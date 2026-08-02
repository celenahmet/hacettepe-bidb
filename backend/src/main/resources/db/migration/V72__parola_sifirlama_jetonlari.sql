-- E-posta altyapısı, 3. adım: parola sıfırlama jetonları.
--
-- JETONUN KENDİSİ SAKLANMAZ, yalnızca SHA-256 karması saklanır. Sebebi:
-- veritabanını okuyabilen biri (yedek, sızıntı, yetkisiz sorgu) saklanan
-- değerle sıfırlama yapabilmemeli. Karma tek yönlüdür; e-postadaki jetondan
-- karma üretilip karşılaştırılır, tersi mümkün değildir.
--
-- TEK KULLANIMLIK: used_at dolduğunda jeton bir daha kabul edilmez. Ayrıca
-- bir jeton kullanıldığında aynı hesabın bekleyen DİĞER jetonları da
-- geçersizleşir; aksi hâlde arka arkaya istenen bağlantıların hepsi
-- açık kalır ve saldırı penceresi gereksiz yere genişler.
--
-- SÜRELİ: expires_at geçtikten sonra kabul edilmez. Süre kısa tutulur;
-- e-posta kutusuna sonradan erişen birinin eski bir bağlantıyı kullanması
-- zorlaşsın.
--
-- İSTEK VE KULLANIM ADRESİ AYRI TUTULUR: jeton bir adresten istenip başka
-- bir adresten kullanıldıysa bu, güvenlik incelemesinde anlamlı bir
-- sinyaldir. Kayıt tutulur ama tek başına engelleme sebebi sayılmaz -
-- kurumsal ağda çıkış adresi değişebiliyor.

CREATE TABLE admin_password_reset (
    id             BIGSERIAL PRIMARY KEY,
    account_id     BIGINT       NOT NULL REFERENCES admin_account(id) ON DELETE CASCADE,
    -- SHA-256, onaltılık: 64 karakter. Jetonun kendisi DEĞİL.
    token_hash     VARCHAR(64)  NOT NULL,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at     TIMESTAMPTZ  NOT NULL,
    used_at        TIMESTAMPTZ,
    requested_ip   VARCHAR(64),
    used_ip        VARCHAR(64),

    CONSTRAINT admin_password_reset_token_uq UNIQUE (token_hash)
);

-- Doğrulama sorgusu karmadan gider; tekil kısıt zaten indeks sağlıyor.
-- Bu indeks, hesabın bekleyen jetonlarını toplu geçersizleştirmek içindir.
CREATE INDEX admin_password_reset_account_idx
    ON admin_password_reset (account_id, used_at);
