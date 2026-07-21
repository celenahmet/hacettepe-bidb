package tr.edu.hacettepe.bidb.web;

import org.springframework.data.domain.Limit;
import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.dto.HomeDto;
import tr.edu.hacettepe.bidb.dto.SliderDto;
import tr.edu.hacettepe.bidb.model.Shortcut;
import tr.edu.hacettepe.bidb.repo.NewsRepo;
import tr.edu.hacettepe.bidb.repo.ShortcutRepo;
import tr.edu.hacettepe.bidb.repo.SliderRepo;

import java.util.List;

/** Ana sayfa bileşenleri tek uçtan sunulur. */
@RestController
@RequestMapping("/api/{dil}")
public class HomeController {

    /** 100 ve üzeri sıra değerleri servis karuselini gösterir. */
    private static final int SERVIS_SIRA_ESIGI = 100;

    private final SliderRepo sliderlar;
    private final ShortcutRepo kisayollar;
    private final NewsRepo duyurular;

    public HomeController(SliderRepo sliderlar, ShortcutRepo kisayollar, NewsRepo duyurular) {
        this.sliderlar = sliderlar;
        this.kisayollar = kisayollar;
        this.duyurular = duyurular;
    }

    @GetMapping("/anasayfa")
    public HomeDto anaSayfa(@PathVariable String dil) {
        List<Shortcut> tumu = kisayollar.findByDilAndYayindaTrueOrderBySiraAsc(dil);

        return new HomeDto(
                sliderlar.findByDilAndYayindaTrueOrderBySiraAsc(dil).stream().map(SliderDto::of).toList(),
                tumu.stream().filter(h -> h.getSira() < SERVIS_SIRA_ESIGI)
                        .map(HomeDto.KisayolDto::of).toList(),
                tumu.stream().filter(h -> h.getSira() >= SERVIS_SIRA_ESIGI)
                        .map(HomeDto.KisayolDto::of).toList(),
                duyurular.findByDilAndYayindaTrueOrderByYayinTarihiDesc(dil, Limit.of(12)).stream()
                        .map(HomeDto.NewsDto::of).toList()
        );
    }
}
