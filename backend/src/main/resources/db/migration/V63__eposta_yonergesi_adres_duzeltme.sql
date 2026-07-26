-- "HÜ E-Posta Yönergesi" belgesinin dosyası aktarımda hiç taşınmamıştı:
-- kayıt /dosyalar/epostayonergesi_300120.pdf adresini gösteriyor ama böyle
-- bir dosya sunucuda yok, bağlantı hata sayfasına düşüyordu.
--
-- Yönergenin güncel sürümü (03.02.2023 tarihli) üniversitenin yayınladığı
-- adresten alınıp diğer belgelerle aynı klasöre kondu; böylece belge dış bir
-- adrese bağımlı kalmıyor. Kayıt yeni dosyaya yönlendirilir.
UPDATE document
   SET url = '/dosyalar/epostayonergesi_030223.pdf'
 WHERE url = '/dosyalar/epostayonergesi_300120.pdf';
