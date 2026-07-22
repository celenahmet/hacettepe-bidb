-- "Yönetim" ve "Organizasyon Şeması" sayfaları birleştirilir.
--
-- GEREKÇE: İki sayfa da çok kısaydı. Yönetim sayfasında iki kişilik bir
-- tablo, Organizasyon Şeması sayfasında yalnızca bir şema görseli vardı.
-- İkisi aynı soruyu yanıtlıyor: "başkanlık nasıl örgütlenmiş?"
--
-- BU BİR İÇERİK KARARIDIR; kurum talebiyle yapılmıştır. Metinlerin kendisi
-- değişmez, yalnızca aynı sayfada toplanır.
--
-- Eski adres (/tr/org-chart) yönlendirmeyle korunur: dışarıdan verilmiş
-- bağlantılar ve arama sonuçları kırılmaz.

-- 1) Şema görseli, yönetim sayfasının sonuna eklenir.
--    Şemanın ayrı bir bölüm olduğu başlıkla korunur; aksi hâlde görsel
--    tablonun devamı gibi görünürdü.
UPDATE page AS hedef
SET content_html = regexp_replace(hedef.content_html, '</div>\s*$', '', 'n')
                   || '<h2>Organizasyon Şeması</h2>'
                   || regexp_replace(
                        regexp_replace(kaynak.content_html, '^\s*<div[^>]*>', '', 'n'),
                        '</div>\s*$', '', 'n')
                   || '</div>',
    title = 'Yönetim ve Organizasyon Şeması',
    updated_at = now()
FROM page AS kaynak
WHERE hedef.slug = 'management' AND hedef.language = 'tr'
  AND kaynak.slug = 'org-chart' AND kaynak.language = 'tr';

-- 2) Menüde iki öğe tek öğeye iner. Sol menü ve üst şerit aynı kaynaktan
--    beslendiği için ikisi de kendiliğinden güncellenir.
UPDATE menu_item
SET label = 'Yönetim ve Organizasyon Şeması'
WHERE page_id = (SELECT id FROM page WHERE slug = 'management' AND language = 'tr');

DELETE FROM menu_item
WHERE page_id = (SELECT id FROM page WHERE slug = 'org-chart' AND language = 'tr');

-- 3) Eski adres yeni sayfaya yönlendirilir.
INSERT INTO redirect (old_path, new_path)
VALUES ('/tr/org-chart', '/tr/management')
ON CONFLICT (old_path) DO UPDATE SET new_path = EXCLUDED.new_path;

-- 4) Birleştirilen sayfa kaldırılır. Sürümleri ve belgeleri ilişkili olarak
--    silinir; içeriği yukarıda yönetim sayfasına taşındı.
DELETE FROM page WHERE slug = 'org-chart' AND language = 'tr';
