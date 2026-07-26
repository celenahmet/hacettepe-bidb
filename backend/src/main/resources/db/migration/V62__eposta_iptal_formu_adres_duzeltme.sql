-- "E-posta İptal Formu" belgesinin adresi aktarımdan yanlış adla gelmişti:
-- kayıt /dosyalar/BGYS-F-12e-PostaiptalFormu.docx adresini gösteriyor, oysa
-- dosya sunucuda E-PostaIptalFormu.docx adıyla duruyor. Bağlantıya tıklayan
-- ziyaretçi belgeye ulaşamıyor, hata sayfasına düşüyordu.
--
-- Belge değişmiyor; yalnızca kaydın işaret ettiği ad gerçek dosya adına
-- eşitleniyor.
UPDATE document
   SET url = '/dosyalar/E-PostaIptalFormu.docx'
 WHERE url = '/dosyalar/BGYS-F-12e-PostaiptalFormu.docx';
