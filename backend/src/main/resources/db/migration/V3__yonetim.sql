-- Yönetim panelinin genişletilmesi:
--   · sayfa metni düzenleme için sürüm geçmişi
--   · sayfa adresi değişince eski adresin yönlendirilmesi
--   · yüklenen belgelerin kaydı

-- Sayfanın her kaydedilmeden önceki hâli saklanır. Böylece yanlış bir
-- düzenleme tek tıkla geri alınabilir; kaynak aktarımından gelen ilk hâl
-- de "aktarım" açıklamasıyla burada durur.
CREATE TABLE sayfa_surum (
    id            BIGSERIAL PRIMARY KEY,
    sayfa_id      BIGINT NOT NULL REFERENCES sayfa(id) ON DELETE CASCADE,
    baslik        VARCHAR(300),
    icerik_html   TEXT NOT NULL,
    aciklama      VARCHAR(200),
    kaydeden      VARCHAR(100),
    kayit_zamani  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX sayfa_surum_sayfa_idx ON sayfa_surum (sayfa_id, kayit_zamani DESC);

-- Sayfanın adresi değiştiğinde eski adres burada tutulur ve kalıcı
-- yönlendirmeyle yenisine taşınır. Dış bağlantılar ve arama sonuçları
-- kırılmaz.
CREATE TABLE yonlendirme (
    id         BIGSERIAL PRIMARY KEY,
    eski_yol   VARCHAR(300) NOT NULL UNIQUE,
    yeni_yol   VARCHAR(300) NOT NULL,
    olusturma  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Panelden yüklenen belgeler. Dosyalar paylaşılan bir dizinde durur;
-- burada yalnızca kaydı tutulur.
CREATE TABLE yuklenen_dosya (
    id         BIGSERIAL PRIMARY KEY,
    dosya_adi  VARCHAR(255) NOT NULL UNIQUE,
    ozgun_ad   VARCHAR(255),
    boyut      BIGINT NOT NULL DEFAULT 0,
    yukleyen   VARCHAR(100),
    yukleme    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Kaynak aktarımından gelen ilk hâl, geri dönülebilecek bir başlangıç
-- noktası olarak kaydedilir.
INSERT INTO sayfa_surum (sayfa_id, baslik, icerik_html, aciklama, kaydeden)
SELECT id, baslik, icerik_html, 'Kaynak sitedeki ilk hâli', 'aktarim' FROM sayfa;
