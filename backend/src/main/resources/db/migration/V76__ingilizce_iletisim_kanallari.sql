-- İngilizce iletişim kanalları eksikti.
--
-- contact_channel tablosunda YALNIZCA Türkçe kayıtlar vardı (7 satır, en=0).
-- Sonucu iki yüzeyde birden görünüyordu:
--
--   1. Alt bilgi (footer): adres satırı bileşendeki yedek metne düşüyor ve
--      kurum adı olmadan yalnızca "06800 Beytepe / ANKARA" yazıyordu;
--      E-POSTA bloğu ise @if (epostalar().length) koşuluna takılıp HİÇ
--      görünmüyordu. Türkçe alt bilgide iki e-posta adresi duruyor.
--   2. İletişim sayfası (/en/contact): blok tümüyle @if (kanallar().length)
--      koşuluna takılıyor, İngilizce sayfada iletişim bilgisi çıkmıyordu.
--
-- Değerler Türkçe kayıtların birebir karşılığıdır. Telefon, faks ve
-- e-posta adresleri çevrilmez; yalnızca adres satırındaki kurum adı
-- çevrilir. Kullanılan karşılık docs/ceviri-sozlugu.md'de "sabit" olarak
-- işaretli: "Bilgi İşlem Daire Başkanlığı → Department of Information
-- Technology". Aynı metin seo.service.ts ve alt bilgi telif satırında da
-- geçiyor; üçü artık aynı.
--
-- sort_order değerleri Türkçedekiyle aynı tutuldu: iki dilde farklı
-- sıralama, aynı sayfanın iki sürümünü karşılaştıran birine kusur gibi
-- görünürdü.

INSERT INTO contact_channel (language, type, label, value, sort_order, published)
SELECT * FROM (VALUES
    ('en', 'address', NULL, 'Hacettepe University Department of Information Technology 06800 Beytepe / ANKARA', 0, TRUE),
    ('en', 'phone',   NULL, '+90 312 297 62 62', 0, TRUE),
    ('en', 'phone',   NULL, '+90 312 297 62 00', 1, TRUE),
    ('en', 'phone',   NULL, '+90 312 299 20 88', 2, TRUE),
    ('en', 'email',   NULL, 'bhim@hacettepe.edu.tr', 0, TRUE),
    ('en', 'email',   NULL, 'bidb@hacettepe.edu.tr', 1, TRUE),
    ('en', 'fax',     NULL, '+90 312 299 20 88', 0, TRUE)
) AS yeni(language, type, label, value, sort_order, published)
-- Elle eklenmiş bir kayıt varsa ikizlenmesin
WHERE NOT EXISTS (
    SELECT 1 FROM contact_channel mevcut
    WHERE mevcut.language = 'en'
      AND mevcut.type = yeni.type
      AND mevcut.value = yeni.value
);
