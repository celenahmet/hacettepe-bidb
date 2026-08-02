-- Portal, servis listesinde ikinci sıraya alındı (kurum kararı).
--
-- Bu, kaynaktan BİLİNÇLİ bir sapmadır. V68 ile bu liste kaynağın aktarım
-- anındaki hâline döndürülmüştü ve orada Portal EN SONDA duruyor. Burada
-- kurum tercihiyle öne alınıyor: Portal en çok kullanılan giriş noktası,
-- listenin sonunda kalması onu gereksiz yere zor bulunur kılıyordu.
--
-- Sapma kayda geçiriliyor ki ileride "acaba yanlışlıkla mı bozuldu?" sorusu
-- doğmasın — V68'in gerekçesiyle çeliştiği için açıklamasız bırakılamaz.
--
-- Sıra İKİ yüzeyi birden etkiler ve bu bilinçlidir:
--   1. Ana sayfadaki "Servisler ve Uygulamalar" kartları
--   2. Üst menüdeki "Hizmetlerimiz" açılır listesi
-- İkisi de aynı kayıtlardan üretiliyor (header.component.ts, anaSayfa.services).
-- Ayrı sıralamak için menüye özel bir sıra alanı gerekirdi; iki yüzeyin aynı
-- sırayı göstermesi kullanıcı açısından da tutarlı olduğu için tercih edilmedi.
--
-- Sıralama ada göre değil ADRESE göre yapılır: adres iki dilde de aynı
-- (ya da aynı sayfanın dil karşılığı), ad ise çevrilmiş durumda.

UPDATE shortcut SET sort_order = 0
 WHERE type = 'service' AND url IN ('/tr/web-services', '/en/web-services');

UPDATE shortcut SET sort_order = 1
 WHERE type = 'service' AND url = 'https://portal.hacettepe.edu.tr/';

UPDATE shortcut SET sort_order = 2
 WHERE type = 'service' AND url = 'http://hu-iys.hacettepe.edu.tr/';

UPDATE shortcut SET sort_order = 3
 WHERE type = 'service' AND url = 'http://egitimmezun.hacettepe.edu.tr/';

UPDATE shortcut SET sort_order = 4
 WHERE type = 'service' AND url = 'https://ozelyeteneksinavi.hacettepe.edu.tr/giris/';

UPDATE shortcut SET sort_order = 5
 WHERE type = 'service' AND url = 'https://kriter.hacettepe.edu.tr';

UPDATE shortcut SET sort_order = 6
 WHERE type = 'service' AND url = 'http://guvenlik.hacettepe.edu.tr/sticker/';
