package tr.edu.hacettepe.bidb.dto;

import tr.edu.hacettepe.bidb.model.Duyuru;
import tr.edu.hacettepe.bidb.model.HizliErisim;

import java.time.LocalDate;
import java.util.List;

/** Ana sayfanın tüm bileşenleri tek istekte döner. */
public record AnaSayfaDto(
        List<SliderDto> slider,
        List<KisayolDto> kisayollar,
        List<KisayolDto> servisler,
        List<DuyuruDto> duyurular
) {
    public record KisayolDto(String ad, String ikonUrl, String adres, boolean yeniSekme) {
        public static KisayolDto of(HizliErisim h) {
            return new KisayolDto(h.getAd(), h.getIkonUrl(), h.getAdres(), h.isYeniSekme());
        }
    }

    public record DuyuruDto(String baslik, LocalDate tarih, String adres) {
        public static DuyuruDto of(Duyuru d) {
            return new DuyuruDto(d.getBaslik(), d.getYayinTarihi(), d.getDisAdres());
        }
    }
}
