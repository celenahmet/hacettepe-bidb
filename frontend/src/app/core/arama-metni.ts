/**
 * Arama karşılaştırması için metni sadeleştirir.
 *
 * Doğrudan toLowerCase() Türkçe metinde yanlış sonuç veriyordu. JavaScript'in
 * varsayılan davranışı "İ" harfini "i" değil, "i" + birleşen nokta (U+0307)
 * olarak küçültür; böylece "iptal" araması "İPTAL" ile EŞLEŞMEZ. Türkçede
 * büyük İ ile başlayan sözcük çok olduğundan (İçerik, İptal, İletişim, İşlem,
 * İndir…) arama sessizce sonuçsuz kalıyordu.
 *
 * toLocaleLowerCase('tr') bu durumu düzeltir ama tersini bozar: İngilizce
 * yazımdaki "I" harfini "ı" yapar, bu kez "IPTAL" bulunamaz. Panelde ve
 * duyurularda iki yazım da geçtiği için tek bir yerel seçmek çözüm değil.
 *
 * Bu yüzden karşılaştırma için harfler katlanır: İ, I, ı ve i aynı harfe
 * indirilir. Aynı mantık diğer Türkçe harflere de uygulanır — "islem" yazan
 * biri "işlem" sonucunu bekler. Katlama yalnızca ARAMA karşılaştırmasında
 * kullanılır; ekranda gösterilen metin hiç değişmez.
 *
 * Katlama sonuçları yalnızca çoğaltır, hiçbir zaman azaltmaz: eskiden bulunan
 * her sonuç bulunmaya devam eder.
 */
const HARF_KARSILIGI: Record<string, string> = {
  'İ': 'i', 'I': 'i', 'ı': 'i',
  'Ş': 's', 'ş': 's',
  'Ğ': 'g', 'ğ': 'g',
  'Ü': 'u', 'ü': 'u',
  'Ö': 'o', 'ö': 'o',
  'Ç': 'c', 'ç': 'c',
  // Eski yazımda geçen inceltme işaretli harfler (kâğıt, hâlâ, îmâ).
  'Â': 'a', 'â': 'a', 'Î': 'i', 'î': 'i', 'Û': 'u', 'û': 'u'
};

const KATLANACAK = /[İIıŞşĞğÜüÖöÇçÂâÎîÛû]/g;

export function aramaIcinSadelestir(metin: string | null | undefined): string {
  if (!metin) return '';
  // Önce Türkçe harfler ASCII karşılığına indirilir; geriye kalan A-Z'yi
  // toLowerCase güvenle küçültür, çünkü sorunlu harfler artık metinde yok.
  return metin.replace(KATLANACAK, (harf) => HARF_KARSILIGI[harf]).toLowerCase();
}
