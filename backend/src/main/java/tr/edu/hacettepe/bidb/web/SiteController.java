package tr.edu.hacettepe.bidb.web;

import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.dto.MenuDto;
import tr.edu.hacettepe.bidb.dto.SliderDto;
import tr.edu.hacettepe.bidb.model.SosyalHesap;
import tr.edu.hacettepe.bidb.repo.MenuRepo;
import tr.edu.hacettepe.bidb.repo.SliderRepo;
import tr.edu.hacettepe.bidb.repo.SosyalHesapRepo;
import tr.edu.hacettepe.bidb.repo.AyarRepo;
import tr.edu.hacettepe.bidb.repo.YonlendirmeRepo;
import tr.edu.hacettepe.bidb.model.Ayar;
import tr.edu.hacettepe.bidb.model.Yonlendirme;

import java.util.Map;
import java.util.stream.Collectors;

import java.util.List;

/** Menü, slider ve sosyal medya gibi site geneli veriler. */
@RestController
@RequestMapping("/api/{dil}")
public class SiteController {

    private final MenuRepo menuler;
    private final SliderRepo sliderlar;
    private final SosyalHesapRepo sosyal;
    private final AyarRepo ayarlar;
    private final YonlendirmeRepo yonlendirmeler;

    public SiteController(MenuRepo menuler, SliderRepo sliderlar, SosyalHesapRepo sosyal,
                          AyarRepo ayarlar, YonlendirmeRepo yonlendirmeler) {
        this.menuler = menuler;
        this.sliderlar = sliderlar;
        this.sosyal = sosyal;
        this.ayarlar = ayarlar;
        this.yonlendirmeler = yonlendirmeler;
    }

    @GetMapping("/menu")
    public List<MenuDto> menu(@PathVariable String dil,
                              @RequestParam(defaultValue = "sol") String konum) {
        return menuler.menuGetir(dil, konum).stream().map(MenuDto::of).toList();
    }

    @GetMapping("/slider")
    public List<SliderDto> slider(@PathVariable String dil) {
        return sliderlar.findByDilAndYayindaTrueOrderBySiraAsc(dil).stream().map(SliderDto::of).toList();
    }

    /** Alt bilgide görünen iletişim bilgileri. Panelden düzenlenir. */
    @GetMapping("/ayarlar")
    public Map<String, String> ayarlar(@PathVariable String dil) {
        return ayarlar.findByDilOrderByAnahtarAsc(dil).stream()
                .filter(a -> a.getDeger() != null)
                .collect(Collectors.toMap(Ayar::getAnahtar, Ayar::getDeger, (a, b) -> a));
    }

    /** Adres değişikliklerinden doğan yönlendirmeler (ön yüz sunucusu kullanır). */
    @GetMapping("/yonlendirmeler")
    public Map<String, String> yonlendirmeler(@PathVariable String dil) {
        return yonlendirmeler.findAll().stream()
                .collect(Collectors.toMap(Yonlendirme::getEskiYol, Yonlendirme::getYeniYol, (a, b) -> a));
    }

    @GetMapping("/sosyal")
    public List<SosyalHesap> sosyalHesaplar(@PathVariable String dil) {
        return sosyal.findByYayindaTrueOrderBySiraAsc();
    }
}
