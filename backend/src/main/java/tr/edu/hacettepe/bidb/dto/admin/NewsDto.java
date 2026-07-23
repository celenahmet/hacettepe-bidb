package tr.edu.hacettepe.bidb.dto.admin;

import tr.edu.hacettepe.bidb.model.News;
import tr.edu.hacettepe.bidb.model.NewsCatalog;

import java.time.LocalDate;
import java.util.Locale;

public record NewsDto(
        Long id, String language, String title, String summary,
        LocalDate publishedOn, boolean featured, boolean published, String externalUrl,
        String slug, String imageUrl, String imageAlt, String contentHtml,
        String category, String audience, String coverTemplate, String coverText
) {
    public static NewsDto of(News d) {
        return new NewsDto(d.getId(), d.getLanguage(), d.getTitle(), d.getSummary(),
                d.getPublishedOn(), d.isFeatured(), d.isPublished(), d.getExternalUrl(),
                d.getSlug(), d.getImageUrl(), d.getImageAlt(), d.getContentHtml(),
                d.getCategory(), d.getAudience(), d.getCoverTemplate(), d.getCoverText());
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
        d.setCategory(NewsCatalog.category(category));
        d.setAudience(NewsCatalog.audience(audience));
        d.setCoverTemplate(NewsCatalog.template(coverTemplate));
        d.setCoverText(kisaMetin(coverText, 120));
        return d;
    }

    private static String kisaMetin(String value, int length) {
        if (value == null || value.isBlank()) return null;
        String temiz = value.trim().replaceAll("\\s+", " ");
        return temiz.length() <= length ? temiz : temiz.substring(0, length);
    }

    /** Başlıktan veya girilen metinden url üretir. */
    private static String sadelestir(String ham) {
        String t = ham.trim().toLowerCase(Locale.forLanguageTag("tr"));
        t = t.replace("ı", "i").replace("ğ", "g").replace("ü", "u")
             .replace("ş", "s").replace("ö", "o").replace("ç", "c");
        return t.replaceAll("[^a-z0-9-]+", "-").replaceAll("-{2,}", "-").replaceAll("^-|-$", "");
    }
}
