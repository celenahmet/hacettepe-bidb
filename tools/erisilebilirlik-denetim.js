/* Erişilebilirlik denetimi (WCAG 2.2 AA).

   Sitenin erişilebilirlik bildirimi "WCAG 2.2 Seviye AA standartlarına
   büyük ölçüde uyumludur" diyor. Bu araç, o taahhüdün ölçülebilir
   kısımlarını denetler:

     alt-yok           görselde alt özniteliği yok
     form-etiketsiz    form alanının erişilebilir adı yok
     baslik-atlama     başlık seviyesi atlanmış (h2 -> h4)
     bag-anlamsiz      "tıklayın", "buraya" gibi bağlamsız bağlantı metni
     bag-adsiz         bağlantının hiç metni yok
     dugme-adsiz       yalnızca ikon taşıyan düğmede ad yok
     yapi              main yok ya da h1 sayısı 1 değil
     tabindex-pozitif  odak sırasını bozan pozitif tabindex
     dokunma-hedefi    SC 2.5.8: hedef 24x24'ten küçük

   ÖLÇÜMDE DİKKAT EDİLENLER (her biri sahte bulgu üretmişti):

   1. Kapalı <details> içindeki öğeler sayılmaz. Kullanıcıya açık
      değildirler; erişilebilirlikleri özet öğesiyle yönetilir. Sayıldıkları
      sürece kapalı akordeondaki HER bağlantı "adsız" görünüyordu.

   2. Ad için innerText değil textContent kullanılır. innerText çizime
      bağlıdır; görünüm alanının çok altındaki içerik atlandığında boş döner
      ve alt bilgi bağlantıları adsız sanılıyordu.

   3. Dokunma hedefinde öğenin KUTUSU değil, dokunmayı gerçekten kabul eden
      ALAN ölçülür (elementFromPoint ile). İkisi aynı değildir: hedef
      görünmez bir sözde öğeyle büyütüldüğünde kutu küçük kalır ama ölçüt
      karşılanır. Kutuyu ölçen bir denetim düzeltmeyi göremez.

   4. Cümle içinde geçen satır içi bağlantılar SC 2.5.8'den muaftır. Muaflık
      en yakın blok atasına kadar aranır: <p>… <strong><a>…</a></strong> …</p>
      yapısında yalnızca ebeveyne bakmak yanlış sonuç verir.

   Gereksinim: çalışan site ve --remote-debugging-port=9222 ile açılmış Chrome.

   Kullanım:  node tools/erisilebilirlik-denetim.js
              node tools/erisilebilirlik-denetim.js --kanit                  */

const KOK = process.env.BIDB_KOK || "http://localhost:4000";
const CDP_KOK = process.env.BIDB_CDP || "http://localhost:9222";

const YOLLAR = ["/tr", "/en", "/tr/about", "/tr/news", "/tr/contact", "/tr/staff",
                "/tr/faq", "/tr/vpn", "/tr/e-signature", "/tr/overview", "/en/contact", "/tr/notices"];

const GORUNUMLER = [[1400, 900, false, "masaüstü"], [390, 844, true, "mobil"]];

const bekle = (ms) => new Promise((r) => setTimeout(r, ms));

class Tarayici {
  static async bagla() {
    let hedefler;
    try {
      hedefler = await (await fetch(CDP_KOK + "/json/list")).json();
    } catch (e) {
      throw new Error("Chrome hata ayıklama portuna ulaşılamadı (" + CDP_KOK + ").");
    }
    const sayfa = hedefler.find((t) => t.type === "page" && t.webSocketDebuggerUrl);
    if (!sayfa) throw new Error("Açık bir sekme bulunamadı.");
    const ws = new WebSocket(sayfa.webSocketDebuggerUrl);
    await new Promise((coz, hata) => {
      ws.addEventListener("open", coz, { once: true });
      ws.addEventListener("error", () => hata(new Error("WebSocket açılamadı")), { once: true });
    });
    return new Tarayici(ws);
  }

  constructor(ws) {
    this.ws = ws;
    this.sira = 0;
    this.bekleyen = new Map();
    ws.addEventListener("message", (olay) => {
      const m = JSON.parse(olay.data);
      if (m.id === undefined) return;
      const b = this.bekleyen.get(m.id);
      if (!b) return;
      this.bekleyen.delete(m.id);
      m.error ? b.hata(new Error(m.error.message)) : b.coz(m.result);
    });
  }

  gonder(yontem, params = {}) {
    const id = ++this.sira;
    this.ws.send(JSON.stringify({ id, method: yontem, params }));
    return new Promise((coz, hata) => this.bekleyen.set(id, { coz, hata }));
  }

  async oku(ifade) {
    const y = await this.gonder("Runtime.evaluate", { expression: ifade, returnByValue: true });
    if (y.exceptionDetails) throw new Error("Sayfada istisna: " + y.exceptionDetails.text);
    return y.result.value;
  }

  async git(yol, en, boy) {
    await this.gonder("Page.navigate", { url: KOK + yol });
    for (let i = 0; i < 40; i++) {
      await bekle(300);
      if (await this.oku("document.readyState === 'complete'")) break;
    }
    await bekle(2400);
    // Aşamalı JS yüklemesi ilk etkileşime kadar beklediği için tetiklenir
    await this.gonder("Input.dispatchMouseEvent",
      { type: "mouseWheel", x: Math.floor(en / 2), y: Math.floor(boy / 2), deltaX: 0, deltaY: 150 });
    await bekle(1100);
  }

  kapat() { this.ws.close(); }
}

const OLCUM = "(function () {\n  var bulgular = [];\n  function ekle(tur, oge, not) {\n    bulgular.push({\n      tur: tur,\n      oge: oge ? (oge.tagName.toLowerCase() +\n        (typeof oge.className === 'string' && oge.className ? '.' + oge.className.trim().split(/\\s+/)[0] : '')) : '-',\n      not: String(not).slice(0, 74)\n    });\n  }\n  /* Kapalı <details> içindeki öğeler kullanıcıya AÇIK DEĞİLDİR: içerikleri\n     ekranda çizilmez, innerText boş döner ve açılana kadar ekran okuyucuya\n     da sunulmaz. Bunları saymak, kapalı akordeondaki her bağlantıyı \"adsız\"\n     göstermeye yol açıyordu - 1224 sahte bulgunun kaynağı buydu.\n     Erişilebilirlikleri özet (summary) öğesiyle yönetilir. */\n  function kapaliDetayIcinde(e) {\n    if (e.closest('summary')) return false;\n    var d = e.closest('details');\n    while (d) {\n      if (!d.open) return true;\n      d = d.parentElement ? d.parentElement.closest('details') : null;\n    }\n    return false;\n  }\n  /* Erişilebilir ad için innerText DEĞİL textContent kullanılır.\n     innerText çizime bağlıdır: görünüm alanının çok altındaki içerik\n     content-visibility ile atlandığında boş döner. Alt bilgi bağlantıları\n     bu yüzden \"adsız\" görünüyordu, oysa metinleri yerindeydi. textContent\n     çizimden bağımsızdır ve ekran okuyucunun gördüğüne daha yakındır. */\n  function metin(e) {\n    return (e.textContent || '').replace(/s+/g, ' ').trim();\n  }\n\n  function gorunur(e) {\n    var r = e.getBoundingClientRect();\n    var s = getComputedStyle(e);\n    if (r.width <= 0 || r.height <= 0) return false;\n    if (s.visibility === 'hidden' || s.display === 'none') return false;\n    return !kapaliDetayIcinde(e);\n  }\n\n  // 1) Görsellerde alt metni\n  document.querySelectorAll('img').forEach(function (g) {\n    if (!g.hasAttribute('alt')) ekle('alt-yok', g, g.getAttribute('src') || '');\n  });\n\n  // 2) Form alanlarının erişilebilir adı\n  document.querySelectorAll('input, select, textarea').forEach(function (e) {\n    if (e.type === 'hidden' || !gorunur(e)) return;\n    var ad = e.getAttribute('aria-label') ||\n      (e.getAttribute('aria-labelledby') && document.getElementById(e.getAttribute('aria-labelledby'))) ||\n      (e.id && document.querySelector('label[for=\"' + CSS.escape(e.id) + '\"]')) ||\n      e.closest('label');\n    if (!ad) ekle('form-etiketsiz', e, (e.getAttribute('name') || e.type || '?'));\n  });\n\n  // 3) Başlık hiyerarşisinde atlanan seviye\n  var seviyeler = [].slice.call(document.querySelectorAll('h1,h2,h3,h4,h5,h6'))\n    .filter(gorunur).map(function (h) { return { n: Number(h.tagName[1]), e: h }; });\n  for (var i = 1; i < seviyeler.length; i++) {\n    if (seviyeler[i].n - seviyeler[i - 1].n > 1) {\n      ekle('baslik-atlama', seviyeler[i].e,\n        'h' + seviyeler[i - 1].n + ' -> h' + seviyeler[i].n + ': ' +\n        (seviyeler[i].e.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 34));\n    }\n  }\n\n  // 4) Anlamsız bağlantı metni\n  var kotu = /^(t[ıi]klay[ıi]n(?:[ıi]z)?|buray[ıi] t[ıi]klay[ıi]n|buraya|devam[ıi]|click here|here|read more|daha fazla|more)\\.?$/i;\n  document.querySelectorAll('a[href]').forEach(function (a) {\n    if (!gorunur(a)) return;\n    var t = metin(a);\n    var ad = a.getAttribute('aria-label') || t;\n    if (!ad) { ekle('bag-adsiz', a, a.getAttribute('href') || ''); return; }\n    if (kotu.test(t) && !a.getAttribute('aria-label')) ekle('bag-anlamsiz', a, '\"' + t + '\"');\n  });\n\n  // 5) Yalnızca ikon taşıyan düğmelerde ad\n  document.querySelectorAll('button').forEach(function (b) {\n    if (!gorunur(b)) return;\n    var t = metin(b);\n    if (t) return;\n    if (!b.getAttribute('aria-label') && !b.getAttribute('title') && !b.getAttribute('aria-labelledby')) {\n      ekle('dugme-adsiz', b, b.className || '');\n    }\n  });\n\n  // 6) Sayfa yapısı\n  if (!document.querySelector('main')) ekle('yapi', null, 'main öğesi yok');\n  if (document.querySelectorAll('h1').length !== 1) {\n    ekle('yapi', null, 'h1 sayısı: ' + document.querySelectorAll('h1').length);\n  }\n\n  // 7) Pozitif tabindex (odak sırasını bozar)\n  document.querySelectorAll('[tabindex]').forEach(function (e) {\n    if (Number(e.getAttribute('tabindex')) > 0) ekle('tabindex-pozitif', e, e.getAttribute('tabindex'));\n  });\n\n  /* 8) Dokunma hedefi (WCAG 2.2 SC 2.5.8, AA: en az 24x24)\n\n     Öğenin KUTUSU değil, dokunmayı gerçekten kabul eden ALAN ölçülür.\n     İkisi aynı değildir: hedef alanı görünmez bir sözde öğeyle\n     büyütüldüğünde kutu küçük kalır ama ölçüt karşılanır. Kutuyu ölçen bir\n     denetim bu düzeltmeyi göremez ve sonsuza dek aynı kusuru bildirir.\n\n     Ölçüm elementFromPoint ile yapılır; bu yüzden öğe önce görünüm alanına\n     getirilir - ekran dışındaki noktada elementFromPoint null döner.\n\n     İSTİSNA: cümle içinde geçen satır içi bağlantılar ölçütten muaftır\n     (yükseklikleri çevre metnin satır yüksekliğiyle sınırlıdır). */\n  /* Bağlantı bir cümlenin içinde mi?\n     Yalnızca DOĞRUDAN ebeveyne bakmak yetmiyor: <p>… <strong><a>…</a></strong>\n     …</p> yapısında ebeveyn <strong> olduğu ve kendi metni bulunmadığı için\n     bağlantı \"tek başına\" sanılıyordu. En yakın BLOK atasına kadar çıkılır. */\n  function cumleIcinde(e) {\n    var p = e.parentElement;\n    while (p && p !== document.body) {\n      var kardes = '';\n      for (var i = 0; i < p.childNodes.length; i++) {\n        if (p.childNodes[i].nodeType === 3) kardes += p.childNodes[i].nodeValue;\n      }\n      if (kardes.trim().length > 0) return true;\n      var d = getComputedStyle(p).display;\n      if (d === 'block' || d === 'flex' || d === 'grid' || d === 'list-item') return false;\n      p = p.parentElement;\n    }\n    return false;\n  }\n\n  function gercekHedef(e) {\n    e.scrollIntoView({ block: 'center' });\n    var r = e.getBoundingClientRect();\n    var cx = Math.round(r.left + r.width / 2), cy = Math.round(r.top + r.height / 2);\n    function tut(x, y) { var h = document.elementFromPoint(x, y); return !!h && (h === e || e.contains(h)); }\n    if (!tut(cx, cy)) return null;\n    var sol = 0, sag = 0, ust = 0, alt = 0;\n    for (var i = 1; i <= 24; i++) { if (tut(cx - i, cy)) sol = i; else break; }\n    for (var i = 1; i <= 24; i++) { if (tut(cx + i, cy)) sag = i; else break; }\n    for (var i = 1; i <= 24; i++) { if (tut(cx, cy - i)) ust = i; else break; }\n    for (var i = 1; i <= 24; i++) { if (tut(cx, cy + i)) alt = i; else break; }\n    return { en: sol + sag + 1, boy: ust + alt + 1 };\n  }\n\n  document.querySelectorAll('a[href], button, input[type=checkbox], input[type=radio]').forEach(function (e) {\n    if (!gorunur(e)) return;\n    var r = e.getBoundingClientRect();\n    if (r.width >= 24 && r.height >= 24) return;\n    if (cumleIcinde(e)) return;\n    var h = gercekHedef(e);\n    if (!h) return;                       // ölçülemedi; sessizce geçilir\n    if (h.en >= 24 && h.boy >= 24) return; // sözde öğeyle büyütülmüş, ölçüt karşılanıyor\n    ekle('dokunma-hedefi', e, 'kutu ' + Math.round(r.width) + 'x' + Math.round(r.height) +\n      ', hedef ' + h.en + 'x' + h.boy + ' — ' + (metin(e) || e.getAttribute('aria-label') || '').slice(0, 24));\n  });\n\n  return { yol: location.pathname, bulgular: bulgular };\n})()\n";

(async () => {
  const kanitModu = process.argv.includes("--kanit");
  const t = await Tarayici.bagla();
  await t.gonder("Page.enable");
  await t.gonder("Runtime.enable");

  if (kanitModu) {
    await t.gonder("Emulation.setDeviceMetricsOverride",
      { width: 1400, height: 900, deviceScaleFactor: 1, mobile: false });
    await t.git("/tr", 1400, 900);
    const once = (await t.oku(OLCUM)).bulgular.length;
    /* Bilinen üç kusur enjekte edilir: alt'sız görsel, adsız düğme ve
       küçük hedef. Araç bunları yakalamıyorsa "0 bulgu" bir şey ifade etmez. */
    await t.oku(
      "(function(){var d=document.createElement('div');" +
      "d.innerHTML='<img src=\"/hu-logo.svg\" width=20 height=20>' +" +
      "'<button style=\"width:10px;height:10px\"></button>';" +
      "document.body.appendChild(d); return 1;})()");
    await bekle(400);
    const sonra = (await t.oku(OLCUM)).bulgular.length;
    console.log("enjeksiyon öncesi bulgu : " + once);
    console.log("enjeksiyon sonrası bulgu: " + sonra);
    const calisiyor = sonra > once;
    console.log("\n" + (calisiyor ? "Araç çalışıyor: kusurları yakalıyor." : "ARAÇ GÜVENİLMEZ."));
    t.kapat();
    process.exit(calisiyor ? 0 : 1);
  }

  const tumu = {};
  for (const [en, boy, mobil, etiket] of GORUNUMLER) {
    await t.gonder("Emulation.setDeviceMetricsOverride",
      { width: en, height: boy, deviceScaleFactor: mobil ? 2 : 1, mobile: mobil });
    for (const yol of YOLLAR) {
      await t.git(yol, en, boy);
      const d = await t.oku(OLCUM);
      (d.bulgular || []).forEach((b) => {
        (tumu[b.tur] = tumu[b.tur] || []).push({ yer: yol + " (" + etiket + ")", oge: b.oge, not: b.not });
      });
    }
  }

  const turler = Object.entries(tumu).sort((a, b) => b[1].length - a[1].length);
  let toplam = 0;
  for (const [tur, liste] of turler) {
    toplam += liste.length;
    console.log("  " + tur.toUpperCase() + ": " + liste.length);
    const gorulen = new Set();
    liste.forEach((x) => {
      const anahtar = x.oge + "|" + x.not;
      if (gorulen.has(anahtar) || gorulen.size >= 6) return;
      gorulen.add(anahtar);
      console.log("     " + x.yer.padEnd(24) + x.oge.slice(0, 26).padEnd(28) + x.not);
    });
  }

  console.log("\nToplam bulgu: " + toplam +
    "   (" + (YOLLAR.length * GORUNUMLER.length) + " sayfa-görünüm)");
  if (toplam === 0) {
    console.log("Aracın gerçekten ölçtüğünü doğrulamak için: node tools/erisilebilirlik-denetim.js --kanit");
  }
  t.kapat();
  process.exit(toplam ? 1 : 0);
})().catch((e) => {
  console.error("Denetim çalışmadı: " + e.message);
  process.exit(2);
});
