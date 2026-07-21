/* Kaynak sitedeki görselleri projeye indirir.

   Slider görselleri, kısayol ikonları, servis görselleri ve içerik
   sayfalarındaki resimler frontend/public altına aynı yol yapısıyla kopyalanır.
   Böylece yeni site kaynak siteye bağımlı kalmaz.

   Kullanım: node tools/fetch-assets.js                                       */

const fs = require("fs");
const path = require("path");

const ORIGIN = "https://bidb.hacettepe.edu.tr";
const KOK = path.join(__dirname, "..");
const HEDEF = path.join(KOK, "frontend", "public");

function adresleriTopla() {
  const adresler = new Set();

  // Ana sayfa bileşenleri
  const bilesenYolu = path.join(KOK, "content", "_anasayfa-bilesenler.json");
  if (fs.existsSync(bilesenYolu)) {
    const b = JSON.parse(fs.readFileSync(bilesenYolu, "utf8"));
    Object.values(b).forEach((dil) => {
      (dil.slider || []).forEach((s) => adresler.add(s.gorsel));
      (dil.hizliErisim || []).forEach((h) => adresler.add(h.ikon));
      (dil.servisler || []).forEach((s) => adresler.add(s.gorsel));
    });
  }

  // İçerik sayfalarındaki görseller
  ["tr", "en"].forEach((dil) => {
    const dizin = path.join(KOK, "content", dil);
    if (!fs.existsSync(dizin)) return;
    fs.readdirSync(dizin).filter((f) => f.endsWith(".json")).forEach((f) => {
      const s = JSON.parse(fs.readFileSync(path.join(dizin, f), "utf8"));
      (s.gorseller || []).forEach((g) => adresler.add(g.src));
    });
  });

  return [...adresler]
    .filter(Boolean)
    .filter((u) => u.startsWith(ORIGIN) || u.startsWith("/"))
    .map((u) => (u.startsWith("/") ? ORIGIN + u : u));
}

async function indir(url) {
  const yol = new URL(url).pathname;                    // örn. /images/r1.jpg
  const hedefDosya = path.join(HEDEF, yol.replace(/^\//, ""));
  if (fs.existsSync(hedefDosya)) return { yol, durum: "zaten var" };

  const yanit = await fetch(url, { headers: { "User-Agent": "HU-BIDB-icerik-aktarimi/1.0" } });
  if (!yanit.ok) return { yol, durum: "HTTP " + yanit.status };

  fs.mkdirSync(path.dirname(hedefDosya), { recursive: true });
  fs.writeFileSync(hedefDosya, Buffer.from(await yanit.arrayBuffer()));
  return { yol, durum: Math.round(fs.statSync(hedefDosya).size / 1024) + " KB" };
}

(async () => {
  const adresler = adresleriTopla();
  console.log(adresler.length + " görsel bulundu\n");

  let indirilen = 0, hatali = 0;
  for (const url of adresler) {
    try {
      const s = await indir(url);
      console.log("  " + (s.durum.includes("HTTP") ? "✗" : "✓") + " " + s.yol.padEnd(46) + s.durum);
      if (s.durum.includes("HTTP")) hatali++; else indirilen++;
    } catch (e) {
      console.log("  ✗ " + url + " → " + e.message);
      hatali++;
    }
    await new Promise((r) => setTimeout(r, 150));
  }
  console.log("\n" + indirilen + " görsel hazır, " + hatali + " hata.");
})();
