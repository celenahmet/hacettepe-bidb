package tr.edu.hacettepe.bidb.dto;

import tr.edu.hacettepe.bidb.model.News;
import tr.edu.hacettepe.bidb.model.Shortcut;

import java.time.LocalDate;
import java.util.List;

/** Ana sayfanın tüm bileşenleri tek istekte döner. */
public record HomeDto(
        PageDto seo,
        List<SliderDto> slider,
        List<KisayolDto> shortcuts,
        List<KisayolDto> services,
        List<NewsDto> news
) {
    public record KisayolDto(String name, String iconUrl, String url, boolean newTab) {
        public static KisayolDto of(Shortcut h) {
            return new KisayolDto(h.getName(), h.getIconUrl(), h.getUrl(), h.isNewTab());
        }
    }

    public record NewsDto(Long id, String title, LocalDate date, String url,
                            String summary, String imageUrl, String imageAlt,
                            boolean hasOwnPage, long viewCount, String category,
                            String audience, String coverTemplate, String coverText) {
        public static NewsDto of(News d) {
            // Haberin kendi sayfası varsa oraya, yoksa verilen bağlantıya gidilir
            boolean kendi = d.getSlug() != null && !d.getSlug().isBlank();
            String url = kendi ? "/" + d.getLanguage() + "/newsItem/" + d.getSlug() : d.getExternalUrl();
            return new NewsDto(d.getId(), d.getTitle(), d.getPublishedOn(), url,
                    d.getSummary(), d.getImageUrl(), d.getImageAlt(), kendi, d.getViewCount(),
                    d.getCategory(), d.getAudience(), d.getCoverTemplate(), d.getCoverText());
        }
    }
}
