package tr.edu.hacettepe.bidb.dto.admin;

import tr.edu.hacettepe.bidb.model.News;

import java.time.LocalDate;
import java.util.Locale;

public record NewsDto(
        Long id, String language, String title, String summary,
        LocalDate publishedOn, boolean featured, boolean published, String externalUrl,
        String slug, String imageUrl, String imageAlt, String contentHtml
) {
    public static NewsDto of(News d) {
        return new NewsDto(d.getId(), d.getLanguage(), d.getTitle(), d.getSummary(),
                d.getPublishedOn(), d.isFeatured(), d.isPublished(), d.getExternalUrl(),
                d.getSlug(), d.getImageUrl(), d.getImageAlt(), d.getContentHtml());
    }

    /** Gelen değerleri varlığa aktarır. */
    public News varligaAktar(News d) {
        d.setLanguage(language);
        d.setTitle(title);
        d.setSummary(summary);
        d.setPublishedOn(publishedOn == null ? LocalDate.now() : publishedOn);
        d.setFeatured(featured);
        d.setPublished(published);
        d.setExternalUrl(externalUrl);
        // Adres boş bırakılırsa haber kendi sayfasında değil, verilen
        // bağlantıda açılır. Boş metin yerine null saklanır ki benzersizlik
        // kısıtı birden çok duyuruyu engellemesin.
        d.setSlug(slug == null || slug.isBlank() ? null : sadelestir(slug));
        d.setImageUrl(imageUrl);
        d.setImageAlt(imageAlt);
        d.setContentHtml(contentHtml);
        return d;
    }

    /** Başlıktan veya girilen metinden url üretir. */
    private static String sadelestir(String ham) {
        String t = ham.trim().toLowerCase(Locale.forLanguageTag("tr"));
        t = t.replace("ı", "i").replace("ğ", "g").replace("ü", "u")
             .replace("ş", "s").replace("ö", "o").replace("ç", "c");
        return t.replaceAll("[^a-z0-9-]+", "-").replaceAll("-{2,}", "-").replaceAll("^-|-$", "");
    }
}
