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
@RequestMapping("/api/{dil}/duyuru")
public class NewsController {

    private final NewsRepo duyurular;

    public NewsController(NewsRepo duyurular) {
        this.duyurular = duyurular;
    }

    public record HaberDto(Long id, String slug, String baslik, String ozet, LocalDate tarih,
                           String gorselUrl, String gorselAlt, String icerikHtml, String disAdres) {
        static HaberDto of(News d) {
            return new HaberDto(d.getId(), d.getSlug(), d.getBaslik(), d.getOzet(), d.getYayinTarihi(),
                    d.getGorselUrl(), d.getGorselAlt(), d.getIcerikHtml(), d.getDisAdres());
        }
    }

    /** Tüm haberler, en yeni önce. */
    @GetMapping
    public List<HaberDto> liste(@PathVariable String dil) {
        return duyurular.findByDilAndYayindaTrueOrderByYayinTarihiDesc(dil).stream()
                .map(HaberDto::of)
                .toList();
    }

    @GetMapping("/{slug}")
    public ResponseEntity<HaberDto> haber(@PathVariable String dil, @PathVariable String slug) {
        return duyurular.findBySlugAndDilAndYayindaTrue(slug, dil)
                .map(HaberDto::of)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
