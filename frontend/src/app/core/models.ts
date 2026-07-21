/** Backend'den gelen veri yapıları. */

export interface Document {
  ad: string;
  adres: string;
  tur: string | null;
}

export interface Page {
  slug: string;
  dil: string;
  baslik: string;
  icerikHtml: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  belgeler: Document[];
  /** Diğer dilde karşılığı var mı (hreflang için) */
  cevirisiVar?: boolean;
}

export interface MenuItem {
  etiket: string;
  adres: string;
  yeniSekme: boolean;
}

export interface Menu {
  baslik: string;
  ogeler: MenuItem[];
}

export interface Slide {
  baslik: string | null;
  altBaslik: string | null;
  gorselUrl: string;
  gorselAlt: string | null;
  baglanti: string | null;
}

export interface SocialAccount {
  ag: string;
  adres: string;
}

export interface Shortcut {
  ad: string;
  ikonUrl: string | null;
  adres: string;
  yeniSekme: boolean;
}

export interface NewsSummary {
  baslik: string;
  tarih: string;
  adres: string | null;
  ozet: string | null;
  gorselUrl: string | null;
  gorselAlt: string | null;
  /** Haberin kendi sayfası varsa site içi bağlantı, yoksa dış bağlantıdır */
  kendiSayfasi: boolean;
}

/** Ana sayfanın tüm bileşenleri tek istekte gelir. */
export interface HomeData {
  slider: Slide[];
  kisayollar: Shortcut[];
  servisler: Shortcut[];
  duyurular: NewsSummary[];
}

export type Language = 'tr' | 'en';
