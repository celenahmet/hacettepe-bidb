-- Önceki bir oturumda İngilizce sayfa içeriği doğrudan psql ile eklenirken
-- (Flyway dışında, terminal kod sayfası UTF-8 olmadığı için) Türkçe harfler
-- ('ı ö ş ç ğ İ Ö Ş Ç Ğ') sessizce '?' karakterine dönüştü — geri
-- döndürülemez bir bayt kaybı, yalnızca doğru yazımıyla yeniden yazılarak
-- düzeltilebilir. Etkilenen beş İngilizce sayfa: committees, about,
-- management, network, hardware; ayrıca ana sayfa şeridindeki iki İngilizce
-- slayt (id 11, 12). Doğru yazımlar TR karşılıklarından doğrulandı
-- (personel/yer adları TR'de bozulmamıştı).
--
-- Metin içeriği değişmiyor, yalnızca bozulan harfler onarılıyor.

UPDATE page SET content_html = replace(replace(replace(replace(replace(replace(replace(
    content_html,
    'G??khan', 'Gökhan'),
    'G??zel', 'Güzel'),
    'G??rkem', 'Görkem'),
    '??oruh', 'Çoruh'),
    'Nazl??', 'Nazlı'),
    '??zlem', 'Özlem'),
    'Taha Ba??', 'Taha Baş'),
  updated_at = now()
WHERE slug = 'committees' AND language = 'en';

-- "Sezgi ??obanba??" için ayrı adım: içindeki iki bozuk harf grubu farklı konumda.
UPDATE page SET content_html = replace(content_html, '??obanba??', 'Çobanbaş'), updated_at = now()
WHERE slug = 'committees' AND language = 'en' AND content_html LIKE '%??obanba??%';

UPDATE page SET content_html = replace(replace(replace(
    content_html,
    'G??khan', 'Gökhan'),
    'G??ZEL', 'GÜZEL'),
    'S??hhiye', 'Sıhhiye'),
  updated_at = now()
WHERE slug = 'management' AND language = 'en';

UPDATE page SET content_html = replace(content_html, 'S??hhiye', 'Sıhhiye'), updated_at = now()
WHERE slug = 'about' AND language = 'en';

UPDATE page SET content_html = replace(replace(
    content_html,
    'S??hhiye', 'Sıhhiye'),
    'Be??evler', 'Beşevler'),
  updated_at = now()
WHERE slug = 'network' AND language = 'en';

-- "Ba??kent" düzeltmesi ayrı adımda: yukarıdaki zincir sırasında "Beşevler"
-- ve "Sıhhiye" dışında kalan tek kalıp.
UPDATE page SET content_html = replace(content_html, 'Ba??kent', 'Başkent'), updated_at = now()
WHERE slug = 'network' AND language = 'en' AND content_html LIKE '%Ba??kent%';

UPDATE page SET content_html = replace(content_html, 'S??hhiye', 'Sıhhiye'), updated_at = now()
WHERE slug = 'hardware' AND language = 'en';

UPDATE slide SET
  title = replace(title, 'S??hhiye', 'Sıhhiye'),
  subtitle = replace(subtitle, 'S??hhiye', 'Sıhhiye'),
  image_alt = replace(image_alt, 'S??hhiye', 'Sıhhiye')
WHERE language = 'en' AND id IN (11, 12);
