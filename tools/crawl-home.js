/* Ana sayfadaki dinamik bileşenleri ayrı ayrı çıkarır:
   slider, hızlı erişim kutuları, haber/duyurular, servis karuseli,
   sosyal medya hesapları ve iletişim bilgileri.
   Kullanım: node tools/crawl-home.js                                     */

const fs = require("fs");
const path = require("path");

const ORIGIN = "https://bidb.hacettepe.edu.tr";
const OUT = path.join(__dirname, "..", "content");

function coz(s) {
  return s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n));
}
const duz = (h) => coz(String(h).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ")).trim();
const mutlak = (u) => (u && u.startsWith("/") ? ORIGIN + u : u);

async function getir(url) {
  const y = await fetch(url, { headers: { "User-Agent": "HU-BIDB-icerik-aktarimi/1.0" } });
  if (!y.ok) throw new Error("HTTP " + y.status);
  return await y.text();
}

/* --- slider: büyük görsel + üzerindeki başlık --- */
function slider(html) {
  const kutu = html.match(/<div[^>]+(?:id|class)=["'][^"']*(?:carousel|slider|slide)[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/i);
  const alan = kutu ? kutu[1] : html;
  const gorseller = [...alan.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)].map((m) => mutlak(m[1]));
  const basliklar = [...alan.matchAll(/<(h1|h2|h3|div)[^>]+class=["'][^"']*(?:caption|title|baslik)[^"']*["'][^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => duz(m[2]));
  return { gorseller: [...new Set(gorseller)].filter((g) => /\.(jpg|jpeg|png|webp)/i.test(g)), basliklar };
}

/* --- hızlı erişim kutuları: ikon + ad + adres --- */
function hizliErisim(html) {
  const out = [];
  const re = /<a[^>]+href=["']([^"']+)["'][^>]*>\s*(?:<[^>]+>\s*)*<img[^>]+src=["']([^"']+)["'][^>]*>([\s\S]{0,200}?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    const ad = duz(m[3]);
    if (!ad || ad.length > 60) continue;
    out.push({ ad, href: mutlak(m[1]), ikon: mutlak(m[2]) });
  }
  return out;
}

/* --- haber ve duyurular --- */
function duyurular(html) {
  const out = [];
  const re = /<a[^>]+href=["']([^"']*(?:duyuru|haber|announce|news)[^"']*)["'][^>]*>([\s\S]{0,300}?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    const baslik = duz(m[2]);
    if (baslik.length < 12) continue;
    const tarih = (baslik.match(/(\d{2}[./]\d{2}[./]\d{2,4})/) || [])[1] || "";
    out.push({ baslik: baslik.replace(/\s*\d{2}[./]\d{2}[./]\d{2,4}\s*$/, "").trim(), tarih, href: mutlak(m[1]) });
  }
  return out.filter((d, i, a) => a.findIndex((x) => x.baslik === d.baslik) === i);
}

/* --- sosyal medya --- */
function sosyal(html) {
  const alanlar = { instagram: /instagram\.com\/[^"'\s>]+/i, facebook: /facebook\.com\/[^"'\s>]+/i, twitter: /(?:twitter|x)\.com\/[^"'\s>]+/i, youtube: /youtube\.com\/[^"'\s>]+/i, linkedin: /linkedin\.com\/[^"'\s>]+/i };
  const out = [];
  Object.entries(alanlar).forEach(([ad, re]) => {
    const m = html.match(re);
    if (m) out.push({ ad, url: "https://" + m[0].replace(/^https?:\/\//, "") });
  });
  return out;
}

/* --- iletişim --- */
function iletisim(html) {
  const metin = duz(html);
  const tel = [...new Set((metin.match(/\+90[\s\d]{9,17}/g) || []).map((t) => t.replace(/\s+/g, " ").trim()))];
  const eposta = [...new Set(metin.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi) || [])];
  const faks = (metin.match(/Faks[:\s]*([+\d\s]{10,20})/i) || [])[1];
  return { telefonlar: tel, epostalar: eposta, faks: faks ? faks.trim() : "", adres: (metin.match(/\d{5}\s+[A-ZÇĞİÖŞÜ][^.]{0,40}ANKARA/i) || [])[0] || "" };
}

(async () => {
  const sonuc = {};
  for (const dil of ["tr", "en"]) {
    const html = await getir(ORIGIN + "/" + dil);
    sonuc[dil] = {
      slider: slider(html),
      hizliErisim: hizliErisim(html),
      duyurular: duyurular(html).slice(0, 20),
      sosyal: sosyal(html),
      iletisim: iletisim(html)
    };
    const s = sonuc[dil];
    console.log(dil.toUpperCase() + ":  slider görseli " + s.slider.gorseller.length +
      " · hızlı erişim " + s.hizliErisim.length +
      " · duyuru " + s.duyurular.length +
      " · sosyal " + s.sosyal.length +
      " · telefon " + s.iletisim.telefonlar.length);
  }
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, "_anasayfa-bilesenler.json"), JSON.stringify(sonuc, null, 2), "utf8");
  console.log("\ncontent/_anasayfa-bilesenler.json yazıldı");
})();
