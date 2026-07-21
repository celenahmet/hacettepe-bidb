-- Hacettepe BİDB — veritabanı şeması
-- Tüm metin alanları çift dillidir (dil sütunuyla ayrılır).

/* ---------- Sayfalar ---------- */

CREATE TABLE sayfa (
    id            BIGSERIAL PRIMARY KEY,
    slug          VARCHAR(120) NOT NULL,
    dil           VARCHAR(2)   NOT NULL CHECK (dil IN ('tr', 'en')),
    baslik        VARCHAR(300) NOT NULL,
    -- Kaynak sitedeki içerik birebir korunur (HTML olarak saklanır)
    icerik_html   TEXT         NOT NULL DEFAULT '',
    -- SEO alanları sayfa başına yönetilir
    seo_title       VARCHAR(300),
    seo_description VARCHAR(500),
    seo_keywords    VARCHAR(500),
    yayinda       BOOLEAN      NOT NULL DEFAULT TRUE,
    sira          INTEGER      NOT NULL DEFAULT 0,
    olusturulma   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    guncelleme    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT sayfa_slug_dil UNIQUE (slug, dil)
);

CREATE INDEX sayfa_dil_idx ON sayfa (dil) WHERE yayinda;

/* ---------- Menü ---------- */

CREATE TABLE menu (
    id        BIGSERIAL PRIMARY KEY,
    dil       VARCHAR(2)   NOT NULL CHECK (dil IN ('tr', 'en')),
    -- 'sol' = sol menü, 'ust' = üst menü, 'alt' = footer
    konum     VARCHAR(10)  NOT NULL DEFAULT 'sol',
    baslik    VARCHAR(200) NOT NULL,
    sira      INTEGER      NOT NULL DEFAULT 0
);

CREATE TABLE menu_oge (
    id         BIGSERIAL PRIMARY KEY,
    menu_id    BIGINT       NOT NULL REFERENCES menu (id) ON DELETE CASCADE,
    ust_oge_id BIGINT       REFERENCES menu_oge (id) ON DELETE CASCADE,
    etiket     VARCHAR(200) NOT NULL,
    -- iç bağlantı için sayfa, dış bağlantı için adres
    sayfa_id   BIGINT       REFERENCES sayfa (id) ON DELETE SET NULL,
    dis_adres  VARCHAR(500),
    yeni_sekme BOOLEAN      NOT NULL DEFAULT FALSE,
    sira       INTEGER      NOT NULL DEFAULT 0,
    CONSTRAINT menu_oge_hedef CHECK (sayfa_id IS NOT NULL OR dis_adres IS NOT NULL OR ust_oge_id IS NULL)
);

CREATE INDEX menu_oge_menu_idx ON menu_oge (menu_id, sira);

/* ---------- Slider ---------- */

CREATE TABLE slider (
    id           BIGSERIAL PRIMARY KEY,
    dil          VARCHAR(2)   NOT NULL CHECK (dil IN ('tr', 'en')),
    baslik       VARCHAR(300),
    alt_baslik   VARCHAR(500),
    gorsel_url   VARCHAR(500) NOT NULL,
    gorsel_alt   VARCHAR(300),
    baglanti     VARCHAR(500),
    sira         INTEGER      NOT NULL DEFAULT 0,
    yayinda      BOOLEAN      NOT NULL DEFAULT TRUE,
    baslangic    DATE,
    bitis        DATE
);

/* ---------- Hızlı erişim kutuları ---------- */

CREATE TABLE hizli_erisim (
    id         BIGSERIAL PRIMARY KEY,
    dil        VARCHAR(2)   NOT NULL CHECK (dil IN ('tr', 'en')),
    ad         VARCHAR(200) NOT NULL,
    ikon_url   VARCHAR(500),
    adres      VARCHAR(500) NOT NULL,
    yeni_sekme BOOLEAN      NOT NULL DEFAULT FALSE,
    sira       INTEGER      NOT NULL DEFAULT 0,
    yayinda    BOOLEAN      NOT NULL DEFAULT TRUE
);

/* ---------- Duyuru ve haberler ---------- */

CREATE TABLE duyuru (
    id          BIGSERIAL PRIMARY KEY,
    dil         VARCHAR(2)   NOT NULL CHECK (dil IN ('tr', 'en')),
    baslik      VARCHAR(400) NOT NULL,
    ozet        VARCHAR(1000),
    icerik_html TEXT,
    yayin_tarihi DATE        NOT NULL DEFAULT CURRENT_DATE,
    one_cikan   BOOLEAN      NOT NULL DEFAULT FALSE,
    yayinda     BOOLEAN      NOT NULL DEFAULT TRUE,
    dis_adres   VARCHAR(500)
);

CREATE INDEX duyuru_tarih_idx ON duyuru (dil, yayin_tarihi DESC) WHERE yayinda;

/* ---------- Belgeler (form, yönerge, kılavuz) ---------- */

CREATE TABLE belge (
    id        BIGSERIAL PRIMARY KEY,
    sayfa_id  BIGINT       REFERENCES sayfa (id) ON DELETE CASCADE,
    ad        VARCHAR(400) NOT NULL,
    adres     VARCHAR(700) NOT NULL,
    tur       VARCHAR(10),
    sira      INTEGER      NOT NULL DEFAULT 0
);

/* ---------- Sosyal medya ---------- */

CREATE TABLE sosyal_hesap (
    id      BIGSERIAL PRIMARY KEY,
    ag      VARCHAR(40)  NOT NULL UNIQUE,
    adres   VARCHAR(500) NOT NULL,
    sira    INTEGER      NOT NULL DEFAULT 0,
    yayinda BOOLEAN      NOT NULL DEFAULT TRUE
);

/* ---------- Site ayarları (iletişim, varsayılan SEO) ---------- */

CREATE TABLE ayar (
    anahtar VARCHAR(80) NOT NULL,
    dil     VARCHAR(2)  NOT NULL DEFAULT 'tr',
    deger   TEXT        NOT NULL,
    PRIMARY KEY (anahtar, dil)
);
