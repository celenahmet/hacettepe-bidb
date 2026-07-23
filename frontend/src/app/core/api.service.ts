import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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

  // Hem tarayıcıda hem sunucuda göreli adres kullanılır; SSR sunucusu
  // /api isteklerini backend servisine iletir.
  private taban = typeof window === 'undefined' ? 'http://localhost:4000' : '';

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
      .pipe(yenidenDene(), catchError(() => of({ slider: [], shortcuts: [], services: [], news: [] })));
  }

  menu(language: Language, position = 'sol'): Observable<Menu[]> {
    return this.http
      .get<Menu[]>(`${this.taban}/api/${language}/menus`, { params: { position } })
      .pipe(yenidenDene(), catchError(() => of([])));
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
