import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService, StaffMember, StaffUnit } from './admin-api.service';
import { tiklamaSinirlayici } from './tiklama-siniri';

/**
 * Personel yönetimi.
 *
 * Personel sayfası HTML metni değil, birim ve kişi kayıtlarıdır; bu ekran
 * o kayıtları düzenler. Birim eklenip silinebilir, kişi eklenip silinebilir,
 * ikisinin de sırası değiştirilebilir.
 *
 * Sıralama "yukarı/aşağı" düğmeleriyle yapılır: sıra numarasını elle
 * yazdırmak, listede boşluk ve çakışma bırakır. Düğme komşu iki kaydın
 * numarasını değiştirir, sayıyı kullanıcının bilmesine gerek kalmaz.
 */
@Component({
  selector: 'bidb-staff-editor',
  imports: [FormsModule],
  template: `
    <p class="aciklama">
      Personel sayfası bu kayıtlardan üretilir. Buradaki her değişiklik
      kaydedildiği anda sitede görünür.
    </p>

    <span class="dugmeler">
      <button type="button" (click)="birimDuzenle(null)">Yeni birim</button>
      <button type="button" class="ikincil" (click)="yukle()">Yenile</button>
    </span>

    @if (mesaj()) { <p class="aciklama">{{ mesaj() }}</p> }

    <!-- birim formu -->
    @if (birimFormu(); as b) {
      <form class="duyuru-form" (ngSubmit)="birimKaydet()">
        <h3>{{ b.id ? 'Birimi düzenle' : 'Yeni birim' }}</h3>

        <label for="bad">Birim adı</label>
        <input id="bad" name="bad" [(ngModel)]="b.name" required>

        <label for="byer">Yerleşke</label>
        <select id="byer" name="byer" [(ngModel)]="b.campus">
          <option [ngValue]="null">— belirtilmesin —</option>
          <option value="Beytepe">Beytepe</option>
          <option value="Sıhhiye">Sıhhiye</option>
        </select>
        <small>Aynı birimin iki yerleşkedeki ekibi ayrı birim olarak eklenir.</small>

        <label for="btel">Telefon</label>
        <input id="btel" name="btel" [(ngModel)]="b.phone" placeholder="297 62 62">

        <label>
          <input type="checkbox" name="byayim" [(ngModel)]="b.published"> Sitede görünsün
        </label>

        <div class="dugmeler">
          <button type="submit" [disabled]="calisiyor()">Kaydet</button>
          <button type="button" class="ikincil" (click)="birimFormu.set(null)">Vazgeç</button>
        </div>
      </form>
    }

    <!-- kişi formu -->
    @if (kisiFormu(); as k) {
      <form class="duyuru-form" (ngSubmit)="kisiKaydet()">
        <h3>{{ k.id ? 'Kişiyi düzenle' : 'Yeni kişi' }} — {{ kisiBirimAdi() }}</h3>

        <label for="kad">Ad soyad</label>
        <input id="kad" name="kad" [(ngModel)]="k.fullName" required>

        <label for="kunvan">Unvan</label>
        <input id="kunvan" name="kunvan" [(ngModel)]="k.roleTitle" placeholder="Daire Başkanı">
        <small>Görev veya kurumsal unvan; boş bırakılabilir.</small>

        <label for="kbirim">Bağlı birim</label>
        <select id="kbirim" name="kbirim" [(ngModel)]="k.unitId" required>
          @for (birim of birimler(); track birim.id) {
            <option [ngValue]="birim.id">
              {{ birim.name }}{{ birim.campus ? ' (' + birim.campus + ')' : '' }}
            </option>
          }
        </select>
        <small>Mevcut bir kişi başka bir birime taşındığında yeni birimin sonuna eklenir.</small>

        <label for="knot">Açıklama</label>
        <input id="knot" name="knot" [(ngModel)]="k.note" placeholder="e-imza">

        <label for="khakkinda">Hakkında <span class="istege-bagli">(isteğe bağlı)</span></label>
        <textarea id="khakkinda" name="khakkinda" [(ngModel)]="k.aboutText"
                  rows="5" maxlength="2000"
                  placeholder="Personelin görev alanı, sorumlulukları veya kurumsal deneyimi hakkında kısa bilgi"></textarea>
        <small>Bu metin, personelin açılır profil kartındaki “Hakkında” bölümünde gösterilir.</small>

        <label for="keposta">Kurumsal e-posta</label>
        <input id="keposta" name="keposta" type="email" [(ngModel)]="k.email"
               placeholder="ad.soyad@hacettepe.edu.tr">
        <small>Boş bırakılırsa profil kartında e-posta bilgisinin girilmediği belirtilir.</small>

        <label>
          <input type="checkbox" name="ksorumlu" [(ngModel)]="k.lead"> Birim sorumlusu
        </label>

        <label for="kfoto">Profil fotoğrafı</label>
        <div class="foto-satir">
          @if (k.photoUrl) {
            <img class="foto-onizleme" [src]="k.photoUrl" alt="" width="56" height="56">
          } @else {
            <span class="foto-onizleme foto-yok">{{ ikonAdi(k.avatar) }}</span>
          }
          <input id="kfoto" type="file" accept="image/*" (change)="fotoSec($event)">
          @if (k.photoUrl) {
            <button type="button" class="ikincil" (click)="k.photoUrl = null">Kaldır</button>
          }
        </div>
        <small>Fotoğraf isteğe bağlıdır. Yüklenmezse aşağıda seçilen ikon gösterilir.</small>

        <label for="kikon">Fotoğraf yoksa gösterilecek ikon</label>
        <select id="kikon" name="kikon" [(ngModel)]="k.avatar">
          <option [ngValue]="null">Nötr</option>
          <option value="kadin">Kadın</option>
          <option value="erkek">Erkek</option>
        </select>

        <div class="dugmeler">
          <button type="submit" [disabled]="calisiyor()">Kaydet</button>
          <button type="button" class="ikincil" (click)="kisiFormu.set(null)">Vazgeç</button>
        </div>
      </form>
    }

    <!-- liste -->
    @for (b of birimler(); track b.id) {
      <section class="menu-bolum">
        <h2>
          {{ b.name }}
          @if (b.campus) { <small>({{ b.campus }})</small> }
          @if (b.phone) { <small>· {{ b.phone }}</small> }
          @if (!b.published) { <small>· yayımda değil</small> }
        </h2>
        <span class="dugmeler">
          <button type="button" class="ikincil" (click)="tasi('units', b.id!, 'up')" title="Yukarı taşı">↑</button>
          <button type="button" class="ikincil" (click)="tasi('units', b.id!, 'down')" title="Aşağı taşı">↓</button>
          <button type="button" class="ikincil" (click)="kisiDuzenle(b, null)">Kişi ekle</button>
          <button type="button" class="ikincil" (click)="birimDuzenle(b)">Birimi düzenle</button>
          <button type="button" class="tehlike" (click)="birimSil(b)">Birimi sil</button>
        </span>

        <div class="tablo-kaydir">
          <table class="yonetim-tablo">
            <thead><tr><th></th><th>Ad soyad</th><th>Unvan / e-posta</th><th></th></tr></thead>
            <tbody>
              @for (k of b.members; track k.id) {
                <tr>
                  <td class="foto-hucre">
                    @if (k.photoUrl) {
                      <img [src]="k.photoUrl" alt="" width="32" height="32">
                    } @else {
                      <span class="foto-yok">{{ ikonAdi(k.avatar) }}</span>
                    }
                  </td>
                  <td>
                    {{ k.fullName }}
                    @if (k.lead) { <small>· birim sorumlusu</small> }
                  </td>
                  <td>
                    <small>{{ k.roleTitle || k.note || '—' }}</small>
                    @if (k.email) { <small> · {{ k.email }}</small> }
                  </td>
                  <td>
                    <button type="button" class="ikincil" (click)="tasi('members', k.id!, 'up')" title="Yukarı taşı">↑</button>
                    <button type="button" class="ikincil" (click)="tasi('members', k.id!, 'down')" title="Aşağı taşı">↓</button>
                    <button type="button" class="ikincil" (click)="kisiDuzenle(b, k)">Düzenle</button>
                    <button type="button" class="tehlike" (click)="kisiSil(k)">Sil</button>
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="4"><small>Bu birimde henüz kişi yok.</small></td></tr>
              }
            </tbody>
          </table>
        </div>
      </section>
    }
  `
})
export class StaffEditorComponent {
  private api = inject(AdminApiService);

  protected birimler = signal<StaffUnit[]>([]);
  protected birimFormu = signal<StaffUnit | null>(null);
  protected kisiFormu = signal<StaffMember | null>(null);
  protected calisiyor = signal(false);
  protected mesaj = signal('');

  /** Kişi formunun hangi birime ait olduğu; yeni kişi buraya eklenir. */
  private hedefBirim: StaffUnit | null = null;

  private yenileSiniri = tiklamaSinirlayici();

  ngOnInit(): void {
    this.yukle();
  }

  protected yukle(): void {
    if (!this.yenileSiniri()) return;
    this.api.staffUnits().subscribe({
      next: (liste) => this.birimler.set(liste),
      // Liste alınamadığında ekran boş kalıyor ve boş birim listesiyle
      // ayırt edilemiyordu; sebebi söylenmeli.
      error: () => this.bildir('Personel listesi alınamadı.')
    });
  }

  protected kisiBirimAdi(): string {
    if (!this.hedefBirim) return '';
    return this.hedefBirim.name + (this.hedefBirim.campus ? ' (' + this.hedefBirim.campus + ')' : '');
  }

  protected ikonAdi(avatar: string | null): string {
    return avatar === 'kadin' ? 'K' : avatar === 'erkek' ? 'E' : '–';
  }

  /* ---- birim ---- */

  protected birimDuzenle(b: StaffUnit | null): void {
    this.kisiFormu.set(null);
    this.birimFormu.set(b
      ? { ...b }
      : { id: null, language: 'tr', name: '', campus: null, phone: null, sortOrder: 0, published: true, members: [] });
  }

  protected birimKaydet(): void {
    const b = this.birimFormu();
    if (!b || !b.name.trim()) return;
    this.calisiyor.set(true);
    this.api.saveStaffUnit(b).subscribe({
      next: () => { this.calisiyor.set(false); this.birimFormu.set(null); this.bildir('Birim kaydedildi.'); this.yukle(); },
      error: () => { this.calisiyor.set(false); this.bildir('Birim kaydedilemedi.'); }
    });
  }

  protected birimSil(b: StaffUnit): void {
    const sayi = b.members.length;
    const uyari = sayi
      ? `"${b.name}" birimi ve içindeki ${sayi} kişi silinecek. Onaylıyor musunuz?`
      : `"${b.name}" birimi silinecek. Onaylıyor musunuz?`;
    if (!confirm(uyari)) return;
    // Hata dalı olmadan istek başarısız olduğunda HİÇBİR ŞEY olmuyordu: next
    // çalışmadığı için ne mesaj çıkıyor ne liste tazeleniyordu. Kullanıcı
    // onaylıyor, kayıt listede duruyor ve nedeni söylenmiyordu.
    this.api.deleteStaffUnit(b.id!).subscribe({
      next: () => { this.bildir('Birim silindi.'); this.yukle(); },
      error: () => this.bildir('Birim silinemedi.')
    });
  }

  /* ---- kişi ---- */

  protected kisiDuzenle(b: StaffUnit, k: StaffMember | null): void {
    this.birimFormu.set(null);
    this.hedefBirim = b;
    this.kisiFormu.set(k
      ? { ...k }
      : {
          id: null,
          unitId: b.id,
          fullName: '',
          roleTitle: null,
          note: null,
          aboutText: null,
          lead: false,
          photoUrl: null,
          email: null,
          avatar: null,
          sortOrder: 0
        });
  }

  protected kisiKaydet(): void {
    const k = this.kisiFormu();
    if (!k || !k.fullName.trim() || !this.hedefBirim || !k.unitId) return;
    this.calisiyor.set(true);
    this.api.saveStaffMember(this.hedefBirim.id!, k).subscribe({
      next: () => { this.calisiyor.set(false); this.kisiFormu.set(null); this.bildir('Kişi kaydedildi.'); this.yukle(); },
      error: () => { this.calisiyor.set(false); this.bildir('Kişi kaydedilemedi.'); }
    });
  }

  protected kisiSil(k: StaffMember): void {
    if (!confirm(`"${k.fullName}" listeden silinecek. Onaylıyor musunuz?`)) return;
    this.api.deleteStaffMember(k.id!).subscribe({
      next: () => { this.bildir('Kişi silindi.'); this.yukle(); },
      error: () => this.bildir('Kişi silinemedi.')
    });
  }

  /** Seçilen fotoğraf yüklenir ve adresi forma yazılır. */
  protected fotoSec(olay: Event): void {
    const dosya = (olay.target as HTMLInputElement).files?.[0];
    const k = this.kisiFormu();
    if (!dosya || !k) return;
    this.calisiyor.set(true);
    this.api.uploadFile(dosya).subscribe({
      next: (sonuc) => { k.photoUrl = sonuc.url; this.calisiyor.set(false); this.bildir('Fotoğraf yüklendi.'); },
      error: () => { this.calisiyor.set(false); this.bildir('Fotoğraf yüklenemedi.'); }
    });
  }

  /* ---- sıralama ---- */

  protected tasi(tur: 'units' | 'members', id: number, yon: 'up' | 'down'): void {
    this.api.moveStaff(tur, id, yon).subscribe({
      next: () => this.yukle(),
      error: () => this.bildir('Sıra değiştirilemedi.')
    });
  }

  private bildir(metin: string): void {
    this.mesaj.set(metin);
    setTimeout(() => this.mesaj.set(''), 4000);
  }
}
