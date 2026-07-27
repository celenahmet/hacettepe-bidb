package tr.edu.hacettepe.bidb.dto;

import tr.edu.hacettepe.bidb.model.Menu;
import tr.edu.hacettepe.bidb.model.MenuItem;

import java.util.List;

public record MenuDto(String title, List<OgeDto> items) {

    /**
     * Gideceği yer olmayan öğeler ziyaretçiye VERİLMEZ.
     *
     * Böyle bir öğe panelden oluşturulamaz — kaydetme "Bir sayfa seçin ya da
     * geçerli bir dış adres girin." diyerek engeller. Ama menüde kullanılan bir
     * sayfa silindiğinde oluşabiliyor: menu_item.page_id yabancı anahtarı
     * SET NULL, yani sayfa gidince öğe hedefsiz kalıyor ve hayatta kalıyor.
     *
     * Sonuç ziyaretçide görünüyordu: sol menüde href TAŞIMAYAN bir <a>. Böyle
     * bir bağlantı tıklanmaz VE klavye sırasına girmez; menü öğesi gibi durur,
     * tıklayınca hiçbir şey olmaz.
     *
     * Yönetim ucu (AdminMenuController) bu öğeleri göstermeye devam eder —
     * yönetici bozuk kaydı görüp düzeltebilmeli, gizlenmemeli.
     */
    public static MenuDto of(Menu m) {
        return new MenuDto(m.getTitle(), m.getItems().stream()
                .map(OgeDto::of)
                .filter(o -> o.url() != null && !o.url().isBlank())
                .toList());
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
