/* Ana sayfa bileşenlerini kaynak siteden çıkarır:
   slider, hızlı erişim kutuları, servis karuseli, haber/duyurular,
   sosyal medya ve iletişim bilgileri.

   Kullanım: node tools/crawl-home.js
   Çıktı:    content/_anasayfa-bilesenler.json                               */

const fs = require("fs");
const path = require("path");
const X = require("./extract.js");

const ORIGIN = "https://bidb.hacettepe.edu.tr";
const OUT = path.join(__dirname, "..", "content");

const mutlak = (u) => {
  if (!u) return "";
  const t = String(u).trim().replace(/^['"]|['"]$/g, "");
  if (/^https?:/i.test(t)) return t;
  return ORIGIN + (t.startsWith("/") ? t : "/" + t);
};

/* Kaynak sayfada HTML yorumuna alınmış bloklar canlı sitede görünmez;
   bunlar aktarılmamalıdır. */
const yorumsuz = (h) => String(h).replace(/<!--[\s\S]*?-->/g, "");

async function getir(url) {
  const y = await fetch(url, { headers: { "User-Agent": "HU-BIDB-icerik-aktarimi/1.0" } });
  if (!y.ok) throw new Error("HTTP " + y.status);
  return yorumsuz(await y.text());
}

/* Ana sayfa slider'ı: arka plan görseli + üzerindeki başlık */
function slider(html) {
  const alan = X.blokBul(html, /class=["'][^"']*swiper-wrapper[^"']*["']/i) || html;

  // Slaytlar, başlıkları ve özetleri sırayla eşleştirilir
  const slaytlar = [...alan.matchAll(
    /<div[^>]+class=["'][^"']*swiper-slide[^"']*["']([^>]*)>/gi
  )].map((m) => ({
    gorsel: mutlak((m[1].match(/background-image:\s*url\(['"]?([^)'"]+)['"]?\)/i) || [])[1]),
    gorselAlt: (m[1].match(/aria-label=["']([^"']*)["']/i) || [])[1] || ""
  }));

  const basliklar = [...alan.matchAll(/class=["']slide_baslik["'][^>]*>([\s\S]*?)<\/div>/gi)].map((m) => X.duz(m[1]));
  const ozetler = [...alan.matchAll(/class=["']slide_ozet["'][^>]*>([\s\S]*?)<\/div>/gi)].map((m) => X.duz(m[1]));

  return slaytlar
    .filter((s) => s.gorsel)
    .map((s, i) => ({ ...s, baslik: basliklar[i] || "", ozet: ozetler[i] || "" }));
}

/* Hızlı erişim kutuları: arka plan ikonu + bağlantı */
function hizliErisim(html) {
  const out = [];
  const re = new RegExp(
    "<div[^>]*style=[\"'][^\"']*background-image:\\s*url\\(['\"]?([^)'\"]+)['\"]?\\)[^\"']*[\"'][^>]*>" +
    "\\s*<a[^>]+href=[\"']([^\"']+)[\"']([^>]*)>([\\s\\S]*?)</a>",
    "gi"
  );
  let m;
  while ((m = re.exec(html))) {
    const ad = X.duz(m[4]);
    if (!ad) continue;
    out.push({
      ad,
      ikon: mutlak(m[1]),
      adres: mutlak(m[2]),
      yeniSekme: /target=["']_blank["']/i.test(m[3])
    });
  }
  return out;
}

/* "Servisler ve Uygulamalar" karuseli */
function servisler(html) {
  const out = [];
  const re = new RegExp(
    "<div[^>]+class=[\"'][^\"']*\\bservis\\b[^\"']*[\"'][^>]*>\\s*<a[^>]+href=[\"']([^\"']+)[\"']([^>]*)>" +
    "\\s*<img[^>]+src=[\"']([^\"']+)[\"'][^>]*>([\\s\\S]*?)</a>",
    "gi"
  );
  let m;
  while ((m = re.exec(html))) {
    const ad = X.duz(m[4]);
    if (!ad) continue;
    out.push({ ad, adres: mutlak(m[1]), gorsel: mutlak(m[3]), yeniSekme: /target=["']_blank["']/i.test(m[2]) });
  }
  return out;
}

/* Haber ve duyurular */
function duyurular(html) {
  const blok = X.blokBul(html, /class=["'][^"']*duyurular_liste[^"']*["']/i);
  if (!blok) return [];
  const out = [];
  const re = /<a[^>]+href=["']([^"']+)["']([^>]*)>([\s\S]*?)<\/a>\s*\(?\s*(\d{2}[.\/]\d{2}[.\/]\d{2,4})?\s*\)?/gi;
  let m;
  while ((m = re.exec(blok))) {
    let baslik = X.duz(m[3]);
    if (baslik.length < 8) continue;
    // Metin içinde geçen çıplak adresler duyuru başlığı değildir
    if (/^(?:https?:\/\/)?[a-z0-9.-]+\.[a-z]{2,6}(?:\/\S*)?$/i.test(baslik)) continue;

    // Tarih kimi duyuruda bağlantının ardında, kimisinde başlığın sonunda yer alır
    let tarih = m[4] || "";
    if (!tarih) {
      const icTarih = baslik.match(/\(?\s*(\d{2}[.\/]\d{2}[.\/]\d{2,4})\s*\)?\s*$/);
      if (icTarih) {
        tarih = icTarih[1];
        baslik = baslik.slice(0, icTarih.index).replace(/[\s(]+$/, "").trim();
      }
    }

    out.push({
      baslik,
      adres: mutlak(m[1]),
      tarih,
      yeniSekme: /target=["']_blank["']/i.test(m[2])
    });
  }
  return out;
}

/* İletişim bilgileri (footer) */
function iletisim(html) {
  const metin = X.duz(html);
  const tel = [...new Set((metin.match(/\+90[\s\d]{9,17}/g) || []).map((t) => t.replace(/\s+/g, " ").trim()))];
  const eposta = [...new Set(metin.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi) || [])];
  const faks = (metin.match(/Faks[:\s]*([+\d\s]{10,20})/i) || [])[1];
  const adresHam = (metin.match(/Hacettepe[^.]{0,90}\d{5}\s+[A-ZÇĞİÖŞÜ][^.]{0,40}ANKARA/i) || [])[0];
  return {
    telefonlar: tel,
    epostalar: eposta,
    faks: faks ? faks.trim() : "",
    adres: adresHam ? adresHam.trim() : ""
  };
}

(async () => {
  const sonuc = {};
  for (const dil of ["tr", "en"]) {
    const html = await getir(ORIGIN + "/" + dil);
    sonuc[dil] = {
      slider: slider(html),
      hizliErisim: hizliErisim(html),
      servisler: servisler(html),
      duyurular: duyurular(html),
      sosyal: X.sosyalMedya(html),
      iletisim: iletisim(html)
    };
    const s = sonuc[dil];
    console.log(dil.toUpperCase() + ":  slayt " + s.slider.length +
      " · hızlı erişim " + s.hizliErisim.length +
      " · servis " + s.servisler.length +
      " · duyuru " + s.duyurular.length +
      " · sosyal " + s.sosyal.length);
    await new Promise((r) => setTimeout(r, 300));
  }
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, "_anasayfa-bilesenler.json"), JSON.stringify(sonuc, null, 2), "utf8");
  console.log("\ncontent/_anasayfa-bilesenler.json yazıldı");
})();
