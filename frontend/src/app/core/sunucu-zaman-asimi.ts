import { HttpInterceptorFn } from '@angular/common/http';
import { timeout } from 'rxjs/operators';

/**
 * Sunucu tarafı çizimde her backend çağrısına üst süre koyar.
 *
 * NEDEN GEREKLİ: çizim sırasındaki veri çağrıları Express vekilinden GEÇMEZ,
 * doğrudan backend ağına gider (bkz. api.service.ts). Vekildeki zaman aşımı ve
 * devre kesici bu yolda devrede değil; yani çizimin backend'i beklemesini
 * sınırlayan hiçbir şey yoktu.
 *
 * Backend'in kapalı olduğu durum sorun çıkarmıyor: bağlantı hemen reddediliyor.
 * Asıl tehlike backend'in AÇIK ama cevap VEREMEZ olması — uzun bir çöp toplama
 * duraklaması, kilitlenmiş bir sorgu, doymuş bir bağlantı havuzu. O zaman TCP
 * bağlantısı kuruluyor ve yanıt hiç gelmiyor; çizim süresiz bekliyor,
 * ziyaretçinin isteği hiç sonuçlanmıyor ve her yeni istek sunucuda bir bağlantı
 * daha tutuyordu.
 *
 * Süre dolduğunda çağrı hata olarak biter; bileşenler bunu zaten karşılıyor ve
 * sayfayı eldeki veriyle döndürüyor. Ziyaretçinin eksik veriyle dolu bir sayfa
 * görmesi, hiç sayfa görmemesinden iyidir.
 *
 * Tarayıcıda devrede değil: orada bekleyen istek sayfayı bloklamıyor ve
 * kullanıcının ağı gerçekten yavaş olabilir.
 */
const SUNUCUDA = typeof window === 'undefined';

const SSR_ZAMAN_ASIMI_MS = SUNUCUDA
  ? Number(process.env['BIDB_SSR_ZAMAN_ASIMI'] ?? 3000)
  : 0;

export const sunucuZamanAsimi: HttpInterceptorFn = (istek, sonraki) =>
  SUNUCUDA ? sonraki(istek).pipe(timeout(SSR_ZAMAN_ASIMI_MS)) : sonraki(istek);
