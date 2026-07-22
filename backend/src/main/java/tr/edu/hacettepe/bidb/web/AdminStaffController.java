package tr.edu.hacettepe.bidb.web;

import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tr.edu.hacettepe.bidb.model.StaffMember;
import tr.edu.hacettepe.bidb.model.StaffUnit;
import tr.edu.hacettepe.bidb.repo.StaffMemberRepo;
import tr.edu.hacettepe.bidb.repo.StaffUnitRepo;

import java.util.List;

/**
 * Personel yönetimi: birim ve kişi ekleme, düzenleme, silme, sıralama.
 *
 * Birim silinince kişileri de silinir — kişinin birimsiz bir anlamı yok.
 * Sıralama, "yukarı/aşağı" düğmeleriyle iki kaydın sıra numarasının
 * değiştirilmesiyle yapılır; panel bunun için ayrı bir uç çağırmak zorunda
 * kalmasın diye taşıma ucu burada tanımlıdır.
 */
@RestController
@RequestMapping("/api/admin/staff")
public class AdminStaffController {

    private final StaffUnitRepo units;
    private final StaffMemberRepo members;

    public AdminStaffController(StaffUnitRepo units, StaffMemberRepo members) {
        this.units = units;
        this.members = members;
    }

    /* ---- okuma ---------------------------------------------------- */

    public record MemberView(Long id, String fullName, String roleTitle, String note,
                             boolean lead, String photoUrl, String avatar, int sortOrder) {}

    public record UnitView(Long id, String language, String name, String campus, String phone,
                           int sortOrder, boolean published, List<MemberView> members) {}

    @GetMapping("/units")
    public List<UnitView> list() {
        return units.findAllByOrderByLanguageAscSortOrderAscIdAsc().stream()
                .map(b -> new UnitView(b.getId(), b.getLanguage(), b.getName(), b.getCampus(),
                        b.getPhone(), b.getSortOrder(), b.isPublished(),
                        b.getMembers().stream()
                                .map(k -> new MemberView(k.getId(), k.getFullName(), k.getRoleTitle(),
                                        k.getNote(), k.isLead(), k.getPhotoUrl(), k.getAvatar(),
                                        k.getSortOrder()))
                                .toList()))
                .toList();
    }

    /* ---- birim ------------------------------------------------------ */

    public record UnitRequest(String language, String name, String campus, String phone,
                              int sortOrder, boolean published) {

        StaffUnit apply(StaffUnit b) {
            b.setLanguage(language == null || language.isBlank() ? "tr" : language);
            b.setName(name);
            b.setCampus(bosIseNull(campus));
            b.setPhone(bosIseNull(phone));
            b.setSortOrder(sortOrder);
            b.setPublished(published);
            return b;
        }
    }

    @PostMapping("/units")
    @Transactional
    public ResponseEntity<?> createUnit(@RequestBody UnitRequest request) {
        if (request.name() == null || request.name().isBlank()) {
            return ResponseEntity.badRequest().body("Birim adı boş olamaz.");
        }
        StaffUnit b = request.apply(new StaffUnit());
        // Sıra verilmediyse listenin sonuna eklenir.
        if (b.getSortOrder() == 0) b.setSortOrder(sonrakiSira(b.getLanguage()));
        return ResponseEntity.ok(units.save(b));
    }

    @PutMapping("/units/{id}")
    @Transactional
    public ResponseEntity<?> updateUnit(@PathVariable Long id, @RequestBody UnitRequest request) {
        if (request.name() == null || request.name().isBlank()) {
            return ResponseEntity.badRequest().body("Birim adı boş olamaz.");
        }
        return units.findById(id)
                .map(b -> ResponseEntity.ok((Object) units.save(request.apply(b))))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/units/{id}")
    @Transactional
    public ResponseEntity<Void> deleteUnit(@PathVariable Long id) {
        if (!units.existsById(id)) return ResponseEntity.notFound().build();
        units.deleteById(id);   // kişiler de silinir
        return ResponseEntity.noContent().build();
    }

    /* ---- kişi -------------------------------------------------------- */

    public record MemberRequest(String fullName, String roleTitle, String note,
                                boolean lead, String photoUrl, String avatar, int sortOrder) {

        StaffMember apply(StaffMember k) {
            k.setFullName(fullName);
            k.setRoleTitle(bosIseNull(roleTitle));
            k.setNote(bosIseNull(note));
            k.setLead(lead);
            k.setPhotoUrl(bosIseNull(photoUrl));
            k.setAvatar(bosIseNull(avatar));
            k.setSortOrder(sortOrder);
            return k;
        }
    }

    @PostMapping("/units/{unitId}/members")
    @Transactional
    public ResponseEntity<?> createMember(@PathVariable Long unitId, @RequestBody MemberRequest request) {
        if (request.fullName() == null || request.fullName().isBlank()) {
            return ResponseEntity.badRequest().body("Ad soyad boş olamaz.");
        }
        return units.findById(unitId).map(b -> {
            StaffMember k = request.apply(new StaffMember());
            k.setUnit(b);
            if (k.getSortOrder() == 0) {
                k.setSortOrder(b.getMembers().stream().mapToInt(StaffMember::getSortOrder).max().orElse(0) + 1);
            }
            return ResponseEntity.ok((Object) members.save(k));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/members/{id}")
    @Transactional
    public ResponseEntity<?> updateMember(@PathVariable Long id, @RequestBody MemberRequest request) {
        if (request.fullName() == null || request.fullName().isBlank()) {
            return ResponseEntity.badRequest().body("Ad soyad boş olamaz.");
        }
        return members.findById(id)
                .map(k -> ResponseEntity.ok((Object) members.save(request.apply(k))))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/members/{id}")
    @Transactional
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        if (!members.existsById(id)) return ResponseEntity.notFound().build();
        members.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /* ---- sıralama ---------------------------------------------------- */

    /**
     * Bir kaydı bir sıra yukarı ya da aşağı taşır.
     *
     * Sıra numarasını elle yazdırmak yerine komşu iki kaydın numaralarını
     * değiştirmek, listede boşluk veya çakışma bırakmaz.
     */
    @PostMapping("/units/{id}/move")
    @Transactional
    public ResponseEntity<Void> moveUnit(@PathVariable Long id, @RequestParam String direction) {
        return units.findById(id).map(b -> {
            List<StaffUnit> liste = units.findAllByOrderByLanguageAscSortOrderAscIdAsc().stream()
                    .filter(x -> x.getLanguage().equals(b.getLanguage())).toList();
            StaffUnit komsu = komsuBul(liste, b, direction, StaffUnit::getId);
            if (komsu == null) return ResponseEntity.noContent().<Void>build();
            int s = b.getSortOrder();
            b.setSortOrder(komsu.getSortOrder());
            komsu.setSortOrder(s);
            units.save(b);
            units.save(komsu);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().<Void>build());
    }

    @PostMapping("/members/{id}/move")
    @Transactional
    public ResponseEntity<Void> moveMember(@PathVariable Long id, @RequestParam String direction) {
        return members.findById(id).map(k -> {
            List<StaffMember> liste = k.getUnit().getMembers();
            StaffMember komsu = komsuBul(liste, k, direction, StaffMember::getId);
            if (komsu == null) return ResponseEntity.noContent().<Void>build();
            int s = k.getSortOrder();
            k.setSortOrder(komsu.getSortOrder());
            komsu.setSortOrder(s);
            members.save(k);
            members.save(komsu);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().<Void>build());
    }

    /** Listedeki komşu kayıt; kayıt zaten uçtaysa null döner. */
    private static <T> T komsuBul(List<T> liste, T kayit, String yon,
                                  java.util.function.Function<T, Long> kimlik) {
        int i = -1;
        for (int n = 0; n < liste.size(); n++) {
            if (kimlik.apply(liste.get(n)).equals(kimlik.apply(kayit))) { i = n; break; }
        }
        if (i < 0) return null;
        int hedef = "up".equals(yon) ? i - 1 : i + 1;
        return (hedef < 0 || hedef >= liste.size()) ? null : liste.get(hedef);
    }

    private int sonrakiSira(String language) {
        return units.findAllByOrderByLanguageAscSortOrderAscIdAsc().stream()
                .filter(b -> b.getLanguage().equals(language))
                .mapToInt(StaffUnit::getSortOrder).max().orElse(0) + 1;
    }

    private static String bosIseNull(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }
}
