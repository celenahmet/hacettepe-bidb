package tr.edu.hacettepe.bidb.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.model.News;
import tr.edu.hacettepe.bidb.repo.NewsRepo;

import java.time.LocalDate;
import java.util.List;

/**
 * Haber ve duyurular.
 *
 * Bir duyuru ya kısa bir bağlantıdır (dış adres), ya da kendi sayfası olan
 * görselli bir haberdir. İkincisi /tr/duyuru/<slug> adresinde açılır.
 */
@RestController
@RequestMapping("/api/{language}/news")
public class NewsController {

    private final NewsRepo news;

    public NewsController(NewsRepo news) {
        this.news = news;
    }

    public record HaberDto(Long id, String slug, String title, String summary, LocalDate date,
                           String imageUrl, String imageAlt, String contentHtml, String externalUrl) {
        static HaberDto of(News d) {
            return new HaberDto(d.getId(), d.getSlug(), d.getTitle(), d.getSummary(), d.getPublishedOn(),
                    d.getImageUrl(), d.getImageAlt(), d.getContentHtml(), d.getExternalUrl());
        }
    }

    /** Tüm haberler, en yeni önce. */
    @GetMapping
    public List<HaberDto> liste(@PathVariable String language) {
        return news.findByLanguageAndPublishedTrueOrderByPublishedOnDesc(language).stream()
                .map(HaberDto::of)
                .toList();
    }

    @GetMapping("/{slug}")
    public ResponseEntity<HaberDto> haber(@PathVariable String language, @PathVariable String slug) {
        return news.findBySlugAndLanguageAndPublishedTrue(slug, language)
                .map(HaberDto::of)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
