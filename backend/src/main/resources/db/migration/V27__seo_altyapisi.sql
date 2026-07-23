-- Sayfa ve haber SEO bilgileri yönetim panelinden değiştirilebilir.
-- İçerik metinlerine dokunulmaz; yalnızca arama ve sosyal paylaşım sunumu genişletilir.
ALTER TABLE page
    ADD COLUMN seo_image VARCHAR(500),
    ADD COLUMN seo_robots VARCHAR(80) NOT NULL DEFAULT 'index, follow',
    ADD COLUMN seo_schema_type VARCHAR(60) NOT NULL DEFAULT 'WebPage';

ALTER TABLE news
    ADD COLUMN seo_title VARCHAR(300),
    ADD COLUMN seo_description VARCHAR(500),
    ADD COLUMN seo_keywords VARCHAR(500),
    ADD COLUMN seo_robots VARCHAR(80) NOT NULL DEFAULT 'index, follow',
    ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Ana sayfa verisi eskiden de "home" kaydında tutuluyordu; artık Angular bu
-- kaydın SEO alanlarını da kullanır. İlk kurulumda boş kalmaması için kaliteli
-- ve sayfaya özel varsayılanlar atanır, panelden sonradan değiştirilebilir.
UPDATE page
SET seo_title = CASE language
        WHEN 'tr' THEN 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı'
        ELSE 'Hacettepe University Department of Information Technology'
    END,
    seo_description = CASE language
        WHEN 'tr' THEN 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı hizmetleri, güncel duyurular, e-posta, ağ, yazılım ve kullanıcı destek kaynakları.'
        ELSE 'Services, announcements, email, network, software and user support resources from Hacettepe University Department of Information Technology.'
    END,
    seo_keywords = CASE language
        WHEN 'tr' THEN 'Hacettepe, Bilgi İşlem Daire Başkanlığı, e-posta, ağ, yazılım, kullanıcı desteği'
        ELSE 'Hacettepe University, information technology, email, network, software, user support'
    END,
    seo_schema_type = 'WebSite',
    updated_at = now()
WHERE slug = 'home';

UPDATE page SET seo_schema_type = 'AboutPage'
WHERE slug IN ('about', 'overview', 'mission-vision');

UPDATE page SET seo_schema_type = 'ContactPage'
WHERE slug = 'contact';

UPDATE page SET seo_schema_type = 'FAQPage'
WHERE slug = 'faq';

UPDATE page SET seo_schema_type = 'CollectionPage'
WHERE slug IN ('staff', 'committees', 'documents', 'forms');

-- Kaynaktaki hata metnini birebir koruyan eski kayıtlar erişilebilir kalır,
-- fakat arama sonuçlarına alınmaz.
UPDATE page SET seo_robots = 'noindex, follow'
WHERE content_html LIKE '%Böyle bir sayfa bulunmamaktadır%';
