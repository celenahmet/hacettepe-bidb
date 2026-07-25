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

    /**
     * Genel (public) istemci adresi.
     *
     * Daha önce burada X-Forwarded-For zincirinin İLK adımı okunuyordu. O adım
     * her zaman istemcinin kendi yazdığı değerdir; başlığı her istekte
     * değiştiren biri, bu adrese dayanan yönetici kaba kuvvet sınırını tümüyle
     * atlatabiliyordu. Çözüm {@link IstemciAdresi} sınıfına taşındı.
     */
    static String genelAdres(HttpServletRequest request, IstemciAdresi istemciAdresi) {
        return istemciAdresi.coz(request);
    }

    /**
     * SSR sunucusuna (server.ts) doğrudan bağlanan tarafın adresi — genelde kurum içi/
     * özel bir ağ adresi. "server.forward-headers-strategy: framework" etkinken hem
     * getRemoteAddr() hem de standart X-Forwarded-For, Spring tarafından İLK (genel)
     * adrese göre yeniden yazılıp sarmalanan istekten kaldırıldığından, bu bilgi
     * standart olmayan ayrı bir başlıkla (bkz. server.ts) taşınır. Başlık yoksa (ör.
     * doğrudan backend'e erişim, ara sunucu yok) getRemoteAddr() zaten doğru adrestir.
     */
    static String yerelAdres(HttpServletRequest request, IstemciAdresi istemciAdresi) {
        // Başlık yalnızca isteğin kendi ara sunucumuzdan geçtiği doğrulanabildiğinde
        // okunur. Doğrulama olmadan herkes bu başlığı gönderip güvenlik kaydına
        // istediği adresi yazdırabilir; bir olay incelemesini yanlış yöne çeker.
        if (istemciAdresi.vekilDogrulandi(request)) {
            String yerel = request.getHeader("X-Bidb-Yerel-Adres");
            if (yerel != null && !yerel.isBlank()) return yerel.trim();
        }
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
