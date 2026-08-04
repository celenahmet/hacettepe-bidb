-- Sosyal medya hesapları: LinkedIn ve YouTube eklendi, X adresi güncellendi,
-- sıralama kurum tercihine göre yeniden düzenlendi.
--
-- Önceki durum üç hesaptı (instagram, facebook, twitter) ve X hâlâ eski
-- twitter.com adresini gösteriyordu. Kurumun LinkedIn ve YouTube hesapları
-- alt bilgide hiç görünmüyordu.
--
-- Alt bilgi şablonunda ('linkedin' ve 'youtube') ikonları ZATEN tanımlıydı
-- (footer.component.ts, @switch blokları); eksik olan yalnızca kayıtlardı.
-- Bu yüzden burada kod değişikliği gerekmiyor.
--
-- Sıralama kurum tercihi: instagram, linkedin, x, youtube, facebook.
-- 'network' sütununda UNIQUE kısıt var; var olanlar güncelleniyor,
-- yalnızca yeni ikisi ekleniyor.

-- X: twitter.com artık x.com'a yönleniyor; adres doğrudan yazılır ki
-- ziyaretçi fazladan bir yönlendirmeden geçmesin.
UPDATE social_account SET url = 'https://x.com/Hacettepe1967' WHERE network = 'twitter';

INSERT INTO social_account (network, url, sort_order, published)
SELECT * FROM (VALUES
    ('linkedin', 'https://www.linkedin.com/school/hacettepe-university/', 1, TRUE),
    ('youtube',  'https://www.youtube.com/c/HacettepeKurumsal',          3, TRUE)
) AS yeni(network, url, sort_order, published)
WHERE NOT EXISTS (
    SELECT 1 FROM social_account mevcut WHERE mevcut.network = yeni.network
);

-- Sıralama: instagram, linkedin, x, youtube, facebook
UPDATE social_account SET sort_order = 0 WHERE network = 'instagram';
UPDATE social_account SET sort_order = 1 WHERE network = 'linkedin';
UPDATE social_account SET sort_order = 2 WHERE network = 'twitter';
UPDATE social_account SET sort_order = 3 WHERE network = 'youtube';
UPDATE social_account SET sort_order = 4 WHERE network = 'facebook';
