-- Haber ve duyurular konu, hedef kitle ve görselsiz kapak şablonuyla
-- yönetilebilir. Alanlar metin anahtarı olarak saklanır; böylece tasarım adı
-- değişse bile eski kayıtların anlamı korunur.
ALTER TABLE news
    ADD COLUMN category       VARCHAR(40)  NOT NULL DEFAULT 'general',
    ADD COLUMN audience       VARCHAR(40)  NOT NULL DEFAULT 'all-users',
    ADD COLUMN cover_template VARCHAR(40)  NOT NULL DEFAULT 'institutional',
    ADD COLUMN cover_text     VARCHAR(120);

-- Mevcut kayıtlar başlıklarındaki açık ifadeler üzerinden bir kez
-- sınıflandırılır. Uygulama bundan sonra başlıktan tahmin yürütmez.
UPDATE news
SET category = CASE
        WHEN title ILIKE '%işkur%' OR title ILIKE '%iskur%' THEN 'iskur'
        WHEN title ILIKE '%personel%' OR title ILIKE '%sözleşmeli%'
             OR title ILIKE '%alım%' OR title ILIKE '%kadro%' THEN 'recruitment'
        WHEN title ILIKE '%e-posta%' OR title ILIKE '%eposta%'
             OR title ILIKE '%mail%' THEN 'email'
        WHEN title ILIKE '%office%' OR title ILIKE '%microsoft%'
             OR title ILIKE '%lisans%' OR title ILIKE '%yazılım%'
             OR title ILIKE '%onedrive%' OR title ILIKE '%exchange%'
             OR title ILIKE '%teams%' THEN 'software-license'
        ELSE 'general'
    END,
    audience = CASE
        WHEN title ILIKE '%işkur%' OR title ILIKE '%iskur%' THEN 'students'
        ELSE 'all-users'
    END,
    cover_template = CASE
        WHEN title ILIKE '%işkur%' OR title ILIKE '%iskur%' THEN 'career'
        WHEN title ILIKE '%personel%' OR title ILIKE '%sözleşmeli%'
             OR title ILIKE '%alım%' OR title ILIKE '%kadro%' THEN 'people'
        WHEN title ILIKE '%e-posta%' OR title ILIKE '%eposta%'
             OR title ILIKE '%mail%' THEN 'communication'
        WHEN title ILIKE '%office%' OR title ILIKE '%microsoft%'
             OR title ILIKE '%lisans%' OR title ILIKE '%yazılım%' THEN 'technology'
        ELSE 'institutional'
    END;

ALTER TABLE news
    ADD CONSTRAINT news_category_valid CHECK (category IN (
        'general', 'service-outage', 'maintenance', 'cyber-security',
        'network-internet', 'email', 'software-license', 'ebys-esignature',
        'web-services', 'training-event', 'recruitment', 'iskur', 'procurement'
    )),
    ADD CONSTRAINT news_audience_valid CHECK (audience IN (
        'all-users', 'students', 'academic-staff', 'administrative-staff',
        'all-staff', 'alumni', 'unit-managers'
    )),
    ADD CONSTRAINT news_cover_template_valid CHECK (cover_template IN (
        'institutional', 'signal', 'technology', 'security', 'maintenance',
        'communication', 'academic', 'people', 'career', 'minimal'
    ));

CREATE INDEX news_category_date_idx
    ON news (language, category, published_on DESC) WHERE published;

