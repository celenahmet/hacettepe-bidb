-- Birleştirilen sayfanın adı ve adresi sadeleştirilir.
--
-- V8'de iki sayfa birleştirilip "Yönetim ve Organizasyon Şeması" adı
-- verilmişti. Şema zaten yönetim kadrosunu da gösterdiği için çift başlık
-- gereksiz: sayfa artık yalnızca "Organizasyon Şeması".
--
-- Adres de ada uydurulur (/tr/management -> /tr/org-chart). Her iki eski
-- adres de yönlendirmeyle korunur.

-- 1) Sayfa içindeki artık gereksiz olan ara başlık kaldırılır:
--    sayfa başlığıyla aynı şeyi söylüyordu.
UPDATE page
SET content_html = replace(content_html, '<h2>Organizasyon Şeması</h2>', '')
WHERE slug = 'management' AND language = 'tr';

-- 2) Ad ve adres
UPDATE page
SET title = 'Organizasyon Şeması',
    slug = 'org-chart',
    updated_at = now()
WHERE slug = 'management' AND language = 'tr';

UPDATE menu_item
SET label = 'Organizasyon Şeması'
WHERE page_id = (SELECT id FROM page WHERE slug = 'org-chart' AND language = 'tr');

-- 3) Yönlendirmeler.
--    V8'de eklenen org-chart -> management kaydı artık ters yönde ve
--    döngü oluştururdu; kaldırılıp yerine doğrusu yazılır.
DELETE FROM redirect WHERE old_path = '/tr/org-chart';

INSERT INTO redirect (old_path, new_path)
VALUES ('/tr/management', '/tr/org-chart')
ON CONFLICT (old_path) DO UPDATE SET new_path = EXCLUDED.new_path;
