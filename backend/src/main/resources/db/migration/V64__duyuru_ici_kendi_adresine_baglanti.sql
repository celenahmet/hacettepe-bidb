-- Bir duyurunun (notice-110520, TR ve EN) metni VPN kılavuzuna
-- http://www.bidb.hacettepe.edu.tr/tr/VPN adresiyle bağlanıyordu.
--
-- İki sorun vardı:
--   1. Adres bu sitenin KENDİ alan adını gösteriyor. Site yayına alındığında
--      ziyaretçi siteden çıkıp aynı siteye dönüyor; gereksiz bir tur ve
--      şifresiz (http) bir adım. Kendi sayfalarına göreli bağlanmak gerekir.
--   2. Yol "/tr/VPN" büyük harfli; site adresleri küçük harfe indirgendiği
--      için bu her seferinde ek bir yönlendirme adımı doğuruyordu.
--
-- Görünen bağlantı METNİ değiştirilmez (ziyaretçi hangi adresin kastedildiğini
-- okumayı sürdürür); yalnızca href, sayfanın gerçek adresine çevrilir.
UPDATE news
   SET content_html = replace(content_html,
        'href="http://www.bidb.hacettepe.edu.tr/tr/VPN"',
        'href="/tr/vpn"')
 WHERE content_html LIKE '%href="http://www.bidb.hacettepe.edu.tr/tr/VPN"%';

UPDATE page
   SET content_html = replace(content_html,
        'href="http://www.bidb.hacettepe.edu.tr/tr/VPN"',
        'href="/tr/vpn"')
 WHERE content_html LIKE '%href="http://www.bidb.hacettepe.edu.tr/tr/VPN"%';
