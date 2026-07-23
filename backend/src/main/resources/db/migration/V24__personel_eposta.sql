-- Personel profilinde kurumsal e-posta bilgisi yapısal veri olarak tutulur.
-- Yönetim ve organizasyon şeması kaynaklarında doğrulanabilen iki adres
-- başlangıç verisi olarak eklenir; diğer kayıtlar panelden doldurulana kadar
-- NULL kalır ve yayın sayfasında açık bir "bilgi girilmemiştir" durumu gösterir.

ALTER TABLE staff_member
    ADD COLUMN email VARCHAR(254);

UPDATE staff_member
SET email = 'gokhan@hacettepe.edu.tr'
WHERE full_name = 'Mustafa Gökhan Güzel';

UPDATE staff_member
SET email = 'esin.alan@hacettepe.edu.tr'
WHERE full_name = 'Esin Alan';

