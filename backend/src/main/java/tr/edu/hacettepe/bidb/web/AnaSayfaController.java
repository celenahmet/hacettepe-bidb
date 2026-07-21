package tr.edu.hacettepe.bidb.web;

import org.springframework.data.domain.Limit;
import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.dto.AnaSayfaDto;
import tr.edu.hacettepe.bidb.dto.SliderDto;
import tr.edu.hacettepe.bidb.model.HizliErisim;
import tr.edu.hacettepe.bidb.repo.DuyuruRepo;
import tr.edu.hacettepe.bidb.repo.HizliErisimRepo;
import tr.edu.hacettepe.bidb.repo.SliderRepo;

import java.util.List;

/** Ana sayfa bileşenleri tek uçtan sunulur. */
@RestController
@RequestMapping("/api/{dil}")
public class AnaSayfaController {

    /** 100 ve üzeri sıra değerleri servis karuselini gösterir. */
    private static final int SERVIS_SIRA_ESIGI = 100;

    private final SliderRepo sliderlar;
    private final HizliErisimRepo kisayollar;
    private final DuyuruRepo duyurular;

    public AnaSayfaController(SliderRepo sliderlar, HizliErisimRepo kisayollar, DuyuruRepo duyurular) {
        this.sliderlar = sliderlar;
        this.kisayollar = kisayollar;
        this.duyurular = duyurular;
    }

    @GetMapping("/anasayfa")
    public AnaSayfaDto anaSayfa(@PathVariable String dil) {
        List<HizliErisim> tumu = kisayollar.findByDilAndYayindaTrueOrderBySiraAsc(dil);

        return new AnaSayfaDto(
                sliderlar.findByDilAndYayindaTrueOrderBySiraAsc(dil).stream().map(SliderDto::of).toList(),
                tumu.stream().filter(h -> h.getSira() < SERVIS_SIRA_ESIGI)
                        .map(AnaSayfaDto.KisayolDto::of).toList(),
                tumu.stream().filter(h -> h.getSira() >= SERVIS_SIRA_ESIGI)
                        .map(AnaSayfaDto.KisayolDto::of).toList(),
                duyurular.findByDilAndYayindaTrueOrderByYayinTarihiDesc(dil, Limit.of(12)).stream()
                        .map(AnaSayfaDto.DuyuruDto::of).toList()
        );
    }
}
