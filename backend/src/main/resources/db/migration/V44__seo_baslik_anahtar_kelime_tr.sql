-- Kapsamlı SEO çalışması, 2. adım: başlık ve anahtar kelime (TR öncelikli).
--
-- Admin panelindeki 'SEO geliştirme kuyruğu' aracı, seo_title boş
-- olduğunda ham sayfa başlığını (ör. "Arşiv", 5 karakter) denetliyor —
-- gerçekte Seo servisi bunu otomatik "{başlık} — {kurum adı}" kalıbına
-- genişletiyor, ama araç bunu bilmiyor ve "25-70 karakter dışında"
-- diye işaretliyor. Ayrıca 79 TR sayfasının seo_title'ı DOLU görünüyordu
-- ama hepsi salt jenerik kurum adıydı (Seo servisinin zaten "boş"
-- sayıp geçersiz kıldığı GENERIC_SOURCE_TITLES değeri) — gerçek bir
-- başlık değildi.
--
-- Bu migration, gerçek bir özel başlığı OLMAYAN (boş veya salt jenerik)
-- her TR sayfası için "{sayfa başlığı} — Hacettepe Üniversitesi BİDB"
-- kalıbında, 25-70 karakter aralığına oturan bir seo_title üretiyor;
-- çok uzun başlıklar kelime sınırında kırpılıyor. Aynı geçişte, boş olan
-- seo_keywords alanına sayfa başlığından türetilmiş anahtar kelimeler
-- ekleniyor. Zaten özel bir başlığı olan 16 sayfaya (e-imza rehberi vb.)
-- dokunulmadı.

UPDATE page SET seo_title = 'Erişilebilirlik Bildirimi — Hacettepe Üniversitesi BİDB', seo_keywords = 'Erişilebilirlik Bildirimi, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 22;
UPDATE page SET seo_title = 'Hacettepe Üniversitesi Mezun Hesabı — Hacettepe Üniversitesi BİDB', seo_keywords = 'Hacettepe Üniversitesi Mezun Hesabı, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 39;
UPDATE page SET seo_title = 'ANSYS Yazılımları Duyurusu — Hacettepe Üniversitesi BİDB', seo_keywords = 'ANSYS Yazılımları Duyurusu, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 2;
UPDATE page SET seo_title = 'Arşiv — Hacettepe Üniversitesi BİDB', seo_keywords = 'Arşiv, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 3;
UPDATE page SET seo_title = 'Hacettepe Üniversitesi İçerik Yönetim — Hacettepe Üniversitesi BİDB', seo_keywords = 'Hacettepe Üniversitesi İçerik Yönetim Sistemi, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 28;
UPDATE page SET seo_title = 'Kurul ve Komisyonlar — Hacettepe Üniversitesi BİDB', seo_keywords = 'Kurul Komisyonlar, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 36;
UPDATE page SET seo_title = 'HÜ Internet Bağlantısı Hakkında — Hacettepe Üniversitesi BİDB', seo_keywords = 'Internet Bağlantısı Hakkında, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 4;
UPDATE page SET seo_title = 'İletişim Bilgileri — Hacettepe Üniversitesi BİDB', seo_keywords = 'İletişim Bilgileri, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 33;
UPDATE page SET seo_title = 'Veritabanı Kontrol Sayfası — Hacettepe Üniversitesi BİDB', seo_keywords = 'Veritabanı Kontrol Sayfası, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 10;
UPDATE page SET seo_title = 'Sorumluluk Sınırı — Hacettepe Üniversitesi BİDB', seo_keywords = 'Sorumluluk Sınırı, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 52;
UPDATE page SET seo_title = 'Yararlı Dokümanlar ve Bağlantılar — Hacettepe Üniversitesi BİDB', seo_keywords = 'Yararlı Dokümanlar Bağlantılar, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 11;
UPDATE page SET seo_title = 'Bilgi ve Dokümanlar — Hacettepe Üniversitesi BİDB', seo_keywords = 'Bilgi Dokümanlar, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 6;
UPDATE page SET seo_title = 'HUNET - BEYTEPE Yurt Erişim Protokolü — Hacettepe Üniversitesi BİDB', seo_keywords = 'HUNET BEYTEPE Yurt Erişim Protokolü, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 30;
UPDATE page SET seo_title = 'Yurt ve Öğrenci Evleri için Kurallar — Hacettepe Üniversitesi BİDB', seo_keywords = 'Yurt Öğrenci Evleri Kurallar, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 42;
UPDATE page SET seo_keywords = 'Elektronik İmza Kullanma Rehberi, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 76;
UPDATE page SET seo_keywords = 'İmza Hakkında, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 77;
UPDATE page SET seo_keywords = 'Başvuru, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 79;
UPDATE page SET seo_keywords = 'Sertifika İptal, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 87;
UPDATE page SET seo_keywords = 'Sertifikamı Aldım Yapmalıyım?, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 81;
UPDATE page SET seo_keywords = 'İmza Sık Sorulan Sorular, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 91;
UPDATE page SET seo_keywords = 'Sertifika Bilgi Güncelleme, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 88;
UPDATE page SET seo_keywords = 'Java Ayarları, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 82;
UPDATE page SET seo_keywords = 'Mevzuat, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 78;
UPDATE page SET seo_keywords = 'Şifre İşlemleri, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 89;
UPDATE page SET seo_keywords = 'Masaüstü Yardım, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 83;
UPDATE page SET seo_keywords = 'Sertifika Yenileme, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 85;
UPDATE page SET seo_keywords = 'Güvenlik Sözcüğü, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 84;
UPDATE page SET seo_keywords = 'Birim İmza Sorumluları, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 90;
UPDATE page SET seo_keywords = 'Sertifika Güncelleme, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 86;
UPDATE page SET seo_keywords = 'Başvuru Akışı, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 80;
UPDATE page SET seo_title = 'E-posta İşlemleri — Hacettepe Üniversitesi BİDB', seo_keywords = 'posta İşlemleri, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 18;
UPDATE page SET seo_title = 'Yeni E-posta Açma — Hacettepe Üniversitesi BİDB', seo_keywords = 'Yeni posta Açma, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 20;
UPDATE page SET seo_title = 'Eski E-Posta Yedek Alma İşlemleri — Hacettepe Üniversitesi BİDB', seo_keywords = 'Eski Posta Yedek Alma İşlemleri Videolu, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 24;
UPDATE page SET seo_title = 'Hacettepe Üniversitesi Yeni E-posta — Hacettepe Üniversitesi BİDB', seo_keywords = 'Hacettepe Üniversitesi Yeni posta Hizmeti Microsoft, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 21;
UPDATE page SET seo_title = 'Dış Erişim Kuralları — Hacettepe Üniversitesi BİDB', seo_keywords = 'Dış Erişim Kuralları, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 23;
UPDATE page SET seo_title = 'Sık Sorulan Sorular — Hacettepe Üniversitesi BİDB', seo_keywords = 'Sık Sorulan Sorular, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 55;
UPDATE page SET seo_title = 'Formlar — Hacettepe Üniversitesi BİDB', seo_keywords = 'Formlar, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 25;
UPDATE page SET seo_title = 'Donanım — Hacettepe Üniversitesi BİDB', seo_keywords = 'Donanım, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 12;
UPDATE page SET seo_title = 'Haber ve Duyurular — Hacettepe Üniversitesi BİDB' WHERE id = 64;
UPDATE page SET seo_title = 'HUNET Kullanım İlkeleri — Hacettepe Üniversitesi BİDB', seo_keywords = 'HUNET Kullanım İlkeleri, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 29;
UPDATE page SET seo_title = 'Bilgi Güvenliği Yönetim Sistemi — Hacettepe Üniversitesi BİDB', seo_keywords = 'Bilgi Güvenliği Yönetim Sistemi, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 5;
UPDATE page SET seo_title = 'Bilgisayar Kazaları için Önlemler — Hacettepe Üniversitesi BİDB', seo_keywords = 'Bilgisayar Kazaları Önlemler, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 9;
UPDATE page SET seo_title = 'PC Salonlarının Kullanım Kuralları — Hacettepe Üniversitesi BİDB', seo_keywords = 'Salonlarının Kullanım Kuralları, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 45;
UPDATE page SET seo_title = 'E-Posta Tarama Politikaları — Hacettepe Üniversitesi BİDB', seo_keywords = 'Posta Tarama Politikaları, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 57;
UPDATE page SET seo_title = 'E-Posta Listeleri Kullanım Kuralları — Hacettepe Üniversitesi BİDB', seo_keywords = 'Posta Listeleri Kullanım Kuralları, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 47;
UPDATE page SET seo_title = 'Öğrencilerimiz için MATLAB Yazılımı — Hacettepe Üniversitesi BİDB', seo_keywords = 'Öğrencilerimiz MATLAB Yazılımı, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 38;
UPDATE page SET seo_title = 'Misyon ve Vizyon — Hacettepe Üniversitesi BİDB', seo_keywords = 'Misyon Vizyon, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 40;
UPDATE page SET seo_title = 'Ağ Altyapısı — Hacettepe Üniversitesi BİDB', seo_keywords = 'Ağ Altyapısı, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 1;
UPDATE page SET seo_title = 'Duyurular — Hacettepe Üniversitesi BİDB', seo_keywords = 'Duyurular, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 16;
UPDATE page SET seo_title = 'Hata!.. — Hacettepe Üniversitesi BİDB', seo_keywords = 'Hata!.., Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 19;
UPDATE page SET seo_title = 'Kampüs İçerisinden Ulaşılabilen — Hacettepe Üniversitesi BİDB', seo_keywords = 'Kampüs İçerisinden Ulaşılabilen Uygulamalar, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 13;
UPDATE page SET seo_title = 'Güvenli E-Posta Bilgilendirme Metni — Hacettepe Üniversitesi BİDB', seo_keywords = 'Güvenli Posta Bilgilendirme Metni, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 14;
UPDATE page SET seo_title = 'Hata!.. — Hacettepe Üniversitesi BİDB', seo_keywords = 'Hata!.., Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 37;
UPDATE page SET seo_title = 'SÖZLEŞMELİ BİLİŞİM PERSONELİ SINAV — Hacettepe Üniversitesi BİDB', seo_keywords = 'SÖZLEŞMELİ BİLİŞİM PERSONELİ SINAV DUYURUSU, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 32;
UPDATE page SET seo_title = 'İŞKUR Gençlik Programı, İş Sağlığı ve — Hacettepe Üniversitesi BİDB', seo_keywords = 'İŞKUR Gençlik Programı Sağlığı Güvenliği Eğitimi, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 15;
UPDATE page SET seo_title = 'SÖZLEŞMELİ BİLİŞİM PERSONELİ SINAV — Hacettepe Üniversitesi BİDB', seo_keywords = 'SÖZLEŞMELİ BİLİŞİM PERSONELİ SINAV DUYURUSU, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 31;
UPDATE page SET seo_title = 'Office 365 — Hacettepe Üniversitesi BİDB', seo_keywords = 'Office 365, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 41;
UPDATE page SET seo_title = 'Organizasyon Şeması — Hacettepe Üniversitesi BİDB', seo_keywords = 'Organizasyon Şeması, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 63;
UPDATE page SET seo_title = 'Genel Tanıtım — Hacettepe Üniversitesi BİDB', seo_keywords = 'Genel Tanıtım, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 26;
UPDATE page SET seo_title = 'Hata!.. — Hacettepe Üniversitesi BİDB', seo_keywords = 'Hata!.., Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 44;
UPDATE page SET seo_title = 'Kişisel Web Sayfaları için Web Servisi — Hacettepe Üniversitesi BİDB', seo_keywords = 'Kişisel Web Sayfaları Servisi, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 35;
UPDATE page SET seo_title = 'Proxy Ayarları — Hacettepe Üniversitesi BİDB', seo_keywords = 'Proxy Ayarları, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 48;
UPDATE page SET seo_title = 'Proxy-Spam Kontrol — Hacettepe Üniversitesi BİDB', seo_keywords = 'Proxy Spam Kontrol, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 49;
UPDATE page SET seo_title = 'SAS (Statistical Analysis Software) — Hacettepe Üniversitesi BİDB', seo_keywords = 'SAS Statistical Analysis Software Yazılım Duyurusu, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 50;
UPDATE page SET seo_title = 'Virüsler ve Güvenlik Önerileri — Hacettepe Üniversitesi BİDB', seo_keywords = 'Virüsler Güvenlik Önerileri, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 27;
UPDATE page SET seo_title = 'Bilgi Güvenliği Politikası — Hacettepe Üniversitesi BİDB', seo_keywords = 'Bilgi Güvenliği Politikası, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 7;
UPDATE page SET seo_title = 'Birimler Web Sayfaları için Web Servisi — Hacettepe Üniversitesi BİDB', seo_keywords = 'Birimler Web Sayfaları Servisi, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 51;
UPDATE page SET seo_title = 'Lisanslı Yazılım Sunucusu — Hacettepe Üniversitesi BİDB', seo_keywords = 'Lisanslı Yazılım Sunucusu, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 62;
UPDATE page SET seo_title = 'SPAM ve PHISHING Hakkında — Hacettepe Üniversitesi BİDB', seo_keywords = 'SPAM PHISHING Hakkında, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 53;
UPDATE page SET seo_title = 'Öğrencilerimiz için IBM SPSS yazılımları — Hacettepe Üniversitesi BİDB', seo_keywords = 'Öğrencilerimiz IBM SPSS yazılımları, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 54;
UPDATE page SET seo_title = 'Personel — Hacettepe Üniversitesi BİDB', seo_keywords = 'Personel, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 46;
UPDATE page SET seo_title = 'Hacettepe Üniversitesi Akademik Ağı — Hacettepe Üniversitesi BİDB', seo_keywords = 'Hacettepe Üniversitesi Akademik Ağı HUNET Hakkında, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 8;
UPDATE page SET seo_title = '50. yıl logolarının web sayfasından — Hacettepe Üniversitesi BİDB', seo_keywords = 'yıl logolarının web sayfasından kaldırılması hakkında, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 56;
UPDATE page SET seo_title = 'Bilgisayar Virüslerinden Ve — Hacettepe Üniversitesi BİDB', seo_keywords = 'Bilgisayar Virüslerinden Saldırılardan Korunma Önerileri, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 58;
UPDATE page SET seo_title = 'VPN sistemi ile ilgili Bilgilendirme ve — Hacettepe Üniversitesi BİDB', seo_keywords = 'VPN sistemi ilgili Bilgilendirme Bağlantı Kılavuzları, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 59;
UPDATE page SET seo_title = 'WEB Sayfası Yayım İlkeleri — Hacettepe Üniversitesi BİDB', seo_keywords = 'WEB Sayfası Yayım İlkeleri, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 61;
UPDATE page SET seo_title = 'WEB Servisleri — Hacettepe Üniversitesi BİDB', seo_keywords = 'WEB Servisleri, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 60;
UPDATE page SET seo_title = 'E-posta — Hacettepe Üniversitesi BİDB', seo_keywords = 'E-posta, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 17;
UPDATE page SET seo_title = 'Kablosuz Erişim Servisleri — Hacettepe Üniversitesi BİDB', seo_keywords = 'Kablosuz Erişim Servisleri, Hacettepe Üniversitesi, Bilgi İşlem Daire Başkanlığı' WHERE id = 34;
