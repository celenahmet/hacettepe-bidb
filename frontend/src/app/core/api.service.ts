import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { yenidenDene } from './yeniden-dene';
import { HomeData, Language, Menu, Page, Slide, SocialAccount, StaffUnit } from './models';

export interface PageResult {
  page: Page | null;
  status: number;
}

/** Backend REST servisine erişim.
 *  Adres, ortam değişkeninden (API_URL) veya varsayılan olarak
 *  aynı sunucudaki /api yolundan çözülür. */
@Injectable({ providedIn: 'root' })
export class Api {
  private http = inject(HttpClient);

  /**
   * SSR doğrudan backend ağına gider; tarayıcı kendi origin'ini kullanır.
   * Sunucu yapılandırmasındaki origin eşlemesi sayesinde SSR yanıtı hydration
   * aktarım önbelleğine yazılır ve tarayıcı aynı veriyi ikinci kez istemez.
   */
  private taban = typeof window === 'undefined'
    ? (process.env['BIDB_API'] ?? 'http://localhost:8081')
    : window.location.origin;

  /**
   * İçerik sayfasının yalnızca boş olup olmadığını değil, neden
   * alınamadığını da taşır. Böylece 404 ile geçici servis kesintisi aynı
   * ekrana düşmez; ziyaretçi gerçek hata koduna yönlendirilir.
   */
  sayfaSonucu(language: Language, slug: string): Observable<PageResult> {
    return this.http
      .get<Page>(`${this.taban}/api/${language}/pages/${slug}`)
      .pipe(
        yenidenDene(),
        map((page) => ({ page, status: 200 })),
        catchError((error: HttpErrorResponse) =>
          of({
            page: null,
            status: error.status >= 400 && error.status <= 599 ? error.status : 503
          })
        )
      );
  }

  anaSayfa(language: Language): Observable<HomeData> {
    return this.http
      .get<HomeData>(`${this.taban}/api/${language}/home`)
      .pipe(yenidenDene(), catchError(() => of({
        seo: null, slider: [], shortcuts: [], services: [], news: []
      })));
  }

  /**
   * Menü, tek bir sayfa çiziminde DÖRT ayrı yerden isteniyor (üst şerit, sol
   * menü, içerik sayfasının bölüm çözümü ve sol menünün ilk kurulumu). Her
   * çağrı ayrı bir HTTP isteği açıyordu; sunucu tarafında bu, menü sorgusunun
   * dört kez çalışması ve her menü öğesi için page tablosuna ayrı ayrı
   * gidilmesi demekti — ölçüldü: tek /tr/staff çiziminde page tablosuna 145
   * erişim.
   *
   * Yanıt kısa süreli olarak paylaşılıyor. Süre, vekilin bu uçlar için zaten
   * ilan ettiği tazelik penceresiyle (30 sn, bkz. server.ts) aynı tutuldu;
   * böylece kabul edilmiş olandan daha uzun bir bayatlık oluşmuyor. Sunucu
   * tarafında her istek kendi enjektörünü aldığı için önbellek istek
   * başınadır, ziyaretçiler arasında paylaşılmaz.
   */
  private menuOnbellek = new Map<string, { veri$: Observable<Menu[]>; zaman: number }>();
  private static readonly MENU_TAZELIK_MS = 30_000;

  menu(language: Language, position = 'sol'): Observable<Menu[]> {
    const anahtar = `${language}|${position}`;
    const kayit = this.menuOnbellek.get(anahtar);
    if (kayit && Date.now() - kayit.zaman < Api.MENU_TAZELIK_MS) return kayit.veri$;

    const veri$ = this.http
      .get<Menu[]>(`${this.taban}/api/${language}/menus`, { params: { position } })
      .pipe(yenidenDene(), catchError(() => of([])), shareReplay({ bufferSize: 1, refCount: false }));
    this.menuOnbellek.set(anahtar, { veri$, zaman: Date.now() });
    return veri$;
  }

  slider(language: Language): Observable<Slide[]> {
    return this.http
      .get<Slide[]>(`${this.taban}/api/${language}/slides`)
      .pipe(yenidenDene(), catchError(() => of([])));
  }

  /** Personel listesi; birim ve kişi kayıtlarından gelir, HTML değildir. */
  personel(language: Language): Observable<StaffUnit[]> {
    return this.http
      .get<StaffUnit[]>(`${this.taban}/api/${language}/staff`)
      .pipe(yenidenDene(), catchError(() => of([])));
  }

  sosyal(language: Language): Observable<SocialAccount[]> {
    return this.http
      .get<SocialAccount[]>(`${this.taban}/api/${language}/social-accounts`)
      .pipe(yenidenDene(), catchError(() => of([])));
  }
}
