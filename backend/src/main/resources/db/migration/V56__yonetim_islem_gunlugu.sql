-- Yönetim panelinde yapılan değişiklik işlemlerinin (oluşturma/güncelleme/silme)
-- denetim kaydı. Paylaşılan tek yönetici hesabı olduğundan kullanıcı kimliği
-- yerine tarayıcı oturumu (session_id, girişte üretilir) ayırt edici kabul edilir.
CREATE TABLE admin_audit_event (
    id BIGSERIAL PRIMARY KEY,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    session_id VARCHAR(64) NOT NULL,
    attempted_username VARCHAR(120),
    ip_address VARCHAR(64) NOT NULL,
    local_ip_address VARCHAR(64),
    http_method VARCHAR(10) NOT NULL,
    resource_path VARCHAR(200) NOT NULL,
    action_label VARCHAR(160) NOT NULL,
    http_status INTEGER NOT NULL,
    successful BOOLEAN NOT NULL
);

CREATE INDEX admin_audit_event_time_idx ON admin_audit_event (occurred_at DESC);
CREATE INDEX admin_audit_event_session_idx ON admin_audit_event (session_id);
