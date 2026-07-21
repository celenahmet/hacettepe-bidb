/* Kaynak sitedeki belgeleri ve içerik görsellerini projeye indirir.

   Sayfa içeriklerinde ve belge listelerinde geçen /dosyalar/... ve
   /images/... adresleri, yeni site yayına alındığında kendi sunucumuzdan
   verilmelidir. Aksi hâlde eski sunucu kapandığında bağlantılar kırılır —
   ve site zaten aynı alan adında çalışacağı için eski sunucuya düşemez.

   Dosyalar frontend/public altına, kaynaktaki yol yapısıyla kopyalanır.

   Kullanım:  node tools/fetch-dosyalar.js                                   */

const fs = require("fs");
const path = require("path");

const ORIGIN = "https://bidb.hacettepe.edu.tr";
const KOK = path.join(__dirname, "..");
const ICERIK = path.join(KOK, "content");
const HEDEF = path.join(KOK, "frontend", "public");
const BEKLEME = 120;

const bekle = (ms) => new Promise((r) => setTimeout(r, ms));

/** İçerik dosyalarındaki tüm yerel varlık adreslerini toplar. */
function adresleriTopla() {
  const adresler = new Set();
  const ekle = (u) => {
    if (!u) return;
    let y = String(u).trim();
    y = y.replace(/^https?:\/\/bidb\.hacettepe\.edu\.tr/i, "");
    if (/^https?:\/\//i.test(y)) return;            // başka siteye ait
    if (!y.startsWith("/")) y = "/" + y;            // "images/x.png" gibi göreli
    if (/^\/(dosyalar|images|files|belgeler)\//i.test(y)) adresler.add(y.split(/[?#]/)[0]);
  };

  for (const dil of ["tr", "en"]) {
    const d = path.join(ICERIK, dil);
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d).filter((x) => x.endsWith(".json"))) {
      const v = JSON.parse(fs.readFileSync(path.join(d, f), "utf8"));
      (v.belgeler || []).forEach((b) => ekle(b.href));
      (v.gorseller || []).forEach((g) => ekle(g.src || g));
      const html = String(v.govdeHtml || "");
      for (const m of html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)) ekle(m[1]);
    }
  }

  const bilesen = path.join(ICERIK, "_anasayfa-bilesenler.json");
  if (fs.existsSync(bilesen)) {
    const b = JSON.parse(fs.readFileSync(bilesen, "utf8"));
    JSON.stringify(b).match(/"[^"]*\/(?:dosyalar|images)\/[^"]*"/gi)?.forEach((s) => ekle(s.slice(1, -1)));
  }
  return [...adresler].sort();
}

(async () => {
  const adresler = adresleriTopla();
  console.log("Bulunan varlık adresi: " + adresler.length);

  let indirilen = 0, mevcut = 0, hata = [];
  for (const yol of adresler) {
    const hedef = path.join(HEDEF, yol.replace(/^\//, "").split("/").join(path.sep));
    if (fs.existsSync(hedef) && fs.statSync(hedef).size > 0) { mevcut++; continue; }

    try {
      const y = await fetch(ORIGIN + encodeURI(yol), { headers: { "User-Agent": "HU-BIDB-icerik-aktarimi/1.0" } });
      if (!y.ok) throw new Error("HTTP " + y.status);
      const veri = Buffer.from(await y.arrayBuffer());
      if (!veri.length) throw new Error("boş dosya");
      fs.mkdirSync(path.dirname(hedef), { recursive: true });
      fs.writeFileSync(hedef, veri);
      indirilen++;
      console.log("  ✓ " + yol.padEnd(62) + (veri.length / 1024).toFixed(0) + " KB");
    } catch (e) {
      hata.push(yol + "  (" + e.message + ")");
      console.log("  ✗ " + yol + "  " + e.message);
    }
    await bekle(BEKLEME);
  }

  console.log("\nindirilen: " + indirilen + " · zaten vardı: " + mevcut + " · alınamayan: " + hata.length);
  if (hata.length) {
    console.log("\nAlınamayanlar (kaynakta da yok olabilir):");
    hata.forEach((h) => console.log("  " + h));
  }
})();
