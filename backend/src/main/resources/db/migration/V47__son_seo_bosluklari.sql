-- Kapsamlı SEO çalışması, kalan gerçek boşluklar.
--
-- e-signature-workflow: içerik yalnızca bir akış şeması görseli (metin yok),
-- V42'nin içerik-tabanlı üretimi bu yüzden atlamıştı. Görselin ne olduğu
-- bilindiği için (e-imza başvuru iş akışı şeması) kısa, doğru bir açıklama
-- elle yazıldı — görselin içindeki adımlar bilinmediği için uydurulmadı.
--
-- mail-filtering: içerik yalnızca "Güncelleme Aşamasındadır." cümlesi.
-- Sayfanın konusu (e-posta tarama politikaları) başlığından biliniyor;
-- açıklama bu gerçek durumu (güncelleniyor) olduğu gibi yansıtıyor.

UPDATE page SET seo_description =
  'Diagram of the e-signature application workflow at Hacettepe University Department of Information Technology.'
WHERE slug = 'e-signature-workflow' AND language = 'en';

UPDATE page SET seo_description =
  'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı e-imza başvuru iş akışını gösteren şema.'
WHERE slug = 'e-signature-workflow' AND language = 'tr';

UPDATE page SET seo_description =
  'Information on Hacettepe University Department of Information Technology''s e-mail filtering policies. This page is currently being updated.'
WHERE slug = 'mail-filtering' AND language = 'en';

UPDATE page SET seo_description =
  'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı e-posta tarama politikaları hakkında bilgi. Bu sayfa güncelleme aşamasındadır.'
WHERE slug = 'mail-filtering' AND language = 'tr';

-- notice-051218 / notice-180117 / owncloud: kaynak site bu üç sayfada da
-- "Böyle bir sayfa bulunmamaktadır!" (soft-404) döndürüyordu. TR sürümleri
-- zaten bilinçli olarak noindex'ti (kırık bir sayfanın arama sonuçlarına
-- girmesi istenmez); EN sürümleri aynı kırık içeriğe sahip olduğu hâlde
-- index'e açık bırakılmıştı — tutarsızlık giderildi. Bu üçünün "arama
-- motoru dizinine kapalı" olarak işaretlenmesi BİLİNÇLİDİR, hata değildir.
UPDATE page SET seo_robots = 'noindex, follow'
WHERE slug IN ('notice-051218', 'notice-180117', 'owncloud') AND language = 'en';
