/* Eksik denetimi — yayın öncesi kapsamlı kontrol.

   Yayına alınan sitede kırık hiçbir şey kalmadığını kanıtlar:
     · her sayfa açılıyor mu
     · site içi bağlantıların hepsi çalışıyor mu
     · her belge (PDF, DOCX…) kendi sunucumuzdan veriliyor mu
     · her görsel yerinde mi
     · hâlâ kaynak sunucuya bağımlı kalan adres var mı

   Site yayına alındığında kaynak sunucu ile aynı alan adını kullanacağı
   için, kaynak sunucuya mutlak adresle bağlanan hiçbir varlık kalmamalıdır.

   Kullanım:  node tools/eksik-denetim.js [taban-adres]                      */

const SITE = process.argv[2] || "http://localhost:4000";

const bicim = (n) => String(n).padStart(4);

async function durum(u) {
  try {
    const y = await fetch(u, { redirect: "manual" });
    return y.status;
  } catch (e) {
    return 0;
  }
}

(async () => {
  console.log("Denetlenen site: " + SITE + "\n");

  /* ---------- sayfa listesi ---------- */
  const sayfalar = [];
  for (const dil of ["tr", "en"]) {
    const y = await fetch(SITE + "/api/" + dil + "/sayfalar");
    for (const s of await y.json()) sayfalar.push("/" + dil + "/" + s.slug);
  }
  sayfalar.unshift("/tr", "/en");

  /* ---------- sayfaları gez, varlıkları topla ---------- */
  const icBaglanti = new Set();
  const belgeler = new Set();
  const gorseller = new Set();
  const disKaynak = new Set();     // kaynak sunucuya mutlak bağımlılık
  const acilmayan = [];

  for (const yol of sayfalar) {
    const y = await fetch(SITE + yol);
    if (!y.ok) { acilmayan.push(yol + " (" + y.status + ")"); continue; }
    const h = await y.text();

    for (const m of h.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)) {
      const u = m[1];
      if (/^https?:\/\/bidb\.hacettepe\.edu\.tr\/(dosyalar|images)\//i.test(u)) disKaynak.add(u);
      else if (/^\/(tr|en)\//.test(u)) icBaglanti.add(u);
      else if (/^\/(dosyalar|files)\//i.test(u)) belgeler.add(u);
    }
    for (const m of h.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) {
      const u = m[1];
      if (/^https?:\/\/bidb\.hacettepe\.edu\.tr\//i.test(u)) disKaynak.add(u);
      else if (!/^https?:\/\//i.test(u)) gorseller.add(u.startsWith("/") ? u : "/" + u);
    }
  }

  /* ---------- kontroller ---------- */
  const rapor = [];

  const kontrol = async (baslik, kume) => {
    const kirik = [];
    for (const u of kume) {
      const k = await durum(u.startsWith("http") ? u : SITE + encodeURI(u));
      if (k >= 400 || k === 0) kirik.push(u + " (" + k + ")");
    }
    console.log(bicim(kume.size) + "  " + baslik.padEnd(30) + (kirik.length ? "✗ " + kirik.length + " KIRIK" : "✓ hepsi çalışıyor"));
    kirik.forEach((x) => console.log("        " + x));
    rapor.push([baslik, kume.size, kirik.length]);
    return kirik;
  };

  console.log(bicim(sayfalar.length) + "  " + "sayfa".padEnd(30) +
    (acilmayan.length ? "✗ " + acilmayan.length + " açılmadı" : "✓ hepsi açılıyor"));
  acilmayan.forEach((x) => console.log("        " + x));
  rapor.push(["sayfa", sayfalar.length, acilmayan.length]);

  await kontrol("site içi bağlantı", icBaglanti);
  await kontrol("belge (PDF, DOCX…)", belgeler);
  await kontrol("görsel", gorseller);

  console.log(bicim(disKaynak.size) + "  " + "kaynak sunucuya bağımlılık".padEnd(30) +
    (disKaynak.size ? "✗ VAR" : "✓ yok"));
  [...disKaynak].slice(0, 10).forEach((x) => console.log("        " + x));
  rapor.push(["kaynak sunucu bağımlılığı", disKaynak.size, disKaynak.size]);

  /* ---------- diğer kontroller ---------- */
  console.log("");
  const ekstra = [
    ["sitemap.xml", "/sitemap.xml", 200],
    ["robots.txt", "/robots.txt", 200],
    ["olmayan sayfa 404", "/tr/olmayan-sayfa-xyz", 404],
    ["eski adres yönlendirmesi", "/tr/geneltanitim", 301]
  ];
  let ekstraHata = 0;
  for (const [ad, yol, beklenen] of ekstra) {
    const k = await durum(SITE + yol);
    const ok = k === beklenen;
    if (!ok) ekstraHata++;
    console.log("      " + ad.padEnd(30) + (ok ? "✓ " : "✗ ") + k + (ok ? "" : " (beklenen " + beklenen + ")"));
  }

  const toplamHata = rapor.reduce((t, r) => t + r[2], 0) + ekstraHata;
  console.log("\n" + (toplamHata === 0 ? "SONUÇ: eksik yok." : "SONUÇ: " + toplamHata + " sorun var."));
  process.exit(toplamHata === 0 ? 0 : 1);
})();
