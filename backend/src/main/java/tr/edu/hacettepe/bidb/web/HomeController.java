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
@RequestMapping("/api/{language}")
public class HomeController {

    /** 100 ve üzeri sıra değerleri servis karuselini gösterir. */
    private static final int SERVIS_SIRA_ESIGI = 100;

    private final SliderRepo sliderlar;
    private final ShortcutRepo shortcuts;
    private final NewsRepo news;

    public HomeController(SliderRepo sliderlar, ShortcutRepo shortcuts, NewsRepo news) {
        this.sliderlar = sliderlar;
        this.shortcuts = shortcuts;
        this.news = news;
    }

    @GetMapping("/home")
    public HomeDto anaSayfa(@PathVariable String language) {
        List<Shortcut> tumu = shortcuts.findByLanguageAndPublishedTrueOrderBySortOrderAsc(language);

        return new HomeDto(
                sliderlar.findByLanguageAndPublishedTrueOrderBySortOrderAsc(language).stream().map(SliderDto::of).toList(),
                tumu.stream().filter(h -> h.getSortOrder() < SERVIS_SIRA_ESIGI)
                        .map(HomeDto.KisayolDto::of).toList(),
                tumu.stream().filter(h -> h.getSortOrder() >= SERVIS_SIRA_ESIGI)
                        .map(HomeDto.KisayolDto::of).toList(),
                news.findByLanguageAndPublishedTrueOrderByPublishedOnDesc(language, Limit.of(12)).stream()
                        .map(HomeDto.NewsDto::of).toList()
        );
    }
}
