-- Güvenlik kayıtlarında genel (public, X-Forwarded-For ilk halka) ve yerel
-- (private, doğrudan bağlantı adresi) IPv4 ayrı tutulur. Çoğu bağlantı
-- kurum içi ağlardan geldiği için ikisinin birlikte görünmesi anlamlıdır.
ALTER TABLE admin_login_event ADD COLUMN local_ip_address VARCHAR(64);
