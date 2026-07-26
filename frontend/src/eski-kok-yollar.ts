/* Dil öneki taşımayan eski adreslerin yeni adreslere eşlemesi.
 *
 * LEGACY_ROUTES (bkz. legacy-routes.ts) yalnızca /tr/… ve /en/… biçimindeki
 * eski adresleri kapsar; o dosya tools/slug-map.js tarafından üretildiği için
 * elle genişletilmez. Ancak eski sitede dil öneki olmayan adresler de vardı
 * (klasör + .shtml düzeni). Bunlar hem arama motorlarında ve dış sitelerde
 * kayıtlı hem de aktarılan sayfa metinlerinin İÇİNDE bağlantı olarak geçiyor;
 * karşılıksız bırakıldıklarında ziyaretçi hata sayfasına düşüyor.
 *
 * Eşleme BİREBİR yapılır, desenle değil: yönlendirme ara katmanı varlık
 * dosyalarından önce çalıştığı için, geniş bir kural CSS/JS isteklerini de
 * yakalayıp siteyi stilsiz bırakabilirdi.
 */
export const ESKI_KOK_YOLLAR: Record<string, string> = {
  // Kişisel web sayfaları hizmeti — /tr/kisisel için zaten eşleme var,
  // eski sitedeki klasörlü adres de aynı sayfaya taşınır.
  '/hizmetlerweb/kisisel.shtml': '/tr/personal-pages',
};
