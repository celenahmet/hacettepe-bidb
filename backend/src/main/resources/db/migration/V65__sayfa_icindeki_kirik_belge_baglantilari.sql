-- Kırık belge bağlantıları, sayfa içeriğinin kendisinde.
--
-- V62 ve V63 aynı iki belgenin adresini düzeltmişti, ama yalnızca "document"
-- tablosunda. Aynı adresler sayfa metinlerinin HTML'inde de geçiyor ve oraya
-- dokunulmamıştı. Sonuç: belge listesinden gidildiğinde dosya açılıyor, ama
-- SSS ve e-posta taşıma sayfalarındaki bağlantıya tıklayan ziyaretçi hata
-- sayfasına düşüyordu. Düzeltme iki saklama yerinden birine uygulanmış.
--
-- Metin değişmiyor; yalnızca bağlantıların işaret ettiği adres, dosyanın
-- sunucudaki gerçek adına eşitleniyor. Hedefler V62 ve V63 ile birebir aynı.

-- "E-posta İptal Formu" — dosya E-PostaIptalFormu.docx adıyla duruyor (V62).
UPDATE page
   SET content_html = replace(content_html,
         '/dosyalar/BGYS-F-12e-PostaiptalFormu.docx',
         '/dosyalar/E-PostaIptalFormu.docx')
 WHERE content_html LIKE '%/dosyalar/BGYS-F-12e-PostaiptalFormu.docx%';

-- "HÜ E-Posta Yönergesi" — aktarımda taşınmayan dosyanın güncel sürümü
-- (03.02.2023) belgeler klasörüne konmuştu (V63).
UPDATE page
   SET content_html = replace(content_html,
         '/dosyalar/epostayonergesi_300120.pdf',
         '/dosyalar/epostayonergesi_030223.pdf')
 WHERE content_html LIKE '%/dosyalar/epostayonergesi_300120.pdf%';

-- Eski sitenin taşıyıcı (carousel) kütüphanesinden kalan iki stil bağlantısı.
-- Ana sayfanın metnine gömülü duruyorlar; işaret ettikleri dosyalar bu sitede
-- yok ve sayfa kendi slider'ını kullanıyor. Tarayıcı bu etiketleri metinle
-- birlikte DOM'a aldığı için her ana sayfa açılışında iki başarısız istek
-- üretiliyordu. Görünen hiçbir şeye katkıları olmadığından kaldırılıyorlar.
UPDATE page
   SET content_html = replace(replace(content_html,
         '<link rel="stylesheet" href="/css/owl.carousel.min.css">', ''),
         '<link rel="stylesheet" href="/css/owl.theme.default.min.css">', '')
 WHERE content_html LIKE '%/css/owl.%';

-- Not: /sablon2017/css/style.css bağlantısı KASTEN düzeltilmedi. O sayfa,
-- birimlere şablonun style.css dosyasını nereden alacaklarını anlatıyor;
-- bağlantı metnin bir parçası. Dosyanın kendisi elde olmadığı için uydurma
-- bir hedef verilemez, karar kaynak dosyayı sağlayacak olana bırakılmıştır.
