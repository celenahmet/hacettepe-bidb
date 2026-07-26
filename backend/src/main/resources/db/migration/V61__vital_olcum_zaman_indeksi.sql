-- web_vital_sample tablosunda birincil anahtar dışında hiç indeks yoktu, ama
-- tabloya yapılan iki erişimin de ölçütü recorded_at:
--
--   1. Kalite panosu:  WHERE recorded_at >= :since  (bkz. WebVitalSampleRepo)
--   2. Gecelik temizlik: deleteByRecordedAtBefore    (bkz. WebVitalCleanup)
--
-- Tablo her ziyaretçi sayfa görüntülemesinde beş satır alıyor ve 90 gün
-- saklanıyor; yani zamanla en hızlı büyüyen tablo burası olacak. İndekssiz
-- durumda her iki işlem de tüm tabloyu taramak zorunda kalırdı.
--
-- analytics_page_view tablosundaki analytics_page_view_time_idx ile aynı
-- adlandırma ve amaç.
CREATE INDEX IF NOT EXISTS web_vital_sample_time_idx
    ON web_vital_sample (recorded_at);
