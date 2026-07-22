/**
 * Aktarılan içeriğin sunuma hazırlanması.
 *
 * Saklanan içerik DEĞİŞTİRİLMEZ. Burada yapılanlar yalnızca çizim
 * sırasında uygulanır:
 *
 *   1. Yalnızca bağlantılardan oluşan listelere biçimlendirme kancası eklenir
 *      (kart ızgarası olarak gösterilebilsinler diye).
 *   2. Eski spam koruması olan {at} yazımı düzeltilir.
 *   3. Düz yazılmış e-posta ve telefonlar tıklanabilir hâle getirilir.
 *
 * Böylece kaynak kopyası bozulmadan kalır; istenirse bu dönüşümler tek
 * yerden kaldırılabilir.
 */

/** Bir liste maddesinin içeriği tek bir bağlantıdan mı ibaret? */
function yalnizcaBaglanti(madde: string): boolean {
  return /^<a\b[^>]*>[\s\S]*?<\/a>$/i.test(madde.trim());
}

/**
 * Yalnızca bağlantı içeren `<ul>` öğelerine `baglanti-dizini` sınıfını ekler.
 * Metin içeren listelere dokunmaz.
 */
export function baglantiDizinleriniIsaretle(html: string): string {
  return String(html).replace(/<ul\b([^>]*)>([\s\S]*?)<\/ul>/gi, (tam, nitelikler, ic) => {
    const maddeler = [...ic.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => m[1]);
    if (maddeler.length < 2 || !maddeler.every(yalnizcaBaglanti)) return tam;

    const sinifli = /\bclass\s*=\s*["']/i.test(nitelikler)
      ? nitelikler.replace(/\bclass\s*=\s*(["'])/i, (_x: string, tirnak: string) => `class=${tirnak}baglanti-dizini `)
      : `${nitelikler} class="baglanti-dizini"`;

    return `<ul${sinifli}>${ic}</ul>`;
  });
}

const EPOSTA = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

/* Türkiye telefon biçimleri: +90 312 297 62 62 · 0 312 297 6262 · (0312) 297 62 62
   Alan kodu öncesi +90 veya 0 aranır; ardından 3 + 7 rakam. Bu sınır, metindeki
   yıl, sayı ve IP gibi dizilerin yanlışlıkla telefona dönüşmesini engeller. */
const TELEFON = /(?:\+90|0)[\s.()–-]*\d{3}(?:[\s.()–-]*\d){7}/g;

/**
 * E-posta ve telefonları tıklanabilir yapar; eski {at} yazımını düzeltir.
 *
 * Yalnızca METİN düğümleri işlenir: etiketlerin içi (öznitelikler) ve zaten
 * bağlantı içindeki metinler atlanır. Böylece var olan bağlantılar bozulmaz
 * ve iç içe bağlantı oluşmaz.
 */
export function iletisimBaglantilari(html: string): string {
  const parcalar = String(html).split(/(<[^>]+>)/);
  let baglantiIcinde = 0;

  return parcalar
    .map((parca) => {
      if (parca.startsWith('<')) {
        if (/^<a\b/i.test(parca)) baglantiIcinde++;
        else if (/^<\/a\s*>/i.test(parca)) baglantiIcinde = Math.max(0, baglantiIcinde - 1);
        return parca;
      }

      // Eski spam koruması: gokhan{at}hacettepe.edu.tr -> gokhan@hacettepe.edu.tr
      let metin = parca
        .replace(/\s*[{[(]\s*at\s*[)\]}]\s*/gi, '@')
        .replace(/\s*[{[(]\s*(?:nokta|dot)\s*[)\]}]\s*/gi, '.');

      // Zaten bağlantı içindeki metin sarılmaz
      if (baglantiIcinde === 0) {
        metin = metin.replace(EPOSTA, (e) => `<a href="mailto:${e}">${e}</a>`);
        metin = metin.replace(TELEFON, (t) => {
          const sade = t.replace(/[^\d+]/g, '');
          return `<a href="tel:${sade}">${t}</a>`;
        });
      }

      return metin;
    })
    .join('');
}

/** Sayfa gövdesine uygulanan tüm sunum düzeltmeleri. */
export function icerigiHazirla(html: string): string {
  return baglantiDizinleriniIsaretle(iletisimBaglantilari(html));
}
