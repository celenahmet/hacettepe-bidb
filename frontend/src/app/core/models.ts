/** Backend'den gelen veri yapıları. */

export interface Document {
  name: string;
  url: string;
  fileType: string | null;
}

export interface Page {
  slug: string;
  language: string;
  title: string;
  contentHtml: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  documents: Document[];
  /** Diğer dilde karşılığı var mı (hreflang için) */
  hasTranslation?: boolean;
}

export interface MenuItem {
  label: string;
  url: string;
  newTab: boolean;
}

export interface Menu {
  title: string;
  items: MenuItem[];
}

export interface Slide {
  title: string | null;
  subtitle: string | null;
  imageUrl: string;
  imageAlt: string | null;
  linkUrl: string | null;
}

export interface SocialAccount {
  network: string;
  url: string;
}

export interface Shortcut {
  name: string;
  iconUrl: string | null;
  url: string;
  newTab: boolean;
}

export interface NewsSummary {
  id: number;
  title: string;
  date: string;
  url: string | null;
  summary: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  /** Haberin kendi sayfası varsa site içi bağlantı, yoksa dış bağlantıdır */
  hasOwnPage: boolean;
  viewCount: number;
}

/** Ana sayfanın tüm bileşenleri tek istekte gelir. */
export interface HomeData {
  slider: Slide[];
  shortcuts: Shortcut[];
  services: Shortcut[];
  news: NewsSummary[];
}

export interface StaffMember {
  fullName: string;
  roleTitle: string | null;
  note: string | null;
  /** Birim sorumlusu; kaynak sayfada adın sonundaki yıldızla gösteriliyordu */
  lead: boolean;
  photoUrl: string | null;
  /** Fotoğraf yoksa gösterilecek varsayılan ikon: 'kadin' | 'erkek' | null */
  avatar: string | null;
}

export interface StaffUnit {
  name: string;
  campus: string | null;
  phone: string | null;
  members: StaffMember[];
}

export type Language = 'tr' | 'en';
