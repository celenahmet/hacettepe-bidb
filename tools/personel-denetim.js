/* Personel içeriği denetimi.

   Personel sayfası artık HTML metni olarak saklanmıyor; birim ve kişi
   kayıtlarından üretiliyor. Bu yüzden verify-content.js'in yaptığı düz
   metin karşılaştırması bu sayfada anlamlı sonuç vermez.

   Bu betik onun yerine daha güçlü bir soruyu yanıtlar: kaynak sayfadaki
   her birim ve her kişi veritabanında duruyor mu? Kaynaktan tek tek
   okunur, veritabanıyla karşılaştırılır, iki yönde de eksik aranır.

   Kullanım:  node tools/personel-denetim.js                                */

const { execFileSync } = require("child_process");

const KAYNAK = "https://bidb.hacettepe.edu.tr/tr/personel";
const KAP = "bidb-db";

function psql(sorgu) {
  return execFileSync("docker", ["exec", "-i", KAP, "psql", "-U", "bidb", "-d", "bidb", "-t", "-A", "-c", sorgu],
    { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
}

/* Türkçe büyük/küçük harf ve boşluk farkları önemsenmez; karşılaştırılan
   şey adın kendisi, yazım biçimi değil. */
const anahtar = (s) =>
  String(s).replace(/\s+/g, " ").trim().toLocaleLowerCase("tr")
    .replace(/[*]/g, "").trim();

(async () => {
  const yanit = await fetch(KAYNAK, { headers: { "User-Agent": "HU-BIDB-dogrulama/1.0" } });
  if (!yanit.ok) {
    console.error("Kaynak sayfa alınamadı: HTTP " + yanit.status);
    process.exit(2);
  }
  const html = await yanit.text();

  /* Kaynakta birim adları <strong>/<b> içinde, kişiler aralarındaki
     <br /> ile ayrılmış düz metin. Etiketler soyulup satırlara bölünür. */
  const govde = (html.match(/<div class="icerik">([\s\S]*?)<\/div>/) || [])[1] || html;
  const satirlar = govde
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|tr|td|table|h\d)>/gi, "\n")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&nbsp;/g, " ")
    .split("\n")
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .filter((s) => s !== "*" && !/^\*\s*Birim Sorumlu/i.test(s));

  const kaynakAdlar = new Set(satirlar.map(anahtar));

  /* Kaynakta adın yanında duran açıklama ("(e-imza)") ve yönetim
     kadrosundaki unvan ("Daire Başkanı") ayrı sütunlara alınmıştı.
     Karşılaştırma bunları kaynaktaki hâliyle yeniden birleştirir —
     yoksa taşınan bilgi "kaybolmuş" gibi görünürdü. */
  const kisiler = psql(
    "SELECT full_name || coalesce(' (' || note || ')', '') FROM staff_member " +
    "UNION SELECT role_title FROM staff_member WHERE role_title IS NOT NULL;"
  ).split("\n").map((s) => s.trim()).filter(Boolean);

  const birimler = psql(
    "SELECT name || coalesce(' (' || campus || ')', '') || coalesce(' (' || phone || ')', '') FROM staff_unit;"
  ).split("\n").map((s) => s.trim()).filter(Boolean);

  const dbAdlar = new Set([...kisiler, ...birimler].map(anahtar));

  /* Kaynakta olup veritabanında olmayanlar: aktarımda düşen bilgi. */
  const dusen = [...kaynakAdlar].filter((a) => !dbAdlar.has(a));

  /* Veritabanında olup kaynakta olmayanlar: uydurulmuş bilgi.
     "Yönetim" gibi kaynakta tablo başlığı olarak geçen adlar da burada
     çıkabilir; o yüzden ayrı listelenir, hata sayılmaz. */
  const fazla = [...dbAdlar].filter((a) => !kaynakAdlar.has(a));

  console.log("Kaynak satırı        : " + kaynakAdlar.size);
  console.log("Veritabanı kaydı     : " + dbAdlar.size + "  (" + kisiler.length + " kişi, " + birimler.length + " birim)");
  console.log();

  if (dusen.length) {
    console.log("✗ Kaynakta olup veritabanında bulunmayan (" + dusen.length + "):");
    dusen.forEach((a) => console.log("    " + a));
  } else {
    console.log("✓ Kaynaktaki her birim ve kişi veritabanında var.");
  }

  if (fazla.length) {
    console.log();
    console.log("• Veritabanında olup kaynak satırlarıyla eşleşmeyen (" + fazla.length + "):");
    fazla.forEach((a) => console.log("    " + a));
    console.log("  (birim adından ayrılan yerleşke/telefon bilgisi burada görünebilir)");
  }

  process.exit(dusen.length ? 1 : 0);
})();
