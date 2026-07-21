/* content/*.json dosyalarından PostgreSQL tohum verisi üretir.

   İçerik kaynaktan alındığı hâliyle aktarılır; hiçbir metin değiştirilmez,
   kısaltılmaz veya yeniden yazılmaz. Yalnızca kaynak sitenin adresleri
   yeni sitenin adres yapısına çevrilir (bkz. adresCevir).

   Kullanım:  node tools/seed.js
   Çıktı:     backend/src/main/resources/db/migration/V2__tohum.sql          */

const fs = require("fs");
const path = require("path");

const KOK = path.join(__dirname, "..");
const ICERIK = path.join(KOK, "content");
const CIKTI = path.join(KOK, "backend", "src", "main", "resources", "db", "migration", "V2__tohum.sql");
const KAYNAK = "https://bidb.hacettepe.edu.tr";

/* Tek tırnak kaçışı — PostgreSQL metin sabiti */
const q = (v) => (v === null || v === undefined ? "NULL" : "'" + String(v).replace(/'/g, "''") + "'");

/* Kaynak sitedeki iç bağlantılar yeni sitenin adreslerine çevrilir.
   Dış bağlantılar ve belge adresleri olduğu gibi bırakılır. */
function adresCevir(html) {
  return String(html).replace(
    /(href|src)=(["'])(https?:\/\/bidb\.hacettepe\.edu\.tr)?\/(tr|en)\/([a-z0-9_-]+)\2/gi,
    (tam, oz, tirnak, kok, dil, slug) => oz + "=" + tirnak + "/" + dil + "/" + slug + tirnak
  );
}

function sayfaOku(dil) {
  const dizin = path.join(ICERIK, dil);
  if (!fs.existsSync(dizin)) return [];
  return fs.readdirSync(dizin)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dizin, f), "utf8")))
    .map((s) => ({ ...s, slug: s.slug || "anasayfa" }));
}

const satirlar = [];
const yaz = (s) => satirlar.push(s);

yaz("-- Bu dosya tools/seed.js tarafından üretildi. Elle düzenlemeyin.");
yaz("-- Kaynak: mevcut bidb.hacettepe.edu.tr içeriği (metinler birebir aktarılmıştır).");
yaz("");

/* ---------- sayfalar ---------- */
let sayfaSira = 0;
const sayfaAnahtar = {};   // "tr/slug" -> sıra numarası (menü bağlamak için)

["tr", "en"].forEach((dil) => {
  const sayfalar = sayfaOku(dil);
  sayfalar.forEach((s) => {
    sayfaSira++;
    sayfaAnahtar[dil + "/" + s.slug] = sayfaSira;
    yaz(
      "INSERT INTO sayfa (slug, dil, baslik, icerik_html, seo_title, seo_description, seo_keywords, sira) VALUES (" +
      [q(s.slug), q(dil), q(s.baslik), q(adresCevir(s.govdeHtml || "")),
       q(s.seo && s.seo.title), q(s.seo && s.seo.description), q(s.seo && s.seo.keywords),
       sayfaSira].join(", ") + ");"
    );

    (s.belgeler || []).forEach((b, i) => {
      const tur = (b.href.match(/\.([a-z0-9]{2,5})(?:\?|$)/i) || ["", ""])[1].toUpperCase();
      yaz(
        "INSERT INTO belge (sayfa_id, ad, adres, tur, sira) SELECT id, " +
        [q(b.metin), q(b.href), q(tur), i].join(", ") +
        " FROM sayfa WHERE slug = " + q(s.slug) + " AND dil = " + q(dil) + ";"
      );
    });
  });
});

/* ---------- menü ---------- */
const menu = JSON.parse(fs.readFileSync(path.join(ICERIK, "_menu.json"), "utf8"));

["tr", "en"].forEach((dil) => {
  (menu[dil] || []).forEach((bolum, bi) => {
    yaz("");
    yaz("INSERT INTO menu (dil, konum, baslik, sira) VALUES (" + [q(dil), q("sol"), q(bolum.bolum), bi].join(", ") + ");");
    bolum.sayfalar.forEach(([slug, ad], si) => {
      yaz(
        "INSERT INTO menu_oge (menu_id, etiket, sayfa_id, sira) SELECT m.id, " + q(ad) + ", s.id, " + si +
        " FROM menu m JOIN sayfa s ON s.slug = " + q(slug) + " AND s.dil = " + q(dil) +
        " WHERE m.dil = " + q(dil) + " AND m.baslik = " + q(bolum.bolum) + ";"
      );
    });
  });
});

/* ---------- sosyal medya ---------- */
const kabuk = JSON.parse(fs.readFileSync(path.join(ICERIK, "_kabuk.json"), "utf8"));
yaz("");
(kabuk.tr.sosyal || []).forEach((s, i) => {
  yaz("INSERT INTO sosyal_hesap (ag, adres, sira) VALUES (" + [q(s.ag), q(s.url), i].join(", ") + ");");
});

/* ---------- ana sayfa bileşenleri ---------- */
const bilesenYolu = path.join(ICERIK, "_anasayfa-bilesenler.json");
if (fs.existsSync(bilesenYolu)) {
  const b = JSON.parse(fs.readFileSync(bilesenYolu, "utf8"));

  // Kaynak sitedeki iç adresler yeni adres yapısına çevrilir
  const adres = (u) => String(u || "").replace(/^https?:\/\/bidb\.hacettepe\.edu\.tr(?=\/)/i, "");
  const disMi = (u) => /^https?:\/\//i.test(u) && !/bidb\.hacettepe\.edu\.tr/i.test(u);

  ["tr", "en"].forEach((dil) => {
    const v = b[dil] || {};

    yaz("");
    (v.slider || []).forEach((s, i) => {
      yaz("INSERT INTO slider (dil, baslik, alt_baslik, gorsel_url, gorsel_alt, sira) VALUES (" +
        [q(dil), q(s.baslik), q(s.ozet), q(adres(s.gorsel)), q(s.gorselAlt), i].join(", ") + ");");
    });

    yaz("");
    (v.hizliErisim || []).forEach((h, i) => {
      yaz("INSERT INTO hizli_erisim (dil, ad, ikon_url, adres, yeni_sekme, sira) VALUES (" +
        [q(dil), q(h.ad), q(adres(h.ikon)), q(adres(h.adres)), h.yeniSekme || disMi(h.adres) ? "TRUE" : "FALSE", i].join(", ") + ");");
    });

    // "Servisler ve Uygulamalar" karuseli de hızlı erişim tablosunda,
    // ayrı bir sıra aralığında tutulur
    yaz("");
    (v.servisler || []).forEach((s, i) => {
      yaz("INSERT INTO hizli_erisim (dil, ad, ikon_url, adres, yeni_sekme, sira) VALUES (" +
        [q(dil), q(s.ad), q(adres(s.gorsel)), q(adres(s.adres)), s.yeniSekme || disMi(s.adres) ? "TRUE" : "FALSE", 100 + i].join(", ") + ");");
    });

    yaz("");
    (v.duyurular || []).forEach((d) => {
      // gg.aa.yyyy → yyyy-aa-gg
      const p = (d.tarih || "").match(/(\d{2})[.\/](\d{2})[.\/](\d{2,4})/);
      const tarih = p ? (p[3].length === 2 ? "20" + p[3] : p[3]) + "-" + p[2] + "-" + p[1] : null;
      yaz("INSERT INTO duyuru (dil, baslik, yayin_tarihi, dis_adres) VALUES (" +
        [q(dil), q(d.baslik), tarih ? q(tarih) : "CURRENT_DATE", q(adres(d.adres))].join(", ") + ");");
    });
  });

  const il = (b.tr && b.tr.iletisim) || {};
  const ayarlar = [
    ["iletisim_adres", il.adres || ""],
    ["iletisim_telefon", (il.telefonlar || []).join(" · ")],
    ["iletisim_eposta", (il.epostalar || []).join(" · ")],
    ["iletisim_faks", il.faks || ""]
  ];
  yaz("");
  ayarlar.filter((a) => a[1]).forEach(([k, v]) => {
    yaz("INSERT INTO ayar (anahtar, dil, deger) VALUES (" + [q(k), q("tr"), q(v)].join(", ") + ");");
  });
}

fs.mkdirSync(path.dirname(CIKTI), { recursive: true });
fs.writeFileSync(CIKTI, satirlar.join("\n") + "\n", "utf8");

const sayfaSayisi = satirlar.filter((s) => s.startsWith("INSERT INTO sayfa")).length;
const belgeSayisi = satirlar.filter((s) => s.startsWith("INSERT INTO belge")).length;
const menuSayisi = satirlar.filter((s) => s.startsWith("INSERT INTO menu ")).length;
const ogeSayisi = satirlar.filter((s) => s.startsWith("INSERT INTO menu_oge")).length;
console.log("V2__tohum.sql üretildi:");
console.log("  sayfa: " + sayfaSayisi + "  ·  belge: " + belgeSayisi + "  ·  menü: " + menuSayisi + "  ·  menü öğesi: " + ogeSayisi);
console.log("  boyut: " + Math.round(fs.statSync(CIKTI).size / 1024) + " KB");
