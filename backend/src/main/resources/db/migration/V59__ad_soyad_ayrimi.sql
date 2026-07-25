-- İletişim formunda ad ve soyad artık ayrı alanlar olarak tutulur
-- (normalizasyon: raporlama/arama ayrı sütun bekler). Var olan kayıtlar en
-- iyi çabayla ilk boşluktan bölünerek geriye dönük doldurulur.
ALTER TABLE contact_ticket ADD COLUMN requester_first_name VARCHAR(80);
ALTER TABLE contact_ticket ADD COLUMN requester_last_name VARCHAR(80);

UPDATE contact_ticket SET
    requester_first_name = CASE
        WHEN position(' ' in requester_name) > 0 THEN substring(requester_name from 1 for position(' ' in requester_name) - 1)
        ELSE requester_name
    END,
    requester_last_name = CASE
        WHEN position(' ' in requester_name) > 0 THEN trim(substring(requester_name from position(' ' in requester_name) + 1))
        ELSE ''
    END;

ALTER TABLE contact_ticket ALTER COLUMN requester_first_name SET NOT NULL;
ALTER TABLE contact_ticket ALTER COLUMN requester_last_name SET NOT NULL;
ALTER TABLE contact_ticket DROP COLUMN requester_name;
