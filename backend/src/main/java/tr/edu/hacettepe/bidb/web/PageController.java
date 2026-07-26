package tr.edu.hacettepe.bidb.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.dto.PageDto;
import tr.edu.hacettepe.bidb.repo.PageRepo;

import java.util.List;

/** Page içerikleri. Adres yapısı: /api/{language}/sayfa/{slug} */
@RestController
@RequestMapping("/api/{language}")
public class PageController {

    private final PageRepo pages;

    public PageController(PageRepo pages) {
        this.pages = pages;
    }

    @GetMapping("/pages/{slug}")
    public ResponseEntity<PageDto> sayfa(@PathVariable String language, @PathVariable String slug) {
        // Diğer dildeki karşılığı varsa hreflang bağlantısı verilebilir
        boolean hasTranslation = pages.existsBySlugAndLanguageAndPublishedTrue(
                slug, language.equals("en") ? "tr" : "en");
        return pages.findBySlugAndLanguage(slug, language)
                .map(s -> PageDto.of(s, hasTranslation))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** Site haritası ve gezinme için sayfa listesi. */
    @GetMapping("/pages")
    public List<PageDto> liste(@PathVariable String language) {
        String otherLanguage = language.equals("en") ? "tr" : "en";
        var translatedSlugs = pages.findByLanguageAndPublishedTrueOrderBySortOrderAscIdAsc(otherLanguage)
                .stream().map(s -> s.getSlug()).collect(java.util.stream.Collectors.toSet());
        return pages.findByLanguageAndPublishedTrueOrderBySortOrderAscIdAsc(language).stream()
                .map(s -> PageDto.summary(s, translatedSlugs.contains(s.getSlug())))
                .toList();
    }
}
