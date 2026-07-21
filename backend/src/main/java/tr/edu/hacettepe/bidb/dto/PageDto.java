package tr.edu.hacettepe.bidb.dto;

import tr.edu.hacettepe.bidb.model.Document;
import tr.edu.hacettepe.bidb.model.Page;

import java.util.List;

/** Ön yüze gönderilen sayfa verisi. SEO alanları Angular tarafında
 *  <title> ve meta etiketlerine yazılır. */
public record PageDto(
        String slug,
        String dil,
        String baslik,
        String icerikHtml,
        String seoTitle,
        String seoDescription,
        String seoKeywords,
        List<BelgeDto> belgeler,
        /** Bu sayfanın diğer dilde karşılığı var mı (hreflang için). */
        boolean cevirisiVar,
        /** Page kaynakta hata metni döndürüyor mu (site haritasına alınmaz). */
        boolean hataliIcerik
) {
    public static PageDto of(Page s) {
        return of(s, false);
    }

    public static PageDto of(Page s, boolean cevirisiVar) {
        return new PageDto(
                s.getSlug(), s.getDil(), s.getBaslik(), s.getIcerikHtml(),
                s.getSeoTitle(), s.getSeoDescription(), s.getSeoKeywords(),
                s.getBelgeler().stream().map(BelgeDto::of).toList(), cevirisiVar, hataliMi(s)
        );
    }

    /** Liste görünümleri için içerik olmadan. */
    public static PageDto ozet(Page s) {
        return new PageDto(s.getSlug(), s.getDil(), s.getBaslik(), null,
                s.getSeoTitle(), s.getSeoDescription(), s.getSeoKeywords(), List.of(), false, hataliMi(s));
    }

    /** Kaynak sitede içeriği olmayan, hata metni dönen sayfalar. Kopya
     *  sadık kalsın diye içerik değiştirilmez; yalnızca site haritasında
     *  ilan edilmezler. */
    private static boolean hataliMi(Page s) {
        String h = s.getIcerikHtml();
        return h != null && h.contains("Böyle bir sayfa bulunmamaktadır");
    }

    public record BelgeDto(String ad, String adres, String tur) {
        public static BelgeDto of(Document b) {
            return new BelgeDto(b.getAd(), b.getAdres(), b.getTur());
        }
    }
}
