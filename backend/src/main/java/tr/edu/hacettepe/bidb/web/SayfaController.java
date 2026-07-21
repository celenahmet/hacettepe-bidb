package tr.edu.hacettepe.bidb.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.dto.SayfaDto;
import tr.edu.hacettepe.bidb.repo.SayfaRepo;

import java.util.List;

/** Sayfa içerikleri. Adres yapısı: /api/{dil}/sayfa/{slug} */
@RestController
@RequestMapping("/api/{dil}")
public class SayfaController {

    private final SayfaRepo sayfalar;

    public SayfaController(SayfaRepo sayfalar) {
        this.sayfalar = sayfalar;
    }

    @GetMapping("/sayfa/{slug}")
    public ResponseEntity<SayfaDto> sayfa(@PathVariable String dil, @PathVariable String slug) {
        // Diğer dildeki karşılığı varsa hreflang bağlantısı verilebilir
        boolean cevirisiVar = sayfalar.bul(slug, dil.equals("en") ? "tr" : "en").isPresent();
        return sayfalar.bul(slug, dil)
                .map(s -> SayfaDto.of(s, cevirisiVar))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** Site haritası ve gezinme için sayfa listesi. */
    @GetMapping("/sayfalar")
    public List<SayfaDto> liste(@PathVariable String dil) {
        return sayfalar.findByDilAndYayindaTrueOrderBySiraAsc(dil).stream().map(SayfaDto::ozet).toList();
    }
}
