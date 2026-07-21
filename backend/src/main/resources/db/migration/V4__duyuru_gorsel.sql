-- Duyurular artık görselli haber olarak da yayımlanabilir.
--
-- İki kullanım bir arada desteklenir:
--   · Kısa duyuru  : yalnızca başlık ve bir bağlantı (dis_adres)
--   · Haber sayfası: görsel + metin; kendi adresinde açılır (/tr/duyuru/<slug>)

-- icerik_html sütunu V1'de zaten tanımlıydı; yalnızca eksik olanlar eklenir.
ALTER TABLE duyuru
    ADD COLUMN slug       VARCHAR(200),
    ADD COLUMN gorsel_url VARCHAR(500),
    ADD COLUMN gorsel_alt VARCHAR(300);

-- Aynı dilde aynı adres iki kez kullanılamaz
CREATE UNIQUE INDEX duyuru_slug_dil ON duyuru (slug, dil) WHERE slug IS NOT NULL;
