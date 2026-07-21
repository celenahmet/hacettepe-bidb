import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AnaSayfaVerisi, Dil, Menu, Sayfa, Slayt, SosyalHesap } from './modeller';

/** Backend REST servisine erişim.
 *  Adres, ortam değişkeninden (API_URL) veya varsayılan olarak
 *  aynı sunucudaki /api yolundan çözülür. */
@Injectable({ providedIn: 'root' })
export class Api {
  private http = inject(HttpClient);

  // Hem tarayıcıda hem sunucuda göreli adres kullanılır; SSR sunucusu
  // /api isteklerini backend servisine iletir.
  private taban = typeof window === 'undefined' ? 'http://localhost:4000' : '';

  sayfa(dil: Dil, slug: string): Observable<Sayfa | null> {
    return this.http
      .get<Sayfa>(`${this.taban}/api/${dil}/sayfa/${slug}`)
      .pipe(catchError(() => of(null)));
  }

  anaSayfa(dil: Dil): Observable<AnaSayfaVerisi> {
    return this.http
      .get<AnaSayfaVerisi>(`${this.taban}/api/${dil}/anasayfa`)
      .pipe(catchError(() => of({ slider: [], kisayollar: [], servisler: [], duyurular: [] })));
  }

  menu(dil: Dil, konum = 'sol'): Observable<Menu[]> {
    return this.http
      .get<Menu[]>(`${this.taban}/api/${dil}/menu`, { params: { konum } })
      .pipe(catchError(() => of([])));
  }

  slider(dil: Dil): Observable<Slayt[]> {
    return this.http
      .get<Slayt[]>(`${this.taban}/api/${dil}/slider`)
      .pipe(catchError(() => of([])));
  }

  sosyal(dil: Dil): Observable<SosyalHesap[]> {
    return this.http
      .get<SosyalHesap[]>(`${this.taban}/api/${dil}/sosyal`)
      .pipe(catchError(() => of([])));
  }
}
