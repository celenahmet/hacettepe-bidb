package tr.edu.hacettepe.bidb.dto;

import tr.edu.hacettepe.bidb.model.Document;
import tr.edu.hacettepe.bidb.model.Page;

import java.util.List;
import java.time.OffsetDateTime;

/** Ön yüze gönderilen sayfa verisi. SEO alanları Angular tarafında
 *  <title> ve meta etiketlerine yazılır. */
public record PageDto(
        String slug,
        String language,
        String title,
        String contentHtml,
        String seoTitle,
        String seoDescription,
        String seoKeywords,
        String seoImage,
        String seoRobots,
        String seoSchemaType,
        OffsetDateTime updatedAt,
        List<BelgeDto> documents,
        /** Bu sayfanın diğer dilde karşılığı var mı (hreflang için). */
        boolean hasTranslation,
        /** Page kaynakta hata metni döndürüyor mu (site haritasına alınmaz). */
        boolean brokenContent
) {
    public static PageDto of(Page s) {
        return of(s, false);
    }

    public static PageDto of(Page s, boolean hasTranslation) {
        return new PageDto(
                s.getSlug(), s.getLanguage(), s.getTitle(), s.getContentHtml(),
                s.getSeoTitle(), s.getSeoDescription(), s.getSeoKeywords(),
                s.getSeoImage(), s.getSeoRobots(), s.getSeoSchemaType(), s.getUpdatedAt(),
                s.getDocuments().stream().map(BelgeDto::of).toList(), hasTranslation, hataliMi(s)
        );
    }

    /** Liste görünümleri için içerik olmadan. */
    public static PageDto summary(Page s) {
        return summary(s, false);
    }

    public static PageDto summary(Page s, boolean hasTranslation) {
        return new PageDto(s.getSlug(), s.getLanguage(), s.getTitle(), null,
                s.getSeoTitle(), s.getSeoDescription(), s.getSeoKeywords(),
                s.getSeoImage(), s.getSeoRobots(), s.getSeoSchemaType(), s.getUpdatedAt(),
                List.of(), hasTranslation, hataliMi(s));
    }

    /** Kaynak sitede içeriği olmayan, hata metni dönen sayfalar. Kopya
     *  sadık kalsın diye içerik değiştirilmez; yalnızca site haritasında
     *  ilan edilmezler. */
    private static boolean hataliMi(Page s) {
        String h = s.getContentHtml();
        return h != null && h.contains("Böyle bir sayfa bulunmamaktadır");
    }

    public record BelgeDto(String name, String url, String fileType) {
        public static BelgeDto of(Document b) {
            return new BelgeDto(b.getName(), b.getUrl(), b.getFileType());
        }
    }
}
