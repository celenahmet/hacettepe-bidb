-- Kapsamlı İngilizce çeviri denetimi (Gemini destekli önceki oturumlar
-- sonrası kalite kontrolü). Sistematik taramalar (unutulmuş Türkçe kelime,
-- TR/EN uzunluk oranı, terminoloji tutarlılığı, US/UK yazım) çoğunlukla
-- temiz çıktı; tek somut bulgu:
--
-- 'overview' sayfasında TR kaynaktaki "Bİ (Bireysel İşlemler)" kısaltması
-- "IT (Individual Transactions)" olarak çevrilmişti. "IT" İngilizcede
-- neredeyse her zaman "Information Technology" anlamına gelir — kurumun
-- kendi adı "Department of INFORMATION TECHNOLOGY" olan bir sitede bu,
-- aynı cümlede iki farklı "IT" anlamı çakışması yaratıp okuyucuyu
-- yanıltıyordu. Zaten yayında olan Organisation Chart sayfası aynı birimi
-- kısaltmasız "Individual Transactions" olarak adlandırıyor (bkz. "EDMS
-- and Individual Transactions Unit") — buradaki metin de aynı, tutarlı
-- biçime getirildi; hiçbir bilgi kaybı yok, yalnızca yanıltıcı kısaltma
-- kaldırıldı.

UPDATE page
SET content_html = replace(
  content_html,
  'EDMS (Electronic Document Management System) and IT (Individual Transactions) systems',
  'EDMS (Electronic Document Management System) and Individual Transactions systems'
),
updated_at = now()
WHERE slug = 'overview' AND language = 'en';
