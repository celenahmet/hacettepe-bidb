-- V12'de eklenen /tr/about -> /tr/overview yönlendirmesi kaldırılır.
--
-- Yönlendirme, sayfa aranmadan önce çalışır; bu yüzden aynı adreste hem
-- yönlendirme hem sayfa varsa sayfa hiç görünmez. /tr/about artık yeni
-- Hakkımızda sayfasının adresi olduğu için yönlendirmenin kalkması gerekir.
--
-- Dışarıdan bir bağlantı kırılmıyor: /tr/about adresi kaynak sitede hiç
-- var olmadı, bu proje içinde verilmiş bir addı. Kaynaktaki gerçek adres
-- /tr/geneltanitim ve o yönlendirme yerinde duruyor.

DELETE FROM redirect WHERE old_path = '/tr/about';
