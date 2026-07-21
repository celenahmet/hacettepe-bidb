package tr.edu.hacettepe.bidb.dto.yonetim;

import tr.edu.hacettepe.bidb.model.Sayfa;

/** Yönetim listesinde sayfa özeti; içerik metni taşınmaz. */
public record SayfaYonetimDto(
        Long id, String slug, String dil, String baslik,
        String seoTitle, String seoDescription, String seoKeywords,
        boolean yayinda, int icerikUzunlugu
) {
    public static SayfaYonetimDto of(Sayfa s) {
        return new SayfaYonetimDto(
                s.getId(), s.getSlug(), s.getDil(), s.getBaslik(),
                s.getSeoTitle(), s.getSeoDescription(), s.getSeoKeywords(),
                s.isYayinda(), s.getIcerikHtml() == null ? 0 : s.getIcerikHtml().length());
    }
}
