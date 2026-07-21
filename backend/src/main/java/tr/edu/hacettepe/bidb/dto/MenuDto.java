package tr.edu.hacettepe.bidb.dto;

import tr.edu.hacettepe.bidb.model.Menu;
import tr.edu.hacettepe.bidb.model.MenuOge;

import java.util.List;

public record MenuDto(String baslik, List<OgeDto> ogeler) {

    public static MenuDto of(Menu m) {
        return new MenuDto(m.getBaslik(), m.getOgeler().stream().map(OgeDto::of).toList());
    }

    public record OgeDto(String etiket, String adres, boolean yeniSekme) {
        public static OgeDto of(MenuOge o) {
            // İç bağlantılar /tr/<slug> biçiminde üretilir
            String adres = o.getSayfa() != null
                    ? "/" + o.getSayfa().getDil() + "/" + o.getSayfa().getSlug()
                    : o.getDisAdres();
            return new OgeDto(o.getEtiket(), adres, o.isYeniSekme());
        }
    }
}
