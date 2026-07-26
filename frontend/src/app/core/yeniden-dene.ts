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
 * İki kez, artan gecikmeyle denenir (400ms, 800ms). Tek bir çağrı için üç
 * denemenin maliyeti 1,2 saniyedir; buna karşılık saniyelik bir kesinti
 * tamamen görünmez hâle gelir.
 *
 * 4xx yanıtlarında denenmez: "bulunamadı" ya da "yetkisiz" tekrar sorulmakla
 * değişmez, yalnızca sunucuyu meşgul eder.
 *
 * SUNUCUDA HİÇ DENENMEZ. "Çağrı başına 1,2 saniye" hesabı bir sayfa çizimi
 * için yanıltıcıydı: çizim onlarca API çağrısı yapıyor ve maliyet çarpılıyor.
 * Backend kapalıyken ölçüldüğünde sayfalar 20-42 saniyede yanıt veriyordu;
 * bu sürenin neredeyse tamamı zaman aşımı değil, üst üste binen yeniden
 * deneme beklemeleriydi (hatanın kendisi 127 ms sürüyor — bağlantı reddi).
 * Ziyaretçi bu sürede boş ekrana bakıyor, sunucu da bağlantıyı tutuyordu.
 *
 * Tarayıcıda deneme değerli: kullanıcı zaten sayfayı görüyor, arka planda
 * yapılan tekrar onun için bedava ve anlık kesintiyi gizliyor. Sunucuda ise
 * her deneme doğrudan ziyaretçinin bekleme süresine yazılıyor. Çizim, veri
 * gelmediğinde zaten boş değere düşüp sayfayı döndürüyor; tarayıcı devraldığında
 * eksik veriyi kendisi yeniden isteyebilir.
 */
const SUNUCUDA = typeof window === 'undefined';

export function yenidenDene<T>() {
  return (kaynak: Observable<T>): Observable<T> =>
    SUNUCUDA
      ? kaynak
      : kaynak.pipe(
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
