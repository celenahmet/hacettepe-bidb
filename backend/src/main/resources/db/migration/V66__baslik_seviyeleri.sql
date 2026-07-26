-- İki sayfada başlık hiyerarşisi kopuktu.
--
-- Sayfa başlığı şablonda h1 olarak çiziliyor. İçeriğin ilk başlığının h2 olması
-- beklenir; bu iki sayfada h4 ile başlıyordu. Ekran okuyucu kullanıcıları
-- belgede başlık başlık gezindiğinde araya iki boş seviye giriyor, yapı
-- "eksik parçalı" görünüyordu. Yayındaki 160 sayfanın 8'i doğru biçimde h2 ile
-- başlıyor; bu ikisi aykırıydı.
--
-- Yalnızca etiket adları değişiyor. Metin, öznitelik, sıra, iç içe geçme aynı
-- kalıyor; etiketler eşit uzunlukta olduğu için içeriğin bayt uzunluğu bile
-- değişmez (doğrulamada bu kullanıldı).
--
-- Görünürdeki karşılığı: bölüm başlıkları 16px yerine 21,6px, alt başlıklar
-- 13,28px yerine 18px çiziliyor ve sitenin diğer sayfalarındaki bölüm
-- başlıklarıyla aynı görünüyorlar. Alt başlıklar şimdiye kadar gövde
-- metninden (16px) küçüktü, yani başlık altındaki paragraftan daha az
-- belirgindi.

-- "Virüslerden Korunma": h4 bölüm başlıkları, h5 alt başlıklar (tanımlar).
-- İki seviyeli yapı korunarak h2/h3'e taşınıyor.
UPDATE page
   SET content_html = replace(replace(replace(replace(content_html,
         '<h4>', '<h2>'), '</h4>', '</h2>'),
         '<h5>', '<h3>'), '</h5>', '</h3>')
 WHERE slug = 'virus-protection';

-- "Virüsler ve Güvenlik Önerileri": tek bölüm başlığı, kaynakta büyük harfli.
UPDATE page
   SET content_html = replace(replace(content_html,
         '<H4>', '<h2>'), '</H4>', '</h2>')
 WHERE slug = 'security';

-- Not: "webmail" sayfası KASTEN dışarıda bırakıldı. Kayıttaki content_html
-- h5 başlıklı üç Bootstrap kartı taşıyor, ama o metin hiç çizilmiyor: sayfanın
-- kendi Angular bileşeni var (bidb-webmail-services) ve ziyaretçinin gördüğü
-- yapı zaten h1 > h2,h2,h2 — atlama yok. Kayıttaki HTML aktarımdan kalan,
-- kullanılmayan kaynak. Buradaki etiketleri değiştirmek görünen sayfada
-- hiçbir şeyi düzeltmez, yalnızca kaynağı gereksiz yere farklılaştırırdı.
