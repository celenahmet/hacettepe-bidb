-- Yalnızca bir belgeye yönlenen duyurular, sıradan dış bağlantılardan açıkça
-- ayrılır. Görsel bağımsızdır; görsel yoksa mevcut kurumsal kapak şablonu
-- kullanılmaya devam eder.
ALTER TABLE news
    ADD COLUMN document_only BOOLEAN NOT NULL DEFAULT FALSE;

-- Daha önce belge bağlantısı olarak girilmiş kayıtlar yeni yayın türüne taşınır.
UPDATE news
SET document_only = TRUE
WHERE slug IS NULL
  AND external_url ~* '\.(pdf|doc|docx|xls|xlsx|ppt|pptx|odt|ods|zip)(\?.*)?$';
