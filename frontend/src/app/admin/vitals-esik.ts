import { AdminDil } from './admin-dil.service';

/**
 * Core Web Vitals ölçümlerinin biçimlendirilmesi ve eşik aralıkları.
 *
 * Bileşenden ayrı bir dosyada: bu mantık saftır (sinyal, HTTP, DOM
 * kullanmaz) ve tek başına sınanabilir. Yönetim paneli bileşeninin
 * içindeyken sınamak için tüm paneli ayağa kaldırmak gerekiyordu —
 * bu da sınanmamasıyla sonuçlanıyordu.
 *
 * Eşik SAYILARI burada YOKTUR. Sunucudan gelen kaydın kendi good/poor
 * değerleri kullanılır; aksi hâlde eşik değiştiğinde panel eski sayıyı
 * göstermeye devam ederdi.
 */

export type VitalDerece = 'good' | 'needs-improvement' | 'poor';

/** Aralık listesinin bir satırı. */
export interface EsikAraligi {
  derece: VitalDerece;
  etiket: string;
  aralik: string;
  /** Ölçümün düştüğü aralık; ekranda vurgulanır. */
  etkin: boolean;
}

/** Aralıkların üretilebilmesi için kayıttan gereken en az bilgi. */
export interface VitalOlcum {
  metric: string;
  good: number;
  poor: number;
  rating: string;
}

/**
 * Ölçüm değerinin ekrandaki yazımı.
 *
 * Sayı biçimi PANEL DİLİNE göre yerelleştirilir: Türkçede ondalık ayracı
 * virgüldür. Önce toFixed(3) kullanılıyordu ve Türkçe panelde "0.328"
 * yazıyordu.
 *
 * CLS birimsiz bir orandır (0-1); diğerleri milisaniyedir.
 */
export function metrikDegeri(metric: string, value: number, dil: AdminDil): string {
  const yerel = dil === 'en' ? 'en-US' : 'tr-TR';
  if (metric === 'CLS') {
    return new Intl.NumberFormat(yerel, {
      minimumFractionDigits: 3, maximumFractionDigits: 3
    }).format(value);
  }
  return `${new Intl.NumberFormat(yerel).format(Math.round(value))} ms`;
}

/**
 * "Optimum beklenti" bloğundaki üç aralık.
 *
 * Vurgulanan satır kaydın kendi rating değerinden belirlenir; rozet de
 * aynı değerden geldiği için ikisi çelişemez. Aralık sınırları da yine
 * kayıttan okunur, bu yüzden metin ile rozet aynı sayıya dayanır.
 *
 * @param t çeviri arayan işlev (AdminDilServisi.t)
 */
export function vitalAraliklar(
  olcum: VitalOlcum,
  dil: AdminDil,
  t: (anahtar: string) => string
): EsikAraligi[] {
  const y = (sayi: number) => metrikDegeri(olcum.metric, sayi, dil);
  const alti = t('kaliteVeAlti');
  const ustu = t('kaliteUstu');
  return [
    {
      derece: 'good',
      etiket: t('kaliteIyi'),
      aralik: `${y(olcum.good)} ${alti}`,
      etkin: olcum.rating === 'good'
    },
    {
      derece: 'needs-improvement',
      etiket: t('kaliteGelistirilmeli'),
      aralik: `${y(olcum.good)} – ${y(olcum.poor)}`,
      etkin: olcum.rating === 'needs-improvement'
    },
    {
      derece: 'poor',
      etiket: t('kaliteZayif'),
      aralik: `${y(olcum.poor)} ${ustu}`,
      etkin: olcum.rating === 'poor'
    }
  ];
}
