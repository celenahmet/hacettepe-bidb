-- Ana sayfadaki "Servisler ve Uygulamalar" bölümü kaynaktaki ilk hâline döndü.
--
-- Aktarımda bu bölüm kaynaktan ayrılmıştı. Kaynağın anlık görüntüsü
-- content/_anasayfa-bilesenler.json dosyasında duruyor ve orada TR için tam
-- YEDİ servis var. Bizde SEKİZ kayıt vardı. Üç fark:
--
--   1. Fazladan "E-Posta" kartı. Kaynakta böyle bir servis kartı yok; bu ad
--      kaynakta hızlı erişim bölümünde geçiyor ("E-Posta İşlemleri"), servis
--      karuselinde değil. Kartın görseli de yoktu, bu yüzden diğer yedisi
--      çizimliyken bu kart boş lacivert bir kutu olarak duruyordu — bölümdeki
--      tek göze batan kart oydu.
--
--   2. Kaynakta servisin adı "Portal", bizde "Hacettepe Portal" olmuş.
--
--   3. Sıra değişmiş: kaynakta Portal EN SONDA, bizde en başa alınmıştı.
--
-- Kaynak sitenin BUGÜNKÜ ana sayfasında bu bölüm artık hiç yok (site sonradan
-- değişmiş). Bu yüzden "ilk hâl" ölçütü canlı site değil, aktarım sırasında
-- alınan anlık görüntüdür.
--
-- Görsellere dokunulmuyor: yedi kaydın icon_url değerleri kaynaktakiyle zaten
-- birebir aynı ve yedi dosyanın hepsi sitede mevcut (hizmet1.png, hizmet2.png,
-- hizmet_mezunbilgi.jpg, servis_gsf.png, servis_akademik.png,
-- servis_sticker.png, servis_portal.png).
--
-- Adreslere de dokunulmuyor: "Web Servisleri" kaynakta /tr/webser adresini
-- gösteriyor, bizde bu sayfanın karşılığı /tr/web-services. Kaynağın ham
-- adresini yazmak bağlantıyı kendi sitemizden dışarı çıkarırdı.
--
-- E-Posta kartının kaldırılması sayfayı erişilemez yapmıyor: /tr/email hem
-- hızlı erişim kutusundan ("E-Posta İşlemleri") hem de sol menüden
-- erişilebiliyor. Denetlendi.
--
-- İngilizce taraf: kaynağın İngilizce ana sayfası taslak hâlde — anlık
-- görüntüde slider dışında hiçbir bölüm yok (hızlı erişim 0, duyuru 0,
-- servis 0). Yani "İngilizcede servis yok" bir kurum kararı değil, o sayfanın
-- hiç kurulmamış olması. Bu yüzden İngilizce bölüm silinmiyor; yalnızca
-- Türkçeyle aynı yapıya getiriliyor ki iki dil birbirini tutsun.

-- 1) Kaynakta karşılığı olmayan kart kaldırılır
DELETE FROM shortcut
 WHERE type = 'service'
   AND url IN ('/tr/email', '/en/email');

-- 2) Kaynaktaki ad geri gelir
UPDATE shortcut
   SET name = 'Portal'
 WHERE type = 'service'
   AND name = 'Hacettepe Portal';

-- 3) Kaynaktaki sıra geri gelir.
--    Sıralama ada göre değil ADRESE göre yapılır: adres iki dilde de aynı
--    (ya da aynı sayfanın dil karşılığı), ad ise çevrilmiş durumda.
UPDATE shortcut SET sort_order = 0
 WHERE type = 'service' AND url IN ('/tr/web-services', '/en/web-services');

UPDATE shortcut SET sort_order = 1
 WHERE type = 'service' AND url = 'http://hu-iys.hacettepe.edu.tr/';

UPDATE shortcut SET sort_order = 2
 WHERE type = 'service' AND url = 'http://egitimmezun.hacettepe.edu.tr/';

UPDATE shortcut SET sort_order = 3
 WHERE type = 'service' AND url = 'https://ozelyeteneksinavi.hacettepe.edu.tr/giris/';

UPDATE shortcut SET sort_order = 4
 WHERE type = 'service' AND url = 'https://kriter.hacettepe.edu.tr';

UPDATE shortcut SET sort_order = 5
 WHERE type = 'service' AND url = 'http://guvenlik.hacettepe.edu.tr/sticker/';

UPDATE shortcut SET sort_order = 6
 WHERE type = 'service' AND url = 'https://portal.hacettepe.edu.tr/';
