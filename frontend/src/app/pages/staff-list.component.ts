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
                      <img [src]="k.photoUrl" [alt]="k.fullName" width="44" height="44" loading="lazy">
                    } @else {
                      <svg viewBox="0 0 44 44" aria-hidden="true" focusable="false">
                        <circle cx="22" cy="16" r="7"></circle>
                        @switch (k.avatar) {
                          @case ('kadin') {
                            <path d="M9 40c0-7 5.8-12 13-12s13 5 13 12H9z"></path>
                            <path d="M13 22c1-6 4-9 9-9s8 3 9 9c-2-3-5-4-9-4s-7 1-9 4z"></path>
                          }
                          @default {
                            <path d="M9 40c0-7 5.8-12 13-12s13 5 13 12H9z"></path>
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
