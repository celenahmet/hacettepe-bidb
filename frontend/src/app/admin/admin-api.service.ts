import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminPage {
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

export interface AdminNews {
  id: number | null;
  dil: string;
  baslik: string;
  ozet: string | null;
  yayinTarihi: string;
  oneCikan: boolean;
  yayinda: boolean;
  disAdres: string | null;
  /** Doldurulursa haber kendi sayfasında açılır: /tr/duyuru/<slug> */
  slug: string | null;
  gorselUrl: string | null;
  gorselAlt: string | null;
  icerikHtml: string | null;
}

export interface Slide {
  id: number | null;
  dil: string;
  baslik: string | null;
  altBaslik: string | null;
  gorselUrl: string;
  gorselAlt: string | null;
  baglanti: string | null;
  sira: number;
  yayinda: boolean;
}

export interface Shortcut {
  id: number | null;
  dil: string;
  ad: string;
  ikonUrl: string | null;
  adres: string;
  yeniSekme: boolean;
  sira: number;
  yayinda: boolean;
}

export interface AdminMenuItem {
  id: number | null;
  etiket: string;
  sayfaId: number | null;
  sayfaYolu: string | null;
  disAdres: string | null;
  yeniSekme: boolean;
  sira: number;
}

export interface AdminMenu {
  id: number;
  dil: string;
  konum: string;
  baslik: string;
  sira: number;
  ogeler: AdminMenuItem[];
}

export interface AdminSocialAccount {
  id: number | null;
  ag: string;
  adres: string;
  sira: number;
  yayinda: boolean;
}

export interface Revision {
  id: number;
  baslik: string;
  aciklama: string | null;
  kaydeden: string;
  zaman: string;
  uzunluk: number;
}

export interface AdminDocument {
  id: number | null;
  ad: string;
  adres: string;
  tur?: string | null;
  sira: number;
}

export interface UploadedFile {
  id: number;
  dosyaAdi: string;
  ozgunAd: string;
  boyut: number;
  yukleyen: string;
  yukleme: string;
}

const SESSION_KEY = 'bidb-yonetim';

/** Yönetim uçlarına erişim. Kimlik bilgisi yalnızca tarayıcı oturumunda tutulur. */
@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private http = inject(HttpClient);

  readonly girisYapildi = signal(false);
  private kimlik = '';

  constructor() {
    if (typeof sessionStorage !== 'undefined') {
      const kayit = sessionStorage.getItem(SESSION_KEY);
      if (kayit) {
        this.kimlik = kayit;
        this.girisYapildi.set(true);
      }
    }
  }

  /** Kullanıcı adı ve parolayı doğrular; başarılıysa oturumda saklar. */
  girisDene(kullanici: string, parola: string): Observable<AdminPage[]> {
    this.kimlik = 'Basic ' + btoa(`${kullanici}:${parola}`);
    return this.http.get<AdminPage[]>('/api/yonetim/sayfalar', { headers: this.basliklar() });
  }

  girisOnayla(): void {
    this.girisYapildi.set(true);
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(SESSION_KEY, this.kimlik);
  }

  cikis(): void {
    this.kimlik = '';
    this.girisYapildi.set(false);
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(SESSION_KEY);
  }

  sayfalar(): Observable<AdminPage[]> {
    return this.http.get<AdminPage[]>('/api/yonetim/sayfalar', { headers: this.basliklar() });
  }

  seoKaydet(id: number, veri: Partial<AdminPage>): Observable<AdminPage> {
    return this.http.put<AdminPage>(`/api/yonetim/sayfalar/${id}/seo`, {
      seoTitle: veri.seoTitle ?? '',
      seoDescription: veri.seoDescription ?? '',
      seoKeywords: veri.seoKeywords ?? '',
      yayinda: veri.yayinda ?? true
    }, { headers: this.basliklar() });
  }

  duyurular(): Observable<AdminNews[]> {
    return this.http.get<AdminNews[]>('/api/yonetim/duyurular', { headers: this.basliklar() });
  }

  duyuruEkle(d: AdminNews): Observable<AdminNews> {
    return this.http.post<AdminNews>('/api/yonetim/duyurular', d, { headers: this.basliklar() });
  }

  duyuruGuncelle(id: number, d: AdminNews): Observable<AdminNews> {
    return this.http.put<AdminNews>(`/api/yonetim/duyurular/${id}`, d, { headers: this.basliklar() });
  }

  duyuruSil(id: number): Observable<void> {
    return this.http.delete<void>(`/api/yonetim/duyurular/${id}`, { headers: this.basliklar() });
  }

  slaytlar(): Observable<Slide[]> {
    return this.http.get<Slide[]>('/api/yonetim/slider/liste', { headers: this.basliklar() });
  }

  slaytKaydet(s: Slide): Observable<Slide> {
    return s.id
      ? this.http.put<Slide>(`/api/yonetim/slider/${s.id}`, s, { headers: this.basliklar() })
      : this.http.post<Slide>('/api/yonetim/slider', s, { headers: this.basliklar() });
  }

  slaytSil(id: number): Observable<void> {
    return this.http.delete<void>(`/api/yonetim/slider/${id}`, { headers: this.basliklar() });
  }

  kisayollar(): Observable<Shortcut[]> {
    return this.http.get<Shortcut[]>('/api/yonetim/kisayollar/liste', { headers: this.basliklar() });
  }

  kisayolKaydet(k: Shortcut): Observable<Shortcut> {
    return k.id
      ? this.http.put<Shortcut>(`/api/yonetim/kisayollar/${k.id}`, k, { headers: this.basliklar() })
      : this.http.post<Shortcut>('/api/yonetim/kisayollar', k, { headers: this.basliklar() });
  }

  kisayolSil(id: number): Observable<void> {
    return this.http.delete<void>(`/api/yonetim/kisayollar/${id}`, { headers: this.basliklar() });
  }

  menuler(): Observable<AdminMenu[]> {
    return this.http.get<AdminMenu[]>('/api/yonetim/menu', { headers: this.basliklar() });
  }

  menuOgeKaydet(menuId: number, o: AdminMenuItem): Observable<unknown> {
    const govde = { menuId, etiket: o.etiket, sayfaId: o.sayfaId, disAdres: o.disAdres, yeniSekme: o.yeniSekme, sira: o.sira };
    return o.id
      ? this.http.put(`/api/yonetim/menu/oge/${o.id}`, govde, { headers: this.basliklar() })
      : this.http.post('/api/yonetim/menu/oge', govde, { headers: this.basliklar() });
  }

  menuOgeSil(id: number): Observable<void> {
    return this.http.delete<void>(`/api/yonetim/menu/oge/${id}`, { headers: this.basliklar() });
  }

  sosyalHesaplar(): Observable<AdminSocialAccount[]> {
    return this.http.get<AdminSocialAccount[]>('/api/yonetim/sosyal', { headers: this.basliklar() });
  }

  sosyalKaydet(s: AdminSocialAccount): Observable<unknown> {
    return s.id
      ? this.http.put(`/api/yonetim/sosyal/${s.id}`, s, { headers: this.basliklar() })
      : this.http.post('/api/yonetim/sosyal', s, { headers: this.basliklar() });
  }

  sosyalSil(id: number): Observable<void> {
    return this.http.delete<void>(`/api/yonetim/sosyal/${id}`, { headers: this.basliklar() });
  }

  menuBolumKaydet(m: { id: number | null; dil: string; konum: string; baslik: string; sira: number }): Observable<unknown> {
    return m.id
      ? this.http.put(`/api/yonetim/menu/${m.id}`, m, { headers: this.basliklar() })
      : this.http.post('/api/yonetim/menu', m, { headers: this.basliklar() });
  }

  menuBolumSil(id: number): Observable<void> {
    return this.http.delete<void>(`/api/yonetim/menu/${id}`, { headers: this.basliklar() });
  }

  /* ---------- sayfa metni ve sürümler ---------- */

  /** Sayfanın içeriğiyle birlikte tam hâli (liste görünümünde metin gelmez). */
  sayfaTam(dil: string, slug: string): Observable<{ icerikHtml: string; baslik: string } | null> {
    return this.http.get<{ icerikHtml: string; baslik: string }>(`/api/${dil}/sayfa/${slug}`);
  }

  icerikKaydet(id: number, veri: { baslik: string; icerikHtml: string; aciklama: string }): Observable<unknown> {
    return this.http.put(`/api/yonetim/sayfa/${id}/icerik`, veri, { headers: this.basliklar() });
  }

  surumler(id: number): Observable<Revision[]> {
    return this.http.get<Revision[]>(`/api/yonetim/sayfa/${id}/surumler`, { headers: this.basliklar() });
  }

  surumIcerik(surumId: number): Observable<{ icerikHtml: string; baslik: string }> {
    return this.http.get<{ icerikHtml: string; baslik: string }>(
      `/api/yonetim/sayfa/surum/${surumId}`, { headers: this.basliklar() });
  }

  geriAl(id: number, surumId: number): Observable<unknown> {
    return this.http.post(`/api/yonetim/sayfa/${id}/geri-al/${surumId}`, {}, { headers: this.basliklar() });
  }

  /* ---------- sayfa ekleme, silme, adres ---------- */

  sayfaEkle(veri: { dil: string; slug: string; baslik: string; icerikHtml: string }): Observable<unknown> {
    return this.http.post('/api/yonetim/sayfa', veri, { headers: this.basliklar() });
  }

  adresDegistir(id: number, veri: { slug: string; baslik: string }): Observable<unknown> {
    return this.http.put(`/api/yonetim/sayfa/${id}/adres`, veri, { headers: this.basliklar() });
  }

  sayfaSil(id: number): Observable<void> {
    return this.http.delete<void>(`/api/yonetim/sayfa/${id}`, { headers: this.basliklar() });
  }

  /* ---------- sayfaya bağlı belgeler ---------- */

  belgeler(sayfaId: number): Observable<AdminDocument[]> {
    return this.http.get<AdminDocument[]>(`/api/yonetim/sayfa/${sayfaId}/belgeler`, { headers: this.basliklar() });
  }

  belgeKaydet(sayfaId: number, b: AdminDocument): Observable<unknown> {
    return b.id
      ? this.http.put(`/api/yonetim/sayfa/belge/${b.id}`, b, { headers: this.basliklar() })
      : this.http.post(`/api/yonetim/sayfa/${sayfaId}/belgeler`, b, { headers: this.basliklar() });
  }

  belgeSil(belgeId: number): Observable<void> {
    return this.http.delete<void>(`/api/yonetim/sayfa/belge/${belgeId}`, { headers: this.basliklar() });
  }

  /* ---------- dosya yükleme ---------- */

  /** Dosya gönderirken Content-Type tarayıcı tarafından belirlenmelidir;
   *  bu yüzden yalnızca kimlik başlığı gönderilir. */
  dosyaYukle(dosya: File): Observable<{ adres: string; dosyaAdi: string; boyut: number }> {
    const govde = new FormData();
    govde.append('dosya', dosya);
    return this.http.post<{ adres: string; dosyaAdi: string; boyut: number }>(
      '/api/yonetim/dosya', govde, { headers: new HttpHeaders({ Authorization: this.kimlik }) });
  }

  yuklenenler(): Observable<UploadedFile[]> {
    return this.http.get<UploadedFile[]>('/api/yonetim/dosya', { headers: this.basliklar() });
  }

  dosyaSil(id: number): Observable<void> {
    return this.http.delete<void>(`/api/yonetim/dosya/${id}`, { headers: this.basliklar() });
  }

  /* ---------- iletişim bilgileri ---------- */

  ayarlar(): Observable<{ anahtar: string; dil: string; deger: string }[]> {
    return this.http.get<{ anahtar: string; dil: string; deger: string }[]>(
      '/api/yonetim/ayarlar', { headers: this.basliklar() });
  }

  ayarKaydet(degerler: Record<string, string>): Observable<unknown> {
    return this.http.put('/api/yonetim/ayarlar', degerler, { headers: this.basliklar() });
  }

  private basliklar(): HttpHeaders {
    return new HttpHeaders({ Authorization: this.kimlik, 'Content-Type': 'application/json' });
  }
}
