-- Proxy belge adlarında platform markalarının doğru yazımı kullanılır.

UPDATE page
SET content_html = replace(
        replace(content_html, 'Macos Chrome Proxy Ayarları', 'MacOS Chrome Proxy Ayarları'),
        'IOS Wifi İçin Proxy Ayarları', 'iOS Wifi İçin Proxy Ayarları'
    ),
    updated_at = now()
WHERE slug = 'proxy'
  AND language = 'tr';

UPDATE document
SET name = replace(
        replace(name, 'Macos Chrome Proxy Ayarları', 'MacOS Chrome Proxy Ayarları'),
        'IOS Wifi İçin Proxy Ayarları', 'iOS Wifi İçin Proxy Ayarları'
    )
WHERE page_id = (
    SELECT id
    FROM page
    WHERE slug = 'proxy' AND language = 'tr'
);
