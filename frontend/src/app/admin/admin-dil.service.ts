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

  // ---- SEO ve Performans ----
  kaliteGercekOlcum: { tr: 'Gerçek kullanıcı ölçümleri', en: 'Real user measurements' },
  kaliteSeoKuyruk: { tr: 'SEO geliştirme kuyruğu', en: 'SEO improvement queue' },
  kaliteOrnek: { tr: 'örnek', en: 'samples' },
  kaliteGun: { tr: 'gün', en: 'days' },
  kaliteAyrintiIpucu: { tr: 'Ayrıntılar için tıklayın', en: 'Click for details' },
  kaliteYuzdelik: { tr: '75. yüzdelik', en: '75th percentile' },
  kaliteIyi: { tr: 'İyi', en: 'Good' },
  kaliteGelistirilmeli: { tr: 'İyileştirilmeli', en: 'Needs improvement' },
  kaliteZayif: { tr: 'Zayıf', en: 'Poor' },

  /* Ölçüm ayrıntı penceresi. Bu metinler şablona sabit Türkçe yazılmıştı;
     pencere yalnızca karta tıklanınca açıldığı için panel dil denetimi
     onu hiç görmemiş ve panel "temiz" raporlanmıştı. */
  kaliteTeknikTanim: { tr: 'Teknik tanım', en: 'Technical definition' },
  kaliteSadeDille: { tr: 'Sade dille', en: 'In plain language' },
  kaliteOptimum: { tr: 'Optimum beklenti', en: 'Expected range' },
  kaliteVeAlti: { tr: 've altı', en: 'or below' },
  kaliteUstu: { tr: 'üstü', en: 'and above' },
  kaliteHedef: { tr: 'Hedef', en: 'Target' },
  kaliteHedefAciklama: {
    tr: 'Ölçüt, ziyaretlerin en yavaş dörtte biri hariç tutulduğunda '
      + "(%75'lik dilim) bu sınırın altında kalınmasıdır — tek tek yavaş "
      + 'açılışlar değil, kullanıcıların çoğunluğunun gördüğü süre '
      + 'değerlendirilir.',
    en: 'The criterion is staying below this limit once the slowest quarter '
      + 'of visits is excluded (75th percentile) — what most users experience '
      + 'is assessed, not individual slow loads.'
  },
  kaliteOlcumAyrinti: { tr: 'ölçüm ayrıntısı', en: 'measurement detail' },
  kaliteKapat: { tr: 'Kapat', en: 'Close' },

  // ---- panel genelinde tekrar eden metinler ----
  ortakDuzenle: { tr: 'Düzenle', en: 'Edit' },
  ortakSil: { tr: 'Sil', en: 'Delete' },
  ortakSira: { tr: 'Sıra', en: 'Order' },
  ortakBaslik: { tr: 'Başlık', en: 'Title' },
  ortakGorsel: { tr: 'Görsel', en: 'Image' },
  ortakTur: { tr: 'Tür', en: 'Type' },
  ortakDeger: { tr: 'Değer', en: 'Value' },
  ortakAg: { tr: 'Ağ', en: 'Network' },
  ortakKullanici: { tr: 'Kullanıcı', en: 'User' },
  ortakIslem: { tr: 'İşlem', en: 'Action' },
  ortakZaman: { tr: 'Zaman', en: 'Time' },
  ortakDurum: { tr: 'Durum', en: 'Status' },
  ortakYeniKisayol: { tr: 'Yeni kısayol', en: 'New shortcut' },
  ortakYeniKayit: { tr: 'Yeni kayıt', en: 'New record' },
  ortakYeniMenuBolumu: { tr: 'Yeni menü bölümü', en: 'New menu section' },
  ortakBaglantiEkle: { tr: 'Bağlantı ekle', en: 'Add link' },
  ortakBolumuDuzenle: { tr: 'Bölümü düzenle', en: 'Edit section' },
  ortakBolumuSil: { tr: 'Bölümü sil', en: 'Delete section' },
  ortakKisiEkle: { tr: 'Kişi ekle', en: 'Add person' },
  ortakBirimiDuzenle: { tr: 'Birimi düzenle', en: 'Edit unit' },
  ortakBirimiSil: { tr: 'Birimi sil', en: 'Delete unit' },
  iletisimTanitim: {
    tr: 'Alt bilgide görünen kurum bilgileri. Her telefon ve e-posta ayrı bir kayıttır; sıra numarası görüntüleme sırasını belirler.',
    en: 'Institutional details shown in the footer. Each telephone number and e-mail address is a separate record; the order number determines the display sequence.' },
  personelTanitim: {
    tr: 'Personel sayfası bu kayıtlardan üretilir. Buradaki her değişiklik kaydedildiği anda sitede görünür.',
    en: 'The staff page is generated from these records. Every change here appears on the site as soon as it is saved.' },

  // ---- güvenlik denetimi bölümleri ----
  gunlukGuvenlikDenetimi: { tr: 'Güvenlik Denetimi', en: 'Security Audit' },
  gunlukIslemBaslik: { tr: 'İşlem günlüğü', en: 'Audit log' },
  gunlukIslemTanitim: {
    tr: 'Panelde yapılan her oluşturma/güncelleme/silme işlemi — oturum, kullanıcı adı, genel ve yerel IPv4 ile.',
    en: 'Every create, update and delete performed in the panel — with session, username, public and local IPv4.' },
  gunlukFiltreEtiket: { tr: 'Kayıtlarda filtrele', en: 'Filter records' },
  gunlukFiltreYerTutucu: { tr: 'Filtrele: işlem, kullanıcı, oturum, yol…', en: 'Filter: action, user, session, path…' },
  gunlukOturum: { tr: 'Oturum', en: 'Session' },
  gunlukKaynak: { tr: 'Kaynak', en: 'Resource' },
  gunlukKayitYok: { tr: 'Kayıt yok', en: 'No records' },
  gunlukKayitYokAciklama: {
    tr: 'Panelde yapılan bir sonraki değişiklik işlemi burada görünecek.',
    en: 'The next change made in the panel will appear here.' },
  gunlukYukleniyor: { tr: 'Kayıtlar yükleniyor…', en: 'Loading records…' },
  gunlukYenile: { tr: 'Yenile', en: 'Refresh' },
  girisKayitBaslik: { tr: 'Giriş kayıtları', en: 'Sign-in records' },
  girisKayitTanitim: {
    tr: 'Yönetim paneline yapılan son 200 giriş denemesi — cihaz, tarayıcı ve konum bilgisiyle.',
    en: 'The last 200 sign-in attempts to the admin panel — with device, browser and location details.' },
  girisKayitKullaniciAdi: { tr: 'Kullanıcı adı', en: 'Username' },
  girisKayitTarayici: { tr: 'Tarayıcı / İşletim sistemi', en: 'Browser / Operating system' },

  // ---- analitik ----
  anaAylikTrafik: { tr: 'Aylık trafik', en: 'Monthly traffic' },
  anaErisimBicimi: { tr: 'Erişim biçimi', en: 'Access type' },
  anaTrafikKaynagi: { tr: 'Trafik kaynağı', en: 'Traffic source' },
  anaSayfaRapor: { tr: 'Sayfa bazlı rapor', en: 'Report by page' },
  anaGecenAy: { tr: 'Geçen ay', en: 'Last month' },
  anaDegisim: { tr: 'Değişim', en: 'Change' },
  anaEgilim: { tr: '12 Aylık Eğilim', en: '12-Month Trend' },
  anaIcerikPerformansi: { tr: 'İçerik Performansı', en: 'Content Performance' },

  // ---- kalite / sayfalar ----
  kaliteGelistirmeAlanlari: { tr: 'Geliştirme alanları', en: 'Areas for improvement' },
  kaliteYuzdelikNot: {
    tr: '75. yüzdelik değerler; ortalama değer kullanıcı deneyimini gizlemez.',
    en: '75th percentile values; an average value does not conceal the user experience.' },
  kaliteEnDusukOnce: { tr: 'En düşük puanlı kayıtlar önce gösterilir.', en: 'Lowest scoring records are shown first.' },
  sayfaIcerik: { tr: 'İçerik', en: 'Content' },
  sayfaYayinda: { tr: 'Yayında', en: 'Published' },
  sayfaDuzenleNot: {
    tr: '"Düzenle" ile sayfanın metnini, adresini ve belgelerini yönetebilirsiniz.',
    en: 'Use "Edit" to manage the page text, address and documents.' },

  // ---- duyurular ----
  duyuruYeniOlustur: { tr: 'Yeni duyuru oluştur', en: 'Create announcement' },
  duyuruFotoSablon: { tr: 'Fotoğraf veya kurumsal şablon', en: 'Photograph or institutional template' },
  duyuruYalnizcaBelge: { tr: 'Yalnızca belge ile yayımla', en: 'Publish as document only' },
  duyuruYalnizcaBelgeNot: {
    tr: 'Kart tıklandığında ayrı bir haber sayfası yerine doğrudan belge açılır.',
    en: 'Clicking the card opens the document directly instead of a separate news page.' },
  duyuruKurumsal: { tr: 'Kurumsal', en: 'Institutional' },
  duyuruKurumsalNot: { tr: 'Lacivert ve kırmızı, resmî genel duyurular', en: 'Navy and red; official general announcements' },
  duyuruHizmetSinyali: { tr: 'Hizmet Sinyali', en: 'Service Signal' },
  duyuruHizmetSinyaliNot: { tr: 'Kesinti ve anlık hizmet durumları', en: 'Outages and live service status' },
  duyuruTeknoloji: { tr: 'Teknoloji', en: 'Technology' },
  duyuruTeknolojiNot: { tr: 'Yazılım, lisans ve dijital hizmetler', en: 'Software, licences and digital services' },
  duyuruGuvenlik: { tr: 'Güvenlik', en: 'Security' },
  duyuruGuvenlikNot: { tr: 'Siber güvenlik ve kritik uyarılar', en: 'Cyber security and critical alerts' },
  duyuruTeknikBakim: { tr: 'Teknik Bakım', en: 'Technical Maintenance' },
  duyuruTeknikBakimNot: { tr: 'Planlı bakım ve altyapı çalışmaları', en: 'Planned maintenance and infrastructure work' },

  // ---- iletişim talepleri ----
  talepBaslik: { tr: 'İletişim talepleri', en: 'Contact requests' },
  talepMerkezi: { tr: 'Merkezi Talep Kaydı', en: 'Central Request Register' },
  talepTanitim: {
    tr: 'Web formundan iletilen talepleri sınıflandırın, sorumlu atayın ve durumlarını izleyin.',
    en: 'Classify requests submitted through the web form, assign an owner and track their status.' },
  talepDurumFiltre: { tr: 'Duruma göre filtrele', en: 'Filter by status' },
  talepAramaYerTutucu: { tr: 'Takip no, konu veya başvuru sahibi ara…', en: 'Search reference, subject or requester…' },

  // ---- yazılım hakkında ----
  hakkindaNedir: { tr: 'Bu yönetim paneli nedir?', en: 'What is this admin panel?' },
  hakkindaDinamiklik: { tr: 'Menülerin ve içeriğin dinamikliği', en: 'How menus and content stay dynamic' },
  hakkindaGelistirmeNotu: { tr: 'Geliştirme notu', en: 'Development note' },

  anaTanitim: {
    tr: 'Toplam görüntüleme, aylık karşılaştırma ve son ziyaret tek raporda.',
    en: 'Total views, monthly comparison and the latest visit in a single report.' },
  duyuruBelgeNot: {
    tr: 'Kart tıklandığında ayrı bir haber sayfası yerine doğrudan yüklenen belge açılır.',
    en: 'Clicking the card opens the uploaded document directly instead of a separate news page.' },
  duyuruOnizle: { tr: 'Önizle', en: 'Preview' },
  duyuruYeniPencere: { tr: 'Yeni pencerede önizle', en: 'Preview in a new window' },
  duyuruBaslikOrnek: { tr: 'Örn. Planlı sistem çalışması', en: 'e.g. Scheduled system maintenance' },
  duyuruAdresOrnek: { tr: 'örn. yeni-eposta-sistemi', en: 'e.g. new-email-system' },
  duyuruKapakTasarimi: { tr: 'Kapak Tasarımı', en: 'Cover Design' },

  sayfaDuzenleTanitim: {
    tr: '"Düzenle" ile sayfanın metnini, adresini ve belgelerini yönetebilir, sürüm geçmişinden eski bir hâle dönebilirsiniz.',
    en: 'Use "Edit" to manage the page text, address and documents, and to restore an earlier version from the revision history.' },
  girisKayitCihaz: { tr: '— cihaz, tarayıcı, IP ve tahmini konum ile.', en: '— with device, browser, IP and approximate location.' },
  talepDurumYeni: { tr: 'Yeni', en: 'New' },
  talepDurumIslemde: { tr: 'İşlemde', en: 'In progress' },
  talepDurumBekliyor: { tr: 'Yanıt bekliyor', en: 'Awaiting reply' },
  talepDurumCozuldu: { tr: 'Çözüldü', en: 'Resolved' },
  talepDurumKapatildi: { tr: 'Kapatıldı', en: 'Closed' },
  talepOncelikNormal: { tr: 'Normal', en: 'Normal' },
  talepOncelikYuksek: { tr: 'Yüksek', en: 'High' },
  talepOncelikAcil: { tr: 'Acil', en: 'Urgent' },

  talepKatGenel: { tr: 'Genel bilgi', en: 'General information' },
  talepKatTeknik: { tr: 'Teknik destek', en: 'Technical support' },
  talepKatEposta: { tr: 'E-posta', en: 'E-mail' },
  talepKatAg: { tr: 'Ağ ve internet', en: 'Network and internet' },
  talepKatYazilim: { tr: 'Yazılım ve lisans', en: 'Software and licensing' },
  talepKatEimza: { tr: 'E-imza', en: 'E-signature' },
  talepKatGuvenlik: { tr: 'Bilgi güvenliği', en: 'Information security' },
  talepKatWeb: { tr: 'Web hizmetleri', en: 'Web services' },
  talepKatOneri: { tr: 'Görüş ve öneri', en: 'Feedback and suggestions' },

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
