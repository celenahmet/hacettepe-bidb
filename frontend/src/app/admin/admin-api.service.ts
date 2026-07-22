import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminPage {
  id: number;
  slug: string;
  language: string;
  title: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  published: boolean;
  contentLength: number;
}

export interface AdminNews {
  id: number | null;
  language: string;
  title: string;
  summary: string | null;
  publishedOn: string;
  featured: boolean;
  published: boolean;
  externalUrl: string | null;
  /** Doldurulursa haber kendi sayfasında açılır: /tr/newsItem/<slug> */
  slug: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  contentHtml: string | null;
}

export interface Slide {
  id: number | null;
  language: string;
  title: string | null;
  subtitle: string | null;
  imageUrl: string;
  imageAlt: string | null;
  linkUrl: string | null;
  sortOrder: number;
  published: boolean;
  /** Tarih verilirse slayt yalnızca bu aralıkta gösterilir */
  startsOn: string | null;
  endsOn: string | null;
}

export interface Shortcut {
  id: number | null;
  language: string;
  name: string;
  iconUrl: string | null;
  url: string;
  newTab: boolean;
  /** shortcut = üstteki ikon ızgarası, service = alttaki karusel */
  type: string;
  sortOrder: number;
  published: boolean;
}

export interface AdminMenuItem {
  id: number | null;
  label: string;
  pageId: number | null;
  pagePath: string | null;
  externalUrl: string | null;
  newTab: boolean;
  sortOrder: number;
}

export interface AdminMenu {
  id: number;
  language: string;
  position: string;
  title: string;
  sortOrder: number;
  items: AdminMenuItem[];
}

export interface AdminSocialAccount {
  id: number | null;
  network: string;
  url: string;
  sortOrder: number;
  published: boolean;
}

export interface Revision {
  id: number;
  title: string;
  note: string | null;
  savedBy: string;
  savedAt: string;
  length: number;
}

export interface AdminDocument {
  id: number | null;
  name: string;
  url: string;
  fileType?: string | null;
  sortOrder: number;
}

export interface UploadedFile {
  id: number;
  fileName: string;
  originalName: string;
  sizeBytes: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface ContactChannel {
  id: number | null;
  language: string;
  /** address | phone | email | fax */
  type: string;
  label: string | null;
  value: string;
  sortOrder: number;
  published: boolean;
}

export interface StaffMember {
  id: number | null;
  fullName: string;
  /** Yalnızca yönetim kadrosunda dolu: "Daire Başkanı" gibi */
  roleTitle: string | null;
  /** Adın yanındaki açıklama: "(e-imza)" */
  note: string | null;
  /** Birim sorumlusu */
  lead: boolean;
  photoUrl: string | null;
  /** Fotoğraf yoksa gösterilecek varsayılan ikon: 'kadin' | 'erkek' | null */
  avatar: string | null;
  sortOrder: number;
}

export interface StaffUnit {
  id: number | null;
  language: string;
  name: string;
  /** Beytepe / Sıhhiye; birim tek yerleşkedeyse boş */
  campus: string | null;
  phone: string | null;
  sortOrder: number;
  published: boolean;
  members: StaffMember[];
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

  /** Kullanıcı nameı ve parolayı doğrular; başarılıysa oturumda saklar. */
  girisDene(kullanici: string, parola: string): Observable<AdminPage[]> {
    this.kimlik = 'Basic ' + btoa(`${kullanici}:${parola}`);
    return this.http.get<AdminPage[]>('/api/admin/pages', { headers: this.basliklar() });
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

  pages(): Observable<AdminPage[]> {
    return this.http.get<AdminPage[]>('/api/admin/pages', { headers: this.basliklar() });
  }

  saveSeo(id: number, veri: Partial<AdminPage>): Observable<AdminPage> {
    return this.http.put<AdminPage>(`/api/admin/pages/${id}/seo`, {
      seoTitle: veri.seoTitle ?? '',
      seoDescription: veri.seoDescription ?? '',
      seoKeywords: veri.seoKeywords ?? '',
      published: veri.published ?? true
    }, { headers: this.basliklar() });
  }

  news(): Observable<AdminNews[]> {
    return this.http.get<AdminNews[]>('/api/admin/news', { headers: this.basliklar() });
  }

  addNews(d: AdminNews): Observable<AdminNews> {
    return this.http.post<AdminNews>('/api/admin/news', d, { headers: this.basliklar() });
  }

  updateNews(id: number, d: AdminNews): Observable<AdminNews> {
    return this.http.put<AdminNews>(`/api/admin/news/${id}`, d, { headers: this.basliklar() });
  }

  deleteNews(id: number): Observable<void> {
    return this.http.delete<void>(`/api/admin/news/${id}`, { headers: this.basliklar() });
  }

  slides(): Observable<Slide[]> {
    return this.http.get<Slide[]>('/api/admin/slides/list', { headers: this.basliklar() });
  }

  saveSlide(s: Slide): Observable<Slide> {
    return s.id
      ? this.http.put<Slide>(`/api/admin/slides/${s.id}`, s, { headers: this.basliklar() })
      : this.http.post<Slide>('/api/admin/slides', s, { headers: this.basliklar() });
  }

  deleteSlide(id: number): Observable<void> {
    return this.http.delete<void>(`/api/admin/slides/${id}`, { headers: this.basliklar() });
  }

  shortcuts(): Observable<Shortcut[]> {
    return this.http.get<Shortcut[]>('/api/admin/shortcuts/list', { headers: this.basliklar() });
  }

  saveShortcut(k: Shortcut): Observable<Shortcut> {
    return k.id
      ? this.http.put<Shortcut>(`/api/admin/shortcuts/${k.id}`, k, { headers: this.basliklar() })
      : this.http.post<Shortcut>('/api/admin/shortcuts', k, { headers: this.basliklar() });
  }

  deleteShortcut(id: number): Observable<void> {
    return this.http.delete<void>(`/api/admin/shortcuts/${id}`, { headers: this.basliklar() });
  }

  menus(): Observable<AdminMenu[]> {
    return this.http.get<AdminMenu[]>('/api/admin/menus', { headers: this.basliklar() });
  }

  saveMenuItem(menuId: number, o: AdminMenuItem): Observable<unknown> {
    const govde = { menuId, label: o.label, pageId: o.pageId, externalUrl: o.externalUrl, newTab: o.newTab, sortOrder: o.sortOrder };
    return o.id
      ? this.http.put(`/api/admin/menus/items/${o.id}`, govde, { headers: this.basliklar() })
      : this.http.post('/api/admin/menus/items', govde, { headers: this.basliklar() });
  }

  deleteMenuItem(id: number): Observable<void> {
    return this.http.delete<void>(`/api/admin/menus/items/${id}`, { headers: this.basliklar() });
  }

  socialAccounts(): Observable<AdminSocialAccount[]> {
    return this.http.get<AdminSocialAccount[]>('/api/admin/social-accounts', { headers: this.basliklar() });
  }

  saveSocialAccount(s: AdminSocialAccount): Observable<unknown> {
    return s.id
      ? this.http.put(`/api/admin/social-accounts/${s.id}`, s, { headers: this.basliklar() })
      : this.http.post('/api/admin/social-accounts', s, { headers: this.basliklar() });
  }

  deleteSocialAccount(id: number): Observable<void> {
    return this.http.delete<void>(`/api/admin/social-accounts/${id}`, { headers: this.basliklar() });
  }

  saveMenuSection(m: { id: number | null; language: string; position: string; title: string; sortOrder: number }): Observable<unknown> {
    return m.id
      ? this.http.put(`/api/admin/menus/${m.id}`, m, { headers: this.basliklar() })
      : this.http.post('/api/admin/menus', m, { headers: this.basliklar() });
  }

  deleteMenuSection(id: number): Observable<void> {
    return this.http.delete<void>(`/api/admin/menus/${id}`, { headers: this.basliklar() });
  }

  /* ---------- sayfa metni ve sürümler ---------- */

  /** Sayfanın içeriğiyle birlikte tam hâli (liste görünümünde metin gelmez). */
  fullPage(language: string, slug: string): Observable<{ contentHtml: string; title: string } | null> {
    return this.http.get<{ contentHtml: string; title: string }>(`/api/${language}/pages/${slug}`);
  }

  saveContent(id: number, veri: { title: string; contentHtml: string; note: string }): Observable<unknown> {
    return this.http.put(`/api/admin/pages/${id}/content`, veri, { headers: this.basliklar() });
  }

  revisions(id: number): Observable<Revision[]> {
    return this.http.get<Revision[]>(`/api/admin/pages/${id}/revisions`, { headers: this.basliklar() });
  }

  surumIcerik(revisionId: number): Observable<{ contentHtml: string; title: string }> {
    return this.http.get<{ contentHtml: string; title: string }>(
      `/api/admin/pages/revision/${revisionId}`, { headers: this.basliklar() });
  }

  restoreRevision(id: number, revisionId: number): Observable<unknown> {
    return this.http.post(`/api/admin/pages/${id}/restore/${revisionId}`, {}, { headers: this.basliklar() });
  }

  /* ---------- sayfa ekleme, silme, url ---------- */

  createPage(veri: { language: string; slug: string; title: string; contentHtml: string }): Observable<unknown> {
    return this.http.post('/api/admin/pages', veri, { headers: this.basliklar() });
  }

  changeAddress(id: number, veri: { slug: string; title: string }): Observable<unknown> {
    return this.http.put(`/api/admin/pages/${id}/url`, veri, { headers: this.basliklar() });
  }

  deletePage(id: number): Observable<void> {
    return this.http.delete<void>(`/api/admin/pages/${id}`, { headers: this.basliklar() });
  }

  /* ---------- sayfaya bağlı documents ---------- */

  documents(pageId: number): Observable<AdminDocument[]> {
    return this.http.get<AdminDocument[]>(`/api/admin/pages/${pageId}/documents`, { headers: this.basliklar() });
  }

  saveDocument(pageId: number, b: AdminDocument): Observable<unknown> {
    return b.id
      ? this.http.put(`/api/admin/pages/documents/${b.id}`, b, { headers: this.basliklar() })
      : this.http.post(`/api/admin/pages/${pageId}/documents`, b, { headers: this.basliklar() });
  }

  deleteDocument(documentId: number): Observable<void> {
    return this.http.delete<void>(`/api/admin/pages/documents/${documentId}`, { headers: this.basliklar() });
  }

  /* ---------- dosya yükleme ---------- */

  /** Dosya gönderirken Content-Type tarayıcı tarafından belirlenmelidir;
   *  bu yüzden yalnızca kimlik başlığı gönderilir. */
  uploadFile(dosya: File): Observable<{ url: string; fileName: string; sizeBytes: number }> {
    const govde = new FormData();
    govde.append('dosya', dosya);
    return this.http.post<{ url: string; fileName: string; sizeBytes: number }>(
      '/api/admin/files', govde, { headers: new HttpHeaders({ Authorization: this.kimlik }) });
  }

  uploadedFiles(): Observable<UploadedFile[]> {
    return this.http.get<UploadedFile[]>('/api/admin/files', { headers: this.basliklar() });
  }

  deleteFile(id: number): Observable<void> {
    return this.http.delete<void>(`/api/admin/files/${id}`, { headers: this.basliklar() });
  }

  /* ---------- iletişim bilgileri ---------- */

  contactChannels(): Observable<ContactChannel[]> {
    return this.http.get<ContactChannel[]>('/api/admin/contact-channels', { headers: this.basliklar() });
  }

  saveContactChannel(c: ContactChannel): Observable<unknown> {
    return c.id
      ? this.http.put(`/api/admin/contact-channels/${c.id}`, c, { headers: this.basliklar() })
      : this.http.post('/api/admin/contact-channels', c, { headers: this.basliklar() });
  }

  deleteContactChannel(id: number): Observable<void> {
    return this.http.delete<void>(`/api/admin/contact-channels/${id}`, { headers: this.basliklar() });
  }

  /* ---------- personel ---------- */

  staffUnits(): Observable<StaffUnit[]> {
    return this.http.get<StaffUnit[]>('/api/admin/staff/units', { headers: this.basliklar() });
  }

  saveStaffUnit(b: StaffUnit): Observable<unknown> {
    return b.id
      ? this.http.put(`/api/admin/staff/units/${b.id}`, b, { headers: this.basliklar() })
      : this.http.post('/api/admin/staff/units', b, { headers: this.basliklar() });
  }

  deleteStaffUnit(id: number): Observable<void> {
    return this.http.delete<void>(`/api/admin/staff/units/${id}`, { headers: this.basliklar() });
  }

  saveStaffMember(unitId: number, k: StaffMember): Observable<unknown> {
    return k.id
      ? this.http.put(`/api/admin/staff/members/${k.id}`, k, { headers: this.basliklar() })
      : this.http.post(`/api/admin/staff/units/${unitId}/members`, k, { headers: this.basliklar() });
  }

  deleteStaffMember(id: number): Observable<void> {
    return this.http.delete<void>(`/api/admin/staff/members/${id}`, { headers: this.basliklar() });
  }

  /** Kaydı bir sıra yukarı ya da aşağı taşır; komşusuyla yer değiştirir. */
  moveStaff(tur: 'units' | 'members', id: number, yon: 'up' | 'down'): Observable<void> {
    return this.http.post<void>(`/api/admin/staff/${tur}/${id}/move?direction=${yon}`, {},
      { headers: this.basliklar() });
  }

  settings(): Observable<{ name: string; language: string; value: string }[]> {
    return this.http.get<{ name: string; language: string; value: string }[]>(
      '/api/admin/settings', { headers: this.basliklar() });
  }

  saveSettings(degerler: Record<string, string>): Observable<unknown> {
    return this.http.put('/api/admin/settings', degerler, { headers: this.basliklar() });
  }

  private basliklar(): HttpHeaders {
    return new HttpHeaders({ Authorization: this.kimlik, 'Content-Type': 'application/json' });
  }
}
