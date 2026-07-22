-- E-imza sayfalarındaki satır-içi görseller yerelleştirilir.
--
-- V18'de göreli yollar kaynak sunucuya (mutlak) çevrilmişti. İndirilebilir
-- dosyalar (form, PDF) kaynakta kalabilir; ama satır-içi GÖRSELLER kaynak
-- sunucuya bağımlılık yaratıyordu (eksik denetimi bunu bir sorun olarak
-- işaretliyor). Görseller frontend/public/images/eimza/ altına indirildi;
-- adresler yerele çevrilir.

UPDATE page
SET content_html = replace(
      content_html,
      'https://bidb.hacettepe.edu.tr/eimza/images/',
      '/images/eimza/'),
    updated_at = now()
WHERE slug LIKE 'e-signature%' AND language = 'tr';
