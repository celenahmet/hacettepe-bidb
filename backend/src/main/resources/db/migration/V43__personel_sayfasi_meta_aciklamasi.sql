-- 'staff' sayfasının content_html'i boş (yapısal veriye taşındı, bkz.
-- staff_unit/staff_member) — V42'nin içerik-tabanlı üretimi bu yüzden
-- atladı. Önemli, sık ziyaret edilen bir sayfa olduğu için elle yazıldı.

UPDATE page SET seo_description =
  'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı birim ve personel listesi: yönetim, ağ, sistem, yazılım geliştirme, insan kaynakları ve kullanıcı destek birimleri.'
WHERE slug = 'staff' AND language = 'tr';

UPDATE page SET seo_description =
  'Staff directory of the Hacettepe University Department of Information Technology: management, network, systems, software development, human resources and user support units.'
WHERE slug = 'staff' AND language = 'en';
