-- E-posta altyapısı, 1. adım: ayarlar ve gönderim günlüğü.
--
-- Bu adım kimlik doğrulamaya HİÇ DOKUNMAZ. Sebebi: yönetici hesabı şu anda
-- bellekte ve ortam değişkeninden geliyor (SecurityConfig.yoneticiler).
-- Parola sıfırlama bunun veritabanına taşınmasını gerektiriyor ve bu, yanlış
-- yapıldığında yöneticiyi kendi panelinden kilitleyen bir değişiklik. Bu
-- yüzden iş üç adıma bölündü: (1) ayarlar + günlük, (2) kimliğin taşınması,
-- (3) sıfırlama akışı. Her adım tek başına doğrulanabilir.
--
-- ============================ mail_setting ============================
--
-- Tek satırlık yapılandırma. Neden tablo: sunucu adresi, kapı ve gönderen
-- adresi kurum içinde değişebiliyor ve bunun için yeniden yayım yapmak
-- gerekmemeli.
--
-- PAROLA BURADA DEĞİL. Bilinçli: veritabanı yedekleri, göç dökümleri ve
-- panel yanıtları parolayı taşımamalı. Parola yalnızca ortam değişkeninden
-- (BIDB_MAIL_PAROLA) okunur; panelde "tanımlı / tanımlı değil" bilgisi
-- gösterilir, değerin kendisi hiçbir uçtan DÖNMEZ.
--
-- Tek satır güvencesi: tek_satir sütunu her zaman TRUE ve üzerinde tekil
-- kısıt var. Böylece ikinci bir yapılandırma satırı oluşamaz ve "hangisi
-- geçerli?" sorusu hiç doğmaz.

CREATE TABLE mail_setting (
    id               BIGSERIAL PRIMARY KEY,
    tek_satir        BOOLEAN      NOT NULL DEFAULT TRUE,
    host             VARCHAR(200),
    port             INTEGER,
    username         VARCHAR(200),
    from_address     VARCHAR(254),
    from_name        VARCHAR(120),
    -- NONE | STARTTLS | SSL
    security_mode    VARCHAR(20)  NOT NULL DEFAULT 'STARTTLS',
    -- Kapalıyken hiçbir e-posta gönderilmez; denemeler günlüğe SKIPPED düşer.
    enabled          BOOLEAN      NOT NULL DEFAULT FALSE,
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by       VARCHAR(120),

    CONSTRAINT mail_setting_tek_satir_chk    CHECK (tek_satir IS TRUE),
    CONSTRAINT mail_setting_tek_satir_uq     UNIQUE (tek_satir),
    CONSTRAINT mail_setting_port_chk         CHECK (port IS NULL OR (port BETWEEN 1 AND 65535)),
    CONSTRAINT mail_setting_security_chk     CHECK (security_mode IN ('NONE', 'STARTTLS', 'SSL'))
);

-- Başlangıç satırı kapalı gelir: yapılandırılmadan hiçbir şey gönderilmesin.
INSERT INTO mail_setting (host, port, security_mode, enabled)
VALUES (NULL, 587, 'STARTTLS', FALSE);

-- ============================== mail_log ==============================
--
-- Gönderilen (ve gönderilemeyen) her e-postanın kaydı.
--
-- İÇERİK SAKLANMAZ. Bilinçli ve güvenlik gereği: parola sıfırlama
-- e-postasının gövdesi sıfırlama bağlantısını taşır. Gövdeyi günlüğe
-- yazmak, panele erişebilen herkese o bağlantıyı vermek demektir - yani
-- günlüğün kendisi bir saldırı yüzeyine dönüşür. Konu başlığı ve alıcı
-- yeterli; ne olduğunu anlamaya yeter, kötüye kullanılmaya yetmez.
--
-- error_message yalnızca sunucunun döndürdüğü teknik hatayı taşır; bu da
-- panelde gösterilir çünkü teşhis için gerekli.

CREATE TABLE mail_log (
    id             BIGSERIAL PRIMARY KEY,
    to_address     VARCHAR(254) NOT NULL,
    subject        VARCHAR(300) NOT NULL,
    -- PAROLA_SIFIRLAMA | TALEP_BILDIRIM | SINAMA
    purpose        VARCHAR(40)  NOT NULL,
    -- SENT | FAILED | SKIPPED
    status         VARCHAR(20)  NOT NULL,
    error_message  VARCHAR(500),
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT mail_log_status_chk CHECK (status IN ('SENT', 'FAILED', 'SKIPPED'))
);

-- Günlük en yeniden eskiye listelenir; sayfalama bu indeksle çalışır.
CREATE INDEX mail_log_created_at_idx ON mail_log (created_at DESC);
