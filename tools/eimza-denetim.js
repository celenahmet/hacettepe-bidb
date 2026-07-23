/* E-imza içerik doğrulama.

   E-imza sayfaları ana siteden değil, ayrı bir alt sistemden (eimza/*.php)
   birebir alındı. verify-content.js bu sayfaları "bilinçli sapma" sayıp
   atlar — çünkü ana site adreslerinde karşılıkları yok. Bu da birebirliği
   ölçen hiçbir denetim kalmaması demekti.

   Bu betik o boşluğu kapatır: her e-imza sayfasını KENDİ kaynağıyla
   karşılaştırır. Kaynak ekip sayfaları güncellediğinde fark burada görünür.

   Kullanım:  node tools/eimza-denetim.js                                   */

const { execFileSync } = require("child_process");

const KAYNAK = "https://bidb.hacettepe.edu.tr/eimza/";
const KAP = "bidb-db";

/* Yeni slug -> kaynak dosya. V18'deki eşlemeyle aynı tutulmalı. */
const ESLEME = {
  "e-signature": "index.php",
  "e-signature-about": "hakkinda.php",
  "e-signature-legislation": "kanun.php",
  "e-signature-application": "basvuru.php",
  "e-signature-workflow": "isakisi.php",
  "e-signature-certificate-received": "yrd_kamusm_sertifikami_aldim.php",
  "e-signature-java": "java_ayar.php",
  "e-signature-remote-desktop": "uzak_masaustu.php",
  "e-signature-security-word": "sertifika_guvenlik_sozcugu.php",
  "e-signature-renewal": "sertifika_yenileme.php",
  "e-signature-update": "sertifika_guncelleme.php",
  "e-signature-cancellation": "sertifika_iptal.php",
  "e-signature-info-update": "sertifika_bilgi_guncelleme.php",
  "e-signature-password": "sifre.php",
  "e-signature-unit-officers": "birim_eimza_sorumlu_listesi.php",
  "e-signature-faq": "sss.php"
};

function psql(sorgu) {
  return execFileSync(
    "docker",
    ["exec", "-i", KAP, "psql", "-U", "bidb", "-d", "bidb", "-t", "-A", "-c", sorgu],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }
  );
}

const normalize = (s) =>
  String(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();

/** V18/V20 ile AYNI çıkarma mantığı: kap derinliği dengelenerek kesilir. */
function kabiDengele(html) {
  let derinlik = 1;
  const etiket = /<(\/?)div\b[^>]*>/gi;
  let m;
  while ((m = etiket.exec(html)) !== null) {
    derinlik += m[1] ? -1 : 1;
    if (derinlik === 0) return html.slice(0, m.index);
  }
  const kes = html.search(/<!--[^>]*bit|<div class="temizle"|<footer|<\/body/i);
  return kes > 0 ? html.slice(0, kes) : html;
}

function govdeyiCikar(html) {
  const col = html.split(/class="col-lg-9[^"]*"[^>]*>/i)[1] || html;
  const ic =
    (col.match(/id="duyurular_ic"[^>]*>([\s\S]*)/i) || [])[1] ||
    (col.match(/id="icerik_yazi"[^>]*>([\s\S]*)/i) || [])[1] ||
    "";
  return kabiDengele(ic).trim();
}

async function getir(url) {
  const y = await fetch(url, { headers: { "User-Agent": "HU-BIDB-dogrulama/1.0" } });
  if (!y.ok) throw new Error("HTTP " + y.status);
  return await y.text();
}

/** İlk farkın konumunu ve çevresini gösterir. */
function farkNoktasi(a, b) {
  const n = Math.min(a.length, b.length);
  let i = 0;
  while (i < n && a[i] === b[i]) i++;
  if (i === n && a.length === b.length) return null;
  return {
    konum: i,
    kaynak: a.slice(Math.max(0, i - 45), i + 45),
    veritabani: b.slice(Math.max(0, i - 45), i + 45)
  };
}

(async () => {
  const kayitlar = JSON.parse(
    psql(
      "SELECT coalesce(json_agg(json_build_object('slug', slug, 'html', content_html))::text, '[]') " +
        "FROM page WHERE slug LIKE 'e-signature%' AND language = 'tr';"
    ).trim()
  );
  const dbHaritasi = Object.fromEntries(kayitlar.map((k) => [k.slug, k.html]));

  console.log("SAYFA".padEnd(36) + "KAYNAK".padStart(8) + "VERİTABANI".padStart(12) + "   SONUÇ");
  console.log("-".repeat(76));

  let ayni = 0,
    farkli = 0,
    eksik = 0;
  const farklar = [];

  for (const [slug, dosya] of Object.entries(ESLEME)) {
    const db = dbHaritasi[slug];
    if (db === undefined) {
      eksik++;
      console.log(slug.padEnd(36) + "        sayfa veritabanında YOK");
      continue;
    }

    let canli;
    try {
      canli = await getir(KAYNAK + dosya);
    } catch (e) {
      console.log(slug.padEnd(36) + "        kaynak indirilemedi: " + e.message);
      continue;
    }

    const kaynakMetin = normalize(govdeyiCikar(canli));
    const dbMetin = normalize(db);

    if (kaynakMetin === dbMetin) {
      ayni++;
      console.log(
        slug.padEnd(36) +
          String(kaynakMetin.length).padStart(8) +
          String(dbMetin.length).padStart(12) +
          "   ✓ birebir aynı"
      );
    } else {
      farkli++;
      console.log(
        slug.padEnd(36) +
          String(kaynakMetin.length).padStart(8) +
          String(dbMetin.length).padStart(12) +
          "   ✗ FARKLI"
      );
      farklar.push({ slug, fark: farkNoktasi(kaynakMetin, dbMetin) });
    }
    await new Promise((r) => setTimeout(r, 250));
  }

  console.log(`\n${ayni} sayfa birebir aynı, ${farkli} sayfa farklı${eksik ? ", " + eksik + " sayfa eksik" : ""}.`);

  if (farklar.length) {
    console.log("\nFarkların ayrıntısı:");
    farklar.slice(0, 5).forEach((f) => {
      if (!f.fark) return;
      console.log(`\n  ${f.slug}  (ilk fark ${f.fark.konum}. karakterde)`);
      console.log("    kaynak     : …" + f.fark.kaynak + "…");
      console.log("    veritabanı : …" + f.fark.veritabani + "…");
    });
    console.log(
      "\nKaynak ekip sayfayı güncellemiş olabilir. Değişiklik doğruysa\n" +
        "içeriği panelden güncelleyin; bu betik yeniden çalıştırıldığında susar."
    );
  }

  process.exit(farkli || eksik ? 1 : 0);
})();
