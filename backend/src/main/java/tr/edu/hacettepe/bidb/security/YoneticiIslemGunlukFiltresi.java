package tr.edu.hacettepe.bidb.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tr.edu.hacettepe.bidb.service.IslemGunlukServisi;

import java.io.IOException;
import java.util.Set;

/**
 * Yönetim panelindeki her değiştirme isteğini (oluşturma/güncelleme/silme)
 * kalıcı bir denetim kaydına (admin_audit_event) yazar.
 *
 * Paylaşılan tek yönetici hesabı olduğundan gerçek kullanıcı kimliği yerine
 * tarayıcı oturumu ayırt edicidir: giriş anında üretilen bir oturum kimliği
 * (bkz. admin-api.service.ts) her istekte X-Bidb-Oturum başlığıyla gelir.
 * Kayıt yalnızca değiştirici HTTP yöntemlerinde (POST/PUT/PATCH/DELETE) ve
 * giriş uçları hariç tutularak yapılır — giriş denemeleri zaten ayrı bir
 * kayda (admin_login_event, bkz. YoneticiGirisSinirlayici) gidiyor.
 */
@Component
public class YoneticiIslemGunlukFiltresi extends OncePerRequestFilter {
    private static final Set<String> DEGISTIRICI_YONTEMLER = Set.of("POST", "PUT", "PATCH", "DELETE");
    private static final String OTURUM_BASLIGI = "X-Bidb-Oturum";

    private final IslemGunlukServisi gunlukServisi;

    public YoneticiIslemGunlukFiltresi(IslemGunlukServisi gunlukServisi) {
        this.gunlukServisi = gunlukServisi;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String yol = request.getRequestURI();
        boolean denetlenecek = yol.startsWith("/api/admin/")
                && !yol.startsWith("/api/admin/auth/")
                && DEGISTIRICI_YONTEMLER.contains(request.getMethod());

        // Denetim kaydı, isteği işleyen kod beklenmedik bir istisna fırlatıp
        // yanıtı hiç tamamlamasa bile alınmalı — bir işlemin BAŞARISIZ olması
        // güvenlik günlüğünden düşmesi için bir sebep değil, tam tersi. Böyle bir
        // istisna, yanıt nesnesine hiç durum kodu yazılmadan filtre zincirinin
        // dışına taşabildiğinden (durum "başarılı" varsayılan 200'de takılı
        // kalır), varsayılan 500'den başlanıp yalnızca zincir NORMAL dönerse
        // gerçek durum koduyla güncellenir.
        int durumKodu = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
        try {
            chain.doFilter(request, response);
            durumKodu = response.getStatus();
        } finally {
            if (denetlenecek && durumKodu != 429) {
                String oturum = request.getHeader(OTURUM_BASLIGI);
                gunlukServisi.kaydet(
                        (oturum == null || oturum.isBlank()) ? "bilinmiyor" : oturum,
                        IstekBilgisi.genelAdres(request),
                        IstekBilgisi.yerelAdres(request),
                        IstekBilgisi.denenenKullaniciAdi(request),
                        request.getMethod(),
                        yol,
                        durumKodu);
            }
        }
    }
}
