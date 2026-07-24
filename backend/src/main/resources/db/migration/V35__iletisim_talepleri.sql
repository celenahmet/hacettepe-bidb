CREATE TABLE contact_ticket (
    id BIGSERIAL PRIMARY KEY,
    reference_code VARCHAR(20) NOT NULL UNIQUE,
    language VARCHAR(2) NOT NULL DEFAULT 'tr',
    category VARCHAR(40) NOT NULL,
    subject VARCHAR(160) NOT NULL,
    requester_name VARCHAR(120) NOT NULL,
    requester_email VARCHAR(254) NOT NULL,
    requester_phone VARCHAR(30),
    message TEXT NOT NULL,
    status VARCHAR(24) NOT NULL DEFAULT 'NEW',
    priority VARCHAR(16) NOT NULL DEFAULT 'NORMAL',
    assigned_to VARCHAR(120),
    admin_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ,
    CONSTRAINT contact_ticket_language_ck CHECK (language IN ('tr', 'en')),
    CONSTRAINT contact_ticket_status_ck CHECK (status IN ('NEW', 'IN_PROGRESS', 'WAITING', 'RESOLVED', 'CLOSED')),
    CONSTRAINT contact_ticket_priority_ck CHECK (priority IN ('NORMAL', 'HIGH', 'URGENT'))
);

CREATE INDEX contact_ticket_status_created_idx ON contact_ticket (status, created_at DESC);
CREATE INDEX contact_ticket_email_idx ON contact_ticket (requester_email);

CREATE TABLE contact_ticket_event (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL REFERENCES contact_ticket(id) ON DELETE CASCADE,
    event_type VARCHAR(24) NOT NULL,
    from_status VARCHAR(24),
    to_status VARCHAR(24),
    note TEXT,
    actor VARCHAR(120) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX contact_ticket_event_ticket_idx ON contact_ticket_event (ticket_id, created_at DESC);
