-- Tahmini konumun yanında, bağlantının hangi internet servis sağlayıcısı/
-- kurumu üzerinden geldiği de gösterilir (ör. "Türk Telekom", "Google LLC").
ALTER TABLE admin_login_event ADD COLUMN isp VARCHAR(200);
