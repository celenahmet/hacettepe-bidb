package tr.edu.hacettepe.bidb.web;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Yönetim paneli giriş formunun doğrulama ucu.
 *
 * Bu uca ulaşabilmek için Spring Security zaten kimlik bilgilerini
 * doğrulamış olur (bkz. SecurityConfig — /api/admin/** authenticated());
 * gövde yalnızca kullanıcı adını yankılar. Ön yüz, panele girerken YALNIZCA
 * bu ucu çağırır — YoneticiGirisSinirlayici da giriş denemesi kaydını
 * (bkz. admin_login_event) bilinçli olarak yalnızca bu yol için tutar,
 * aksi hâlde oturum boyunca yapılan her sıradan API isteği bir "giriş"
 * gibi kaydedilirdi.
 */
@RestController
@RequestMapping("/api/admin/auth")
public class AdminAuthController {

    @GetMapping("/dogrula")
    public Map<String, String> dogrula(Authentication kimlik) {
        return Map.of("kullanici", kimlik == null ? "" : kimlik.getName());
    }
}
