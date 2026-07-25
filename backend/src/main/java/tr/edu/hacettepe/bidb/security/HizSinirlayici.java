package tr.edu.hacettepe.bidb.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * IP başına kayan pencerede istek sayısını sınırlayan basit, bellek içi
 * yardımcı.
 *
 * Kimliksiz uçlarda (anonim ölçüm uçları gibi) aynı mantık tekrar tekrar
 * yazılmasın diye tek yerde toplanır. ContactTicketController kendi
 * özel eşiğini ve mesajını inline tutuyor, dokunulmadı; burada yalnızca
 * daha önce hiç sınırlaması olmayan uçlar için kullanılır.
 */
@Component
public class HizSinirlayici {
    private final Map<String, Deque<Instant>> kayitlar = new ConcurrentHashMap<>();
    private final IstemciAdresi istemciAdresi;

    public HizSinirlayici(IstemciAdresi istemciAdresi) {
        this.istemciAdresi = istemciAdresi;
    }

    /** true dönerse sınır aşılmıştır, istek reddedilmelidir. */
    public boolean asildiMi(String anahtar, int azamiIstek, long pencereSaniye) {
        Instant simdi = Instant.now();
        Deque<Instant> gecmis = kayitlar.computeIfAbsent(anahtar, ignored -> new ArrayDeque<>());
        boolean asildi;
        synchronized (gecmis) {
            while (!gecmis.isEmpty() && gecmis.peekFirst().isBefore(simdi.minusSeconds(pencereSaniye))) {
                gecmis.removeFirst();
            }
            asildi = gecmis.size() >= azamiIstek;
            if (!asildi) gecmis.addLast(simdi);
        }
        temizlikGerekirse(simdi, pencereSaniye);
        return asildi;
    }

    private void temizlikGerekirse(Instant simdi, long pencereSaniye) {
        if (kayitlar.size() <= 10_000) return;
        Instant esik = simdi.minusSeconds(pencereSaniye);
        kayitlar.entrySet().removeIf(girdi -> {
            Instant son = girdi.getValue().peekLast();
            return son == null || son.isBefore(esik);
        });
    }

    /**
     * Sınırlama anahtarı olarak kullanılacak istemci adresi.
     *
     * Sahteciliğe kapalı çözüm için bkz. {@link IstemciAdresi}: daha önce
     * X-Forwarded-For koşulsuz okunuyordu ve başlığı döndüren bir istemci
     * buradaki bütün sınırları atlatabiliyordu.
     */
    public String istekAdresi(HttpServletRequest request) {
        return istemciAdresi.coz(request);
    }
}
