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
import tr.edu.hacettepe.bidb.repo.ContactChannelRepo;
import tr.edu.hacettepe.bidb.model.ContactChannel;
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
    private final ContactChannelRepo contactChannels;

    public SiteController(MenuRepo menuler, SliderRepo sliderlar, SocialAccountRepo sosyal,
                          SettingRepo ayarlar, RedirectRepo yonlendirmeler,
                          ContactChannelRepo contactChannels) {
        this.menuler = menuler;
        this.sliderlar = sliderlar;
        this.sosyal = sosyal;
        this.ayarlar = ayarlar;
        this.yonlendirmeler = yonlendirmeler;
        this.contactChannels = contactChannels;
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
    /** Alt bilgideki iletişim bilgileri; her değer ayrı kayıt. */
    @GetMapping("/contact-channels")
    public List<ContactChannel> contactChannels(@PathVariable String language) {
        return contactChannels.findByLanguageAndPublishedTrueOrderByTypeAscSortOrderAsc(language);
    }

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
