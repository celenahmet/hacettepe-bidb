import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HomeData, Language, Menu, Page, Slide, SocialAccount } from './models';

/** Backend REST servisine erişim.
 *  Adres, ortam değişkeninden (API_URL) veya varsayılan olarak
 *  aynı sunucudaki /api yolundan çözülür. */
@Injectable({ providedIn: 'root' })
export class Api {
  private http = inject(HttpClient);

  // Hem tarayıcıda hem sunucuda göreli adres kullanılır; SSR sunucusu
  // /api isteklerini backend servisine iletir.
  private taban = typeof window === 'undefined' ? 'http://localhost:4000' : '';

  sayfa(language: Language, slug: string): Observable<Page | null> {
    return this.http
      .get<Page>(`${this.taban}/api/${language}/pages/${slug}`)
      .pipe(catchError(() => of(null)));
  }

  anaSayfa(language: Language): Observable<HomeData> {
    return this.http
      .get<HomeData>(`${this.taban}/api/${language}/home`)
      .pipe(catchError(() => of({ slider: [], shortcuts: [], services: [], news: [] })));
  }

  menu(language: Language, position = 'sol'): Observable<Menu[]> {
    return this.http
      .get<Menu[]>(`${this.taban}/api/${language}/menus`, { params: { position } })
      .pipe(catchError(() => of([])));
  }

  slider(language: Language): Observable<Slide[]> {
    return this.http
      .get<Slide[]>(`${this.taban}/api/${language}/slides`)
      .pipe(catchError(() => of([])));
  }

  sosyal(language: Language): Observable<SocialAccount[]> {
    return this.http
      .get<SocialAccount[]>(`${this.taban}/api/${language}/social-accounts`)
      .pipe(catchError(() => of([])));
  }
}
