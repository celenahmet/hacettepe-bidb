package tr.edu.hacettepe.bidb.dto.yonetim;

import tr.edu.hacettepe.bidb.model.Duyuru;

import java.time.LocalDate;
import java.util.Locale;

public record DuyuruDto(
        Long id, String dil, String baslik, String ozet,
        LocalDate yayinTarihi, boolean oneCikan, boolean yayinda, String disAdres,
        String slug, String gorselUrl, String gorselAlt, String icerikHtml
) {
    public static DuyuruDto of(Duyuru d) {
        return new DuyuruDto(d.getId(), d.getDil(), d.getBaslik(), d.getOzet(),
                d.getYayinTarihi(), d.isOneCikan(), d.isYayinda(), d.getDisAdres(),
                d.getSlug(), d.getGorselUrl(), d.getGorselAlt(), d.getIcerikHtml());
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
        // Adres boş bırakılırsa haber kendi sayfasında değil, verilen
        // bağlantıda açılır. Boş metin yerine null saklanır ki benzersizlik
        // kısıtı birden çok duyuruyu engellemesin.
        d.setSlug(slug == null || slug.isBlank() ? null : sadelestir(slug));
        d.setGorselUrl(gorselUrl);
        d.setGorselAlt(gorselAlt);
        d.setIcerikHtml(icerikHtml);
        return d;
    }

    /** Başlıktan veya girilen metinden adres üretir. */
    private static String sadelestir(String ham) {
        String t = ham.trim().toLowerCase(Locale.forLanguageTag("tr"));
        t = t.replace("ı", "i").replace("ğ", "g").replace("ü", "u")
             .replace("ş", "s").replace("ö", "o").replace("ç", "c");
        return t.replaceAll("[^a-z0-9-]+", "-").replaceAll("-{2,}", "-").replaceAll("^-|-$", "");
    }
}
