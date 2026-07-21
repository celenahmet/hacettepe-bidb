package tr.edu.hacettepe.bidb.dto;

import tr.edu.hacettepe.bidb.model.Belge;
import tr.edu.hacettepe.bidb.model.Sayfa;

import java.util.List;

/** Ön yüze gönderilen sayfa verisi. SEO alanları Angular tarafında
 *  <title> ve meta etiketlerine yazılır. */
public record SayfaDto(
        String slug,
        String dil,
        String baslik,
        String icerikHtml,
        String seoTitle,
        String seoDescription,
        String seoKeywords,
        List<BelgeDto> belgeler,
        /** Bu sayfanın diğer dilde karşılığı var mı (hreflang için). */
        boolean cevirisiVar
) {
    public static SayfaDto of(Sayfa s) {
        return of(s, false);
    }

    public static SayfaDto of(Sayfa s, boolean cevirisiVar) {
        return new SayfaDto(
                s.getSlug(), s.getDil(), s.getBaslik(), s.getIcerikHtml(),
                s.getSeoTitle(), s.getSeoDescription(), s.getSeoKeywords(),
                s.getBelgeler().stream().map(BelgeDto::of).toList(), cevirisiVar
        );
    }

    /** Liste görünümleri için içerik olmadan. */
    public static SayfaDto ozet(Sayfa s) {
        return new SayfaDto(s.getSlug(), s.getDil(), s.getBaslik(), null,
                s.getSeoTitle(), s.getSeoDescription(), s.getSeoKeywords(), List.of(), false);
    }

    public record BelgeDto(String ad, String adres, String tur) {
        public static BelgeDto of(Belge b) {
            return new BelgeDto(b.getAd(), b.getAdres(), b.getTur());
        }
    }
}
