-- Türkçe ana sayfanın başlığı bir alt bölümün adını taşıyordu.
--
-- BULGU
-- tr/home kaydı aktarımda şu değerleri almış:
--     title      = 'Haber ve Duyurular'
--     seo_title  = 'Haber ve Duyurular — Hacettepe Üniversitesi BİDB'
--
-- Oysa kaynak sitenin ana sayfa başlığı bu değil:
--     https://bidb.hacettepe.edu.tr/tr/  ->  "Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı"
--
-- Değer büyük olasılıkla taramada ana sayfadaki haber bölümünün başlığından
-- alınmış. Sonucu üç ayrı kusur:
--
--   1. Sitenin EN ÖNEMLİ sayfası, bir alt bölümün adıyla arama sonuçlarına
--      çıkıyor; kurum adı başlıkta hiç geçmiyor.
--   2. /tr ile /tr/news AYNI başlığı taşıyor. İki sayfa aynı sorgu için
--      birbiriyle yarışıyor.
--   3. İngilizce karşılığı doğru (title='Overview'), yani iki dil
--      birbirini tutmuyor.
--
-- Kusur yeni değil; başlık soneki kısaltılana kadar iki sayfa yalnızca
-- sonekle ayrıştığı için çakışma görünmüyordu.
--
-- DÜZELTME
-- İngilizce kaydın yapısı birebir örnek alınır:
--
--     en:  title='Overview'      seo_title='Hacettepe University Department of Information Technology'
--     tr:  title='Genel Bakış'   seo_title='Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı'
--
-- seo_title kaynağın ana sayfa başlığıyla BİREBİR aynı yazılır. Bu değer
-- Seo servisindeki GENERIC_SOURCE_TITLES listesinde olduğu için "genel"
-- sayılır ve başlık `title — kısa kurum adı` biçiminde üretilir:
--
--     "Genel Bakış — Hacettepe Üniversitesi BİDB"   (41 karakter)
--
-- İçerik değişmiyor: ana sayfada page.title HİÇBİR YERDE gösterilmiyor
-- (ekrandaki h1 ayrı ve "Bilgi İşlem Daire Başkanlığı" yazıyor), bu alan
-- yalnızca meta veri olarak kullanılıyor. Denetlendi.

UPDATE page
   SET title     = 'Genel Bakış',
       seo_title = 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı'
 WHERE slug = 'home'
   AND language = 'tr';
