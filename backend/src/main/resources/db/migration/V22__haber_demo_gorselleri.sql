-- Haber kartlarının fotoğraflı kullanımını göstermek için mevcut yedi
-- duyuruya proje içinde saklanan demo kapakları bağlanır. Başlık, tarih,
-- bağlantı ve içerik alanlarına dokunulmaz.
UPDATE news
SET image_url = CASE id
    WHEN 1 THEN '/images/news/demo-basketbol-takimi.webp'
    WHEN 2 THEN '/images/news/demo-voleybol-maci-1.webp'
    WHEN 3 THEN '/images/news/demo-futbol-takimlari.webp'
    WHEN 4 THEN '/images/news/demo-voleybol-takimi.webp'
    WHEN 5 THEN '/images/news/demo-futbol-takimi.webp'
    WHEN 6 THEN '/images/news/demo-tenis-maci.webp'
    WHEN 7 THEN '/images/news/demo-voleybol-maci-2.webp'
END,
image_alt = CASE id
    WHEN 1 THEN 'Hacettepe spor salonunda kadın basketbol takımı'
    WHEN 2 THEN 'Hacettepe spor salonunda oynanan voleybol karşılaşması'
    WHEN 3 THEN 'Hacettepe sahasında karşılaşma öncesi futbol takımları'
    WHEN 4 THEN 'Hacettepe spor salonunda kadın voleybol takımı'
    WHEN 5 THEN 'Hacettepe sahasında karşılaşma öncesi futbol takımı'
    WHEN 6 THEN 'Kapalı tenis kortunda servis kullanan sporcu'
    WHEN 7 THEN 'Hacettepe spor salonunda oynanan voleybol karşılaşması'
END
WHERE language = 'tr'
  AND id BETWEEN 1 AND 7;
