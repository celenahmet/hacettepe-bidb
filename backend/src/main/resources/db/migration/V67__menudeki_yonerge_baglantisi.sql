-- Sol menüdeki "E-Posta Yönergesi" bağlantısı kırıktı.
--
-- Aynı belge veritabanında ÜÇ ayrı yerde adresleniyor ve aktarımda her birine
-- farklı bir dosya adı düşmüş:
--
--   1. document tablosu          -> V63 ile düzeltildi
--   2. page.content_html         -> V65 ile düzeltildi
--   3. menu_item.external_url    -> burada düzeltiliyor
--
-- Üçüncüsü, tarama menü adreslerine ayrıca bakılana kadar görünmemişti.
-- Oysa en görünür olanı bu: sol menüde, her sayfada duran bir bağlantı.
-- Türkçe ve İngilizce menülerde birer kayıt (#22 ve #126), ikisi de
-- /dosyalar/epostayonergesi22.pdf adresini gösteriyordu; böyle bir dosya yok,
-- bağlantı hata sayfasına düşüyordu.
--
-- Hedef, diğer iki yerdekiyle aynı: yönergenin güncel sürümü (03.02.2023),
-- belgeler klasöründe duruyor ve erişilebilir olduğu doğrulandı.
--
-- Etiketler değişmiyor; yalnızca adres gerçek dosyaya eşitleniyor.
UPDATE menu_item
   SET external_url = '/dosyalar/epostayonergesi_030223.pdf'
 WHERE external_url = '/dosyalar/epostayonergesi22.pdf';
