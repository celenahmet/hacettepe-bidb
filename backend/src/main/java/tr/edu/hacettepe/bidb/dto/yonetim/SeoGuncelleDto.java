package tr.edu.hacettepe.bidb.dto.yonetim;

/** Sayfanın yalnızca SEO alanları ve yayın durumu. */
public record SeoGuncelleDto(
        String seoTitle,
        String seoDescription,
        String seoKeywords,
        boolean yayinda
) {}
