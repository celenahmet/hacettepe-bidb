-- Ana sayfa slaytları hizmetleri tek tek anlatıyor (ağ, yerleşke, kablosuz,
-- yazılım, web siteleri, destek) ama Başkanlığın bu hizmetleri neden ve hangi
-- kapsamda yürüttüğünü söyleyen bir giriş slaydı yoktu. Ziyaretçi vitrinin
-- ikinci karesinde kurumsal çerçeveyi görsün diye eklenir.
--
-- Metin uydurulmamıştır: Hakkımızda sayfasının açılış paragrafından alınmıştır.
-- Görsel, sayfa başlığı şeridinde de kullanılan kurumsal veri-ağı görselinin
-- slider oranındaki (1920x825) sürümüdür; srcset diğer boyutları dosya adındaki
-- "-1920" ekini değiştirerek türetir (bkz. hero-slider.component.ts).

-- Yeni slayt ikinci sıraya girdiği için mevcut 2..6 bir kademe kayar.
-- Azalan sırayla güncellenir ki ara adımlarda çakışma oluşmasın.
UPDATE slide SET sort_order = sort_order + 1
WHERE language IN ('tr', 'en') AND sort_order >= 2;

INSERT INTO slide (language, title, subtitle, image_url, image_alt, link_url, sort_order, published)
VALUES (
  'tr',
  'Üniversitenin Bilişim Altyapısı',
  'Eğitim, öğretim, araştırma ve idari süreçlerin dayandığı ağ, sunucu, yazılım ve kullanıcı hizmetleri Başkanlığımız tarafından kurulur, işletilir ve geliştirilir.',
  '/images/slider/kurumsal-1920.webp',
  'Hacettepe Üniversitesi amblemi ve kurumsal ağ altyapısını simgeleyen soyut veri ağı görseli',
  '/tr/about',
  2,
  true
);

INSERT INTO slide (language, title, subtitle, image_url, image_alt, link_url, sort_order, published)
VALUES (
  'en',
  'The University''s IT Infrastructure',
  'The network, server, software and user services on which education, research and administrative processes depend are established, operated and developed by our Department.',
  '/images/slider/kurumsal-1920.webp',
  'Hacettepe University emblem with an abstract data network representing the institutional IT infrastructure',
  '/en/about',
  2,
  true
);
