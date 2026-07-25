package tr.edu.hacettepe.bidb.security;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Base64;

/**
 * Giriş kayıtları ve işlem günlüğü filtrelerinin ortak kullandığı istek
 * bilgisi çözümleyicileri (IP adresleri, denenen kullanıcı adı).
 *
 * bkz. YoneticiGirisSinirlayici ve YoneticiIslemGunlukFiltresi.
 */
final class IstekBilgisi {
    private IstekBilgisi() {}

    /** Genel (public) adres adayı: X-Forwarded-For zincirindeki İLK adres. */
    static String genelAdres(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) return forwarded.split(",")[0].trim();
        String adres = request.getRemoteAddr();
        return adres == null ? "unknown" : adres;
    }

    /**
     * SSR sunucusuna (server.ts) doğrudan bağlanan tarafın adresi — genelde kurum içi/
     * özel bir ağ adresi. "server.forward-headers-strategy: framework" etkinken hem
     * getRemoteAddr() hem de standart X-Forwarded-For, Spring tarafından İLK (genel)
     * adrese göre yeniden yazılıp sarmalanan istekten kaldırıldığından, bu bilgi
     * standart olmayan ayrı bir başlıkla (bkz. server.ts) taşınır. Başlık yoksa (ör.
     * doğrudan backend'e erişim, ara sunucu yok) getRemoteAddr() zaten doğru adrestir.
     */
    static String yerelAdres(HttpServletRequest request) {
        String yerel = request.getHeader("X-Bidb-Yerel-Adres");
        if (yerel != null && !yerel.isBlank()) return yerel.trim();
        return request.getRemoteAddr();
    }

    /** Authorization başlığındaki Basic kimlikten yalnızca kullanıcı adını çözer. */
    static String denenenKullaniciAdi(HttpServletRequest request) {
        String baslik = request.getHeader("Authorization");
        if (baslik == null || !baslik.regionMatches(true, 0, "Basic ", 0, 6)) return null;
        try {
            String cozulmus = new String(Base64.getDecoder().decode(baslik.substring(6).trim()));
            int ayrac = cozulmus.indexOf(':');
            return ayrac < 0 ? cozulmus : cozulmus.substring(0, ayrac);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
