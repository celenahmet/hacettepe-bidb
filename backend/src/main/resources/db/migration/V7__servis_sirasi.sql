-- Servis ve uygulamaların adlandırması ve sırası.
--
-- Bu kayıtlar hem ana sayfadaki servis şeridini hem üst şeritteki
-- "Servis ve Uygulamalar" menüsünü besler; sıra ikisinde de geçerlidir.
--
-- Sıralama ilkesi: en geniş kitlenin kullandığı genel giriş noktaları önce,
-- belirli bir gruba hitap eden başvuru sistemleri sonra. Alfabetik sıra
-- kullanıcıya bir şey söylemez; kullanım sıklığı söyler.

-- "Portal" tek başına belirsizdi; hangi kurumun portalı olduğu adından
-- anlaşılmıyordu.
UPDATE shortcut
SET name = 'Hacettepe Portal'
WHERE type = 'service' AND name = 'Portal';

UPDATE shortcut SET sort_order = 0 WHERE type = 'service' AND name = 'Hacettepe Portal';
UPDATE shortcut SET sort_order = 1 WHERE type = 'service' AND name = 'Web Servisleri';
UPDATE shortcut SET sort_order = 2 WHERE type = 'service' AND name = 'HÜ İçerik Yönetim Sistemi';
UPDATE shortcut SET sort_order = 3 WHERE type = 'service' AND name = 'Akademik Ön Değerlendirme Başvuru Sistemi';
UPDATE shortcut SET sort_order = 4 WHERE type = 'service' AND name = 'GSF Başvuru Sistemi';
UPDATE shortcut SET sort_order = 5 WHERE type = 'service' AND name = 'Eğitim Fakültesi Mezun Bilgi Sistemi';
UPDATE shortcut SET sort_order = 6 WHERE type = 'service' AND name = 'Sticker Başvurusu';
