/* Bağlantı kapanışı taraması.

   Menüden erişilen sayfaları taramak yetmiyor: sayfa içeriklerinden başka
   sayfalara bağlantı veriliyor, o sayfalar da başkalarına. Kopyanın eksiksiz
   olması için, mevcut sayfalardan başlanır ve site içi bağlantılar yeni
   sayfa kalmayana kadar izlenir.

   İçerik kaynaktan alındığı gibi kaydedilir; hiçbir metin değiştirilmez.

   Kullanım:  node tools/crawl-kapanis.js                                    */

const fs = require("fs");
const path = require("path");
const X = require("./extract.js");

const ORIGIN = "https://bidb.hacettepe.edu.tr";
const OUT = path.join(__dirname, "..", "content");
const BEKLEME = 250;
const UST_SINIR = 400;   // güvenlik sınırı

const bekle = (ms) => new Promise((r) => setTimeout(r, ms));

async function getir(url) {
  const y = await fetch(url, {
    headers: { "User-Agent": "HU-BIDB-icerik-aktarimi/1.0", Accept: "text/html" },
    redirect: "follow"
  });
  if (!y.ok) throw new Error("HTTP " + y.status);
  return await y.text();
}

/* ozgunSlug: kaynak sitedeki adres (büyük/küçük harf dâhil). Dosya adı ve
   slug küçük harfe indirgenir, ancak kaynak adresi olduğu gibi kaydedilir —
   doğrulama bu adresi kullanır. */
function sayfaCoz(html, dil, slug, ad, ozgunSlug) {
  const govde = X.icerikGovdesi(html);
  const paragraflar = X.paragraflar(govde);
  const baglantilar = X.baglantilar(govde, ORIGIN);
  return {
    slug, dil, bolum: "", menuAdi: ad,
    url: ORIGIN + "/" + dil + "/" + (ozgunSlug || slug),
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

/** Bir sayfanın gövdesindeki site içi sayfa bağlantıları */
function icBaglantilar(veri) {
  const bulunan = [];
  const desen = /(?:https?:\/\/bidb\.hacettepe\.edu\.tr)?\/(tr|en)\/([A-Za-z0-9_-]+)/g;
  for (const m of String(veri.govdeHtml || "").matchAll(desen)) {
    bulunan.push([m[1].toLowerCase(), m[2]]);
  }
  return bulunan;
}

(async () => {
  const mevcut = new Set();
  for (const dil of ["tr", "en"]) {
    const dizin = path.join(OUT, dil);
    if (!fs.existsSync(dizin)) continue;
    for (const f of fs.readdirSync(dizin)) {
      if (f.endsWith(".json") && !f.startsWith("_")) mevcut.add(dil + "/" + f.slice(0, -5).toLowerCase());
    }
  }
  console.log("Mevcut sayfa: " + mevcut.size);

  // Sıra: mevcut sayfaların bağlantılarıyla başlar
  const sira = [];
  const gorulen = new Set(mevcut);
  for (const dil of ["tr", "en"]) {
    const dizin = path.join(OUT, dil);
    if (!fs.existsSync(dizin)) continue;
    for (const f of fs.readdirSync(dizin).filter((x) => x.endsWith(".json"))) {
      const veri = JSON.parse(fs.readFileSync(path.join(dizin, f), "utf8"));
      for (const [d, s] of icBaglantilar(veri)) {
        const anahtar = d + "/" + s.toLowerCase();
        if (!gorulen.has(anahtar)) { gorulen.add(anahtar); sira.push([d, s]); }
      }
    }
  }

  let eklenen = 0, atlanan = 0;
  while (sira.length && eklenen < UST_SINIR) {
    const [dil, slug] = sira.shift();
    let html;
    try {
      html = await getir(ORIGIN + "/" + dil + "/" + slug);
    } catch (e) {
      console.log("  – " + dil + "/" + slug + " (" + e.message + ")");
      atlanan++;
      await bekle(BEKLEME);
      continue;
    }

    const veri = sayfaCoz(html, dil, slug.toLowerCase(), slug, slug);
    // İçeriği boş dönen adresler (yönlendirme, dosya) kaydedilmez
    if (veri.karakter === 0 && !veri.govdeHtml) { atlanan++; await bekle(BEKLEME); continue; }

    fs.writeFileSync(path.join(OUT, dil, slug.toLowerCase() + ".json"), JSON.stringify(veri, null, 2), "utf8");
    eklenen++;
    console.log("  ✓ " + (dil + "/" + slug).padEnd(38) + String(veri.karakter).padStart(6) + " karakter");

    for (const [d, s] of icBaglantilar(veri)) {
      const anahtar = d + "/" + s.toLowerCase();
      if (!gorulen.has(anahtar)) { gorulen.add(anahtar); sira.push([d, s]); }
    }
    await bekle(BEKLEME);
  }

  console.log("\nEklenen: " + eklenen + " · atlanan: " + atlanan + " · toplam sayfa: " + (mevcut.size + eklenen));
  if (sira.length) console.log("UYARI: üst sınıra ulaşıldı, " + sira.length + " adres taranmadı.");
})();
