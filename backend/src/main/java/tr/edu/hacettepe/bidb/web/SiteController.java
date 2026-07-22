package tr.edu.hacettepe.bidb.web;

import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.dto.MenuDto;
import tr.edu.hacettepe.bidb.dto.SliderDto;
import tr.edu.hacettepe.bidb.model.SocialAccount;
import tr.edu.hacettepe.bidb.repo.MenuRepo;
import tr.edu.hacettepe.bidb.repo.SliderRepo;
import tr.edu.hacettepe.bidb.repo.SocialAccountRepo;
import tr.edu.hacettepe.bidb.repo.SettingRepo;
import tr.edu.hacettepe.bidb.repo.RedirectRepo;
import tr.edu.hacettepe.bidb.model.Setting;
import tr.edu.hacettepe.bidb.model.Redirect;

import java.util.Map;
import java.util.stream.Collectors;

import java.util.List;

/** Menü, slider ve sosyal medya gibi site geneli veriler. */
@RestController
@RequestMapping("/api/{language}")
public class SiteController {

    private final MenuRepo menuler;
    private final SliderRepo sliderlar;
    private final SocialAccountRepo sosyal;
    private final SettingRepo ayarlar;
    private final RedirectRepo yonlendirmeler;

    public SiteController(MenuRepo menuler, SliderRepo sliderlar, SocialAccountRepo sosyal,
                          SettingRepo ayarlar, RedirectRepo yonlendirmeler) {
        this.menuler = menuler;
        this.sliderlar = sliderlar;
        this.sosyal = sosyal;
        this.ayarlar = ayarlar;
        this.yonlendirmeler = yonlendirmeler;
    }

    @GetMapping("/menus")
    public List<MenuDto> menu(@PathVariable String language,
                              @RequestParam(defaultValue = "sol") String position) {
        return menuler.findByLanguageAndPosition(language, position).stream().map(MenuDto::of).toList();
    }

    @GetMapping("/slides")
    public List<SliderDto> slider(@PathVariable String language) {
        return sliderlar.findByLanguageAndPublishedTrueOrderBySortOrderAsc(language).stream().map(SliderDto::of).toList();
    }

    /** Alt bilgide görünen iletişim bilgileri. Panelden düzenlenir. */
    @GetMapping("/settings")
    public Map<String, String> ayarlar(@PathVariable String language) {
        return ayarlar.findByLanguageOrderByNameAsc(language).stream()
                .filter(a -> a.getValue() != null)
                .collect(Collectors.toMap(Setting::getName, Setting::getValue, (a, b) -> a));
    }

    /** Adres değişikliklerinden doğan yönlendirmeler (ön yüz sunucusu kullanır). */
    @GetMapping("/redirects")
    public Map<String, String> yonlendirmeler(@PathVariable String language) {
        return yonlendirmeler.findAll().stream()
                .collect(Collectors.toMap(Redirect::getOldPath, Redirect::getNewPath, (a, b) -> a));
    }

    @GetMapping("/social-accounts")
    public List<SocialAccount> sosyalHesaplar(@PathVariable String language) {
        return sosyal.findByPublishedTrueOrderBySortOrderAsc();
    }
}
