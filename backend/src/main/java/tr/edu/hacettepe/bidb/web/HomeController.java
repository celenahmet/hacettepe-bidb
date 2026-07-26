package tr.edu.hacettepe.bidb.web;

import org.springframework.data.domain.Limit;
import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.dto.HomeDto;
import tr.edu.hacettepe.bidb.dto.PageDto;
import tr.edu.hacettepe.bidb.dto.SliderDto;
import tr.edu.hacettepe.bidb.model.Shortcut;
import tr.edu.hacettepe.bidb.repo.NewsRepo;
import tr.edu.hacettepe.bidb.repo.PageRepo;
import tr.edu.hacettepe.bidb.repo.ShortcutRepo;
import tr.edu.hacettepe.bidb.repo.SliderRepo;

import java.util.List;

/** Ana sayfa bileşenleri tek uçtan sunulur. */
@RestController
@RequestMapping("/api/{language}")
public class HomeController {

    private final SliderRepo sliderlar;
    private final ShortcutRepo shortcuts;
    private final NewsRepo news;
    private final PageRepo pages;

    public HomeController(SliderRepo sliderlar, ShortcutRepo shortcuts, NewsRepo news, PageRepo pages) {
        this.sliderlar = sliderlar;
        this.shortcuts = shortcuts;
        this.news = news;
        this.pages = pages;
    }

    @GetMapping("/home")
    public HomeDto anaSayfa(@PathVariable String language) {
        List<Shortcut> tumu = shortcuts.findByLanguageAndPublishedTrueOrderBySortOrderAscIdAsc(language);

        boolean hasTranslation = pages.existsBySlugAndLanguageAndPublishedTrue(
                "home", language.equals("en") ? "tr" : "en");
        PageDto seo = pages.findFirstBySlugAndLanguageAndPublishedTrue("home", language)
                .map(page -> PageDto.summary(page, hasTranslation))
                .orElse(null);

        return new HomeDto(
                seo,
                sliderlar.findByLanguageAndPublishedTrueOrderBySortOrderAsc(language).stream().map(SliderDto::of).toList(),
                tumu.stream().filter(h -> !"service".equals(h.getType()))
                        .map(HomeDto.KisayolDto::of).toList(),
                tumu.stream().filter(h -> "service".equals(h.getType()))
                        .map(HomeDto.KisayolDto::of).toList(),
                news.findByLanguageAndPublishedTrueOrderByFeaturedDescPublishedOnDesc(language, Limit.of(12)).stream()
                        .map(HomeDto.NewsDto::of).toList()
        );
    }
}
