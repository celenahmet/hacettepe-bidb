-- Haber ve duyuruların okunma sayısı kalıcı olarak tutulur.
-- Sayaç yalnızca artar; mevcut kayıtlar sıfırdan başlar.
ALTER TABLE news
    ADD COLUMN view_count BIGINT NOT NULL DEFAULT 0;

ALTER TABLE news
    ADD CONSTRAINT news_view_count_nonnegative CHECK (view_count >= 0);
