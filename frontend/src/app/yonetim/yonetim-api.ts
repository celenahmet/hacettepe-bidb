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
  /** Doldurulursa haber kendi sayfasında açılır: /tr/duyuru/<slug> */
  slug: string | null;
  gorselUrl: string | null;
  gorselAlt: string | null;
  icerikHtml: string | null;
}

export interface Slayt {
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

export interface Kisayol {
  id: number | null;
  dil: string;
  ad: string;
  ikonUrl: string | null;
  adres: string;
  yeniSekme: boolean;
  sira: number;
  yayinda: boolean;
}

export interface MenuOgeYonetim {
  id: number | null;
  etiket: string;
  sayfaId: number | null;
  sayfaYolu: string | null;
  disAdres: string | null;
  yeniSekme: boolean;
  sira: number;
}

export interface MenuYonetim {
  id: number;
  dil: string;
  konum: string;
  baslik: string;
  sira: number;
  ogeler: MenuOgeYonetim[];
}

export interface SosyalHesapYonetim {
  id: number | null;
  ag: string;
  adres: string;
  sira: number;
  yayinda: boolean;
}

export interface Surum {
  id: number;
  baslik: string;
  aciklama: string | null;
  kaydeden: string;
  zaman: string;
  uzunluk: number;
}

export interface BelgeYonetim {
  id: number | null;
  ad: string;
  adres: string;
  tur?: string | null;
  sira: number;
}

export interface YuklenenDosya {
  id: number;
  dosyaAdi: string;
  ozgunAd: string;
  boyut: number;
  yukleyen: string;
  yukleme: string;
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

  slaytlar(): Observable<Slayt[]> {
    return this.http.get<Slayt[]>('/api/yonetim/slider/liste', { headers: this.basliklar() });
  }

  slaytKaydet(s: Slayt): Observable<Slayt> {
    return s.id
      ? this.http.put<Slayt>(`/api/yonetim/slider/${s.id}`, s, { headers: this.basliklar() })
      : this.http.post<Slayt>('/api/yonetim/slider', s, { headers: this.basliklar() });
  }

  slaytSil(id: number): Observable<void> {
    return this.http.delete<void>(`/api/yonetim/slider/${id}`, { headers: this.basliklar() });
  }

  kisayollar(): Observable<Kisayol[]> {
    return this.http.get<Kisayol[]>('/api/yonetim/kisayollar/liste', { headers: this.basliklar() });
  }

  kisayolKaydet(k: Kisayol): Observable<Kisayol> {
    return k.id
      ? this.http.put<Kisayol>(`/api/yonetim/kisayollar/${k.id}`, k, { headers: this.basliklar() })
      : this.http.post<Kisayol>('/api/yonetim/kisayollar', k, { headers: this.basliklar() });
  }

  kisayolSil(id: number): Observable<void> {
    return this.http.delete<void>(`/api/yonetim/kisayollar/${id}`, { headers: this.basliklar() });
  }

  menuler(): Observable<MenuYonetim[]> {
    return this.http.get<MenuYonetim[]>('/api/yonetim/menu', { headers: this.basliklar() });
  }

  menuOgeKaydet(menuId: number, o: MenuOgeYonetim): Observable<unknown> {
    const govde = { menuId, etiket: o.etiket, sayfaId: o.sayfaId, disAdres: o.disAdres, yeniSekme: o.yeniSekme, sira: o.sira };
    return o.id
      ? this.http.put(`/api/yonetim/menu/oge/${o.id}`, govde, { headers: this.basliklar() })
      : this.http.post('/api/yonetim/menu/oge', govde, { headers: this.basliklar() });
  }

  menuOgeSil(id: number): Observable<void> {
    return this.http.delete<void>(`/api/yonetim/menu/oge/${id}`, { headers: this.basliklar() });
  }

  sosyalHesaplar(): Observable<SosyalHesapYonetim[]> {
    return this.http.get<SosyalHesapYonetim[]>('/api/yonetim/sosyal', { headers: this.basliklar() });
  }

  sosyalKaydet(s: SosyalHesapYonetim): Observable<unknown> {
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

  surumler(id: number): Observable<Surum[]> {
    return this.http.get<Surum[]>(`/api/yonetim/sayfa/${id}/surumler`, { headers: this.basliklar() });
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

  belgeler(sayfaId: number): Observable<BelgeYonetim[]> {
    return this.http.get<BelgeYonetim[]>(`/api/yonetim/sayfa/${sayfaId}/belgeler`, { headers: this.basliklar() });
  }

  belgeKaydet(sayfaId: number, b: BelgeYonetim): Observable<unknown> {
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

  yuklenenler(): Observable<YuklenenDosya[]> {
    return this.http.get<YuklenenDosya[]>('/api/yonetim/dosya', { headers: this.basliklar() });
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
