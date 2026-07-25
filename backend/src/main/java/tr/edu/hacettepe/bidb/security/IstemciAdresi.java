package tr.edu.hacettepe.bidb.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.List;

/**
 * İstemcinin gerçek adresini, sahteciliğe kapalı biçimde çözer.
 *
 * <p><b>Kapatılan açık.</b> Önceki sürüm X-Forwarded-For başlığını koşulsuz
 * okuyup zincirin İLK adımını istemci sayıyordu. O adım her zaman istemcinin
 * kendi yazdığı, doğrulanmamış değerdir; her istekte başka bir değer göndererek
 * adrese dayanan bütün korumalar atlatılabiliyordu — yönetici girişindeki kaba
 * kuvvet sınırı (5 dakikada 8 başarısız deneme) dâhil. Doğrulandı: başlık
 * döndürülerek 15 ardışık başarısız giriş denemesi hiç engellenmeden geçiyordu.
 *
 * <p><b>Doğru kural.</b> Zincire her ara sunucu KENDİ GÖRDÜĞÜ adresi sona
 * ekler. Bizim altyapımızda tam olarak bir ara adım vardır (Angular SSR
 * sunucusu, bkz. server.ts), dolayısıyla gerçek istemci her zaman zincirin
 * SONDAN birinci adımıdır. Soldaki her şey istemcinin uydurabildiği dolgudur ve
 * asla okunmaz. Sondan kaçıncı adımın okunacağı sabit olduğu için, saldırgan
 * zincire ne kadar dolgu eklerse eklesin seçilen konumu kaydıramaz.
 *
 * <p>"Özel ağ adreslerini atla" gibi bir kural burada YANLIŞ olurdu: kampüs
 * NAT'ı ya da kurum içi ağdan gelen gerçek bir kullanıcının adresi de özeldir;
 * o adım atlanınca bir sonraki durak saldırganın uydurduğu değer olur.
 *
 * <p>Ön yüzün önünde ayrıca bir ters vekil (nginx vb.) varsa adım sayısı
 * BIDB_VEKIL_ADIM_SAYISI ile artırılmalıdır; aksi hâlde istemci yerine o vekilin
 * adresi okunur (güvenlik açığı değil, yalnızca daha kaba bir sınırlama).
 *
 * <p>Bu sınıfın çalışabilmesi için Spring'in kendi ara sunucu başlığı işlemesi
 * kapalı olmalıdır (server.forward-headers-strategy: none — bkz. application.yml).
 * Açık kalırsa Spring getRemoteAddr()'ı zincirin İLK (uydurulmuş) adımına göre
 * yeniden yazar ve gerçek TCP karşı tarafı öğrenilemez.
 */
@Component
public class IstemciAdresi {

    private final List<String> ekGuvenilirVekiller;
    private final int vekilAdimSayisi;
    private final String vekilAnahtari;

    public IstemciAdresi(
            @Value("${bidb.guvenilir-vekiller:}") String guvenilirVekiller,
            @Value("${bidb.vekil-adim-sayisi:1}") int vekilAdimSayisi,
            @Value("${bidb.vekil-anahtari:}") String vekilAnahtari) {
        this.ekGuvenilirVekiller = Arrays.stream(guvenilirVekiller.split(","))
                .map(String::trim)
                .filter(deger -> !deger.isBlank())
                .toList();
        this.vekilAdimSayisi = Math.max(1, vekilAdimSayisi);
        this.vekilAnahtari = vekilAnahtari == null ? "" : vekilAnahtari.trim();
    }

    /**
     * İstemcinin adresi. Sahte X-Forwarded-For gönderilse bile, istek kendi ara
     * sunucumuzdan geçmediyse doğrudan TCP karşı tarafı döner.
     */
    public String coz(HttpServletRequest request) {
        String tcpKarsiTaraf = request.getRemoteAddr();
        if (tcpKarsiTaraf == null || tcpKarsiTaraf.isBlank()) tcpKarsiTaraf = "unknown";
        if (!vekildenGeldiMi(request, tcpKarsiTaraf)) return tcpKarsiTaraf;

        String zincir = request.getHeader("X-Forwarded-For");
        if (zincir == null || zincir.isBlank()) return tcpKarsiTaraf;

        String[] adimlar = Arrays.stream(zincir.split(","))
                .map(String::trim)
                .filter(adim -> !adim.isBlank())
                .toArray(String[]::new);
        if (adimlar.length == 0) return tcpKarsiTaraf;

        // Sondan sabit sayıda adım geri sayılır; dolgu eklemek bu konumu kaydırmaz.
        int sira = adimlar.length - vekilAdimSayisi;
        return adimlar[Math.max(0, sira)];
    }

    /**
     * İsteğin kendi ara sunucumuzdan geçtiği doğrulanabiliyor mu?
     *
     * Ara sunucunun eklediği standart dışı başlıklara (ör. denetim kaydındaki
     * yerel adres) güvenilip güvenilemeyeceğini belirler; doğrulanamayan
     * isteklerde o başlıklar yok sayılmalıdır, aksi hâlde herkes güvenlik
     * kaydına istediği değeri yazdırabilir.
     */
    public boolean vekilDogrulandi(HttpServletRequest request) {
        String tcpKarsiTaraf = request.getRemoteAddr();
        return vekildenGeldiMi(request, tcpKarsiTaraf == null ? "unknown" : tcpKarsiTaraf);
    }

    /**
     * İstek gerçekten kendi ara sunucumuzdan mı geçti?
     *
     * <p>BIDB_VEKIL_ANAHTARI tanımlıysa yalnızca doğru anahtarı taşıyan istekler
     * kabul edilir; bu, backend'e ağ üzerinden doğrudan ulaşabilen birinin
     * (ör. ana makineye erişimi olan bir süreç) sahte zincir göndermesini de
     * kapatır. Anahtar tanımlı değilse ara sunucunun ağ konumuna güvenilir:
     * yalnızca geri döngü/özel ağdan gelen istekler zincir taşıyabilir.
     */
    private boolean vekildenGeldiMi(HttpServletRequest request, String tcpKarsiTaraf) {
        if (!vekilAnahtari.isEmpty()) {
            String gelen = request.getHeader("X-Bidb-Vekil-Anahtari");
            if (gelen == null) return false;
            return MessageDigest.isEqual(
                    gelen.trim().getBytes(StandardCharsets.UTF_8),
                    vekilAnahtari.getBytes(StandardCharsets.UTF_8));
        }
        return guvenilirVekilMi(tcpKarsiTaraf);
    }

    /**
     * Adres kendi altyapımızın bir adımı sayılabilir mi? Varsayılan olarak geri
     * döngü, özel ağ ve bağlantı yerel adresleri; ön yüz SSR sunucusu backend'e
     * Docker'ın özel ağı üzerinden bağlandığı için bu küme dağıtımı kapsar.
     */
    private boolean guvenilirVekilMi(String adres) {
        String temiz = adres.startsWith("[") ? adres.substring(1, Math.max(1, adres.indexOf(']'))) : adres;
        for (String onek : ekGuvenilirVekiller) {
            if (temiz.equals(onek) || temiz.startsWith(onek)) return true;
        }
        // Yalnızca IP değişmezleri çözülür. Bu kontrol olmadan başlığa yazılan
        // bir alan adı ("saldirgan.example") DNS sorgusu tetikler; istekleri
        // dışarıya çıkaran bir yan kanal oluşur.
        if (!ipDegismeziMi(temiz)) return false;
        try {
            InetAddress ip = InetAddress.getByName(temiz);
            return ip.isLoopbackAddress() || ip.isSiteLocalAddress()
                    || ip.isLinkLocalAddress() || ip.isAnyLocalAddress();
        } catch (UnknownHostException | SecurityException e) {
            return false;
        }
    }

    /** DNS'e gitmeden, değerin sayısal bir IPv4/IPv6 adresi olup olmadığını söyler. */
    private static boolean ipDegismeziMi(String deger) {
        if (deger.isBlank()) return false;
        boolean ikiNokta = deger.indexOf(':') >= 0;
        for (int i = 0; i < deger.length(); i++) {
            char c = deger.charAt(i);
            boolean gecerli = ikiNokta
                    ? (Character.digit(c, 16) >= 0 || c == ':' || c == '.' || c == '%')
                    : (c >= '0' && c <= '9') || c == '.';
            if (!gecerli) return false;
        }
        return true;
    }
}
