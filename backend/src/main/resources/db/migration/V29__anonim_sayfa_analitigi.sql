-- Aylık içerik raporları için anonim sayfa görüntüleme olayları.
-- Kişi/oturum/çerez/IP/user-agent/referrer URL'si tutulmaz.
CREATE TABLE analytics_page_view (
    id            BIGSERIAL PRIMARY KEY,
    path          VARCHAR(300) NOT NULL,
    language      VARCHAR(2) NOT NULL CHECK (language IN ('tr', 'en')),
    device_class  VARCHAR(12) NOT NULL CHECK (device_class IN ('mobile', 'tablet', 'desktop')),
    referrer_type VARCHAR(12) NOT NULL CHECK (referrer_type IN ('direct', 'internal', 'search', 'social', 'external')),
    recorded_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX analytics_page_view_time_idx
    ON analytics_page_view (recorded_at DESC);
CREATE INDEX analytics_page_view_path_time_idx
    ON analytics_page_view (path, recorded_at DESC);
