import { Observable, timer } from 'rxjs';
import { retry } from 'rxjs/operators';

/**
 * Geçici ağ hatalarında isteği yeniden dener.
 *
 * NEDEN GEREKLİ: istekler hata durumunda boş değere düşüyordu. Backend bir
 * an cevap veremediğinde (yeniden başlatma, soğuk açılış, anlık ağ kesintisi)
 * menü boş, açılış alanı yok, duyurular yok, iletişim boş bir sayfa
 * çiziliyor ve bu hâl kalıcı oluyordu — bileşen bir daha istemiyordu.
 * Ziyaretçinin gördüğü şey "site bozulmuş" oluyordu.
 *
 * İki kez, artan gecikmeyle denenir (400ms, 800ms). Sunucu gerçekten
 * kapalıysa üç denemenin toplam maliyeti 1,2 saniyedir; buna karşılık
 * saniyelik bir kesinti tamamen görünmez hâle gelir.
 *
 * 4xx yanıtlarında denenmez: "bulunamadı" ya da "yetkisiz" tekrar sorulmakla
 * değişmez, yalnızca sunucuyu meşgul eder.
 */
export function yenidenDene<T>() {
  return (kaynak: Observable<T>): Observable<T> =>
    kaynak.pipe(
      retry({
        count: 2,
        delay: (hata, sayi) => {
          const kod = hata?.status ?? 0;
          if (kod >= 400 && kod < 500) throw hata;
          return timer(sayi * 400);
        }
      })
    );
}
