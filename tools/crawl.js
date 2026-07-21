/* bidb.hacettepe.edu.tr içerik toplayıcı (v2).
   TR ve EN sayfalarını indirir, içerik + SEO + belge bağlantılarını ayıklar,
   content/<dil>/<slug>.json dosyalarına yazar.
   Kullanım:  node tools/crawl.js                                            */

const fs = require("fs");
const path = require("path");
const X = require("./extract.js");

const ORIGIN = "https://bidb.hacettepe.edu.tr";
const OUT = path.join(__dirname, "..", "content");
const BEKLEME = 300;

/* Türkçe menü yapısı (kaynak sitedeki sırayla) */
const MENU_TR = [
  { bolum: "Kurumsal", sayfalar: [
    ["geneltanitim", "Genel Tanıtım"], ["yonetim", "Yönetim"], ["misyonvizyon", "Misyon ve Vizyon"],
    ["bilgikorumaanapolitikamiz", "Bilgi Güvenliği Politikası"], ["personel", "Personel"],
    ["organizasyonsemasi", "Organizasyon Şeması"], ["kk", "Kurul ve Komisyonlar"] ] },
  { bolum: "Servislerimiz", sayfalar: [
    ["webser", "WEB Servisleri"], ["hu-iys", "İçerik Yönetim Sistemi"], ["kablosuz", "Kablosuz Erişim Servisleri"],
    ["yazilim", "Lisanslı Yazılım Sunucusu"], ["bilgidokuman", "Bilgi ve Dokümanlar"],
    ["eposta", "E-Posta İşlemleri"], ["e-posta", "E-Posta Giriş"], ["office365", "Office 365"],
    ["proxy", "Proxy Ayarları ve Kurulumu"], ["sss", "Sık Sorulan Sorular"], ["formlar", "Formlar"] ] },
  { bolum: "Kurallar ve İlkeler", sayfalar: [
    ["bgys", "Bilgi Güvenliği Yönetim Sistemi"], ["tarama", "E-Posta Tarama Politikaları"],
    ["yayim", "WEB Sayfası Yayım İlkeleri"], ["ogr_kural", "Yurt ve Öğrenci Evleri Kuralları"],
    ["pc_salon", "PC Salonlarının Kullanım Kuralları"], ["posta_kural", "Dağıtım Listeleri Politikaları"],
    ["hunet_kurallar", "HUNET Kullanım İlkeleri"], ["bilisim_ilke", "HUNET Öğrenci Çerçeve Kuralları"],
    ["hunet_protokol", "HUNET Beytepe Yurt Erişim Protokolü"] ] },
  { bolum: "Teknik Altyapı", sayfalar: [
    ["altyapi", "Ağ Altyapısı"], ["donanim", "Mevcut Donanım Bilgileri"], ["erisim", "Dış Erişim Kuralları"] ] },
  { bolum: "İletişim", sayfalar: [
    ["iletisim", "İletişim"], ["sorumluluksiniri", "Sorumluluk Sınırı"], ["erisilebilirlik", "Erişilebilirlik Bildirimi"] ] }
];

/* İngilizce tarafta adresler farklı ve sayfa sayısı az (kaynak siteden doğrulandı) */
const MENU_EN = [
  { bolum: "Corporate", sayfalar: [
    ["overview", "Overview"], ["mv", "Mission and Vision"], ["yonetim", "Administrative Organization"] ] },
  { bolum: "Services", sayfalar: [ ["grup", "Service Groups"] ] },
  { bolum: "Contact", sayfalar: [ ["iletisim", "Contact"] ] }
];

const bekle = (ms) => new Promise((r) => setTimeout(r, ms));


async function getir(url) {
  const y = await fetch(url, { headers: { "User-Agent": "HU-BIDB-icerik-aktarimi/1.0", Accept: "text/html" }, redirect: "follow" });
  if (!y.ok) throw new Error("HTTP " + y.status);
  return await y.text();
}

function sayfaCoz(html, dil, slug, bolum, ad) {
  const govde = X.icerikGovdesi(html);
  const paragraflar = X.paragraflar(govde);
  const baglantilar = X.baglantilar(govde, ORIGIN);
  return {
    slug, dil, bolum, menuAdi: ad,
    url: ORIGIN + "/" + dil + "/" + slug,
    baslik: X.sayfaBasligi(html) || ad,
    seo: {
      title: X.etiket(html, "title"),
      description: X.meta(html, "description"),
      keywords: X.meta(html, "keywords")
    },
    paragraflar,
    baglantilar,
    gorseller: X.gorseller(govde, ORIGIN),
    belgeler: baglantilar.filter((b) => /\.(pdf|docx?|xlsx?|pptx?|zip|rar)(\?|$)/i.test(b.href)),
    govdeHtml: govde.trim(),
    karakter: paragraflar.reduce((t, p) => t + p.metin.length, 0),
    cekilme: new Date().toISOString()
  };
}

(async () => {
  const ozet = [];
  let ok = 0, hata = 0;

  for (const [dil, menu] of [["tr", MENU_TR], ["en", MENU_EN]]) {
    fs.mkdirSync(path.join(OUT, dil), { recursive: true });


    try {
      const html = await getir(ORIGIN + "/" + dil);
      const veri = sayfaCoz(html, dil, "", "", dil === "tr" ? "Ana Sayfa" : "Home Page");
      fs.writeFileSync(path.join(OUT, dil, "_anasayfa.json"), JSON.stringify(veri, null, 2), "utf8");
      console.log("  ✓ " + dil + "/ (ana sayfa) — " + veri.karakter + " karakter");
      ok++;
    } catch (e) { console.log("  ✗ " + dil + "/ → " + e.message); hata++; }
    await bekle(BEKLEME);

    for (const b of menu) {
      for (const [slug, ad] of b.sayfalar) {
        try {
          const html = await getir(ORIGIN + "/" + dil + "/" + slug);
          const veri = sayfaCoz(html, dil, slug, b.bolum, ad);
          fs.writeFileSync(path.join(OUT, dil, slug + ".json"), JSON.stringify(veri, null, 2), "utf8");
          ozet.push({ dil, slug, ad, bolum: b.bolum, karakter: veri.karakter, belge: veri.belgeler.length });
          console.log("  ✓ " + (dil + "/" + slug).padEnd(32) + String(veri.karakter).padStart(6) + " karakter, " + veri.belgeler.length + " belge");
          ok++;
        } catch (e) {
          ozet.push({ dil, slug, ad, hata: e.message });
          console.log("  ✗ " + dil + "/" + slug + " → " + e.message);
          hata++;
        }
        await bekle(BEKLEME);
      }
    }
  }

  // Sol menü ve sosyal medya doğrudan kaynak sayfadan okunur
  const kabuk = {};
  for (const dil of ["tr", "en"]) {
    try {
      const html = await getir(ORIGIN + "/" + dil);
      kabuk[dil] = { menu: X.solMenu(html, ORIGIN), sosyal: X.sosyalMedya(html) };
      console.log("  " + dil + " kabuk: " + kabuk[dil].menu.length + " menü başlığı, " + kabuk[dil].sosyal.length + " sosyal hesap");
    } catch (e) { kabuk[dil] = { menu: [], sosyal: [] }; }
    await bekle(BEKLEME);
  }
  fs.writeFileSync(path.join(OUT, "_kabuk.json"), JSON.stringify(kabuk, null, 2), "utf8");
  fs.writeFileSync(path.join(OUT, "_menu.json"), JSON.stringify({ tr: MENU_TR, en: MENU_EN }, null, 2), "utf8");
  fs.writeFileSync(path.join(OUT, "_ozet.json"), JSON.stringify(ozet, null, 2), "utf8");
  console.log("\nToplam " + ok + " sayfa indirildi, " + hata + " hata.");
})();
