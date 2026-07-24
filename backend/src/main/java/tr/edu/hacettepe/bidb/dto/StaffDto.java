package tr.edu.hacettepe.bidb.dto;

import tr.edu.hacettepe.bidb.model.StaffMember;
import tr.edu.hacettepe.bidb.model.StaffUnit;

import java.util.List;

/**
 * Personel sayfasının veri biçimi.
 *
 * Varlık sınıfları doğrudan yayımlanmaz: sayfada işi olmayan alanlar
 * (yayım durumu, sıra numarası) dışarı sızmasın diye ayrı kayıtlara
 * çevrilir.
 */
public final class StaffDto {

    private StaffDto() {}

    public record Member(String fullName, String roleTitle, String note, String aboutText,
                         boolean lead, String photoUrl, String email, String avatar) {

        static Member of(StaffMember k) {
            return new Member(k.getFullName(), k.getRoleTitle(), k.getNote(), k.getAboutText(),
                    k.isLead(), k.getPhotoUrl(), k.getEmail(), k.getAvatar());
        }
    }

    public record Unit(String name, String campus, String phone, List<Member> members) {

        public static Unit of(StaffUnit b) {
            return new Unit(b.getName(), b.getCampus(), b.getPhone(),
                    b.getMembers().stream().map(Member::of).toList());
        }
    }
}
