package tr.edu.hacettepe.bidb.web;

import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.dto.MenuDto;
import tr.edu.hacettepe.bidb.dto.SliderDto;
import tr.edu.hacettepe.bidb.model.SosyalHesap;
import tr.edu.hacettepe.bidb.repo.MenuRepo;
import tr.edu.hacettepe.bidb.repo.SliderRepo;
import tr.edu.hacettepe.bidb.repo.SosyalHesapRepo;

import java.util.List;

/** Menü, slider ve sosyal medya gibi site geneli veriler. */
@RestController
@RequestMapping("/api/{dil}")
public class SiteController {

    private final MenuRepo menuler;
    private final SliderRepo sliderlar;
    private final SosyalHesapRepo sosyal;

    public SiteController(MenuRepo menuler, SliderRepo sliderlar, SosyalHesapRepo sosyal) {
        this.menuler = menuler;
        this.sliderlar = sliderlar;
        this.sosyal = sosyal;
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

    @GetMapping("/sosyal")
    public List<SosyalHesap> sosyalHesaplar(@PathVariable String dil) {
        return sosyal.findByYayindaTrueOrderBySiraAsc();
    }
}
