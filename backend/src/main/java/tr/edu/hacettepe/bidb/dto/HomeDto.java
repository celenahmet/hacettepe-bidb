package tr.edu.hacettepe.bidb.dto;

import tr.edu.hacettepe.bidb.model.News;
import tr.edu.hacettepe.bidb.model.Shortcut;

import java.time.LocalDate;
import java.util.List;

/** Ana sayfanın tüm bileşenleri tek istekte döner. */
public record HomeDto(
        List<SliderDto> slider,
        List<KisayolDto> kisayollar,
        List<KisayolDto> servisler,
        List<NewsDto> duyurular
) {
    public record KisayolDto(String ad, String ikonUrl, String adres, boolean yeniSekme) {
        public static KisayolDto of(Shortcut h) {
            return new KisayolDto(h.getAd(), h.getIkonUrl(), h.getAdres(), h.isYeniSekme());
        }
    }

    public record NewsDto(String baslik, LocalDate tarih, String adres,
                            String ozet, String gorselUrl, String gorselAlt, boolean kendiSayfasi) {
        public static NewsDto of(News d) {
            // Haberin kendi sayfası varsa oraya, yoksa verilen bağlantıya gidilir
            boolean kendi = d.getSlug() != null && !d.getSlug().isBlank();
            String adres = kendi ? "/" + d.getDil() + "/duyuru/" + d.getSlug() : d.getDisAdres();
            return new NewsDto(d.getBaslik(), d.getYayinTarihi(), adres,
                    d.getOzet(), d.getGorselUrl(), d.getGorselAlt(), kendi);
        }
    }
}
