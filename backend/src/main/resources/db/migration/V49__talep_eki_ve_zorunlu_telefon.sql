-- İletişim formuna opsiyonel ek dosya desteği eklendi; telefon alanı zorunlu hale getirildi.

ALTER TABLE contact_ticket
    ADD COLUMN attachment_url VARCHAR(300),
    ADD COLUMN attachment_name VARCHAR(200),
    ADD COLUMN attachment_size_bytes BIGINT;

-- Var olan kayıtlarda boş telefon olabilir; NOT NULL'a geçmeden önce doldurulur.
UPDATE contact_ticket SET requester_phone = '' WHERE requester_phone IS NULL;
ALTER TABLE contact_ticket ALTER COLUMN requester_phone SET NOT NULL;
