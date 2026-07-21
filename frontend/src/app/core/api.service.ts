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

  sayfa(dil: Language, slug: string): Observable<Page | null> {
    return this.http
      .get<Page>(`${this.taban}/api/${dil}/sayfa/${slug}`)
      .pipe(catchError(() => of(null)));
  }

  anaSayfa(dil: Language): Observable<HomeData> {
    return this.http
      .get<HomeData>(`${this.taban}/api/${dil}/anasayfa`)
      .pipe(catchError(() => of({ slider: [], kisayollar: [], servisler: [], duyurular: [] })));
  }

  menu(dil: Language, konum = 'sol'): Observable<Menu[]> {
    return this.http
      .get<Menu[]>(`${this.taban}/api/${dil}/menu`, { params: { konum } })
      .pipe(catchError(() => of([])));
  }

  slider(dil: Language): Observable<Slide[]> {
    return this.http
      .get<Slide[]>(`${this.taban}/api/${dil}/slider`)
      .pipe(catchError(() => of([])));
  }

  sosyal(dil: Language): Observable<SocialAccount[]> {
    return this.http
      .get<SocialAccount[]>(`${this.taban}/api/${dil}/sosyal`)
      .pipe(catchError(() => of([])));
  }
}
