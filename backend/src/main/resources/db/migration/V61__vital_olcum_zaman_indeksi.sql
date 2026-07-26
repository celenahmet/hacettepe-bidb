-- Tabloya yapılan iki erişimin de ölçütü YALNIZCA recorded_at:
--
--   1. Kalite panosu:   WHERE recorded_at >= :since   (bkz. WebVitalSampleRepo)
--   2. Gecelik temizlik: deleteByRecordedAtBefore     (bkz. WebVitalCleanup)
--
-- Tabloda zaten web_vital_path_metric_idx (path, metric, recorded_at DESC)
-- var, ancak o indeks path ile BAŞLADIĞI için yalnızca zamana göre yapılan
-- bu aralık taramalarına hizmet edemez; iki işlem de tüm tabloyu tarıyordu.
-- Bu indeks onun yerine geçmez, tamamlar.
--
-- Tablo her ziyaretçi sayfa görüntülemesinde beş satır alıyor ve 90 gün
-- saklanıyor; zamanla en hızlı büyüyen tablo burası olacağı için etkisi
-- büyüyerek hissedilirdi. Planlayıcı doğrulandı: her iki sorgu da artık
-- web_vital_sample_time_idx üzerinden ilerliyor.
--
-- analytics_page_view tablosundaki analytics_page_view_time_idx ile aynı
-- adlandırma ve amaç.
CREATE INDEX IF NOT EXISTS web_vital_sample_time_idx
    ON web_vital_sample (recorded_at);
