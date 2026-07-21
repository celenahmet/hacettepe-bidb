/* Menü ve sayfa eksiği denetimi.

   İki soruyu kanıtla yanıtlar:
     1. Kaynak sitedeki sol menüde bizde olmayan öğe var mı?
     2. Kaynak sitedeki herhangi bir sayfadan bağlantı verilip de
        bizde bulunmayan sayfa var mı?

   Kaynakta yorum satırına alınmış (<!-- -->) öğeler kurum tarafından
   kasten gizlenmiştir; bunlar eksik sayılmaz ve taranmaz.

   Bağlantı deseni <a[^>]+href biçiminde yazılır: kaynakta bazı etiketler
   "<a  href" (çift boşuk) olarak geçiyor ve katı desen bunları atlıyordu.

   Kullanım:  node tools/menu-denetim.js                                     */

const fs = require("fs");
const path = require("path");

const ORIGIN = "https://bidb.hacettepe.edu.tr";
const ICERIK = path.join(__dirname, "..", "content");
const BEKLEME = 150;

const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
const yorumsuz = (h) => String(h).replace(/<!--[\s\S]*?-->/g, "");
const duz = (h) => String(h).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

async function getir(url) {
  const y = await fetch(url, { headers: { "User-Agent": "HU-BIDB-denetim/1.0" } });
  if (!y.ok) throw new Error("HTTP " + y.status);
  return await y.text();
}

/** Sol menüyü bölüm başlıklarına göre gruplayarak çıkarır. */
function kaynakMenu(html) {
  const h = yorumsuz(html);
  const bas = h.indexOf("main-nav");
  if (bas < 0) return [];
  const nav = h.slice(bas, h.indexOf("</nav>", bas));

  const bolumler = [];
  let simdiki = { bolum: "(üst düzey)", ogeler: [] };
  bolumler.push(simdiki);

  for (const m of nav.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = m[1].trim();
    const ad = duz(m[2]);
    if (!ad) continue;                       // ikon bağlantıları
    if (href === "#") {                      // bölüm başlığı
      simdiki = { bolum: ad, ogeler: [] };
      bolumler.push(simdiki);
      continue;
    }
    if (/instagram|facebook|twitter|^\/en$|^\/tr$/i.test(href)) continue;  // sosyal ve dil
    simdiki.ogeler.push({ ad, href });
  }
  return bolumler.filter((b) => b.ogeler.length);
}

/** Bizdeki sayfalar: kaynak slug -> var */
function bizdekiSayfalar() {
  const kume = new Set();
  for (const dil of ["tr", "en"]) {
    const d = path.join(ICERIK, dil);
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d).filter((x) => x.endsWith(".json") && !x.startsWith("_"))) {
      const v = JSON.parse(fs.readFileSync(path.join(d, f), "utf8"));
      const s = (String(v.url || "").match(/\/(?:tr|en)\/([^/?#]+)/) || [])[1] || v.slug;
      kume.add(dil + "/" + String(s).toLowerCase());
    }
  }
  kume.add("tr/");
  kume.add("en/");
  return kume;
}

(async () => {
  const bizde = bizdekiSayfalar();
  const menum = JSON.parse(fs.readFileSync(path.join(ICERIK, "_menu.json"), "utf8"));

  /* ---------- 1) menü karşılaştırması ---------- */
  let menuEksik = 0;
  for (const dil of ["tr", "en"]) {
    const kaynak = kaynakMenu(await getir(ORIGIN + "/" + dil));
    const bizimSlug = new Set();
    // Menü öğesi ya [slug, ad] ya da { ad, disAdres } biçimindedir
    (menum[dil] || []).forEach((b) =>
      b.sayfalar.forEach((o) => {
        if (Array.isArray(o)) bizimSlug.add(String(o[0]).toLowerCase());
      })
    );
    const bizimDis = new Set();
    (menum[dil] || []).forEach((b) =>
      b.sayfalar.forEach((o) => {
        if (!Array.isArray(o)) bizimDis.add(String(o.disAdres).replace(/^https?:\/\/bidb\.hacettepe\.edu\.tr/i, ""));
      })
    );

    console.log("\n===== " + dil.toUpperCase() + " MENÜ =====");
    for (const b of kaynak) {
      console.log("\n  [" + b.bolum + "]");
      for (const o of b.ogeler) {
        const s = (o.href.match(/^(?:https?:\/\/bidb\.hacettepe\.edu\.tr)?\/(?:tr|en)\/([^/?#]+)$/) || [])[1];
        let durum;
        // Ana sayfa bağlantısı (/tr, /en, /tr/) her zaman vardır
        if (/^(?:https?:\/\/bidb\.hacettepe\.edu\.tr)?\/(?:tr|en)\/?$/.test(o.href)) {
          console.log("    " + "✓ ana sayfa".padEnd(24) + o.ad.padEnd(44) + o.href);
          continue;
        }
        if (s) {
          durum = bizimSlug.has(s.toLowerCase()) ? "✓" : "✗ EKSİK";
        } else {
          // Belge veya dış bağlantı: bizim menümüzde de bulunmalı
          const sade = o.href.replace(/^https?:\/\/bidb\.hacettepe\.edu\.tr/i, "");
          durum = bizimDis.has(sade) || bizimDis.has(o.href) ? "✓ dış bağlantı" : "✗ EKSİK (dış bağlantı)";
        }
        if (durum.startsWith("✗")) menuEksik++;
        console.log("    " + durum.padEnd(24) + o.ad.padEnd(44) + o.href.slice(0, 70));
      }
    }
    await bekle(BEKLEME);
  }
  console.log("\n  menüde eksik sayfa: " + menuEksik);

  /* ---------- 2) site geneli sayfa eksiği ---------- */
  console.log("\n===== SAYFA EKSİĞİ (tüm kaynak sayfalar taranır) =====");
  const taranacak = [];
  for (const dil of ["tr", "en"]) {
    const d = path.join(ICERIK, dil);
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d).filter((x) => x.endsWith(".json") && !x.startsWith("_"))) {
      const v = JSON.parse(fs.readFileSync(path.join(d, f), "utf8"));
      const s = (String(v.url || "").match(/\/(?:tr|en)\/([^/?#]+)/) || [])[1];
      if (s) taranacak.push([dil, s]);
    }
  }
  taranacak.unshift(["tr", ""], ["en", ""]);

  const eksik = new Map();
  let n = 0;
  for (const [dil, slug] of taranacak) {
    let h;
    try { h = yorumsuz(await getir(ORIGIN + "/" + dil + (slug ? "/" + slug : ""))); }
    catch { await bekle(BEKLEME); continue; }

    for (const m of h.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)) {
      const y = m[1].match(/^(?:https?:\/\/bidb\.hacettepe\.edu\.tr)?\/(tr|en)\/([A-Za-z0-9_.-]+)\/?$/);
      if (!y) continue;
      if (/\.(pdf|docx?|xlsx?|pptx?|zip|rar|jpe?g|png|gif|svg)$/i.test(y[2])) continue;
      const a = y[1].toLowerCase() + "/" + y[2].toLowerCase();
      if (!bizde.has(a)) eksik.set(a, (eksik.get(a) || 0) + 1);
    }
    if (++n % 20 === 0) process.stdout.write(".");
    await bekle(BEKLEME);
  }

  console.log("\n\n  taranan kaynak sayfa : " + taranacak.length);
  console.log("  bizdeki sayfa        : " + (bizde.size - 2));
  console.log("  BİZDE OLMAYAN        : " + eksik.size);
  [...eksik.entries()].sort((a, b) => b[1] - a[1]).forEach(([a, c]) => console.log("    " + a + "  (" + c + " yerde)"));
})();
