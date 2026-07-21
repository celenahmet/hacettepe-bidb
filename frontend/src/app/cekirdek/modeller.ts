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

export type Dil = 'tr' | 'en';
