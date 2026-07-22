-- Ana sayfa görsel alanı yenilenir.
--
-- Eski üç slayt aynı başlığı ("Bilgi İşlem Daire Başkanlığı") taşıyordu ve
-- açıklaması yoktu: ziyaretçiye hiçbir şey söylemiyor, yalnızca yer
-- kaplıyordu. Yeni altı slaytın her biri bir hizmet alanını tanıtıyor ve
-- ilgili sayfaya bağlanıyor — görsel alan böylece süs olmaktan çıkıp
-- gezinmenin parçası oluyor.
--
-- Metinler kurumun kendi sayfalarında yazılı bilgilerden türetildi
-- (Ağ Altyapısı, Kablosuz Erişim, PC Salonları, Genel Tanıtım, WEB
-- Servisleri, İletişim). Slogan kullanılmadı: her açıklama, bağlandığı
-- sayfada karşılığı olan somut bir hizmeti anlatıyor.
--
-- SIRALAMA: yeşil doku ile yapılı doku sırayla geliyor. Aynı türden iki
-- görsel arka arkaya gelirse geçiş fark edilmez, dizi tekdüzeleşir.
--
-- Görseller WebP'ye çevrildi. Özgün dosyalar toplam 13 MB'tı; ana sayfanın
-- ilk açılışında indirilecek boyut olarak kabul edilemezdi. İki genişlikte
-- üretildi (1920 ve 960); bileşen dar ekranda küçük olanı istiyor.

DELETE FROM slide WHERE language = 'tr';

INSERT INTO slide (language, title, subtitle, image_url, image_alt, link_url, sort_order, published) VALUES
('tr',
 'Ağ ve Sistem Altyapısı',
 'Beytepe ve Sıhhiye yerleşkeleri UlakNet üzerinden yüksek hızda internet hizmeti alır ve birbirine Metro Ethernet hattıyla bağlıdır.',
 '/images/slider/slide3-1920.webp',
 'Beytepe Yerleşkesinin ormanlık alan içindeki havadan görünümü',
 '/tr/network', 1, TRUE),

('tr',
 'Sıhhiye Bilgi İşlem Merkezi',
 'Sağlık bilimleri fakülteleri ve hastanelerin bulunduğu Sıhhiye Yerleşkesinde, Başkanlığımıza bağlı bir Bilgi İşlem Merkezi görev yapar.',
 '/images/slider/slide1-1920.webp',
 'Sıhhiye Yerleşkesindeki Hacettepe binası',
 '/tr/contact', 2, TRUE),

('tr',
 'Kablosuz Erişim',
 'Her iki yerleşkede açık alanlar ve yurtlar dâhil olmak üzere Eduroam ve Hacettepe kablosuz ağları hizmet vermektedir.',
 '/images/slider/slide4-1920.webp',
 'Beytepe Yerleşkesinde çimenlik alanda vakit geçiren öğrenciler',
 '/tr/wireless', 3, TRUE),

('tr',
 'Kurumsal Yazılım Hizmetleri',
 'Belge Yönetim Sistemi, Bireysel İşlemler ve İnsan Kaynakları Yönetim Sistemi Başkanlığımızca işletilir; birimlerin yazılım ihtiyaçları geliştirilir.',
 '/images/slider/slide2-1920.webp',
 'Beytepe Yerleşkesindeki cam cepheli bina',
 '/tr/overview', 4, TRUE),

-- Spor Şenliği sitesi Başkanlığımızca hazırlandı; Web Birimimizin görev
-- tanımında "öğrenci toplulukları ve organizasyonlara yönelik web sayfası
-- oluşturulması" zaten yazılı. Slayt bu hizmeti anlatıyor.
('tr',
 'Etkinlik ve Birim Web Siteleri',
 'Akademik ve idari birimler, öğrenci toplulukları ve üniversite etkinlikleri için web sayfaları hazırlanır ve teknik desteği verilir.',
 '/images/slider/spor-1920.webp',
 'Hacettepe Üniversitesi stadyumunda spor şenliği kupası ve spor malzemeleri',
 '/tr/web-services', 5, TRUE),

('tr',
 'Kullanıcı Desteği',
 'E-posta ve hesap işlemleri, lisanslı yazılım dağıtımı, elektronik imza ve teknik destek talepleri Çağrı Merkezimiz üzerinden karşılanır.',
 '/images/slider/slide5-1920.webp',
 'Beytepe Yerleşkesi giriş tabelası',
 '/tr/faq', 6, TRUE);
