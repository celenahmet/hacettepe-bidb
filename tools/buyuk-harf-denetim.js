/* Büyük/küçük harf dönüşümü dil denetimi.

   Türkçe ile İngilizce'nin harf dönüşüm kuralları AYRIŞIR:

       "i" büyük harfe ->  Türkçe: İ    İngilizce: I
       "I" küçük harfe ->  Türkçe: ı    İngilizce: i

   CSS'in text-transform'u bu dönüşümü ÖĞENİN DİLİNE göre yapar. Dil yanlışsa
   metin bozulur ve bu, kurumsal bir sitede göze batan bir hatadır:

       İngilizce metin Türkçe dille : "Hacettepe University" -> "HACETTEPE UNİVERSİTY"
       Türkçe metin İngilizce dille : "İletişim"             -> "ILETISIM"

   Araç, dönüşüm uygulanan HER öğe için kaynak metni hem Türkçe hem İngilizce
   kurallarıyla dönüştürür. İkisi farklıysa dilin önemi vardır; o zaman
   tarayıcının ürettiği metin, öğenin geçerli dili için doğru olanla
   karşılaştırılır.

   Yalnızca ayrımın gerçekten oluştuğu metinler bildirilir; "KAYDET" gibi
   i/I içermeyen metinler zaten iki dilde aynı çıkar.

   Gereksinim: çalışan site ve --remote-debugging-port=9222 ile açılmış Chrome.

   Kullanım:  node tools/buyuk-harf-denetim.js
              node tools/buyuk-harf-denetim.js --kanit                       */

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

  async harf(ch) { await this.gonder("Input.dispatchKeyEvent", { type: "char", text: ch }); }

  async enter() {
    await this.gonder("Input.dispatchKeyEvent",
      { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13, text: "\r" });
    await this.gonder("Input.dispatchKeyEvent",
      { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
  }

  async git(yol) {
    await this.gonder("Page.navigate", { url: KOK + yol });
    for (let i = 0; i < 40; i++) {
      await bekle(300);
      if (await this.oku("document.readyState === 'complete'")) break;
    }
    await bekle(2600);
  }

  kapat() { this.ws.close(); }
}

const OLCUM = (beklenenDil) => `(function () {
  var BEKLENEN = ${JSON.stringify(beklenenDil)};
  var bulgular = [];
  var ogeler = document.querySelectorAll('*');

  for (var i = 0; i < ogeler.length; i++) {
    var e = ogeler[i];
    var s = getComputedStyle(e);
    var d = s.textTransform;
    if (d !== 'uppercase' && d !== 'lowercase') continue;

    /* Yalnızca kendi metnini taşıyan öğeler: kapsayıcıyı da saymak aynı
       metni defalarca bildirir. */
    var kendi = '';
    for (var j = 0; j < e.childNodes.length; j++) {
      if (e.childNodes[j].nodeType === 3) kendi += e.childNodes[j].nodeValue;
    }
    kendi = kendi.replace(/\s+/g, ' ').trim();
    if (!kendi) continue;

    var trH, enH;
    if (d === 'uppercase') { trH = kendi.toLocaleUpperCase('tr'); enH = kendi.toLocaleUpperCase('en'); }
    else { trH = kendi.toLocaleLowerCase('tr'); enH = kendi.toLocaleLowerCase('en'); }

    // İki dilde aynı çıkıyorsa dilin bir önemi yok
    if (trH === enH) continue;

    var langOge = e.closest('[lang]');
    var lang = (langOge ? (langOge.getAttribute('lang') || '') : '').toLowerCase().slice(0, 2);
    if (!lang) lang = (document.documentElement.lang || '').toLowerCase().slice(0, 2);

    // Geçerli dil beklenenle aynıysa dönüşüm doğrudur
    if (lang === BEKLENEN) continue;

    var cikan = lang === 'tr' ? trH : enH;
    var olmasiGereken = BEKLENEN === 'tr' ? trH : enH;

    bulgular.push({
      metin: kendi.slice(0, 46),
      lang: lang || '(yok)',
      cikan: cikan.slice(0, 46),
      olmasiGereken: olmasiGereken.slice(0, 46),
      secici: e.tagName.toLowerCase() +
        (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/)[0] : '')
    });
  }
  return { belgeDil: document.documentElement.lang, beklenen: BEKLENEN, bulgular: bulgular };
})()`;

async function girisYap(t) {
  await t.git("/yonetim");
  if (!(await t.oku("!!document.querySelector('#kullanici')"))) return;
  await t.oku("document.querySelector('#kullanici').focus(), 1");
  for (const ch of KULLANICI) await t.harf(ch);
  await t.oku("document.querySelector('#parola').focus(), 1");
  for (const ch of PAROLA) await t.harf(ch);
  await t.enter();
  await bekle(6000);
}

/**
 * Panel dilini istenen değere getirir.
 *
 * GİRİŞ EKRANINDA dil düğmesi YOKTUR; tercih localStorage'da tutulur. Düğmeye
 * bakarak karar vermek, giriş ekranını hep mevcut dilde ölçmeye ve ölçümün
 * sessizce yanlış dili sınamasına yol açıyordu.
 */
async function panelDili(t, istenen) {
  const dugmeVar = await t.oku("!!document.querySelector('.dil-degistir')");
  if (!dugmeVar) {
    await t.oku("try { localStorage.setItem('bidb-yonetim-dil', " + JSON.stringify(istenen) + "); } catch (e) {} 1");
    await t.gonder("Page.reload", {});
    for (let i = 0; i < 40; i++) {
      await bekle(300);
      if (await t.oku("document.readyState === 'complete'")) break;
    }
    await bekle(2600);
    return;
  }
  for (let i = 0; i < 3; i++) {
    const simdiki = await t.oku(
      "(function(){var b=document.querySelector('.dil-degistir');" +
      "return b ? (b.textContent.trim() === 'EN' ? 'tr' : 'en') : null;})()");
    if (simdiki === istenen || simdiki === null) return;
    await t.oku("(function(){var b=document.querySelector('.dil-degistir'); if(b) b.click(); return 1;})()");
    await bekle(1500);
  }
}

(async () => {
  const kanitModu = process.argv.includes("--kanit");
  const t = await Tarayici.bagla();
  await t.gonder("Page.enable");
  await t.gonder("Runtime.enable");
  await t.gonder("Emulation.setDeviceMetricsOverride",
    { width: 1500, height: 1100, deviceScaleFactor: 1, mobile: false });

  if (kanitModu) {
    /* Bilinen bir hata enjekte edilir: İngilizce metin Türkçe dille
       büyütülür. Araç bunu yakalamıyorsa "0 bulgu" bir şey ifade etmez. */
    await t.git("/en");
    const once = (await t.oku(OLCUM("en"))).bulgular.length;
    await t.oku(
      "(function(){var d=document.createElement('div');" +
      "d.setAttribute('lang','tr'); d.style.textTransform='uppercase';" +
      "d.textContent='Hacettepe University Information Technologies';" +
      "document.body.appendChild(d); return 1;})()");
    await bekle(400);
    const sonra = (await t.oku(OLCUM("en"))).bulgular.length;
    console.log("enjeksiyon öncesi bulgu : " + once);
    console.log("enjeksiyon sonrası bulgu: " + sonra);
    const calisiyor = sonra > once;
    console.log("\n" + (calisiyor ? "Araç çalışıyor: yanlış dille dönüşümü yakalıyor." : "ARAÇ GÜVENİLMEZ."));
    t.kapat();
    process.exit(calisiyor ? 0 : 1);
  }

  const yollar = ["/tr", "/en", "/tr/about", "/en/about", "/tr/news", "/en/news",
                  "/tr/contact", "/en/contact", "/tr/staff", "/en/staff"];

  console.log("YER".padEnd(30) + "BULGU");
  console.log("-".repeat(76));

  let toplam = 0;
  const yaz = (yer, sonuc) => {
    const b = sonuc.bulgular || [];
    toplam += b.length;
    console.log(yer.padEnd(30) + (b.length ? b.length + " metin  (belge lang=" + sonuc.belgeDil + ")" : "temiz"));
    b.slice(0, 6).forEach((x) => {
      console.log("    lang=" + String(x.lang).padEnd(7) + x.secici.slice(0, 26));
      console.log("       kaynak          : " + x.metin);
      console.log("       şu an çıkan     : " + x.cikan);
      console.log("       çıkması gereken : " + x.olmasiGereken);
    });
    if (b.length > 6) console.log("    … ve " + (b.length - 6) + " metin daha");
  };

  for (const yol of yollar) {
    await t.git(yol);
    yaz(yol, await t.oku(OLCUM(yol.startsWith("/en") ? "en" : "tr")));
  }

  // Yönetim paneli: giriş ekranı ve panel, iki dilde
  await t.oku("try { sessionStorage.clear(); } catch (e) {} 1");
  await t.git("/yonetim");
  for (const dil of ["en", "tr"]) {
    await panelDili(t, dil);
    await bekle(1200);
    yaz("/yonetim giriş (" + dil + ")", await t.oku(OLCUM(dil)));
  }
  await girisYap(t);
  for (const dil of ["en", "tr"]) {
    await panelDili(t, dil);
    await bekle(1200);
    yaz("/yonetim panel (" + dil + ")", await t.oku(OLCUM(dil)));
  }

  console.log("\nToplam yanlış dille dönüştürülen metin: " + toplam);
  if (toplam === 0) {
    console.log("Aracın gerçekten ölçtüğünü doğrulamak için: node tools/buyuk-harf-denetim.js --kanit");
  }
  t.kapat();
  process.exit(toplam ? 1 : 0);
})().catch((e) => {
  console.error("Denetim çalışmadı: " + e.message);
  process.exit(2);
});
