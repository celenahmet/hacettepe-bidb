package tr.edu.hacettepe.bidb.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.dto.PageDto;
import tr.edu.hacettepe.bidb.repo.PageRepo;

import java.util.List;

/** Page içerikleri. Adres yapısı: /api/{dil}/sayfa/{slug} */
@RestController
@RequestMapping("/api/{dil}")
public class PageController {

    private final PageRepo sayfalar;

    public PageController(PageRepo sayfalar) {
        this.sayfalar = sayfalar;
    }

    @GetMapping("/sayfa/{slug}")
    public ResponseEntity<PageDto> sayfa(@PathVariable String dil, @PathVariable String slug) {
        // Diğer dildeki karşılığı varsa hreflang bağlantısı verilebilir
        boolean cevirisiVar = sayfalar.findBySlugAndLanguage(slug, dil.equals("en") ? "tr" : "en").isPresent();
        return sayfalar.findBySlugAndLanguage(slug, dil)
                .map(s -> PageDto.of(s, cevirisiVar))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** Site haritası ve gezinme için sayfa listesi. */
    @GetMapping("/sayfalar")
    public List<PageDto> liste(@PathVariable String dil) {
        return sayfalar.findByDilAndYayindaTrueOrderBySiraAsc(dil).stream().map(PageDto::ozet).toList();
    }
}
