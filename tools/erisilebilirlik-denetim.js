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
     metin-kontrast    SC 1.4.3: metin/zemin oranı 4,5:1 (büyük metin 3:1)
     odak-gostergesi-yok   SC 2.4.7: odakta hiçbir görsel değişiklik yok
     odak-kontrasti-dusuk  SC 1.4.11: gösterge zemine karşı 3:1 altında

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

   5. Görsel olarak gizli metin (.sr-only örüntüsü) kontrasta sokulmaz;
      görülmeyen metnin kontrastı yoktur.

   6. Odak göstergesi ÖĞENİN ÇEVRESİNDEKİ zeminle karşılaştırılır, gövde
      zeminiyle değil. Koyu bölümdeki beyaz çerçeve aksi hâlde 1:1 çıkıyordu.

   7. outline-style:auto tarayıcının kendi İKİ TONLU halkasıdır; bildirilen
      renk gerçekte boyananı yansıtmaz, literal okunmaz. Aynı sebeple, siteye
      ait iki tonlu göstergelerde halkalardan birinin yeterli olması yeter.

   8. Odak sonrası stil okunmadan ÖNCE geçişler kapatılır. Aksi hâlde okunan
      değer geçişin başlangıcıdır, yani henüz değişmemiş hâlidir; göstergesi
      olan öğeler "göstergesi yok" görünüyordu.

   9. Kenarlık değişimi DÖRT kenardan da okunur. Yalnızca üst kenara bakmak,
      alt kenarını değiştiren arama alanını kaçırıyordu.

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

const KONTRAST_OLCUM = "(function () {\n  /* Renk çözümleme. getComputedStyle her zaman rgb()/rgba() döndürür,\n     bu yüzden ayrıştırma güvenlidir — düzenli ifadeyle uğraşmak yerine\n     sayıları doğrudan çekiyoruz. Önceki bir denemede bu kısım her oranı\n     NaN üretmiş ve ölçer hiçbir zaman bulgu veremeden \"temiz\" raporlamıştı. */\n  function renk(s) {\n    var p = String(s).replace(/[^0-9.,]/g, '').split(',').map(Number);\n    if (p.length < 3 || p.some(function (x) { return isNaN(x); })) return null;\n    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };\n  }\n  function harman(on, alt) {\n    var a = on.a;\n    return { r: on.r * a + alt.r * (1 - a), g: on.g * a + alt.g * (1 - a), b: on.b * a + alt.b * (1 - a), a: 1 };\n  }\n  function lin(v) { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }\n  function isik(c) { return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b); }\n  function oran(f, b) {\n    var A = isik(f), B = isik(b);\n    return (Math.max(A, B) + 0.05) / (Math.min(A, B) + 0.05);\n  }\n\n  /* Etkin zemin: saydam zeminler ata zincirinde harmanlanır. Görsel ya da\n     degrade zemin varsa ÖLÇÜLEMEZ sayılır — arka plan piksele göre değişir\n     ve tek bir oran vermek yanıltıcı olur. */\n  function etkinZemin(e) {\n    var yigin = [];\n    var x = e;\n    while (x && x !== document.documentElement) {\n      var s = getComputedStyle(x);\n      if (s.backgroundImage && s.backgroundImage !== 'none') return { belirsiz: true };\n      var z = renk(s.backgroundColor);\n      if (z && z.a > 0) {\n        yigin.push(z);\n        if (z.a === 1) break;\n      }\n      x = x.parentElement;\n    }\n    var alt = { r: 255, g: 255, b: 255, a: 1 };\n    for (var i = yigin.length - 1; i >= 0; i--) alt = harman(yigin[i], alt);\n    return alt;\n  }\n\n  /* GÖRSEL OLARAK GİZLİ metin ölçüme girmez.\n     \"Ekran okuyucuya özel\" metin (.sr-only örüntüsü: 1x1 kutu, kırpma ile\n     gizleme) gözle görülmez; kontrast ölçütü görüleni bağlar. Ölçülürse\n     1.16:1 gibi anlamsız bir oran üretir ve gerçek bulguları gölgeler. */\n  function gorselGizli(e) {\n    var r = e.getBoundingClientRect();\n    if (r.width <= 1 || r.height <= 1) return true;\n    var s = getComputedStyle(e);\n    if (s.clipPath && s.clipPath !== 'none' && s.clipPath.indexOf('inset(100%') === 0) return true;\n    if (s.clipPath && s.clipPath.indexOf('inset(50%') === 0) return true;\n    return s.clip === 'rect(0px, 0px, 0px, 0px)';\n  }\n\n  function gorunur(e) {\n    var r = e.getBoundingClientRect();\n    var s = getComputedStyle(e);\n    if (r.width <= 0 || r.height <= 0) return false;\n    if (s.visibility === 'hidden' || s.display === 'none' || Number(s.opacity) === 0) return false;\n    if (gorselGizli(e)) return false;\n    var d = e.closest('details');\n    return !(d && !d.open && !e.closest('summary'));\n  }\n\n  var bulgular = [];\n  var gorulen = {};\n\n  document.querySelectorAll('body *').forEach(function (e) {\n    if (!gorunur(e)) return;\n    // Yalnızca KENDİ metnini taşıyan öğeler; kapsayıcı sayılırsa aynı metin\n    // defalarca ölçülür ve zemini de yanlış eşleşir.\n    var kendi = '';\n    for (var i = 0; i < e.childNodes.length; i++) {\n      if (e.childNodes[i].nodeType === 3) kendi += e.childNodes[i].nodeValue;\n    }\n    kendi = kendi.replace(/\\s+/g, ' ').trim();\n    if (!kendi) return;\n\n    var s = getComputedStyle(e);\n    var on = renk(s.color);\n    if (!on) return;\n    var alt = etkinZemin(e);\n    if (alt.belirsiz) return;          // görsel/degrade zemin: ölçülemez\n    if (on.a < 1) on = harman(on, alt);\n\n    var boyut = parseFloat(s.fontSize);\n    var kalinlik = parseInt(s.fontWeight, 10) || 400;\n    // WCAG \"büyük metin\": 18.66px+ ya da 14px+ ve kalın\n    var buyuk = boyut >= 18.66 || (boyut >= 14 && kalinlik >= 700);\n    /* aria-hidden=\"true\" bir öğe yardımcı teknolojiye METİN olarak\n       sunulmaz; ekranda görünen bir SÜSTÜR (ok, ayraç, ikon). Bu yüzden\n       1.4.3 (metin, 4.5:1) değil 1.4.11 (metin dışı, 3:1) uygulanır. */\n    var susMu = !!e.closest('[aria-hidden=\"true\"]');\n    var esik = susMu ? 3 : (buyuk ? 3 : 4.5);\n    var o = oran(on, alt);\n    if (o >= esik) return;\n\n    var anahtar = s.color + '|' + Math.round(alt.r) + ',' + Math.round(alt.g) + ',' + Math.round(alt.b) + '|' + boyut;\n    if (gorulen[anahtar]) return;\n    gorulen[anahtar] = true;\n\n    bulgular.push({\n      tur: 'metin-kontrast',\n      oran: Math.round(o * 100) / 100,\n      esik: esik,\n      yazi: s.color,\n      zemin: 'rgb(' + Math.round(alt.r) + ', ' + Math.round(alt.g) + ', ' + Math.round(alt.b) + ')',\n      boyut: boyut + 'px/' + kalinlik,\n      metin: kendi.slice(0, 40),\n      secici: e.tagName.toLowerCase() +\n        (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\\s+/)[0] : '')\n    });\n  });\n\n  return { yol: location.pathname, bulgular: bulgular };\n})()\n";

const ODAK_OLCUM = "(function () {\n  function renk(s) {\n    var p = String(s).replace(/[^0-9.,]/g, '').split(',').map(Number);\n    if (p.length < 3 || p.some(function (x) { return isNaN(x); })) return null;\n    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };\n  }\n  function lin(v) { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }\n  function isik(c) { return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b); }\n  function oran(f, b) { var A = isik(f), B = isik(b); return (Math.max(A, B) + 0.05) / (Math.min(A, B) + 0.05); }\n\n  function gorunur(e) {\n    var r = e.getBoundingClientRect();\n    var s = getComputedStyle(e);\n    if (r.width <= 0 || r.height <= 0) return false;\n    if (s.visibility === 'hidden' || s.display === 'none') return false;\n    var d = e.closest('details');\n    return !(d && !d.open && !e.closest('summary'));\n  }\n\n  /* GEÇİŞLER KAPATILIR. Odak göstergesi çoğu yerde transition ile\n     canlandırılıyor; odaklandıktan hemen sonra okunan hesaplanmış değer\n     geçişin BAŞLANGIÇ değeridir, yani henüz değişmemiş hâlidir. Bu yüzden\n     gösterge varken bile \"yok\" görünüyordu (duyuru arama alanı böyle\n     bildirilmişti; :focus zorlanınca kenarlığın doğru şekilde kırmızıya\n     döndüğü görüldü). Geçişi kapatmak ölçümü zamanlamadan bağımsız kılar. */\n  var gecisKapat = document.createElement('style');\n  gecisKapat.textContent = '*, *::before, *::after { transition: none !important; animation: none !important; }';\n  document.head.appendChild(gecisKapat);\n\n  var odaklanabilir = document.querySelectorAll(\n    'a[href], button, input, select, textarea, [tabindex]:not([tabindex=\"-1\"]), summary, details');\n  var bulgular = [];\n  var sayac = { toplam: 0, denetlenen: 0 };\n\n  for (var i = 0; i < odaklanabilir.length; i++) {\n    var e = odaklanabilir[i];\n    if (!gorunur(e)) continue;\n    if (e.disabled) continue;\n    sayac.toplam++;\n\n    /* Odak GÖSTERGESİ var mı (WCAG 2.4.7 Focus Visible, AA).\n       :focus-visible kuralı eşleşiyor mu diye bakmak yetmez — kural olabilir\n       ama görünür bir iz bırakmıyor olabilir. Bu yüzden öğe gerçekten\n       odaklanır ve odaklıyken hesaplanan stil, odaksız hâliyle\n       KARŞILAŞTIRILIR. Fark yoksa gösterge yok demektir. */\n    var oncesi = getComputedStyle(e);\n    var o1 = {\n      outlineWidth: oncesi.outlineWidth, outlineStyle: oncesi.outlineStyle,\n      outlineColor: oncesi.outlineColor, boxShadow: oncesi.boxShadow,\n      borderColor: oncesi.borderTopColor + '|' + oncesi.borderRightColor + '|' +\n        oncesi.borderBottomColor + '|' + oncesi.borderLeftColor, background: oncesi.backgroundColor,\n      textDecoration: oncesi.textDecorationLine\n    };\n    var oncekiOdak = document.activeElement;\n    try { e.focus({ preventScroll: true }); } catch (x) { continue; }\n    if (document.activeElement !== e) { if (oncekiOdak && oncekiOdak.focus) oncekiOdak.focus({ preventScroll: true }); continue; }\n    sayac.denetlenen++;\n    var sonrasi = getComputedStyle(e);\n    var o2 = {\n      outlineWidth: sonrasi.outlineWidth, outlineStyle: sonrasi.outlineStyle,\n      outlineColor: sonrasi.outlineColor, boxShadow: sonrasi.boxShadow,\n      borderColor: sonrasi.borderTopColor + '|' + sonrasi.borderRightColor + '|' +\n        sonrasi.borderBottomColor + '|' + sonrasi.borderLeftColor, background: sonrasi.backgroundColor,\n      textDecoration: sonrasi.textDecorationLine\n    };\n\n    var degisti = false;\n    for (var k in o1) if (o1[k] !== o2[k]) degisti = true;\n\n    /* outline-style: auto -> tarayıcının KENDİ odak halkası. Chrome bunu\n       iki tonlu (koyu + açık) çizer ve her zeminde görünür olacak şekilde\n       tasarlanmıştır; hesaplanan outlineColor gerçekte boyananı yansıtmaz.\n       Literal okumak 11 sahte bulgu üretiyordu. */\n    if (o2.outlineStyle === 'auto') { e.blur(); continue; }\n    var anahat = o2.outlineStyle !== 'none' && parseFloat(o2.outlineWidth) > 0;\n    var kontrastYeterli = true;\n    if (anahat) {\n      var c = renk(o2.outlineColor);\n      /* Gösterge, ÖĞENİN ÇEVRESİNDEKİ zeminle karşılaştırılır; document.body\n         ile değil. Koyu bir bölümdeki beyaz çerçeve doğrudur ama gövde\n         zemini beyaz olduğu için 1:1 hesaplanıyor ve 47 sahte bulgu\n         üretiyordu. */\n      var z = null, x = e.parentElement;\n      while (x) {\n        var zs = getComputedStyle(x);\n        var zz = renk(zs.backgroundColor);\n        if (zz && zz.a === 1) { z = zz; break; }\n        if (zs.backgroundImage && zs.backgroundImage !== 'none') { z = null; break; }\n        x = x.parentElement;\n      }\n      if (c && z) kontrastYeterli = oran(c, z) >= 3;   // 1.4.11: gösterge en az 3:1\n\n      /* İKİ TONLU gösterge: çerçevenin dışına ikinci bir halka (box-shadow)\n         konduğunda, halkalardan BİRİ zemine karşı yeterliyse gösterge\n         görünürdür. Tarayıcıların kendi odak halkası da böyle çalışır.\n         Yalnızca çerçeve rengine bakmak, doğru kurulmuş iki tonlu bir\n         göstergeyi kusur sayardı. */\n      if (!kontrastYeterli && o2.boxShadow && o2.boxShadow !== 'none' && o2.boxShadow !== o1.boxShadow) {\n        var gc = renk(o2.boxShadow);\n        if (gc && z && oran(gc, z) >= 3) kontrastYeterli = true;\n      }\n    }\n\n    if (!degisti) {\n      bulgular.push({ tur: 'odak-gostergesi-yok', oge: e.tagName.toLowerCase() +\n        (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\\s+/)[0] : ''),\n        not: (e.textContent || e.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').trim().slice(0, 34) });\n    } else if (anahat && !kontrastYeterli) {\n      bulgular.push({ tur: 'odak-kontrasti-dusuk', oge: e.tagName.toLowerCase(),\n        not: o2.outlineColor });\n    }\n\n    e.blur();\n  }\n\n  gecisKapat.remove();\n  return { yol: location.pathname, sayac: sayac, bulgular: bulgular };\n})()\n";

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
    const once = (await t.oku(OLCUM)).bulgular.length +
      (await t.oku(KONTRAST_OLCUM)).bulgular.length;
    /* Bilinen üç kusur enjekte edilir: alt'sız görsel, adsız düğme ve
       küçük hedef. Araç bunları yakalamıyorsa "0 bulgu" bir şey ifade etmez. */
    await t.oku(
      "(function(){var d=document.createElement('div');" +
      "d.innerHTML='<img src=\"/hu-logo.svg\" width=20 height=20>' +" +
      "'<button style=\"width:10px;height:10px\"></button>' +" +
      "'<p style=\"background:#fff;color:#bbb;font-size:14px\">Dusuk kontrast sinamasi</p>';" +
      "document.body.appendChild(d); return 1;})()");
    await bekle(400);
    const sonra = (await t.oku(OLCUM)).bulgular.length +
      (await t.oku(KONTRAST_OLCUM)).bulgular.length;
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

      // 1) Yapısal ölçütler
      const d = await t.oku(OLCUM);
      (d.bulgular || []).forEach((b) => {
        (tumu[b.tur] = tumu[b.tur] || []).push({ yer: yol + " (" + etiket + ")", oge: b.oge, not: b.not });
      });

      // 2) Metin kontrastı (1.4.3) — en sık ihlal edilen ölçüt
      const k = await t.oku(KONTRAST_OLCUM);
      (k.bulgular || []).forEach((b) => {
        (tumu[b.tur] = tumu[b.tur] || []).push({
          yer: yol + " (" + etiket + ")", oge: b.secici,
          not: b.oran + ":1 (eşik " + b.esik + ")  " + b.yazi + " / " + b.zemin + "  \"" + b.metin + "\""
        });
      });

      /* 3) Odak göstergesi (2.4.7, 1.4.11) — yalnızca masaüstünde.
         Dokunmatik görünümde klavye odağı anlamlı bir senaryo değil ve
         her öğeye odaklanmak ölçümü gereksiz yere uzatıyor. */
      if (!mobil) {
        const o = await t.oku(ODAK_OLCUM);
        (o.bulgular || []).forEach((b) => {
          (tumu[b.tur] = tumu[b.tur] || []).push({ yer: yol + " (" + etiket + ")", oge: b.oge, not: b.not });
        });
      }
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
