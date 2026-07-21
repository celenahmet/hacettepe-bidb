/** Backend'den gelen veri yapıları. */

export interface Belge {
  ad: string;
  adres: string;
  tur: string | null;
}

export interface Sayfa {
  slug: string;
  dil: string;
  baslik: string;
  icerikHtml: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  belgeler: Belge[];
  /** Diğer dilde karşılığı var mı (hreflang için) */
  cevirisiVar?: boolean;
}

export interface MenuOge {
  etiket: string;
  adres: string;
  yeniSekme: boolean;
}

export interface Menu {
  baslik: string;
  ogeler: MenuOge[];
}

export interface Slayt {
  baslik: string | null;
  altBaslik: string | null;
  gorselUrl: string;
  gorselAlt: string | null;
  baglanti: string | null;
}

export interface SosyalHesap {
  ag: string;
  adres: string;
}

export interface Kisayol {
  ad: string;
  ikonUrl: string | null;
  adres: string;
  yeniSekme: boolean;
}

export interface DuyuruOzet {
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
export interface AnaSayfaVerisi {
  slider: Slayt[];
  kisayollar: Kisayol[];
  servisler: Kisayol[];
  duyurular: DuyuruOzet[];
}

export type Dil = 'tr' | 'en';
