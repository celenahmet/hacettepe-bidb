/* Yönetim paneli dil denetimi.

   Panel İngilizceye alındığında arayüzün TAMAMI İngilizce olmalı. Ray
   menüsü çevriliyordu ama bölüm içerikleri sabit Türkçe kalmıştı; ekranda
   yarısı İngilizce yarısı Türkçe bir panel çıkıyordu.

   Ne denetlenir: yalnızca ARAYÜZ metinleri — başlıklar, alan etiketleri,
   düğmeler, yer tutucular, tablo sütun başlıkları, açıklama satırları.

   Ne denetlenmez: VERİ. Sayfa başlıkları, personel adları, birim adları
   veritabanından gelir ve İngilizce panelde de Türkçe kalması doğrudur.
   Bu ayrım önemli: veri de taransaydı araç hiçbir zaman "temiz"
   diyemezdi ve hiçbir şey ifade etmezdi.

   Türkçeye özgü harf (çğıöşüÇĞİÖŞÜ) bulunması yeterli kanıt sayılır.
   Bu harfleri içermeyen Türkçe metinleri kaçırır (örn. "Kaydet"), yani
   araç EKSİK BULUR ama YANLIŞ BULMAZ. Sıfır bulgu tek başına yeterli
   değildir; gözle de bakılmalıdır.

   Kullanım:  node tools/panel-dil-denetim.js
              node tools/panel-dil-denetim.js --kanit                     */

const KOK = process.env.BIDB_KOK || "http://localhost:4000";
const CDP_KOK = process.env.BIDB_CDP || "http://localhost:9222";
const KULLANICI = process.env.BIDB_YONETICI_KULLANICI || "admin";
const PAROLA = process.env.BIDB_YONETICI_PAROLA || "admin";

const bekle = (ms) => new Promise((r) => setTimeout(r, ms));

class Tarayici {
  static async bagla() {
    let hedefler;
    try {
      hedefler = await (await fetch(CDP_KOK + "/json/list")).json();
    } catch (e) {
      throw new Error("Chrome hata ayıklama portuna ulaşılamadı (" + CDP_KOK + "). "
        + "Chrome'u --remote-debugging-port=9222 ile başlatın.");
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

  async harf(ch) {
    await this.gonder("Input.dispatchKeyEvent", { type: "char", text: ch });
  }

  async tus(key, code, kod) {
    await this.gonder("Input.dispatchKeyEvent",
      { type: "keyDown", key, code, windowsVirtualKeyCode: kod, text: key === "Enter" ? "\r" : undefined });
    await this.gonder("Input.dispatchKeyEvent",
      { type: "keyUp", key, code, windowsVirtualKeyCode: kod });
  }

  kapat() { this.ws.close(); }
}

/* Tarayıcıda çalışacak ölçüm: yalnızca arayüz metinleri toplanır. */
const OLCUM = `(function () {
  var TR = /[çğıöşüÇĞİÖŞÜ]/;
  var govde = document.querySelector('.calisma-govde');
  if (!govde) return { yok: true };

  var bulgular = [];
  function ekle(tur, metin) {
    var t = String(metin || '').replace(/\\s+/g, ' ').trim();
    if (!t || !TR.test(t)) return;
    bulgular.push({ tur: tur, metin: t.slice(0, 64) });
  }

  // Başlıklar, etiketler, düğmeler, sütun başlıkları: hepsi arayüz metni
  // .menu-bolum başlıkları VERİDİR (personel birimi, menü adı) - dışlanır.
  // Aksi hâlde araç, İngilizce panelde de doğru olan Türkçe birim adlarını
  // kusur sayar ve hiçbir zaman temiz diyemezdi.
  govde.querySelectorAll('h1, h2, h3, h4').forEach(function (e) {
    if (e.closest('.menu-bolum')) return;
    ekle('başlık', e.textContent);
  });
  govde.querySelectorAll('label > span, label > strong').forEach(function (e) { ekle('etiket', e.textContent); });
  govde.querySelectorAll('button').forEach(function (e) { ekle('düğme', e.textContent); });
  govde.querySelectorAll('th').forEach(function (e) { ekle('sütun', e.textContent); });
  govde.querySelectorAll('[placeholder]').forEach(function (e) { ekle('yer tutucu', e.getAttribute('placeholder')); });
  govde.querySelectorAll('.aciklama, .bolum-no, .kalite-bos strong, .kalite-bos p')
    .forEach(function (e) { ekle('açıklama', e.textContent); });
  // Bölüm üstündeki tanıtım paragrafı
  govde.querySelectorAll('section > header p').forEach(function (e) { ekle('tanıtım', e.textContent); });

  // Aynı metin birden çok kez geçebilir; tekilleştirilir
  var gorulen = {}, tekil = [];
  bulgular.forEach(function (b) {
    var k = b.tur + '|' + b.metin;
    if (gorulen[k]) return;
    gorulen[k] = true;
    tekil.push(b);
  });
  return { bulgular: tekil };
})()`;

async function girisYap(t) {
  await t.gonder("Page.navigate", { url: KOK + "/yonetim" });
  for (let i = 0; i < 40; i++) {
    await bekle(500);
    if (await t.oku("!!document.querySelector('#kullanici') || !!document.querySelector('.ray')")) break;
  }
  await bekle(3000);
  if (!(await t.oku("!!document.querySelector('#kullanici')"))) return;

  await t.oku("document.querySelector('#kullanici').focus(), 1");
  for (const ch of KULLANICI) await t.harf(ch);
  await t.oku("document.querySelector('#parola').focus(), 1");
  for (const ch of PAROLA) await t.harf(ch);
  await t.tus("Enter", "Enter", 13);
  await bekle(6000);
}

/** Panel dilini İngilizceye alır. Düğme TR/EN arasında geçiş yapar. */
async function ingilizceyeAl(t) {
  for (let i = 0; i < 3; i++) {
    const dil = await t.oku(
      "(function(){var b=document.querySelector('.dil-degistir'); return b?b.textContent.trim():null;})()");
    // Düğme "EN" yazıyorsa panel şu an Türkçe demektir
    if (dil !== "EN") return true;
    await t.oku("(function(){var b=document.querySelector('.dil-degistir'); if(b) b.click(); return 1;})()");
    await bekle(1500);
  }
  return false;
}

(async () => {
  const kanitModu = process.argv.includes("--kanit");
  const t = await Tarayici.bagla();
  await t.gonder("Page.enable");
  await t.gonder("Runtime.enable");
  await t.gonder("Emulation.setDeviceMetricsOverride",
    { width: 1500, height: 1100, deviceScaleFactor: 1, mobile: false });

  await girisYap(t);
  if (!(await t.oku("!!document.querySelector('.ray')"))) {
    console.error("Panele girilemedi.");
    t.kapat();
    process.exit(2);
  }
  await ingilizceyeAl(t);
  await bekle(1200);

  /* Yalnızca .ray-liste: ray başlığındaki dil ve erişilebilirlik düğmeleri
     ile çıkış düğmesi bölüm değildir; onları da dolaşmak aynı bölümü birden
     çok kez ölçüp toplamı şişiriyordu. */
  const bolumSayisi = await t.oku("document.querySelectorAll('.ray-liste button').length");

  /* Kanıt modu: İngilizce panele Türkçe bir etiket enjekte edilir. Araç
     bunu yakalamıyorsa "0 bulgu" sonucu hiçbir şey kanıtlamaz. */
  if (kanitModu) {
    const once = await t.oku(OLCUM);
    await t.oku("(function(){var g=document.querySelector('.calisma-govde');"
      + "var h=document.createElement('h3'); h.textContent='Sınama başlığı çalışıyor';"
      + "g.appendChild(h); return 1;})()");
    await bekle(400);
    const sonra = await t.oku(OLCUM);
    const oncekiSayi = (once.bulgular || []).length;
    const sonrakiSayi = (sonra.bulgular || []).length;
    console.log("enjeksiyon öncesi bulgu : " + oncekiSayi);
    console.log("enjeksiyon sonrası bulgu: " + sonrakiSayi);
    const calisiyor = sonrakiSayi > oncekiSayi;
    console.log("\n" + (calisiyor ? "Araç çalışıyor: çevrilmemiş metni yakalıyor." : "ARAÇ GÜVENİLMEZ."));
    t.kapat();
    process.exit(calisiyor ? 0 : 1);
  }

  console.log("BÖLÜM".padEnd(26) + "ÇEVRİLMEMİŞ ARAYÜZ METNİ");
  console.log("-".repeat(72));

  let toplam = 0;
  for (let i = 0; i < bolumSayisi; i++) {
    const ad = await t.oku(
      "(function(){var b=document.querySelectorAll('.ray-liste button')[" + i + "];"
      + "if(!b) return 'yok';"
      + "var t=b.textContent.replace(/\\s+/g,' ').trim().slice(0,22);"
      + "b.click(); return t;})()");
    await bekle(1600);
    const sonuc = await t.oku(OLCUM);
    const b = (sonuc && sonuc.bulgular) || [];
    toplam += b.length;
    console.log(String(ad).padEnd(26) + (b.length ? b.length + " metin" : "temiz"));
    b.slice(0, 8).forEach((x) => console.log("    [" + x.tur + "] " + x.metin));
    if (b.length > 8) console.log("    … ve " + (b.length - 8) + " metin daha");
  }

  console.log("\nToplam çevrilmemiş arayüz metni: " + toplam);
  if (toplam === 0) {
    console.log("Aracın gerçekten ölçtüğünü doğrulamak için: node tools/panel-dil-denetim.js --kanit");
  }
  t.kapat();
  process.exit(toplam ? 1 : 0);
})().catch((e) => {
  console.error("Denetim çalışmadı: " + e.message);
  process.exit(2);
});
