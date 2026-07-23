package tr.edu.hacettepe.bidb.dto.admin;

import tr.edu.hacettepe.bidb.model.Page;

/** Yönetim listesinde sayfa özeti; içerik metni taşınmaz. */
public record AdminPageDto(
        Long id, String slug, String language, String title,
        String seoTitle, String seoDescription, String seoKeywords,
        String seoImage, String seoRobots, String seoSchemaType,
        boolean published, int contentLength
) {
    public static AdminPageDto of(Page s) {
        return new AdminPageDto(
                s.getId(), s.getSlug(), s.getLanguage(), s.getTitle(),
                s.getSeoTitle(), s.getSeoDescription(), s.getSeoKeywords(),
                s.getSeoImage(), s.getSeoRobots(), s.getSeoSchemaType(),
                s.isPublished(), s.getContentHtml() == null ? 0 : s.getContentHtml().length());
    }
}
