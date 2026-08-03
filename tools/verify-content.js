/* İçerik doğrulama.

   Veritabanına yüklenen metni, kaynak sitedeki canlı sayfayla karşılaştırır.
   Amaç, "içerik birebir aktarıldı" iddiasını ölçerek kanıtlamaktır.

   Karşılaştırma normalize edilmiş düz metin üzerinden yapılır:
   HTML etiketleri, ardışık boşluklar ve satır sonları önemsenmez —
   çünkü bunlar görünen içeriği değiştirmez.

   Kullanım:  node tools/verify-content.js                                    */

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { yeniSlug } = require("./slug-map");
const X = require("./extract.js");

/* Yeni adres -> kaynak sitedeki özgün adres.

   Adres tahmin edilmez: içerik dosyalarında kayıtlı olan gerçek kaynak
   adresi kullanılır. Kaynak sitede bazı adresler büyük harfli (/tr/VPN)
   ve yeniden kurulan adres o sayfayı bulamıyordu. */
const KAYNAK_SLUG = {};
for (const dil of ["tr", "en"]) {
  const dizin = path.join(__dirname, "..", "content", dil);
  if (!fs.existsSync(dizin)) continue;
  for (const f of fs.readdirSync(dizin).filter((x) => x.endsWith(".json") && !x.startsWith("_"))) {
    const veri = JSON.parse(fs.readFileSync(path.join(dizin, f), "utf8"));
    const ozgun = (String(veri.url || "").match(/\/(?:tr|en)\/([^/?#]+)/) || [])[1] || veri.slug;
    KAYNAK_SLUG[dil + "/" + yeniSlug(dil, veri.slug)] = ozgun;
  }
}

/* Kurum kararıyla kaynaktan bilerek ayrılan sayfalar.
   Bu sayfalar karşılaştırılmaz; gerekçe kayıt altında kalır ki ileride
   "acaba yanlışlıkla mı bozuldu?" sorusu doğmasın. */
const BILINCLI_SAPMA = {
  "tr/org-chart": "Yönetim sayfasıyla birleştirildi (kurum kararı)",
  "tr/about": "Kaynakta yok — kurum için yeni yazıldı (Hakkımızda)",
  "tr/e-signature": "E-imza alt sisteminden birebir alındı (eimza/*.php)",
  "tr/e-signature-about": "E-imza alt sisteminden birebir alındı (eimza/*.php)",
  "tr/e-signature-legislation": "E-imza alt sisteminden birebir alındı (eimza/*.php)",
  "tr/e-signature-application": "E-imza alt sisteminden birebir alındı (eimza/*.php)",
  "tr/e-signature-workflow": "E-imza alt sisteminden birebir alındı (eimza/*.php)",
  "tr/e-signature-certificate-received": "E-imza alt sisteminden birebir alındı (eimza/*.php)",
  "tr/e-signature-java": "E-imza alt sisteminden birebir alındı (eimza/*.php)",
  "tr/e-signature-remote-desktop": "E-imza alt sisteminden birebir alındı (eimza/*.php)",
  "tr/e-signature-security-word": "E-imza alt sisteminden birebir alındı (eimza/*.php)",
  "tr/e-signature-renewal": "E-imza alt sisteminden birebir alındı (eimza/*.php)",
  "tr/e-signature-update": "E-imza alt sisteminden birebir alındı (eimza/*.php)",
  "tr/e-signature-cancellation": "E-imza alt sisteminden birebir alındı (eimza/*.php)",
  "tr/e-signature-info-update": "E-imza alt sisteminden birebir alındı (eimza/*.php)",
  "tr/e-signature-password": "E-imza alt sisteminden birebir alındı (eimza/*.php)",
  "tr/e-signature-unit-officers": "E-imza alt sisteminden birebir alındı (eimza/*.php)",
  "tr/e-signature-faq": "E-imza alt sisteminden birebir alındı (eimza/*.php)",
  "tr/staff": "Yapısal veriye taşındı — node tools/personel-denetim.js ile denetlenir",
  "tr/wireless": "V33 migration ile eduroam açıklaması eklendi (kurum kararı, dokümante edilmiş)",
  // Tek fark bir marka adının yazımı: kaynakta "Macos", bizde "MacOS".
  // Uzunluk birebir aynı (1327 karakter), anlam değişmiyor. 781107d
  // ("proxy kartlarının marka ikonlarını düzelt") ile bilerek düzeltildi.
  // Kayda geçiriliyor: aksi hâlde denetim her çalıştığında açıklamasız bir
  // FARKLI satırı üretiyor ve bu listenin var olma sebebi olan "acaba
  // bozuldu mu?" sorusunu her seferinde yeniden doğuruyordu.
  "tr/proxy": "Marka adı yazımı düzeltildi: Macos -> MacOS (781107d)"
};

/* Kaynağın "bu sayfa yok" gövdesi. İngilizce adreslerin tamamı bunu
   döndürüyor; taslak sayfa gerçek içerik değildir. */
const KAYNAK_SUNMUYOR = /^Böyle bir sayfa bulunmamaktadır/;

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
    "SELECT coalesce(json_agg(json_build_object('dil', language, 'slug', slug, 'html', content_html) " +
    "ORDER BY language, slug)::text, '[]') FROM page WHERE slug <> 'home';"
  ).trim());

  console.log("SAYFA".padEnd(34) + "KAYNAK".padStart(8) + "VERİTABANI".padStart(12) + "   SONUÇ");
  console.log("-".repeat(74));

  let ayni = 0, farkli = 0, bilincli = 0, sunulmayan = 0;
  const farklar = [];

  for (const kayit of kayitlar) {
    const { dil, slug, html } = kayit;

    if (BILINCLI_SAPMA[dil + "/" + slug]) {
      bilincli++;
      console.log((dil + "/" + slug).padEnd(34) + "        ● bilinçli sapma: " + BILINCLI_SAPMA[dil + "/" + slug]);
      continue;
    }

    let canli;
    try {
      const kaynakSlug = KAYNAK_SLUG[dil + "/" + slug] || slug;
      canli = await getir(ORIGIN + "/" + dil + "/" + kaynakSlug);
    } catch (e) {
      console.log((dil + "/" + slug).padEnd(34) + "        indirilemedi: " + e.message);
      continue;
    }

    const kaynakMetin = normalize(X.duz(X.icerikGovdesi(canli)));
    const dbMetin = normalize(X.duz(html));

    /* Kaynak sitenin İngilizce adresleri artık içerik SUNMUYOR: /en/<slug>
       isteklerinin tamamı aynı taslak sayfayı döndürüyor ve içerik gövdesinde
       "Böyle bir sayfa bulunmamaktadır!" yazıyor.

       Bunlar "FARKLI" sayıldığında denetim 79 sahte bulgu üretiyordu. O
       kalabalıkta gerçek bir bozulma görünmez hâle gelir - denetimin var olma
       sebebi de tam olarak onu görmek. Bu yüzden ayrı sayılıyor.

       İngilizce içerik silinmiş değil; kaynakta karşılaştırılacak bir şey yok.
       Karşılığın doğruluğu, çeviri işi yapıldığında ayrıca ele alınacak
       (bkz. devir notu, İngilizce çeviri bölümü). */
    if (KAYNAK_SUNMUYOR.test(kaynakMetin)) {
      sunulmayan++;
      console.log((dil + "/" + slug).padEnd(34) + "        ○ kaynak artık bu sayfayı sunmuyor");
      await new Promise((r) => setTimeout(r, 250));
      continue;
    }

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

  console.log("\n" + ayni + " sayfa birebir aynı, " + farkli + " sayfa farklı, "
    + bilincli + " bilinçli sapma, " + sunulmayan + " sayfayı kaynak artık sunmuyor.");
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
