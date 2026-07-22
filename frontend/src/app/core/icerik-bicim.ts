/**
 * Aktarılan içeriğin sunuma hazırlanması.
 *
 * Saklanan içerik DEĞİŞTİRİLMEZ. Burada yapılan tek şey, çizim sırasında
 * biçimlendirme kancası eklemektir: yalnızca bağlantılardan oluşan listelere
 * bir sınıf verilir ki kart ızgarası olarak gösterilebilsinler.
 *
 * Bu işin CSS ile yapılması denendi; `:has()` bir `:not()` içinde
 * kullanılamadığı için "içinde bağlantıdan başka madde bulunmayan liste"
 * koşulu seçici olarak yazılamıyor. Sınıfı burada eklemek hem güvenilir
 * hem de metin listelerini (yönerge maddeleri gibi) etkilemiyor.
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

    // Mevcut class niteliği varsa korunur, yoksa eklenir
    const sinifli = /\bclass\s*=\s*["']/i.test(nitelikler)
      ? nitelikler.replace(/\bclass\s*=\s*(["'])/i, (_x: string, tirnak: string) => `class=${tirnak}baglanti-dizini `)
      : `${nitelikler} class="baglanti-dizini"`;

    return `<ul${sinifli}>${ic}</ul>`;
  });
}
