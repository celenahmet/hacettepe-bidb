/* Sayfa içeriği ayıklama.

   Kaynak sitenin şablonu incelendi: her sayfada içerik
     <div id="ana-icerik">
       <div class="baslik">Sayfa Başlığı</div>
       <div class="icerik"> ... </div>
     </div>
   yapısında. Sol menü <div class="menu_sol">, sosyal medya ise
   <div class="mobil_menu_alt"> içindedir.                                    */

function coz(s) {
  return String(s)
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&rsquo;/g, "’").replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&uuml;/g, "ü").replace(/&ouml;/g, "ö").replace(/&ccedil;/g, "ç")
    .replace(/&Uuml;/g, "Ü").replace(/&Ouml;/g, "Ö").replace(/&Ccedil;/g, "Ç")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
    .replace(/&[a-z]+;/gi, " ");
}

const duz = (h) => coz(String(h).replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();

function scriptsiz(html) {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
}

/* Açılış etiketinden başlayıp eşleşen kapanışa kadar olan bloğu döndürür */
function blok(html, baslangicIndex) {
  const acilis = html.slice(baslangicIndex).match(/^<(\w+)[^>]*>/);
  if (!acilis) return "";
  const etiket = acilis[1];
  const re = new RegExp("<" + etiket + "\\b[^>]*>|</" + etiket + ">", "gi");
  re.lastIndex = baslangicIndex;
  let derinlik = 0, m;
  while ((m = re.exec(html))) {
    derinlik += m[0][1] === "/" ? -1 : 1;
    if (derinlik === 0) return html.slice(baslangicIndex, m.index + m[0].length);
  }
  return html.slice(baslangicIndex);
}

function blokBul(html, desen) {
  const m = html.match(desen);
  if (!m) return "";
  // eşleşmenin bulunduğu etiketin başına geri git
  const bas = html.lastIndexOf("<", m.index);
  return blok(html, bas);
}

/* Sayfaya özgü içerik alanı */
function anaIcerik(html) {
  const temiz = scriptsiz(html);
  const alan = blokBul(temiz, /id=["']ana-icerik["']/i);
  return alan || temiz;
}

function sayfaBasligi(html) {
  const alan = anaIcerik(html);
  const b = blokBul(alan, /class=["'][^"']*\bbaslik\b[^"']*["']/i);
  if (b) {
    const t = duz(b);
    if (t && t.length < 160) return t;
  }
  for (const et of ["h1", "h2"]) {
    const m = alan.match(new RegExp("<" + et + "[^>]*>([\\s\\S]*?)</" + et + ">", "i"));
    if (m) return duz(m[1]);
  }
  return "";
}

/* Başlık kutusu çıkarılmış hâliyle gövde */
function icerikGovdesi(html) {
  const alan = anaIcerik(html);
  const ic = blokBul(alan, /class=["'][^"']*\bicerik\b[^"']*["']/i);
  if (ic) return ic;
  const b = blokBul(alan, /class=["'][^"']*\bbaslik\b[^"']*["']/i);
  return b ? alan.replace(b, "") : alan;
}

function paragraflar(govdeHtml) {
  const out = [];
  const re = /<(h1|h2|h3|h4|h5|p|li|td|th|dt|dd|figcaption)[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = re.exec(govdeHtml))) {
    const metin = duz(m[2]);
    if (metin.length < 2) continue;
    if (out.length && out[out.length - 1].metin === metin) continue;
    out.push({ tur: m[1].toLowerCase(), metin });
  }
  if (!out.length) {
    const t = duz(govdeHtml);
    if (t.length > 2) out.push({ tur: "p", metin: t });
  }
  return out;
}

function baglantilar(govdeHtml, origin) {
  const out = [];
  const re = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(govdeHtml))) {
    const metin = duz(m[2]);
    let href = m[1].trim();
    if (href.startsWith("#") || /^javascript:/i.test(href)) continue;
    if (href.startsWith("/")) href = origin + href;
    if (out.some((x) => x.href === href && x.metin === metin)) continue;
    out.push({ metin: metin || href.split("/").pop(), href });
  }
  return out;
}

function gorseller(govdeHtml, origin) {
  const out = [];
  const re = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = re.exec(govdeHtml))) {
    let src = m[1].trim();
    if (src.startsWith("/")) src = origin + src;
    const alt = (m[0].match(/alt=["']([^"']*)["']/i) || ["", ""])[1];
    if (!out.some((x) => x.src === src)) out.push({ src, alt: coz(alt).trim() });
  }
  return out;
}

/* Sol menü: bölüm ve alt bağlantılar */
function solMenu(html, origin) {
  const alan = blokBul(scriptsiz(html), /class=["'][^"']*\bmenu_sol\b[^"']*["']/i);
  if (!alan) return [];
  const out = [];
  // birinci seviye <li>'ler
  const re = /<li([^>]*)>([\s\S]*?)<\/li>\s*(?=<li|<\/ul>)/gi;
  let m;
  while ((m = re.exec(alan))) {
    const parca = m[2];
    const ilk = parca.match(/<a[^>]+href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/i);
    if (!ilk) continue;
    const altlar = [...parca.matchAll(/<a[^>]+href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)]
      .slice(1)
      .map((a) => ({ ad: duz(a[2]), href: a[1].startsWith("/") ? origin + a[1] : a[1] }))
      .filter((a) => a.ad);
    out.push({
      ad: duz(ilk[2]),
      href: ilk[1] === "#" ? null : (ilk[1].startsWith("/") ? origin + ilk[1] : ilk[1]),
      altlar
    });
  }
  return out.filter((x) => x.ad);
}

/* Sosyal medya hesapları */
function sosyalMedya(html) {
  const desen = /https?:\/\/(?:www\.)?(instagram|facebook|twitter|x|youtube|linkedin)\.com\/[^"'\s>]+/gi;
  const out = [];
  let m;
  while ((m = desen.exec(html))) {
    const url = m[0].replace(/[.,)]+$/, "");
    const ag = m[1].toLowerCase();
    if (!out.some((x) => x.ag === ag)) out.push({ ag, url });
  }
  return out;
}

function etiket(html, ad) {
  const m = html.match(new RegExp("<" + ad + "[^>]*>([\\s\\S]*?)</" + ad + ">", "i"));
  return m ? duz(m[1]) : "";
}

function meta(html, ad) {
  const a = html.match(new RegExp('<meta[^>]+(?:name|property)=["\']' + ad + '["\'][^>]*content=["\']([^"\']*)["\']', "i"));
  const b = html.match(new RegExp('<meta[^>]+content=["\']([^"\']*)["\'][^>]*(?:name|property)=["\']' + ad + '["\']', "i"));
  return coz((a || b || ["", ""])[1]).trim();
}

module.exports = {
  coz, duz, scriptsiz, blok, blokBul,
  anaIcerik, icerikGovdesi, sayfaBasligi,
  paragraflar, baglantilar, gorseller,
  solMenu, sosyalMedya, etiket, meta
};
