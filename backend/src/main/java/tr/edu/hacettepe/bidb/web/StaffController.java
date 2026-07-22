package tr.edu.hacettepe.bidb.web;

import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.dto.StaffDto;
import tr.edu.hacettepe.bidb.repo.StaffUnitRepo;

import java.util.List;

/**
 * Personel listesi.
 *
 * Sayfa gövdesi HTML olarak saklanmaz; birim ve kişi kayıtlarından üretilir.
 * Böylece panelden kişi eklenip silinebilir ve her kişiye fotoğraf
 * bağlanabilir.
 */
@RestController
@RequestMapping("/api/{language}/staff")
public class StaffController {

    private final StaffUnitRepo units;

    public StaffController(StaffUnitRepo units) {
        this.units = units;
    }

    @GetMapping
    public List<StaffDto.Unit> list(@PathVariable String language) {
        return units.findByLanguageAndPublishedTrueOrderBySortOrderAscIdAsc(language)
                .stream().map(StaffDto.Unit::of).toList();
    }
}
