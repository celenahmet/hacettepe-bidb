-- 'service-groups' (EN) hiçbir menüden veya başka bir sayfadan bağlantı
-- almıyor ve TR tarafında hiç karşılığı yok — muhtemelen mevcut, daha
-- ayrıntılı birim yapısının (bkz. 'overview') yerini aldığı eski bir
-- gruplama. İçerik kaybolmasın diye silinmiyor, ama yayından kaldırılıp
-- site haritasından (sitemap.xml) ve arama dizininden çıkarılıyor —
-- ulaşılamayan bir sayfanın arama sonuçlarında görünmesi istenmez.

UPDATE page SET published = false, seo_robots = 'noindex, follow'
WHERE slug = 'service-groups' AND language = 'en';
