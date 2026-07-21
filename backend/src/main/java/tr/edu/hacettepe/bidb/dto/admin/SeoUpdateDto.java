package tr.edu.hacettepe.bidb.dto.admin;

/** Sayfanın yalnızca SEO alanları ve yayın durumu. */
public record SeoUpdateDto(
        String seoTitle,
        String seoDescription,
        String seoKeywords,
        boolean yayinda
) {}
