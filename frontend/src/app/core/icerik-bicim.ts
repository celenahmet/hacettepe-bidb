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

/**
 * Liste maddelerinde kapanmamış bağlantı etiketlerini kapatır.
 *
 * Aktarılan kaynak sayfalarda eksik </a> etiketleri var. Tarayıcı bunu
 * onaramaz: açık kalan bağlantı, sonraki <li> ögesini KENDİ İÇİNE alır ve
 * ortaya boş bir hücre ile dışarı düşmüş bir madde çıkar. Proxy
 * sayfasındaki Android maddesi tam olarak buna yol açıyordu.
 *
 * Onarım yalnızca yapısaldır: hiçbir metin eklenmez, silinmez ya da yeri
 * değiştirilmez; sadece maddenin sonunda eksik kalan kapanış etiketi
 * tamamlanır. Kaynaktaki bozukluk düzeltilirse bu kural kendiliğinden
 * etkisiz kalır.
 */
export function bagliMaddeleriOnar(html: string): string {
  return String(html).replace(/<li\b([^>]*)>([\s\S]*?)<\/li>/gi, (_tam, nitelikler, ic) => {
    const acilan = (ic.match(/<a\b[^>]*>/gi) || []).length;
    const kapanan = (ic.match(/<\/a\s*>/gi) || []).length;
    const eksik = acilan - kapanan;
    return eksik > 0
      ? `<li${nitelikler}>${ic}${'</a>'.repeat(eksik)}</li>`
      : `<li${nitelikler}>${ic}</li>`;
  });
}

/**
 * Bir liste maddesinin görünen metninin tamamı bağlantı içinde mi?
 *
 * Önce "madde tam olarak tek bir <a>...</a> olmalı" ölçütü kullanılıyordu.
 * Bu kural aktarılan içerikte kırılıyor: kaynak sayfalarda kapanmamış </a>
 * etiketleri var (Proxy sayfasındaki Android maddesi gibi). Tek bir bozuk
 * etiket, listenin TAMAMININ dizin olarak tanınmasını engelliyordu — yedi
 * belgelik bir liste madde imli düz liste olarak kalıyordu.
 *
 * Yeni ölçüt dayanıklı: bağlantılar çıkarıldıktan sonra geriye görünen
 * metin kalmıyorsa madde yalnızca bağlantıdan ibarettir. Kapanmamış bir
 * bağlantıda, açılış etiketinden sonrası da ona ait sayılır.
 */
function yalnizcaBaglanti(madde: string): boolean {
  const metin = String(madde);
  if (!/<a\b/i.test(metin)) return false;

  const kalan = metin
    .replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, '')   // kapalı bağlantılar
    .replace(/<a\b[^>]*>[\s\S]*$/i, '')         // kapanmamış bağlantı
    .replace(/<[^>]+>/g, '')                    // kalan etiketler
    .replace(/&nbsp;|&#160;/gi, ' ');

  return kalan.trim() === '';
}

/**
 * Ardışık "yalnızca bağlantı içeren paragraflar"ı bir dizin listesine çevirir.
 *
 * Bazı kaynak sayfalar (Office 365 gibi) bağlantı listesini <ul><li> yerine
 * arka arkaya <p><a>…</a></p> olarak yazmış. Bunlar dizin olarak
 * tanınmıyor, düz bağlantı satırları gibi kalıyordu. İki ya da daha çok
 * böyle paragraf art arda geldiğinde tek bir <ul class="baglanti-dizini">'ye
 * dönüştürülür — böylece aynı kart ızgarası ve ikonları kazanırlar.
 *
 * Yalnızca içinde bağlantıdan başka görünür metin olmayan paragraflar
 * gruplanır; araya metin girerse grup orada biter.
 */
export function paragrafBaglantilariniDizinYap(html: string): string {
  // Tek bir "yalnızca bağlantı" paragrafı: baştan sona <a>…</a>, yanında
  // yalnızca boşluk ya da <br> olabilir.
  const P = '<p\\b[^>]*>\\s*(?:<a\\b[^>]*>[\\s\\S]*?<\\/a>)\\s*(?:<br\\s*\\/?>\\s*)?<\\/p>';
  const RUN = new RegExp(`(?:${P}\\s*){2,}`, 'gi');
  const TEK = new RegExp(P, 'gi');

  return String(html).replace(RUN, (blok) => {
    const maddeler = (blok.match(TEK) || []).map((p) => {
      const bag = (p.match(/<a\b[^>]*>[\s\S]*?<\/a>/i) || [''])[0];
      return `<li>${bag}</li>`;
    });
    return `<ul class="baglanti-dizini">${maddeler.join('')}</ul>`;
  });
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
  // Sıra önemli: önce bozuk işaretleme onarılır, sonra paragraf-bağlantı
  // dizinleri listeye çevrilir, sonra <ul> dizinleri işaretlenir, en son
  // iletişim bağlantıları kurulur. Ters sırada, kapanmamış bir etiket
  // yüzünden liste dizin sayılmaz ve onarım geç kalırdı.
  return baglantiDizinleriniIsaretle(
    paragrafBaglantilariniDizinYap(
      iletisimBaglantilari(bagliMaddeleriOnar(html))
    )
  );
}
