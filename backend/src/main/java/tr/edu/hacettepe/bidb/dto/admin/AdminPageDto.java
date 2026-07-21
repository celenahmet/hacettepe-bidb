package tr.edu.hacettepe.bidb.dto.admin;

import tr.edu.hacettepe.bidb.model.Page;

/** Yönetim listesinde sayfa özeti; içerik metni taşınmaz. */
public record AdminPageDto(
        Long id, String slug, String dil, String baslik,
        String seoTitle, String seoDescription, String seoKeywords,
        boolean yayinda, int icerikUzunlugu
) {
    public static AdminPageDto of(Page s) {
        return new AdminPageDto(
                s.getId(), s.getSlug(), s.getDil(), s.getBaslik(),
                s.getSeoTitle(), s.getSeoDescription(), s.getSeoKeywords(),
                s.isYayinda(), s.getIcerikHtml() == null ? 0 : s.getIcerikHtml().length());
    }
}
