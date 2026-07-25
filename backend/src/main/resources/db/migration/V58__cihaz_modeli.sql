-- Mobil cihazlarda (Android) User-Agent genelde gerçek cihaz model kodunu
-- taşır (ör. "SM-S911B"); bu bilgi ayrı bir alanda tutulur. iOS UA'ları
-- model numarası vermez, yalnızca "iPhone"/"iPad" olarak kalır.
ALTER TABLE admin_login_event ADD COLUMN device_model VARCHAR(120);
