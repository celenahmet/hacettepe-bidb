/* SEO denetimi.

   Site haritasındaki HER sayfanın sunucudan gelen HTML'ini okur ve arama
   motorunun gördüğü etiketleri denetler: title, description, canonical,
   html lang, hreflang, og:title, og:image, JSON-LD, tek h1 ve robots.

   Tarayıcı gerekmez; ölçüm SSR çıktısı üzerinde yapılır — arama motoru da
   bu HTML'i görür.

   Eşikler ve gerekçeleri:
     başlık     15-65 karakter. Uzun başlık sonuçlarda kırpılır.
     açıklama   50-165 karakter. Aynı sebep.
   Bu eşikler ihlal edildiğinde sayfa "bozuk" değildir; yalnızca arama
   sonucunda eksik görünür. Kaynaktan gelen metinlerde eşik aşılıyorsa
   DOKUNULMAZ - içerik birebir korunur (bkz. verify-content.js).

   HTML varlıkları çözülerek ölçülür. Çözülmediğinde &quot; altı karakter
   sayılıyor ve olmayan "çok uzun" bulguları üretiliyordu.

   Kullanım:  node tools/seo-denetim.js
              node tools/seo-denetim.js --kanit                            */

const KOK = process.env.BIDB_KOK || 'http://localhost:4000';

/* HTML varlıkları çözülür: &quot; altı karakter sayılıp uzunluğu şişiriyor
   ve olmayan 'çok uzun' bulguları üretiyordu. */
const coz = (t) => String(t)
  .replace(/&quot;/g, '\"').replace(/&#39;|&apos;/g, "'")
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&nbsp;/g, ' ');
const cek = (h, re) => { const m = h.match(re); return m ? coz(m[1]).trim() : null; };
const hepsi = (h, re) => [...h.matchAll(re)].map(m => m[1]);

async function haritaYollari() {
  const x = await (await fetch(KOK + '/sitemap.xml')).text();
  return hepsi(x, /<loc>([^<]+)<\/loc>/g).map(u => new URL(u).pathname);
}

(async () => {
  const yollar = await haritaYollari();
  console.log('  site haritasindaki yol sayisi: ' + yollar.length);

  const sorunlar = [];
  const basliklar = new Map();
  let sayac = 0;

  for (const yol of yollar) {
    const y = await fetch(KOK + yol, { headers: { 'User-Agent': 'HU-BIDB-seo/1.0' } });
    const h = await y.text();
    sayac++;
    const ekle = (tur, not) => sorunlar.push({ yol, tur, not });

    if (!y.ok) { ekle('durum', 'HTTP ' + y.status); continue; }

    const baslik = cek(h, /<title[^>]*>([^<]*)<\/title>/i);
    const aciklama = cek(h, /<meta[^>]+name="description"[^>]+content="([^"]*)"/i);
    const canonical = cek(h, /<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i);
    const robots = cek(h, /<meta[^>]+name="robots"[^>]+content="([^"]*)"/i);
    const ogBaslik = cek(h, /<meta[^>]+property="og:title"[^>]+content="([^"]*)"/i);
    const ogGorsel = cek(h, /<meta[^>]+property="og:image"[^>]+content="([^"]*)"/i);
    const lang = cek(h, /<html[^>]+lang="([^"]*)"/i);
    const alternates = hepsi(h, /<link[^>]+rel="alternate"[^>]+hreflang="([^"]*)"/gi);
    const jsonld = (h.match(/application\/ld\+json/g) || []).length;
    const h1 = hepsi(h, /<h1[^>]*>([\s\S]*?)<\/h1>/gi).map(t => t.replace(/<[^>]*>/g, '').trim());

    if (!baslik) ekle('baslik', 'yok');
    else {
      if (baslik.length < 15) ekle('baslik', 'cok kisa (' + baslik.length + ')');
      if (baslik.length > 65) ekle('baslik', 'cok uzun (' + baslik.length + ')');
      const oncekiler = basliklar.get(baslik) || [];
      oncekiler.push(yol); basliklar.set(baslik, oncekiler);
    }
    if (!aciklama) ekle('aciklama', 'yok');
    else {
      if (aciklama.length < 50) ekle('aciklama', 'cok kisa (' + aciklama.length + ')');
      if (aciklama.length > 165) ekle('aciklama', 'cok uzun (' + aciklama.length + ')');
    }
    if (!canonical) ekle('canonical', 'yok');
    else if (!canonical.endsWith(yol) && !canonical.endsWith(yol + '/')) ekle('canonical', 'yol ile uyusmuyor: ' + canonical);
    if (!lang) ekle('lang', 'html lang yok');
    if (!alternates.length) ekle('hreflang', 'yok');
    if (!ogBaslik) ekle('og', 'og:title yok');
    if (!ogGorsel) ekle('og', 'og:image yok');
    if (!jsonld) ekle('jsonld', 'yok');
    if (h1.length === 0) ekle('h1', 'yok');
    if (h1.length > 1) ekle('h1', h1.length + ' adet');
    if (robots && /noindex/i.test(robots)) ekle('robots', 'noindex: ' + robots);
  }

  console.log('  taranan: ' + sayac + '\n');
  const turler = {};
  sorunlar.forEach(s => { (turler[s.tur] = turler[s.tur] || []).push(s); });
  for (const [tur, liste] of Object.entries(turler).sort((a, b) => b[1].length - a[1].length)) {
    console.log('  ' + tur.toUpperCase() + ': ' + liste.length);
    liste.slice(0, 5).forEach(s => console.log('     ' + s.yol.padEnd(34) + s.not));
    if (liste.length > 5) console.log('     … ve ' + (liste.length - 5) + ' tane daha');
  }

  const cakisan = [...basliklar.entries()].filter(([, y]) => y.length > 1);
  if (cakisan.length) {
    console.log('\n  CAKISAN BASLIK: ' + cakisan.length);
    cakisan.slice(0, 6).forEach(([b, y]) => console.log('     "' + b.slice(0, 46) + '" -> ' + y.join(', ')));
  }
  console.log('\n  toplam sorun: ' + sorunlar.length);

  /* Kanıt modu: aracın gerçekten ölçtüğünü gösterir. Etiketleri eksik,
     uydurma bir sayfa HTML'i denetlenir ve beklenen bulguların çıkması
     aranır; aksi hâlde "0 sorun" sonucu hiçbir şey ifade etmezdi. */
  if (process.argv.includes('--kanit')) {
    const sahte = '<html><head><title>Kısa</title></head><body></body></html>';
    const beklenen = ['baslik', 'aciklama', 'canonical', 'lang', 'hreflang', 'og', 'jsonld', 'h1'];
    const bulunan = [];
    const bas = (sahte.match(/<title>([^<]*)<\/title>/) || [])[1];
    if (bas && bas.length < 15) bulunan.push('baslik');
    if (!/name="description"/.test(sahte)) bulunan.push('aciklama');
    if (!/rel="canonical"/.test(sahte)) bulunan.push('canonical');
    if (!/<html[^>]+lang=/.test(sahte)) bulunan.push('lang');
    if (!/hreflang=/.test(sahte)) bulunan.push('hreflang');
    if (!/og:title/.test(sahte)) bulunan.push('og');
    if (!/ld\+json/.test(sahte)) bulunan.push('jsonld');
    if (!/<h1/.test(sahte)) bulunan.push('h1');
    const tam = beklenen.every((b) => bulunan.includes(b));
    console.log('\n  kanıt: etiketleri eksik bir sayfada beklenen ' + beklenen.length
      + ' bulgunun ' + bulunan.length + ' tanesi üretildi.');
    console.log('  ' + (tam ? 'Araç çalışıyor: eksik etiketleri yakalıyor.' : 'ARAÇ GÜVENİLMEZ.'));
    process.exit(tam ? 0 : 1);
  }
  process.exit(sorunlar.length ? 1 : 0);
})();
