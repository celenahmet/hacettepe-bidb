-- Gerçek kullanıcı performans ölçümleri anonim ve en küçük veri kümesiyle saklanır.
-- IP, kullanıcı aracısı, çerez, oturum veya kişi tanımlayıcı hiçbir alan tutulmaz.
CREATE TABLE web_vital_sample (
    id          BIGSERIAL PRIMARY KEY,
    path        VARCHAR(300) NOT NULL,
    metric      VARCHAR(8) NOT NULL,
    value       DOUBLE PRECISION NOT NULL,
    rating      VARCHAR(20) NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT web_vital_metric_check CHECK (metric IN ('LCP', 'INP', 'CLS', 'FCP', 'TTFB')),
    CONSTRAINT web_vital_rating_check CHECK (rating IN ('good', 'needs-improvement', 'poor')),
    CONSTRAINT web_vital_value_check CHECK (value >= 0)
);

CREATE INDEX web_vital_recent_idx ON web_vital_sample (recorded_at DESC);
CREATE INDEX web_vital_path_metric_idx ON web_vital_sample (path, metric, recorded_at DESC);

