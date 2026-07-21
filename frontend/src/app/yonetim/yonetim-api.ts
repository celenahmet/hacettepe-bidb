import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SayfaYonetim {
  id: number;
  slug: string;
  dil: string;
  baslik: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  yayinda: boolean;
  icerikUzunlugu: number;
}

export interface DuyuruYonetim {
  id: number | null;
  dil: string;
  baslik: string;
  ozet: string | null;
  yayinTarihi: string;
  oneCikan: boolean;
  yayinda: boolean;
  disAdres: string | null;
}

const OTURUM_ANAHTARI = 'bidb-yonetim';

/** Yönetim uçlarına erişim. Kimlik bilgisi yalnızca tarayıcı oturumunda tutulur. */
@Injectable({ providedIn: 'root' })
export class YonetimApi {
  private http = inject(HttpClient);

  readonly girisYapildi = signal(false);
  private kimlik = '';

  constructor() {
    if (typeof sessionStorage !== 'undefined') {
      const kayit = sessionStorage.getItem(OTURUM_ANAHTARI);
      if (kayit) {
        this.kimlik = kayit;
        this.girisYapildi.set(true);
      }
    }
  }

  /** Kullanıcı adı ve parolayı doğrular; başarılıysa oturumda saklar. */
  girisDene(kullanici: string, parola: string): Observable<SayfaYonetim[]> {
    this.kimlik = 'Basic ' + btoa(`${kullanici}:${parola}`);
    return this.http.get<SayfaYonetim[]>('/api/yonetim/sayfalar', { headers: this.basliklar() });
  }

  girisOnayla(): void {
    this.girisYapildi.set(true);
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(OTURUM_ANAHTARI, this.kimlik);
  }

  cikis(): void {
    this.kimlik = '';
    this.girisYapildi.set(false);
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(OTURUM_ANAHTARI);
  }

  sayfalar(): Observable<SayfaYonetim[]> {
    return this.http.get<SayfaYonetim[]>('/api/yonetim/sayfalar', { headers: this.basliklar() });
  }

  seoKaydet(id: number, veri: Partial<SayfaYonetim>): Observable<SayfaYonetim> {
    return this.http.put<SayfaYonetim>(`/api/yonetim/sayfalar/${id}/seo`, {
      seoTitle: veri.seoTitle ?? '',
      seoDescription: veri.seoDescription ?? '',
      seoKeywords: veri.seoKeywords ?? '',
      yayinda: veri.yayinda ?? true
    }, { headers: this.basliklar() });
  }

  duyurular(): Observable<DuyuruYonetim[]> {
    return this.http.get<DuyuruYonetim[]>('/api/yonetim/duyurular', { headers: this.basliklar() });
  }

  duyuruEkle(d: DuyuruYonetim): Observable<DuyuruYonetim> {
    return this.http.post<DuyuruYonetim>('/api/yonetim/duyurular', d, { headers: this.basliklar() });
  }

  duyuruGuncelle(id: number, d: DuyuruYonetim): Observable<DuyuruYonetim> {
    return this.http.put<DuyuruYonetim>(`/api/yonetim/duyurular/${id}`, d, { headers: this.basliklar() });
  }

  duyuruSil(id: number): Observable<void> {
    return this.http.delete<void>(`/api/yonetim/duyurular/${id}`, { headers: this.basliklar() });
  }

  private basliklar(): HttpHeaders {
    return new HttpHeaders({ Authorization: this.kimlik, 'Content-Type': 'application/json' });
  }
}
