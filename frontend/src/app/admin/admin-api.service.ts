import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewsAudience, NewsCategory, NewsCoverTemplate } from '../core/models';

export interface AdminPage {
  id: number;
  slug: string;
  language: string;
  title: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  seoImage: string | null;
  seoRobots: string | null;
  seoSchemaType: string | null;
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
  /** Duyuru, detay sayfası yerine doğrudan yüklenen belgeye yönlenir. */
  documentOnly: boolean;
  /** Doldurulursa haber kendi sayfasında açılır: /tr/newsItem/<slug> */
  slug: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  contentHtml: string | null;
  category: NewsCategory;
  audience: NewsAudience;
  coverTemplate: NewsCoverTemplate;
  /** Fotoğraf kullanılmadığında şablonun üzerinde gösterilen kısa metin */
  coverText: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  seoRobots: string | null;
}

export interface NewsOption {
  key: string;
  trLabel: string;
  enLabel: string;
  description: string;
}

export interface NewsOptions {
  categories: NewsOption[];
  audiences: NewsOption[];
  templates: NewsOption[];
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

export interface ContactTicket {
  id: number;
  referenceCode: string;
  language: string;
  category: string;
  subject: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string | null;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'WAITING' | 'RESOLVED' | 'CLOSED';
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  assignedTo: string | null;
  adminNote: string | null;
  attachmentUrl: string | null;
  attachmentName: string | null;
  attachmentSizeBytes: number | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

export interface ContactTicketEvent {
  id: number;
  eventType: string;
  fromStatus: string | null;
  toStatus: string | null;
  note: string | null;
  actor: string;
  createdAt: string;
}

export interface StaffMember {
  id: number | null;
  unitId: number | null;
  fullName: string;
  /** Yönetim panelinden düzenlenen görev veya kurumsal unvan */
  roleTitle: string | null;
  /** Adın yanındaki açıklama: "(e-imza)" */
  note: string | null;
  /** Profil detayında gösterilen isteğe bağlı kurumsal tanıtım metni */
  aboutText: string | null;
  /** Birim sorumlusu */
  lead: boolean;
  photoUrl: string | null;
  email: string | null;
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

export interface QualityPageScore {
  path: string;
  title: string;
  contentType: 'page' | 'news';
  score: number;
  issues: string[];
}

export interface QualityVitalScore {
  path: string;
  metric: 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB';
  p75: number;
  samples: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  score: number;
  lastMeasuredAt: string;
}

export interface QualitySummary {
  seoScore: number;
  performanceScore: number | null;
  performanceSamples: number;
  generatedAt: string;
  pages: QualityPageScore[];
  vitals: QualityVitalScore[];
}

/** Yönetim paneline yapılan bir giriş denemesinin kaydı. */
export interface LoginEvent {
  id: number;
  occurredAt: string;
  successful: boolean;
  attemptedUsername: string | null;
  ipAddress: string;
  localIpAddress: string | null;
  deviceClass: string | null;
  browser: string | null;
  operatingSystem: string | null;
  city: string | null;
  country: string | null;
}

export interface AuditEvent {
  id: number;
  occurredAt: string;
  sessionId: string;
  attemptedUsername: string | null;
  ipAddress: string;
  localIpAddress: string | null;
  httpMethod: string;
  resourcePath: string;
  actionLabel: string;
  httpStatus: number;
  successful: boolean;
}

export interface AnalyticsPeriodPoint {
  key: string;
  views: number;
}

export interface AnalyticsBreakdown {
  name: string;
  views: number;
  percentage: number;
}

export interface AnalyticsPageReport {
  path: string;
  views: number;
  currentMonthViews: number;
  previousMonthViews: number;
  changePercent: number | null;
  lastViewedAt: string;
}

export interface AnalyticsReport {
  totalViews: number;
  currentMonthViews: number;
  previousMonthViews: number;
  monthlyChangePercent: number | null;
  activePages: number;
  months: number;
  generatedAt: string;
  monthly: AnalyticsPeriodPoint[];
  daily: AnalyticsPeriodPoint[];
  pages: AnalyticsPageReport[];
  devices: AnalyticsBreakdown[];
  referrers: AnalyticsBreakdown[];
}

const SESSION_KEY = 'bidb-yonetim';
const OTURUM_KIMLIGI_ANAHTARI = 'bidb-oturum-kimligi';

/** Yönetim uçlarına erişim. Kimlik bilgisi yalnızca tarayıcı oturumunda tutulur. */
@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private http = inject(HttpClient);

  readonly girisYapildi = signal(false);
  private kimlik = '';
  /**
   * Tarayıcı sekmesi başına üretilen, kalıcı olmayan bir ayırt edici.
   * Paylaşılan tek yönetici hesabı olduğundan gerçek kullanıcı kimliği yerine
   * işlem günlüğünde (bkz. admin_audit_event) "kim" sorusuna bu cevap verir.
   */
  private readonly oturumKimligi = this.oturumKimligiUret();

  private oturumKimligiUret(): string {
    if (typeof sessionStorage === 'undefined') return 'sunucu';
    let kimlik = sessionStorage.getItem(OTURUM_KIMLIGI_ANAHTARI);
    if (!kimlik) {
      kimlik = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now());
      sessionStorage.setItem(OTURUM_KIMLIGI_ANAHTARI, kimlik);
    }
    return kimlik;
  }

  constructor() {
    if (typeof sessionStorage !== 'undefined') {
      const kayit = sessionStorage.getItem(SESSION_KEY);
      if (kayit) {
        this.kimlik = kayit;
        this.girisYapildi.set(true);
      }
    }
  }

  /**
   * Kullanıcı adı ve parolayı doğrular; başarılıysa oturumda saklar.
   *
   * Yalnızca bu tek uca (dogrula) çağrı yapılır — YoneticiGirisSinirlayici
   * giriş kaydını (cihaz, IP, tahmini konum) bu yol için tutar. Sayfa
   * listesi girişten sonra ayrıca yüklenir (bkz. AdminPanelComponent.giris()).
   */
  girisDene(kullanici: string, parola: string): Observable<{ kullanici: string }> {
    this.kimlik = 'Basic ' + btoa(`${kullanici}:${parola}`);
    return this.http.get<{ kullanici: string }>('/api/admin/auth/dogrula', { headers: this.basliklar() });
  }

  /** Son giriş denemeleri (güvenlik denetimi). */
  loginEvents(): Observable<LoginEvent[]> {
    return this.http.get<LoginEvent[]>('/api/admin/login-events', { headers: this.basliklar() });
  }

  /** Panelde yapılan değişiklik işlemlerinin denetim kaydı (oturum, IP, ne değişti). */
  auditEvents(): Observable<AuditEvent[]> {
    return this.http.get<AuditEvent[]>('/api/admin/audit-events', { headers: this.basliklar() });
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
      seoImage: veri.seoImage ?? '',
      seoRobots: veri.seoRobots ?? 'index, follow',
      seoSchemaType: veri.seoSchemaType ?? 'WebPage',
      published: veri.published ?? true
    }, { headers: this.basliklar() });
  }

  news(): Observable<AdminNews[]> {
    return this.http.get<AdminNews[]>('/api/admin/news', { headers: this.basliklar() });
  }

  newsOptions(): Observable<NewsOptions> {
    return this.http.get<NewsOptions>('/api/admin/news/options', { headers: this.basliklar() });
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
      '/api/admin/files', govde,
      { headers: new HttpHeaders({ Authorization: this.kimlik, 'X-Bidb-Oturum': this.oturumKimligi }) });
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

  contactTickets(): Observable<ContactTicket[]> {
    return this.http.get<ContactTicket[]>('/api/admin/contact-tickets', { headers: this.basliklar() });
  }

  contactTicketEvents(id: number): Observable<ContactTicketEvent[]> {
    return this.http.get<ContactTicketEvent[]>(`/api/admin/contact-tickets/${id}/events`,
      { headers: this.basliklar() });
  }

  updateContactTicket(ticket: ContactTicket, eventNote: string): Observable<ContactTicket> {
    return this.http.put<ContactTicket>(`/api/admin/contact-tickets/${ticket.id}`, {
      status: ticket.status,
      priority: ticket.priority,
      assignedTo: ticket.assignedTo,
      adminNote: ticket.adminNote,
      eventNote
    }, { headers: this.basliklar() });
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
    const hedefBirimId = k.unitId ?? unitId;
    return k.id
      ? this.http.put(`/api/admin/staff/members/${k.id}`, k, { headers: this.basliklar() })
      : this.http.post(`/api/admin/staff/units/${hedefBirimId}/members`, k, { headers: this.basliklar() });
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

  qualitySummary(days = 28): Observable<QualitySummary> {
    return this.http.get<QualitySummary>('/api/admin/quality', {
      headers: this.basliklar(),
      params: { days }
    });
  }

  analyticsReport(months = 12): Observable<AnalyticsReport> {
    return this.http.get<AnalyticsReport>('/api/admin/analytics', {
      headers: this.basliklar(),
      params: { months }
    });
  }

  private basliklar(): HttpHeaders {
    return new HttpHeaders({
      Authorization: this.kimlik,
      'Content-Type': 'application/json',
      'X-Bidb-Oturum': this.oturumKimligi,
    });
  }
}
