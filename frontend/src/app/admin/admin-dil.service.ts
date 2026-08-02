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
// ---- E-Posta bölümü ----
  epostaKurumsal: { tr: 'Kurumsal İletişim', en: 'Institutional Communication' },
  epostaAyarBaslik: { tr: 'E-posta gönderim ayarları', en: 'E-mail delivery settings' },
  epostaAyarTanitim: {
    tr: 'Parola yenileme gibi otomatik iletiler bu sunucu üzerinden gönderilir. Yapılandırma tamamlanmadan gönderim açılamaz.',
    en: 'Automated messages such as password renewal are sent through this server. Delivery cannot be enabled until the configuration is complete.' },
  epostaYenile: { tr: 'Yenile', en: 'Refresh' },
  epostaKapali: { tr: 'Gönderim şu anda yapılamıyor —', en: 'Delivery is currently unavailable —' },
  epostaAcik: { tr: 'Gönderim açık. İletiler şu adresten gönderilecektir:', en: 'Delivery is enabled. Messages will be sent from:' },
  epostaSunucu: { tr: 'Sunucu adresi', en: 'Server address' },
  epostaSunucuOrnek: { tr: 'örn. smtp.hacettepe.edu.tr', en: 'e.g. smtp.hacettepe.edu.tr' },
  epostaAdresOrnek: { tr: 'örn. bidb@hacettepe.edu.tr', en: 'e.g. bidb@hacettepe.edu.tr' },
  epostaAdOrnek: {
    tr: 'örn. Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı',
    en: 'e.g. Hacettepe University Department of Information Technologies' },
  epostaKapi: { tr: 'Kapı', en: 'Port' },
  epostaKullanici: { tr: 'Kullanıcı adı', en: 'Username' },
  epostaGuvenlik: { tr: 'Güvenlik', en: 'Security' },
  epostaGuvenlikOnerilen: { tr: 'STARTTLS (önerilen)', en: 'STARTTLS (recommended)' },
  epostaGuvenlikSifresiz: { tr: 'Şifresiz', en: 'Unencrypted' },
  epostaGonderenAdres: { tr: 'Gönderen adresi', en: 'Sender address' },
  epostaGonderenAd: { tr: 'Gönderen adı', en: 'Sender name' },
  epostaSifresizUyari: {
    tr: 'Şifresiz bağlantıda kullanıcı adı ve parola ağ üzerinde açık gider. Yalnızca kurum içi güvenilir bir aktarıcı için seçiniz.',
    en: 'Over an unencrypted connection the username and password travel in clear text. Select this only for a trusted internal relay.' },
  epostaParolaNot1: { tr: 'Sunucu parolası güvenlik gereği panelde tutulmaz; sunucudaki', en: 'For security reasons the server password is not held in the panel; it is read from the' },
  epostaParolaNot2: { tr: 'ortam değişkeninden okunur. Durum:', en: 'environment variable on the server. Status:' },
  epostaTanimli: { tr: 'tanımlı', en: 'defined' },
  epostaTanimliDegil: { tr: 'tanımlı değil', en: 'not defined' },
  epostaGonderimAcik: { tr: 'Gönderim açık', en: 'Delivery enabled' },
  epostaKaydet: { tr: 'Kaydet', en: 'Save' },
  epostaSinamaGonder: { tr: 'Sınama iletisi gönder', en: 'Send test message' },
  epostaSinamaKapali: { tr: 'Sınama iletisi ancak gönderim açıkken gönderilebilir.', en: 'A test message can only be sent while delivery is enabled.' },
  epostaSinamaNot: { tr: 'Sınama iletisi yalnızca gönderen adresine yollanır.', en: 'The test message is sent only to the sender address.' },
  epostaSonGuncelleme: { tr: 'Son güncelleme:', en: 'Last updated:' },

  epostaHesapBaslik: { tr: 'Parola yenileme adresi', en: 'Password renewal address' },
  epostaHesapTanitim: {
    tr: 'Yönetim paneli parolası unutulduğunda yenileme yönergesi bu adrese gönderilir. Adres tanımlı değilse yenileme akışı çalışmaz.',
    en: 'If the admin panel password is forgotten, the renewal instructions are sent to this address. Without an address the renewal process cannot run.' },
  epostaHesapUyari: {
    tr: 'Adres tanımlı değil. Parola unutulursa yenileme yapılamaz; kurtarma yalnızca sunucuya erişimi olan bir işletmen tarafından yapılabilir.',
    en: 'No address is defined. If the password is forgotten it cannot be renewed; recovery would require an operator with server access.' },
  epostaBildirimAdresi: { tr: 'Bildirim adresi', en: 'Notification address' },
  epostaParolaDegismez: {
    tr: 'Parola bu ekrandan değiştirilemez. Bu bilinçlidir: açık bir oturumu ele geçiren birinin tek istekle parolayı değiştirip hesabı kalıcı olarak devralması engellenir. Parola yalnızca e-posta ile doğrulanan yenileme akışından değişir.',
    en: 'The password cannot be changed from this screen. This is deliberate: it prevents anyone who takes over an open session from changing the password in a single request and permanently seizing the account. The password changes only through the e-mail verified renewal process.' },
  epostaSonParolaDegisikligi: { tr: 'Son değişiklik:', en: 'Last changed:' },
  epostaAdresKaydet: { tr: 'Adresi kaydet', en: 'Save address' },

  epostaGunlukBaslik: { tr: 'Gönderim günlüğü', en: 'Delivery log' },
  epostaGunlukTanitim: {
    tr: 'Gönderilen ve gönderilemeyen iletilerin kaydı. İleti gövdesi güvenlik gereği saklanmaz: parola yenileme iletileri tek kullanımlık bağlantı taşır.',
    en: 'A record of messages sent and not sent. Message bodies are not stored for security reasons: password renewal messages carry a single-use link.' },
  epostaKayit: { tr: 'kayıt', en: 'records' },
  epostaZaman: { tr: 'Zaman', en: 'Time' },
  epostaAlici: { tr: 'Alıcı', en: 'Recipient' },
  epostaKonu: { tr: 'Konu', en: 'Subject' },
  epostaAmac: { tr: 'Amaç', en: 'Purpose' },
  epostaDurum: { tr: 'Durum', en: 'Status' },
  epostaKayitYok: { tr: 'Kayıt yok', en: 'No records' },
  epostaKayitYokAciklama: { tr: 'Gönderilen ilk ileti burada görünecek.', en: 'The first message sent will appear here.' },
  epostaAmacParola: { tr: 'Parola yenileme', en: 'Password renewal' },
  epostaAmacTalep: { tr: 'Talep bildirimi', en: 'Request notification' },
  epostaAmacSinama: { tr: 'Sınama', en: 'Test' },
  epostaDurumGonderildi: { tr: 'Gönderildi', en: 'Sent' },
  epostaDurumBasarisiz: { tr: 'Başarısız', en: 'Failed' },
  epostaDurumGonderilmedi: { tr: 'Gönderilmedi', en: 'Not sent' },
  epostaAyarAlinamadi: { tr: 'E-posta ayarları alınamadı.', en: 'E-mail settings could not be retrieved.' },
  epostaGunlukAlinamadi: { tr: 'Gönderim günlüğü alınamadı.', en: 'The delivery log could not be retrieved.' },
  epostaHesapAlinamadi: { tr: 'Yönetici hesabı bilgisi alınamadı.', en: 'Administrator account details could not be retrieved.' },
  epostaAyarKaydedildi: { tr: 'Ayarlar kaydedildi.', en: 'Settings saved.' },
  epostaAyarKaydedilemedi: { tr: 'Ayarlar kaydedilemedi.', en: 'Settings could not be saved.' },
  epostaAdresKaydedildi: { tr: 'Bildirim adresi kaydedildi.', en: 'Notification address saved.' },
  epostaAdresKaldirildi: { tr: 'Bildirim adresi kaldırıldı.', en: 'Notification address removed.' },
  epostaAdresKaydedilemedi: { tr: 'Bildirim adresi kaydedilemedi. Adresin biçimini denetleyiniz.', en: 'The notification address could not be saved. Please check the address format.' },
  epostaSinamaGonderilemedi: { tr: 'Sınama iletisi gönderilemedi.', en: 'The test message could not be sent.' },

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
