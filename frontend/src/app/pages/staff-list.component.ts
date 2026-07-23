import { Component, Input, inject, signal } from '@angular/core';
import { Api } from '../core/api.service';
import { Language, StaffUnit } from '../core/models';

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
                      <!-- Uc ayri siluet: kadin, erkek, notr. Ayrim sac ve
                           omuz hattiyla kuruluyor; renk ya da simge farki
                           kullanilmiyor, cunku rehberde asil bilgi ad ve
                           gorevdir. -->
                      <svg viewBox="0 0 48 64" aria-hidden="true" focusable="false">
                        @switch (k.avatar) {
                          @case ('kadin') {
                            <!-- Sac cene hizasinda disari acilir: kulak gibi
                                 iki cikinti yerine yuze inen bir kutle. -->
                            <path d="M24 11.5c6.9 0 11.4 5.1 11.4 12.9 0 3.9-1.1 7.3-2.9 9.7 2.4 1.3 4 3.3 4.7 6l.7 2.7H10.1l.7-2.7c.7-2.7 2.3-4.7 4.7-6-1.8-2.4-2.9-5.8-2.9-9.7 0-7.8 4.5-12.9 11.4-12.9z"></path>
                            <path d="M24 45.5c8.9 0 16.1 6.9 16.1 16.5H7.9c0-9.6 7.2-16.5 16.1-16.5z"></path>
                          }
                          @case ('erkek') {
                            <path d="M24 12.5c6.5 0 10.8 4.7 10.8 12.5S30 38.8 24 38.8 13.2 32.8 13.2 25 17.5 12.5 24 12.5z"></path>
                            <path d="M24 45.5c10.7 0 19.4 6.6 19.4 16.5H4.6c0-9.9 8.7-16.5 19.4-16.5z"></path>
                          }
                          @default {
                            <circle cx="24" cy="25" r="9"></circle>
                            <path d="M6.5 62c0-9.3 7.8-15.8 17.5-15.8S41.5 52.7 41.5 62h-35z"></path>
                          }
                        }
                      </svg>
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
}
