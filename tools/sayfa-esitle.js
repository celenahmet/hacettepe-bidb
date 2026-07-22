/* Tek bir sayfayı kaynak siteyle yeniden eşitler.
 *
 * Kaynak site (bidb.hacettepe.edu.tr) yayına geçene kadar güncellenmeye
 * devam ediyor. verify-content.js bir fark bildirdiğinde, o sayfayı bu
 * araçla kaynaktaki son hâline getirebilirsiniz.
 *
 * Değişiklik yönetim ucundan yapıldığı için önceki hâl sürüm geçmişine
 * kaydedilir; yanlış giderse panelden geri alınabilir.
 *
 * Kullanım:
 *   node tools/sayfa-esitle.js <kaynak-slug>
 *   node tools/sayfa-esitle.js personel
 */

const X = require("./extract.js");
const { yeniSlug } = require("./slug-map");
const fs = require("fs");
const path = require("path");

const ORIGIN = "https://bidb.hacettepe.edu.tr";
const SITE = process.env.BIDB_SITE || "http://localhost:4000";
const KULLANICI = process.env.BIDB_YONETICI_KULLANICI || "yonetici";
const PAROLA = process.env.BIDB_YONETICI_PAROLA || "degistir-beni";

/** Kaynak sitenin adreslerini yeni yapıya çevirir (seed.js ile aynı kural). */
function adresCevir(html) {
  return String(html)
    .replace(
      /(href|src)=(["'])(https?:\/\/bidb\.hacettepe\.edu\.tr)?\/(tr|en)\/([a-z0-9_-]+)\2/gi,
      (t, oz, tirnak, kok, dil, slug) =>
        oz + "=" + tirnak + "/" + dil + "/" + yeniSlug(dil.toLowerCase(), slug) + tirnak
    )
    .replace(
      /(href|src)=(["'])https?:\/\/bidb\.hacettepe\.edu\.tr(\/(?:dosyalar|images)\/)/gi,
      (t, oz, tirnak, yol) => oz + "=" + tirnak + yol
    );
}

const kimlik = "Basic " + Buffer.from(KULLANICI + ":" + PAROLA).toString("base64");

(async () => {
  const kaynakSlug = process.argv[2];
  const dil = process.argv[3] || "tr";
  if (!kaynakSlug) {
    console.error("Kullanım: node tools/sayfa-esitle.js <kaynak-slug> [dil]");
    process.exit(1);
  }

  const hedefSlug = yeniSlug(dil, kaynakSlug);

  console.log("Kaynak  : " + ORIGIN + "/" + dil + "/" + kaynakSlug);
  console.log("Hedef   : /" + dil + "/" + hedefSlug + "\n");

  /* 1) kaynaktan al */
  const y = await fetch(ORIGIN + "/" + dil + "/" + kaynakSlug, {
    headers: { "User-Agent": "HU-BIDB-icerik-aktarimi/1.0" }
  });
  if (!y.ok) {
    console.error("Kaynak sayfa alınamadı: HTTP " + y.status);
    process.exit(1);
  }
  const govde = X.icerikGovdesi(await y.text()).trim();
  if (!govde) {
    console.error("Kaynak sayfanın gövdesi boş görünüyor; işlem durduruldu.");
    process.exit(1);
  }

  /* 2) sayfayı bul */
  const liste = await (await fetch(SITE + "/api/admin/pages", {
    headers: { Authorization: kimlik }
  })).json();
  const sayfa = liste.find((s) => s.slug === hedefSlug && s.language === dil);
  if (!sayfa) {
    console.error("Sayfa bulunamadı: /" + dil + "/" + hedefSlug);
    process.exit(1);
  }

  console.log("Mevcut  : " + sayfa.contentLength + " karakter");
  console.log("Kaynak  : " + govde.length + " karakter");

  if (govde.length === 0) {
    console.error("Boş içerik yazılmayacak.");
    process.exit(1);
  }

  /* 3) güncelle */
  const yanit = await fetch(SITE + "/api/admin/pages/" + sayfa.id + "/content", {
    method: "PUT",
    headers: { Authorization: kimlik, "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      title: sayfa.title,
      contentHtml: adresCevir(govde),
      note: "Kaynak sitedeki güncellemeyle eşitlendi"
    })
  });

  if (!yanit.ok) {
    console.error("\nGüncellenemedi: HTTP " + yanit.status);
    process.exit(1);
  }

  /* 4) içerik dosyasını da güncelle (izlenebilirlik) */
  const dosya = path.join(__dirname, "..", "content", dil, kaynakSlug + ".json");
  if (fs.existsSync(dosya)) {
    const veri = JSON.parse(fs.readFileSync(dosya, "utf8"));
    veri.govdeHtml = govde;
    veri.cekilme = new Date().toISOString();
    fs.writeFileSync(dosya, JSON.stringify(veri, null, 2), "utf8");
    console.log("İçerik dosyası da güncellendi: content/" + dil + "/" + kaynakSlug + ".json");
  }

  console.log("\nEşitlendi. Önceki hâl sürüm geçmişinde; panelden geri alınabilir.");
  console.log("Doğrulamak için: node tools/verify-content.js");
})();
