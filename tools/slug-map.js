/* Adres (slug) eşlemesi — tek kaynak.

   Kaynak sitedeki Türkçe ve kısaltmalı adresler, kurumsal ve kısa
   İngilizce karşılıklarıyla değiştirilir. Aynı slug her iki dilde de
   kullanılır; yalnızca dil ön eki değişir:

       /tr/about   ·   /en/about

   Sayfa METİNLERİ değişmez. Yalnızca adresler ve bağlantı hedefleri
   yeni yapıya taşınır.                                                      */

/** Türkçe taraftaki eski slug -> yeni slug */
const TR = {
  anasayfa: "home",
  geneltanitim: "overview",       // /tr/about ayrı bir Hakkımızda sayfasına ayrıldı
  yonetim: "org-chart",          // Organizasyon Şeması ile birleştirildi
  misyonvizyon: "mission-vision",
  bilgikorumaanapolitikamiz: "security-policy",
  personel: "staff",
  organizasyonsemasi: "org-chart",
  kk: "committees",

  webser: "web-services",
  "hu-iys": "cms",
  kablosuz: "wireless",
  yazilim: "software",
  bilgidokuman: "documents",
  eposta: "email",
  "e-posta": "webmail",
  office365: "office365",
  proxy: "proxy",
  sss: "faq",
  formlar: "forms",

  bgys: "isms",
  tarama: "mail-filtering",
  yayim: "web-policy",
  ogr_kural: "dorm-rules",
  pc_salon: "lab-rules",
  posta_kural: "mailing-lists",
  hunet_kurallar: "hunet-policy",
  bilisim_ilke: "student-rules",
  hunet_protokol: "dorm-access",

  altyapi: "network",
  donanim: "hardware",
  erisim: "external-access",

  iletisim: "contact",
  sorumluluksiniri: "disclaimer",
  erisilebilirlik: "accessibility",

  /* menüde yer almayan, içerikten bağlantı verilen sayfalar */
  vpn: "vpn",
  mezuneposta: "alumni-email",
  arsiv: "archive",
  servis: "services",
  kisisel: "personal-pages",
  spam: "spam",
  guvenlik: "security",
  bil_onlem: "it-security-tips",
  baglanti_onlem: "connection-security",
  dokuman_link: "document-links",
  epostaalma: "email-account",
  proxy_spam_kntr: "proxy-spam",
  eposta_gecis: "email-migration",
  ilan_280425: "notice-280425",
  duy_iskur280225: "notice-iskur-280225",

  /* arşiv ve eski duyuru sayfaları (içerikten bağlantılı) */
  ilan: "notices",
  duyuru121120: "notice-121120",
  duyuru110520: "notice-110520",
  eposta051218: "notice-051218",
  spss081118: "spss-081118",
  matlabogr061118: "matlab-061118",
  sas191018: "sas-191018",
  ansysduy011018: "ansys-011018",
  stylecc50kaldirilmasi: "stylecc50-removal",
  owncloud: "owncloud",
  d_050416: "notice-050416",
  dblidyasorgui: "database-query",
  "viruslere-karsi-korunma": "virus-protection",
  eski_eposta_yedekalma_video: "email-backup-video",
  kurumsalsema180117: "notice-180117"
};

/** İngilizce taraftaki eski slug -> yeni slug */
const EN = {
  anasayfa: "home",
  overview: "about",
  mv: "mission-vision",
  yonetim: "management",
  grup: "service-groups",
  iletisim: "contact"
};

/** Dil ve eski slug'a göre yeni slug döndürür. */
function yeniSlug(dil, eski) {
  const tablo = dil === "en" ? EN : TR;
  // Kaynak sitede bazı adresler büyük harfli (örn. /tr/VPN); eşleme
  // küçük harf üzerinden yapılır ve sonuç da küçük harfli döner.
  const anahtar = String(eski).toLowerCase();
  return tablo[anahtar] ?? anahtar;
}

/** Kaynak sitedeki adres yollarını yeni yapıya çevirir: /tr/geneltanitim -> /tr/about */
function yoluCevir(yol) {
  return String(yol).replace(
    /(^|https?:\/\/bidb\.hacettepe\.edu\.tr)\/(tr|en)\/([a-z0-9_-]+)/gi,
    (tam, kok, dil, slug) => (kok.startsWith("http") ? "" : kok) + "/" + dil + "/" + yeniSlug(dil.toLowerCase(), slug)
  );
}

/** Eski yol -> yeni yol eşlemesi (yönlendirme için) */
function yonlendirmeTablosu() {
  const tablo = {};
  Object.entries(TR).forEach(([eski, yeni]) => {
    if (eski !== yeni) tablo["/tr/" + eski] = "/tr/" + yeni;
  });
  Object.entries(EN).forEach(([eski, yeni]) => {
    if (eski !== yeni) tablo["/en/" + eski] = "/en/" + yeni;
  });
  return tablo;
}

module.exports = { TR, EN, yeniSlug, yoluCevir, yonlendirmeTablosu };
