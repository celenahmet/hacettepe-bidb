/* Yayına hazırlık kontrolü.
   Çalışan yığın üzerinde sayfaları, uçları ve varlıkları denetler.
   Kullanım: node tools/son-kontrol.js                                        */

const SITE = process.env.SITE ?? "http://localhost:4000";
const API = process.env.API ?? "http://localhost:8081";

const sonuc = [];
const kontrol = (ad, gecti, detay = "") => sonuc.push({ ad, gecti, detay });

async function metin(url) {
  const y = await fetch(url);
  return { durum: y.status, govde: await y.text() };
}

function govdeMetni(html) {
  const m = (html.match(/<main[^>]*>([\s\S]*?)<\/main>/) || ["", ""])[1];
  return m.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

(async () => {
  /* --- sayfalar --- */
  const sayfalar = [
    ["/tr", 800], ["/tr/geneltanitim", 3000], ["/tr/sss", 10000],
    ["/tr/formlar", 300], ["/tr/iletisim", 100], ["/en/overview", 300]
  ];
  for (const [yol, asgari] of sayfalar) {
    const { durum, govde } = await metin(SITE + yol);
    const uzunluk = govdeMetni(govde).length;
    kontrol("sayfa " + yol, durum === 200 && uzunluk >= asgari, durum + ", " + uzunluk + " karakter");
  }

  /* --- SEO etiketleri --- */
  const { govde: gt } = await metin(SITE + "/tr/geneltanitim");
  kontrol("sayfaya özgü başlık", /<title>Genel Tanıtım/.test(gt));
  kontrol("html lang doğru", /<html[^>]+lang="tr"/.test(gt));
  kontrol("canonical bağlantısı", /rel="canonical"/.test(gt));
  kontrol("hreflang tr/en", /hreflang="tr"/.test(gt) && /hreflang="en"/.test(gt));
  kontrol("og:title", /property="og:title"/.test(gt));

  const { govde: ge } = await metin(SITE + "/en/overview");
  kontrol("İngilizce sayfa lang=en", /<html[^>]+lang="en"/.test(ge));

  /* --- gezinme --- */
  kontrol("sol menü sunucuda", (gt.match(/class="sol-bolum"/g) || []).length >= 4);
  kontrol("içeriğe atla bağlantısı", /class="atla"/.test(gt));
  kontrol("belge listesi", (await metin(SITE + "/tr/formlar")).govde.includes("belge-tur"));

  /* --- ana sayfa bileşenleri --- */
  const { govde: ana } = await metin(SITE + "/tr");
  kontrol("slider", /slayt-baslik/.test(ana));
  kontrol("kısayollar", (ana.match(/class="kisayol"/g) || []).length >= 10);
  kontrol("duyurular", (ana.match(/<time/g) || []).length >= 8);
  kontrol("servisler", (ana.match(/class="servis"/g) || []).length >= 5);

  /* --- varlıklar --- */
  for (const v of ["/hu-logo.svg", "/images/r1.jpg", "/images/icon/eposta.png", "/images/hizmet1.png"]) {
    const y = await fetch(SITE + v);
    kontrol("görsel " + v, y.status === 200, String(y.status));
  }

  /* --- API --- */
  for (const u of ["/api/tr/menu", "/api/tr/anasayfa", "/api/tr/sayfa/geneltanitim", "/api/en/sayfa/overview", "/api/tr/sosyal"]) {
    const y = await fetch(API + u);
    kontrol("API " + u, y.status === 200, String(y.status));
  }
  const yok = await fetch(API + "/api/tr/sayfa/olmayan-sayfa");
  kontrol("olmayan sayfa 404", yok.status === 404, String(yok.status));

  /* --- vekil --- */
  const vekil = await fetch(SITE + "/api/tr/menu");
  kontrol("site üzerinden API vekili", vekil.status === 200, String(vekil.status));

  /* --- rapor --- */
  const gecen = sonuc.filter((s) => s.gecti).length;
  sonuc.forEach((s) => console.log("  " + (s.gecti ? "✓" : "✗") + " " + s.ad.padEnd(38) + s.detay));
  console.log("\n" + gecen + "/" + sonuc.length + " kontrol geçti");
  process.exit(gecen === sonuc.length ? 0 : 1);
})();
