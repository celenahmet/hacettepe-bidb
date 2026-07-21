/* İçerik doğrulama.

   Veritabanına yüklenen metni, kaynak sitedeki canlı sayfayla karşılaştırır.
   Amaç, "içerik birebir aktarıldı" iddiasını ölçerek kanıtlamaktır.

   Karşılaştırma normalize edilmiş düz metin üzerinden yapılır:
   HTML etiketleri, ardışık boşluklar ve satır sonları önemsenmez —
   çünkü bunlar görünen içeriği değiştirmez.

   Kullanım:  node tools/verify-content.js                                    */

const { execFileSync } = require("child_process");
const X = require("./extract.js");

const ORIGIN = "https://bidb.hacettepe.edu.tr";
const KAP = "bidb-db";

function psql(sorgu) {
  return execFileSync("docker", ["exec", "-i", KAP, "psql", "-U", "bidb", "-d", "bidb", "-t", "-A", "-c", sorgu],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}

const normalize = (s) => String(s).replace(/\s+/g, " ").trim();

async function getir(url) {
  const y = await fetch(url, { headers: { "User-Agent": "HU-BIDB-dogrulama/1.0" } });
  if (!y.ok) throw new Error("HTTP " + y.status);
  return await y.text();
}

/* İlk farklılığın konumunu ve çevresini gösterir */
function farkNoktasi(a, b) {
  const n = Math.min(a.length, b.length);
  let i = 0;
  while (i < n && a[i] === b[i]) i++;
  if (i === n && a.length === b.length) return null;
  return {
    konum: i,
    kaynak: a.slice(Math.max(0, i - 40), i + 40),
    veritabani: b.slice(Math.max(0, i - 40), i + 40)
  };
}

(async () => {
  // İçerik satır sonu barındırdığı için satır bazlı değil, JSON olarak okunur
  const kayitlar = JSON.parse(psql(
    "SELECT coalesce(json_agg(json_build_object('dil', dil, 'slug', slug, 'html', icerik_html) " +
    "ORDER BY dil, slug)::text, '[]') FROM sayfa WHERE slug <> 'anasayfa';"
  ).trim());

  console.log("SAYFA".padEnd(34) + "KAYNAK".padStart(8) + "VERİTABANI".padStart(12) + "   SONUÇ");
  console.log("-".repeat(74));

  let ayni = 0, farkli = 0;
  const farklar = [];

  for (const kayit of kayitlar) {
    const { dil, slug, html } = kayit;
    let canli;
    try {
      canli = await getir(ORIGIN + "/" + dil + "/" + slug);
    } catch (e) {
      console.log((dil + "/" + slug).padEnd(34) + "        indirilemedi: " + e.message);
      continue;
    }

    const kaynakMetin = normalize(X.duz(X.icerikGovdesi(canli)));
    const dbMetin = normalize(X.duz(html));

    if (kaynakMetin === dbMetin) {
      ayni++;
      console.log((dil + "/" + slug).padEnd(34) + String(kaynakMetin.length).padStart(8) + String(dbMetin.length).padStart(12) + "   ✓ birebir aynı");
    } else {
      farkli++;
      const f = farkNoktasi(kaynakMetin, dbMetin);
      console.log((dil + "/" + slug).padEnd(34) + String(kaynakMetin.length).padStart(8) + String(dbMetin.length).padStart(12) + "   ✗ FARKLI");
      farklar.push({ sayfa: dil + "/" + slug, fark: f });
    }
    await new Promise((r) => setTimeout(r, 250));
  }

  console.log("\n" + ayni + " sayfa birebir aynı, " + farkli + " sayfa farklı.");
  if (farklar.length) {
    console.log("\nFarkların ayrıntısı:");
    farklar.slice(0, 5).forEach((f) => {
      console.log("\n  " + f.sayfa + "  (ilk fark " + f.fark.konum + ". karakterde)");
      console.log("    kaynak     : …" + f.fark.kaynak + "…");
      console.log("    veritabanı : …" + f.fark.veritabani + "…");
    });
  }
  process.exit(farkli ? 1 : 0);
})();
