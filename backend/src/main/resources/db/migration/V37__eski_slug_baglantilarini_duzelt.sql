-- Kaynak siteden aktarılan içerik HTML'i, sitenin eski (İngilizce yeniden
-- adlandırmadan önceki) Türkçe adres yapısına ait iç bağlantılar
-- barındırıyordu: /tr/kisisel, /tr/personel, /tr/servis, /tr/formlar,
-- /tr/eposta_gecis gibi. Sayfa tablosu bugün bu adları değil güncel
-- İngilizce-stilli slug'ları kullanıyor (personal-pages, staff, services,
-- forms, email-migration...) — bu yüzden o bağlantılar tıklandığında ya
-- yanlış sayfaya ya da hiçbir şeye gitmiyordu.
--
-- Ayrıca İngilizce sayfalarda, hedef sayfanın İngilizcesi VAR olduğu hâlde
-- bağlantı hâlâ /tr/ önekiyle yazılmıştı — İngilizce ziyaretçi tıklayınca
-- Türkçeye düşüyordu. Bu migration, güncel bir karşılığı BULUNAN her
-- bağlantıyı kendi dilinin doğru slug'una yönlendiriyor.
--
-- Karşılığı OLMAYAN bağlantılara dokunulmadı (bilinçli):
--   en/archive içinde /tr/notice-051218 ve /tr/owncloud — bu iki sayfanın
--   İngilizcesi yok, Türkçe kaynağa yönlendirmek kırık bağlantıdan iyidir.
--   e-signature-java içindeki http://www.java.com/tr/download — kendi
--   sitemize ait değil, Oracle'ın kendi yerelleştirmesi.
--   notice-110520 içindeki eski alan adına (bidb.hacettepe.edu.tr) mutlak
--   bağlantı — arşivlenmiş, tarihli bir duyurunun içeriği; dokunulmadı.
--
-- Metinler değişmedi, yalnızca href değerleri düzeltildi. Her UPDATE,
-- yalnızca eski bağlantıyı BARINDIRAN satırı etkiler (WHERE ... LIKE),
-- diğer tüm satırlar dokunulmadan kalır.

-- === İngilizce sayfalar: /tr/ -> /en/ (karşılığı olan hedefler) ===

UPDATE page SET content_html = replace(content_html, '"/tr/virus-protection"', '"/en/virus-protection"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/virus-protection"%';
UPDATE page SET content_html = replace(content_html, '"/tr/vpn"', '"/en/vpn"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/vpn"%';
UPDATE page SET content_html = replace(content_html, '"/tr/spam"', '"/en/spam"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/spam"%';
UPDATE page SET content_html = replace(content_html, '"/tr/security"', '"/en/security"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/security"%';
UPDATE page SET content_html = replace(content_html, '"/tr/it-security-tips"', '"/en/it-security-tips"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/it-security-tips"%';
UPDATE page SET content_html = replace(content_html, '"/tr/connection-security"', '"/en/connection-security"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/connection-security"%';
UPDATE page SET content_html = replace(content_html, '"/tr/proxy"', '"/en/proxy"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/proxy"%';
UPDATE page SET content_html = replace(content_html, '"/tr/document-links"', '"/en/document-links"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/document-links"%';
UPDATE page SET content_html = replace(content_html, '"/tr/personel"', '"/en/staff"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/personel"%';
UPDATE page SET content_html = replace(content_html, '"/tr/kisisel#2"', '"/en/personal-pages#2"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/kisisel#2"%';
UPDATE page SET content_html = replace(content_html, '"/tr/kisisel#21"', '"/en/personal-pages#21"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/kisisel#21"%';
UPDATE page SET content_html = replace(content_html, '"/tr/kisisel#4"', '"/en/personal-pages#4"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/kisisel#4"%';
UPDATE page SET content_html = replace(content_html, '"/tr/kisisel#5"', '"/en/personal-pages#5"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/kisisel#5"%';
UPDATE page SET content_html = replace(content_html, '"/tr/database-query"', '"/en/database-query"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/database-query"%';
UPDATE page SET content_html = replace(content_html, '"/tr/student-rules"', '"/en/student-rules"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/student-rules"%';
UPDATE page SET content_html = replace(content_html, '"/tr/services"', '"/en/services"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/services"%';
UPDATE page SET content_html = replace(content_html, '"/tr/personal-pages"', '"/en/personal-pages"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/personal-pages"%';
UPDATE page SET content_html = replace(content_html, '"/tr/email-migration"', '"/en/email-migration"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/email-migration"%';
UPDATE page SET content_html = replace(content_html, '"/tr/notices"', '"/en/notices"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/notices"%';
UPDATE page SET content_html = replace(content_html, '"/tr/notice-121120"', '"/en/notice-121120"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/notice-121120"%';
UPDATE page SET content_html = replace(content_html, '"/tr/notice-110520"', '"/en/notice-110520"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/notice-110520"%';
UPDATE page SET content_html = replace(content_html, '"/tr/notice-050416"', '"/en/notice-050416"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/notice-050416"%';
UPDATE page SET content_html = replace(content_html, '"/tr/spss-081118"', '"/en/spss-081118"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/spss-081118"%';
UPDATE page SET content_html = replace(content_html, '"/tr/matlab-061118"', '"/en/matlab-061118"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/matlab-061118"%';
UPDATE page SET content_html = replace(content_html, '"/tr/sas-191018"', '"/en/sas-191018"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/sas-191018"%';
UPDATE page SET content_html = replace(content_html, '"/tr/ansys-011018"', '"/en/ansys-011018"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/ansys-011018"%';
UPDATE page SET content_html = replace(content_html, '"/tr/stylecc50-removal"', '"/en/stylecc50-removal"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/stylecc50-removal"%';
UPDATE page SET content_html = replace(content_html, '"/tr/email"', '"/en/email"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/email"%';
UPDATE page SET content_html = replace(content_html, '"/tr/network"', '"/en/network"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/network"%';
UPDATE page SET content_html = replace(content_html, 'https://bidb.hacettepe.edu.tr/tr/epostaalma', '/en/email-account'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%bidb.hacettepe.edu.tr/tr/epostaalma%';
UPDATE page SET content_html = replace(content_html, 'https://bidb.hacettepe.edu.tr/tr/proxy_spam_kntr', '/en/proxy-spam'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%bidb.hacettepe.edu.tr/tr/proxy_spam_kntr%';
UPDATE page SET content_html = replace(content_html, '"/tr/eposta_gecis"', '"/en/email-migration"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/eposta_gecis"%';
UPDATE page SET content_html = replace(content_html, '"/tr/alumni-email"', '"/en/alumni-email"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/alumni-email"%';
UPDATE page SET content_html = replace(content_html, '"/tr/formlar/"', '"/en/forms"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/formlar/"%';
UPDATE page SET content_html = replace(content_html, '"/tr/email-backup-video"', '"/en/email-backup-video"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/email-backup-video"%';
UPDATE page SET content_html = replace(content_html, '"/tr/email-account"', '"/en/email-account"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/email-account"%';
UPDATE page SET content_html = replace(content_html, '"/tr/office365"', '"/en/office365"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/office365"%';
UPDATE page SET content_html = replace(content_html, '"/tr/servis#5"', '"/en/services#5"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/servis#5"%';
UPDATE page SET content_html = replace(content_html, '"/tr/servis#6"', '"/en/services#6"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/servis#6"%';
UPDATE page SET content_html = replace(content_html, '"/tr/servis#7"', '"/en/services#7"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/servis#7"%';
UPDATE page SET content_html = replace(content_html, '"/tr/servis#8"', '"/en/services#8"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/servis#8"%';
UPDATE page SET content_html = replace(content_html, '"/tr/servis#9"', '"/en/services#9"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/servis#9"%';
UPDATE page SET content_html = replace(content_html, '"/tr/servis#11"', '"/en/services#11"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/servis#11"%';
UPDATE page SET content_html = replace(content_html, '"/tr/servis#12"', '"/en/services#12"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/servis#12"%';
UPDATE page SET content_html = replace(content_html, '"/tr/cms"', '"/en/cms"'), updated_at = now() WHERE language = 'en' AND content_html LIKE '%"/tr/cms"%';

-- === Türkçe sayfalar: aynı dilde, ama slug'ın kendisi eski ===

UPDATE page SET content_html = replace(content_html, '"/tr/formlar/"', '"/tr/forms"'), updated_at = now() WHERE language = 'tr' AND content_html LIKE '%"/tr/formlar/"%';
UPDATE page SET content_html = replace(content_html, '"/tr/kisisel#2"', '"/tr/personal-pages#2"'), updated_at = now() WHERE language = 'tr' AND content_html LIKE '%"/tr/kisisel#2"%';
UPDATE page SET content_html = replace(content_html, '"/tr/kisisel#21"', '"/tr/personal-pages#21"'), updated_at = now() WHERE language = 'tr' AND content_html LIKE '%"/tr/kisisel#21"%';
UPDATE page SET content_html = replace(content_html, '"/tr/kisisel#4"', '"/tr/personal-pages#4"'), updated_at = now() WHERE language = 'tr' AND content_html LIKE '%"/tr/kisisel#4"%';
UPDATE page SET content_html = replace(content_html, '"/tr/kisisel#5"', '"/tr/personal-pages#5"'), updated_at = now() WHERE language = 'tr' AND content_html LIKE '%"/tr/kisisel#5"%';
UPDATE page SET content_html = replace(content_html, '"/tr/servis#5"', '"/tr/services#5"'), updated_at = now() WHERE language = 'tr' AND content_html LIKE '%"/tr/servis#5"%';
UPDATE page SET content_html = replace(content_html, '"/tr/servis#6"', '"/tr/services#6"'), updated_at = now() WHERE language = 'tr' AND content_html LIKE '%"/tr/servis#6"%';
UPDATE page SET content_html = replace(content_html, '"/tr/servis#7"', '"/tr/services#7"'), updated_at = now() WHERE language = 'tr' AND content_html LIKE '%"/tr/servis#7"%';
UPDATE page SET content_html = replace(content_html, '"/tr/servis#8"', '"/tr/services#8"'), updated_at = now() WHERE language = 'tr' AND content_html LIKE '%"/tr/servis#8"%';
UPDATE page SET content_html = replace(content_html, '"/tr/servis#9"', '"/tr/services#9"'), updated_at = now() WHERE language = 'tr' AND content_html LIKE '%"/tr/servis#9"%';
UPDATE page SET content_html = replace(content_html, '"/tr/servis#11"', '"/tr/services#11"'), updated_at = now() WHERE language = 'tr' AND content_html LIKE '%"/tr/servis#11"%';
UPDATE page SET content_html = replace(content_html, '"/tr/servis#12"', '"/tr/services#12"'), updated_at = now() WHERE language = 'tr' AND content_html LIKE '%"/tr/servis#12"%';
