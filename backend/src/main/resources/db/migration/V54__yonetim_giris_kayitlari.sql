-- Yönetim paneline yapılan her giriş denemesinin kaydı: kim (kullanıcı adı
-- denemesi), ne zaman, nereden (IP, tahmini şehir/ülke), hangi cihaz ve
-- tarayıcıdan, başarılı mı. Kurumsal güvenlik denetimi içindir; IP yalnızca
-- bu tabloda, yalnızca giriş denemeleri için tutulur (site geneli anonim
-- analitikte IP hiç saklanmaz — bu politika değişmedi, bu tablo ayrı ve
-- kasıtlı bir istisnadır).
CREATE TABLE admin_login_event (
    id                BIGSERIAL PRIMARY KEY,
    occurred_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    successful        BOOLEAN NOT NULL,
    attempted_username VARCHAR(120),
    ip_address        VARCHAR(64) NOT NULL,
    user_agent        VARCHAR(500),
    device_class      VARCHAR(20),
    browser           VARCHAR(40),
    operating_system   VARCHAR(40),
    city              VARCHAR(120),
    country           VARCHAR(120)
);

CREATE INDEX admin_login_event_time_idx ON admin_login_event (occurred_at DESC);
