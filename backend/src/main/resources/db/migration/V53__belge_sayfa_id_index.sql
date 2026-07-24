-- document.page_id üzerinde hiç index yoktu (V1'den bu yana). PageRepo.findBySlugAndLanguage
-- her sayfa görüntülemesinde "LEFT JOIN FETCH s.documents" ile bu sütuna göre eşleşiyor;
-- indexsiz, her istek document tablosunun tamamını taratıyordu. Aynı erişim kalıbı
-- staff_member.unit_id için zaten indexliydi (idx_staff_member_birim, V11) — document bu
-- örüntünün gözden kaçan tek istisnasıydı.
CREATE INDEX document_page_idx ON document (page_id);
