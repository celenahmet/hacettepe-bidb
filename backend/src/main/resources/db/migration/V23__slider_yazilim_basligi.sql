-- Uzun başlık geniş ekranlarda dahi gereksiz yere iki satıra bölünerek
-- görsel odağı ağırlaştırıyordu. İçerik ve bağlantı korunur; yalnızca
-- hizmeti doğrudan anlatan daha kısa başlık kullanılır.
UPDATE slide
SET title = 'Yazılım Hizmetleri'
WHERE language = 'tr'
  AND title = 'Kurumsal Yazılım Hizmetleri';
