package tr.edu.hacettepe.bidb.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tr.edu.hacettepe.bidb.service.GirisKayitServisi;

import java.io.IOException;
import java.time.Instant;
import java.util.Base64;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Yönetim uçlarına (Basic Auth) art arda başarısız giriş denemelerini IP
 * başına sınırlar.
 *
 * Tek bir paylaşılan yönetici hesabı olduğu için kaba kuvvet denemesi
 * doğrudan o hesabı hedefler; Spring Security'nin httpBasic()'i kendiliğinden
 * bir sınırlama yapmaz — istenildiği kadar parola denenebilirdi.
 *
 * Aynı kayan-pencere örüntüsü ContactTicketController'daki form hız
 * sınırlamasında da kullanılıyor; burada da tutarlılık için tekrarlandı.
 *
 * Ayrıca /api/admin/auth/dogrula ucuna (yalnızca giriş formunun çağırdığı
 * uç — bkz. AdminAuthController) yapılan denemeleri kalıcı güvenlik
 * kaydına (admin_login_event) yazar. Sınırlama TÜM /api/admin/** için
 * geçerliyken, kayıt yalnızca bu tek uç için tutulur; aksi hâlde oturum
 * boyunca yapılan sıradan her API isteği bir "giriş" gibi kaydedilirdi.
 */
@Component
public class YoneticiGirisSinirlayici extends OncePerRequestFilter {
    private static final long PENCERE_SANIYE = 300;
    private static final int AZAMI_BASARISIZ_DENEME = 8;
    private static final String GIRIS_KAYIT_YOLU = "/api/admin/auth/dogrula";

    private final Map<String, Deque<Instant>> basarisizDenemeler = new ConcurrentHashMap<>();
    private final GirisKayitServisi girisKayitServisi;

    public YoneticiGirisSinirlayici(GirisKayitServisi girisKayitServisi) {
        this.girisKayitServisi = girisKayitServisi;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        if (!request.getRequestURI().startsWith("/api/admin/")) {
            chain.doFilter(request, response);
            return;
        }

        String adres = clientAddress(request);
        Instant simdi = Instant.now();
        Deque<Instant> denemeler = basarisizDenemeler.computeIfAbsent(adres, ignored -> new ArrayDeque<>());
        synchronized (denemeler) {
            while (!denemeler.isEmpty() && denemeler.peekFirst().isBefore(simdi.minusSeconds(PENCERE_SANIYE))) {
                denemeler.removeFirst();
            }
            if (denemeler.size() >= AZAMI_BASARISIZ_DENEME) {
                response.setStatus(429);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write(
                    "{\"message\":\"Çok sayıda başarısız giriş denemesi. Lütfen birkaç dakika sonra tekrar deneyin.\"}");
                return;
            }
        }

        chain.doFilter(request, response);

        if (response.getStatus() == 401) {
            synchronized (denemeler) { denemeler.addLast(simdi); }
        } else if (response.getStatus() < 400) {
            basarisizDenemeler.remove(adres);
        }

        if (request.getRequestURI().equals(GIRIS_KAYIT_YOLU) && response.getStatus() != 429) {
            girisKayitServisi.kaydet(adres, request.getHeader("User-Agent"),
                    denenenKullaniciAdi(request), response.getStatus() < 400);
        }

        if (basarisizDenemeler.size() > 10_000) {
            Instant esik = simdi.minusSeconds(PENCERE_SANIYE);
            basarisizDenemeler.entrySet().removeIf(girdi -> {
                Instant son = girdi.getValue().peekLast();
                return son == null || son.isBefore(esik);
            });
        }
    }

    /** Authorization başlığındaki Basic kimlikten yalnızca kullanıcı adını çözer. */
    private static String denenenKullaniciAdi(HttpServletRequest request) {
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

    private static String clientAddress(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) return forwarded.split(",")[0].trim();
        String adres = request.getRemoteAddr();
        return adres == null ? "unknown" : adres;
    }
}
