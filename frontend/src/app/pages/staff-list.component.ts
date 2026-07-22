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
 * birim adları kurumsal lacivert, ayrımlar ince çizgiyle. Şema kurumun
 * nasıl örgütlendiğini, bu sayfa o örgütte kimin çalıştığını gösterir;
 * ikisi arka arkaya okunduğunda kopukluk olmamalı.
 */
@Component({
  selector: 'bidb-staff-list',
  template: `
    @if (birimler().length) {
      <div class="personel">
        @for (b of birimler(); track b.name + (b.campus ?? '')) {
          <section class="personel-birim">
            <h2 class="personel-birim-ad">
              {{ b.name }}
              @if (b.campus) { <span class="personel-yerleske">{{ b.campus }}</span> }
            </h2>

            @if (b.phone) {
              <p class="personel-telefon">
                <a [href]="telefonBaglantisi(b.phone)">{{ b.phone }}</a>
              </p>
            }

            <ul class="personel-liste">
              @for (k of b.members; track k.fullName) {
                <li class="personel-kisi" [class.sorumlu]="k.lead">
                  <span class="personel-gorsel">
                    @if (k.photoUrl) {
                      <img [src]="k.photoUrl" [alt]="k.fullName" width="60" height="80" loading="lazy">
                    } @else {
                      <svg viewBox="0 0 48 64" aria-hidden="true" focusable="false">
                        <circle cx="24" cy="24" r="9"></circle>
                        @switch (k.avatar) {
                          @case ('kadin') {
                            <path d="M6 62c0-9.5 8-16.5 18-16.5S42 52.5 42 62H6z"></path>
                            <path d="M13 32c.8-8 5-12.5 11-12.5S34.2 24 35 32c-2.4-4-6.4-5.6-11-5.6S15.4 28 13 32z"></path>
                          }
                          @default {
                            <path d="M6 62c0-9.5 8-16.5 18-16.5S42 52.5 42 62H6z"></path>
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
