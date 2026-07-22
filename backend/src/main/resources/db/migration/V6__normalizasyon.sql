-- Normalizasyon: iki gerçek veri modeli kusuru giderilir.
--
-- 1) İletişim bilgileri tek metin alanında " · " ile ayrılarak tutuluyordu.
--    Biçimlendirme verinin içindeydi: tek bir telefonu değiştirmek metni
--    ayrıştırmayı gerektiriyordu ve her numaranın kendi etiketi olamıyordu.
--
-- 2) Kısayolun türü sıra numarasından çıkarılıyordu (0-99 ikon ızgarası,
--    100 ve üzeri servis karuseli). Bu gizli kural şemaya bakan hiç kimseye
--    görünmüyordu; artık açık bir sütun.

-- ---------- 1) iletişim kanalları ----------

CREATE TABLE contact_channel (
    id          BIGSERIAL PRIMARY KEY,
    language    VARCHAR(2)   NOT NULL DEFAULT 'tr',
    -- address | phone | email | fax
    type        VARCHAR(20)  NOT NULL,
    -- "Bize Ulaşın", "Daire Başkanlığı" gibi; boş olabilir
    label       VARCHAR(150),
    value       VARCHAR(500) NOT NULL,
    sort_order  INT          NOT NULL DEFAULT 0,
    published   BOOLEAN      NOT NULL DEFAULT TRUE,
    CONSTRAINT contact_channel_type_check
        CHECK (type IN ('address', 'phone', 'email', 'fax'))
);

CREATE INDEX contact_channel_idx ON contact_channel (language, type, sort_order);

-- Mevcut değerler " · " ayracından bölünerek satırlara taşınır.
-- Veri kaybolmaz; yalnızca yapıya kavuşur.
INSERT INTO contact_channel (language, type, value, sort_order)
SELECT s.language,
       CASE s.name
           WHEN 'iletisim_adres'   THEN 'address'
           WHEN 'iletisim_telefon' THEN 'phone'
           WHEN 'iletisim_eposta'  THEN 'email'
           WHEN 'iletisim_faks'    THEN 'fax'
       END,
       btrim(parca.value),
       parca.sira - 1
FROM setting s
CROSS JOIN LATERAL unnest(string_to_array(s.value, '·')) WITH ORDINALITY AS parca(value, sira)
WHERE s.name IN ('iletisim_adres', 'iletisim_telefon', 'iletisim_eposta', 'iletisim_faks')
  AND btrim(parca.value) <> '';

-- Taşınan kayıtlar setting tablosundan kaldırılır; tek doğru yer kalsın.
DELETE FROM setting
WHERE name IN ('iletisim_adres', 'iletisim_telefon', 'iletisim_eposta', 'iletisim_faks');

-- ---------- 2) kısayol türü ----------

ALTER TABLE shortcut
    ADD COLUMN type VARCHAR(20) NOT NULL DEFAULT 'shortcut';

ALTER TABLE shortcut
    ADD CONSTRAINT shortcut_type_check CHECK (type IN ('shortcut', 'service'));

-- Eski kural: 100 ve üzeri sıra numarası servis karuselini işaret ediyordu.
UPDATE shortcut SET type = 'service' WHERE sort_order >= 100;

-- Servislerin sıra numarası kendi içinde sıfırdan başlar; 100 ofseti
-- artık bir anlam taşımıyor.
UPDATE shortcut SET sort_order = sort_order - 100 WHERE type = 'service';
