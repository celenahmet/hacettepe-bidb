import { Injectable, signal } from '@angular/core';

export type AdminDil = 'tr' | 'en';

const ANAHTAR = 'bidb-yonetim-dil';

/**
 * Yönetim paneli arayüz dili (İngilizce desteği).
 *
 * Ziyaretçi sitesinin dilinden (URL'deki /tr, /en) BAĞIMSIZDIR — operatör
 * içerikle aynı dilde çalışmak zorunda değildir. Panel, üzerinde çalıştığı
 * verinin kendisini (sayfa/duyuru metinleri vb.) çevirmez; yalnızca panel
 * arayüzünün (düğme, etiket, başlık) dilini değiştirir.
 *
 * ngx-translate gibi bir kütüphane yerine küçük bir sözlük yeterli —
 * proje genelinde zaten aynı örüntü (dil ? 'X' : 'Y') kullanılıyor
 * (bkz. footer/header component'leri); burada tekrarı azaltmak için
 * tek bir sözlüğe toplandı.
 */
@Injectable({ providedIn: 'root' })
export class AdminDilServisi {
  readonly dil = signal<AdminDil>(this.kayitliDil());

  private kayitliDil(): AdminDil {
    if (typeof localStorage === 'undefined') return 'tr';
    return localStorage.getItem(ANAHTAR) === 'en' ? 'en' : 'tr';
  }

  degistir(yeni: AdminDil): void {
    this.dil.set(yeni);
    if (typeof localStorage !== 'undefined') localStorage.setItem(ANAHTAR, yeni);
  }

  /** Anahtar sözlükte yoksa anahtarın kendisini döner — eksik çeviri sessizce yutulmaz, görünür kalır. */
  t = (anahtar: string): string => {
    return SOZLUK[anahtar]?.[this.dil()] ?? anahtar;
  };
}

const SOZLUK: Record<string, { tr: string; en: string }> = {
  // ---- giriş ekranı ----
  girisKurum: { tr: 'Hacettepe Üniversitesi', en: 'Hacettepe University' },
  girisBaslik: { tr: 'Bilgi İşlem<br>Daire Başkanlığı', en: 'Information Technologies<br>Department' },
  kullaniciAdi: { tr: 'Kullanıcı adı', en: 'Username' },
  parola: { tr: 'Parola', en: 'Password' },
  girisYap: { tr: 'Giriş yap', en: 'Sign in' },
  girisYapiliyor: { tr: 'Giriş yapılıyor…', en: 'Signing in…' },

  // ---- sol menü bölümleri ----
  bolumAnalitik: { tr: 'Analitik', en: 'Analytics' },
  bolumKalite: { tr: 'SEO ve Performans', en: 'SEO and Performance' },
  bolumSayfalar: { tr: 'Sayfalar', en: 'Pages' },
  bolumDuyurular: { tr: 'Duyurular', en: 'Announcements' },
  bolumSlider: { tr: 'Slider', en: 'Slider' },
  bolumKisayollar: { tr: 'Kısayollar', en: 'Shortcuts' },
  bolumMenuler: { tr: 'Menüler', en: 'Menus' },
  bolumSosyal: { tr: 'Sosyal Medya', en: 'Social Media' },
  bolumIletisim: { tr: 'İletişim Bilgileri', en: 'Contact Information' },
  bolumTalepler: { tr: 'İletişim Talepleri', en: 'Contact Requests' },
  bolumEposta: { tr: 'E-Posta', en: 'E-mail' },
  parolamiUnuttum: { tr: 'Parolamı unuttum', en: 'Forgot my password' },
  bolumPersonel: { tr: 'Personel', en: 'Staff' },
  bolumGuvenlik: { tr: 'Güvenlik Kayıtları', en: 'Security Log' },
  bolumHakkinda: { tr: 'Yazılım Hakkında', en: 'About This System' },
  bolumIslemGunlugu: { tr: 'İşlem Günlüğü', en: 'Audit Log' },
  cikisYap: { tr: 'Çıkış', en: 'Sign out' },
  menuyuAc: { tr: 'Yönetim menüsünü aç', en: 'Open admin menu' },
  yonetimPaneli: { tr: 'Yönetim Paneli', en: 'Admin Panel' },

  // ---- ortak eylemler ----
  kaydet: { tr: 'Kaydet', en: 'Save' },
  sil: { tr: 'Sil', en: 'Delete' },
  duzenle: { tr: 'Düzenle', en: 'Edit' },
  yeniKayit: { tr: 'Yeni kayıt', en: 'New record' },
  iptal: { tr: 'İptal', en: 'Cancel' },
  yenile: { tr: 'Yenile', en: 'Refresh' },
  yayinla: { tr: 'Yayınla', en: 'Publish' },
  yayindanKaldir: { tr: 'Yayından kaldır', en: 'Unpublish' },
  ara: { tr: 'Ara…', en: 'Search…' },
  yukleniyor: { tr: 'Yükleniyor…', en: 'Loading…' },
  kayitYok: { tr: 'Kayıt yok', en: 'No records' },
};
