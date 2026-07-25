package tr.edu.hacettepe.bidb.web;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import tr.edu.hacettepe.bidb.model.News;
import tr.edu.hacettepe.bidb.repo.NewsRepo;
import tr.edu.hacettepe.bidb.security.HizSinirlayici;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

/**
 * Haber ve duyurular.
 *
 * Bir duyuru ya kısa bir bağlantıdır (dış adres), ya da kendi sayfası olan
 * görselli bir haberdir. İkincisi /tr/duyuru/<slug> adresinde açılır.
 */
@RestController
@RequestMapping({"/api/{language}/news", "/api/{language}/newsItem"})
public class NewsController {

    private final NewsRepo news;
    private final HizSinirlayici hizSinirlayici;

    public NewsController(NewsRepo news, HizSinirlayici hizSinirlayici) {
        this.news = news;
        this.hizSinirlayici = hizSinirlayici;
    }

    public record HaberDto(Long id, String slug, String title, String summary, LocalDate date,
                           String imageUrl, String imageAlt, String contentHtml,
                           String externalUrl, long viewCount, String category,
                           String audience, String coverTemplate, String coverText,
                           String seoTitle, String seoDescription, String seoKeywords,
                           String seoRobots, OffsetDateTime updatedAt) {
        static HaberDto of(News d) {
            return new HaberDto(d.getId(), d.getSlug(), d.getTitle(), d.getSummary(), d.getPublishedOn(),
                    d.getImageUrl(), d.getImageAlt(), d.getContentHtml(),
                    d.getExternalUrl(), d.getViewCount(), d.getCategory(),
                    d.getAudience(), d.getCoverTemplate(), d.getCoverText(),
                    d.getSeoTitle(), d.getSeoDescription(), d.getSeoKeywords(),
                    d.getSeoRobots(), d.getUpdatedAt());
        }

        static HaberDto of(News d, long viewCount) {
            return new HaberDto(d.getId(), d.getSlug(), d.getTitle(), d.getSummary(), d.getPublishedOn(),
                    d.getImageUrl(), d.getImageAlt(), d.getContentHtml(),
                    d.getExternalUrl(), viewCount, d.getCategory(),
                    d.getAudience(), d.getCoverTemplate(), d.getCoverText(),
                    d.getSeoTitle(), d.getSeoDescription(), d.getSeoKeywords(),
                    d.getSeoRobots(), d.getUpdatedAt());
        }
    }

    /** Tüm haberler, en yeni önce. */
    @GetMapping
    public List<HaberDto> liste(@PathVariable String language) {
        return news.findByLanguageAndPublishedTrueOrderByFeaturedDescPublishedOnDesc(language).stream()
                .map(HaberDto::of)
                .toList();
    }

    @GetMapping("/{slug}")
    public ResponseEntity<HaberDto> haber(@PathVariable String language, @PathVariable String slug,
                                           HttpServletRequest servletRequest) {
        return news.findBySlugAndLanguageAndPublishedTrue(slug, language)
                .map(d -> {
                    // Görüntülenme sayısı yalnızca hız sınırının altındayken artırılır;
                    // sayfanın kendisi (aşılsa bile) her zaman normal döner — sınırlama
                    // sayacı botlardan korur, ziyaretçinin sayfa görmesini engellemez.
                    boolean sayilsin = !gorunumSiniriniAsti(servletRequest);
                    int guncellenen = sayilsin ? news.goruntulenmeyiArtir(d.getId(), language) : 0;
                    long yeniSayi = d.getViewCount() + (guncellenen == 1 ? 1 : 0);
                    return HaberDto.of(d, yeniSayi);
                })
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** Dış bağlantılı duyurularda kart tıklaması görüntülenme olarak sayılır. */
    @PostMapping("/{id}/view")
    public ResponseEntity<Void> goruntulenme(@PathVariable String language, @PathVariable Long id,
                                              HttpServletRequest servletRequest) {
        if (gorunumSiniriniAsti(servletRequest)) throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS);
        return news.goruntulenmeyiArtir(id, language) == 1
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    /** İki uç da aynı sayacı artırdığından, kimliksiz bir betiğin GET/POST arasında
     *  geçiş yaparak sınırı atlamasını önlemek için ortak bir anahtar kullanılır. */
    private boolean gorunumSiniriniAsti(HttpServletRequest request) {
        String adres = hizSinirlayici.istekAdresi(request);
        return hizSinirlayici.asildiMi("haber-goruntulenme:" + adres, 40, 60);
    }
}
