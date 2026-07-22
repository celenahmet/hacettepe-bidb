package tr.edu.hacettepe.bidb.dto;

import tr.edu.hacettepe.bidb.model.Menu;
import tr.edu.hacettepe.bidb.model.MenuItem;

import java.util.List;

public record MenuDto(String title, List<OgeDto> items) {

    public static MenuDto of(Menu m) {
        return new MenuDto(m.getTitle(), m.getItems().stream().map(OgeDto::of).toList());
    }

    public record OgeDto(String label, String url, boolean newTab) {
        public static OgeDto of(MenuItem o) {
            // İç bağlantılar /tr/<slug> biçiminde üretilir
            String url = o.getPage() != null
                    ? "/" + o.getPage().getLanguage() + "/" + o.getPage().getSlug()
                    : o.getExternalUrl();
            return new OgeDto(o.getLabel(), url, o.isNewTab());
        }
    }
}
