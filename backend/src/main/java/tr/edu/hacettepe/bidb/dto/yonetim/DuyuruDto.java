package tr.edu.hacettepe.bidb.dto.yonetim;

import tr.edu.hacettepe.bidb.model.Duyuru;

import java.time.LocalDate;

public record DuyuruDto(
        Long id, String dil, String baslik, String ozet,
        LocalDate yayinTarihi, boolean oneCikan, boolean yayinda, String disAdres
) {
    public static DuyuruDto of(Duyuru d) {
        return new DuyuruDto(d.getId(), d.getDil(), d.getBaslik(), d.getOzet(),
                d.getYayinTarihi(), d.isOneCikan(), d.isYayinda(), d.getDisAdres());
    }

    /** Gelen değerleri varlığa aktarır. */
    public Duyuru varligaAktar(Duyuru d) {
        d.setDil(dil);
        d.setBaslik(baslik);
        d.setOzet(ozet);
        d.setYayinTarihi(yayinTarihi == null ? LocalDate.now() : yayinTarihi);
        d.setOneCikan(oneCikan);
        d.setYayinda(yayinda);
        d.setDisAdres(disAdres);
        return d;
    }
}
