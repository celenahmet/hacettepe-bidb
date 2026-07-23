import { Component, Input, inject, signal } from '@angular/core';
import { Api } from '../core/api.service';
import { Language, StaffMember, StaffUnit } from '../core/models';

/**
 * Personel listesi.
 *
 * Sayfa gövdesi HTML olarak saklanmaz; birim ve kişi kayıtlarından üretilir.
 * Bu yüzden ayrı bir bileşendir: panelden eklenen bir kişi hiçbir metin
 * düzenlenmeden burada görünür.
 *
 * Tasarım, organizasyon şemasıyla aynı dili konuşur — kutu ve gölge yok,
 * birim adları kurumsal lacivert, ayrımlar ince çizgiyle. Kişiler bitişik
 * dizin hücrelerinde gösterilir; fotoğraf kimlik bilgisinin parçasıdır,
 * küçük bir simge değildir. Fotoğraf olmayan kayıtlarda aynı alan nötr bir
 * siluetle korunur, böylece fotoğraflar eklendikçe düzen değişmez.
 */
@Component({
  selector: 'bidb-staff-list',
  template: `
    @if (birimler().length) {
      <div class="personel">
        @for (b of birimler(); track b.name + (b.campus ?? '')) {
          <section class="personel-birim">
            <header class="personel-birim-ust">
              <h2 class="personel-birim-ad">{{ b.name }}</h2>
              <div class="personel-birim-meta">
                @if (b.campus) {
                  <span class="personel-yerleske">{{ b.campus }}</span>
                }
                @if (b.phone) {
                  <a class="personel-telefon" [href]="telefonBaglantisi(b.phone)">
                    {{ b.phone }}
                  </a>
                }
                <span class="personel-sayi">
                  {{ b.members.length }}
                  {{ dilDegeri === 'en' ? (b.members.length === 1 ? 'person' : 'people') : 'kişi' }}
                </span>
              </div>
            </header>

            <ul class="personel-liste">
              @for (k of b.members; track k.fullName) {
                <li class="personel-kisi" [class.sorumlu]="k.lead">
                  <span class="personel-gorsel">
                    @if (k.photoUrl) {
                      <img [src]="k.photoUrl" [alt]="k.fullName"
                           width="256" height="320" loading="lazy">
                    } @else {
                      <!-- Gerçek fotoğraf yüklenene kadar kullanılan yapay
                           portre, gerçek kişiyle karıştırılmaması için açıkça
                           demo olarak işaretlenir. -->
                      <span class="personel-demo-portre {{ demoPortreSinifi(k) }}"
                            role="img"
                            [attr.aria-label]="dilDegeri === 'en' ? 'Demo portrait' : 'Demo portre'"></span>
                      <span class="personel-demo-etiket" aria-hidden="true">DEMO</span>
                    }
                  </span>

                  <span class="personel-bilgi">
                    <span class="personel-ad">{{ k.fullName }}</span>
                    @if (k.roleTitle) {
                      <span class="personel-unvan">{{ k.roleTitle }}</span>
                    } @else if (k.lead) {
                      <span class="personel-unvan">{{ dilDegeri === 'en' ? 'Unit supervisor' : 'Birim sorumlusu' }}</span>
                    }
                    @if (k.note) { <span class="personel-not">{{ k.note }}</span> }
                    <button class="personel-eposta" type="button" disabled
                            [attr.aria-label]="dilDegeri === 'en'
                              ? 'Email address is not available'
                              : 'E-posta adresi bulunmuyor'"
                            [title]="dilDegeri === 'en'
                              ? 'Email address is not available'
                              : 'E-posta adresi bulunmuyor'">
                      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <rect x="3.5" y="5.5" width="17" height="13" rx="1.5"></rect>
                        <path d="m5 7 7 5.5L19 7"></path>
                      </svg>
                    </button>
                  </span>
                </li>
              }
            </ul>
          </section>
        }
      </div>
    }
  `
})
export class StaffListComponent {
  @Input({ required: true }) dilDegeri!: Language;

  private api = inject(Api);
  protected birimler = signal<StaffUnit[]>([]);

  ngOnInit(): void {
    this.api.personel(this.dilDegeri).subscribe((liste) => this.birimler.set(liste));
  }

  /** Dâhili numara, kurum santraliyle birlikte aranabilir olsun diye
      tam biçime çevrilir; ekranda görünen metin değişmez. */
  protected telefonBaglantisi(numara: string): string {
    const rakam = numara.replace(/\D/g, '');
    return 'tel:' + (rakam.length <= 8 ? '+90312' + rakam : '+90' + rakam.replace(/^0/, ''));
  }

  /** Demo portreler gerçek kişilerle eşleştirilmez. Ad yalnızca aynı kaydın
      her yüklemede aynı örnek görseli almasını sağlayan kararlı anahtardır. */
  protected demoPortreSinifi(kisi: StaffMember): string {
    const toplam = [...kisi.fullName].reduce((deger, harf) => deger + (harf.codePointAt(0) ?? 0), 0);
    const erkek = [0, 3, 4, 7];
    const kadin = [1, 2, 5, 6];
    const secenekler = kisi.avatar === 'erkek' ? erkek : kisi.avatar === 'kadin' ? kadin : [0, 1, 2, 3, 4, 5, 6, 7];
    return `demo-portre-${secenekler[toplam % secenekler.length]}`;
  }
}
