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
                  <button class="personel-kart-ac" type="button"
                          (click)="profilAc(k, b)"
                          aria-haspopup="dialog"
                          [attr.aria-label]="k.fullName + (dilDegeri === 'en' ? ' profile details' : ' profil detayları')">
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
                      <span class="personel-kart-detay" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                          <path d="M5 12h13M14 7l5 5-5 5"></path>
                        </svg>
                      </span>
                    </span>
                  </button>
                </li>
              }
            </ul>
          </section>
        }
      </div>
    }

    @if (seciliProfil(); as profil) {
      <div class="personel-profil-katman"
           (click)="katmanTiklandi($event)"
           (keydown)="profilTusu($event)">
        <section class="personel-profil-panel"
                 role="dialog"
                 aria-modal="true"
                 aria-labelledby="personel-profil-baslik"
                 tabindex="-1">
          <button class="personel-profil-kapat" type="button" (click)="profilKapat()"
                  [attr.aria-label]="dilDegeri === 'en' ? 'Close profile' : 'Profili kapat'">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18"></path>
            </svg>
          </button>

          <div class="personel-profil-gorsel">
            @if (profil.kisi.photoUrl) {
              <img [src]="profil.kisi.photoUrl" [alt]="profil.kisi.fullName"
                   width="520" height="650">
            } @else {
              <span class="personel-demo-portre {{ demoPortreSinifi(profil.kisi) }}"
                    role="img"
                    [attr.aria-label]="dilDegeri === 'en' ? 'Demo portrait' : 'Demo portre'"></span>
              <span class="personel-demo-etiket" aria-hidden="true">DEMO</span>
            }
            <span class="personel-profil-gorsel-ton" aria-hidden="true"></span>
          </div>

          <div class="personel-profil-icerik">
            <p class="personel-profil-kod">
              {{ dilDegeri === 'en' ? 'INSTITUTIONAL STAFF DIRECTORY' : 'KURUMSAL PERSONEL REHBERİ' }}
            </p>
            <h2 id="personel-profil-baslik">{{ profil.kisi.fullName }}</h2>

            <div class="personel-profil-gorev">
              <span>
                {{ profil.kisi.roleTitle
                    || (profil.kisi.lead
                      ? (dilDegeri === 'en' ? 'Unit supervisor' : 'Birim sorumlusu')
                      : (dilDegeri === 'en' ? 'Staff member' : 'Personel')) }}
              </span>
              <strong>{{ profil.birim.name }}</strong>
            </div>

            @if (profil.kisi.note) {
              <p class="personel-profil-not">{{ profil.kisi.note }}</p>
            }

            <div class="personel-profil-meta">
              @if (profil.birim.campus) {
                <span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="2.5"></circle>
                  </svg>
                  {{ profil.birim.campus }}
                </span>
              }
              @if (profil.birim.phone) {
                <a [href]="telefonBaglantisi(profil.birim.phone)">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 3H4.5A1.5 1.5 0 0 0 3 4.5C3 13.6 10.4 21 19.5 21a1.5 1.5 0 0 0 1.5-1.5V17l-4-1-1.2 2a15 15 0 0 1-9.8-9.8L8 7Z"></path>
                  </svg>
                  {{ profil.birim.phone }}
                </a>
              }
            </div>

            <section class="personel-profil-eposta" aria-labelledby="personel-eposta-baslik">
              <div class="personel-profil-eposta-baslik">
                <span class="personel-profil-eposta-ikon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <rect x="3.5" y="5.5" width="17" height="13" rx="1.5"></rect>
                    <path d="m5 7 7 5.5L19 7"></path>
                  </svg>
                </span>
                <div>
                  <p id="personel-eposta-baslik">
                    {{ dilDegeri === 'en' ? 'Institutional email' : 'Kurumsal e-posta' }}
                  </p>
                  <span>
                    {{ dilDegeri === 'en'
                      ? 'The address is shown only on request.'
                      : 'Adres yalnızca isteğiniz üzerine gösterilir.' }}
                  </span>
                </div>
              </div>

              @if (profil.kisi.email) {
                @if (!epostaGorunur()) {
                  <button class="personel-eposta-goster" type="button" (click)="epostaGoster()">
                    {{ dilDegeri === 'en' ? 'Show email address' : 'E-posta adresini göster' }}
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h13M14 7l5 5-5 5"></path>
                    </svg>
                  </button>
                } @else {
                  <div class="personel-eposta-acik">
                    <a [href]="'mailto:' + profil.kisi.email">{{ profil.kisi.email }}</a>
                    <button type="button" (click)="epostaKopyala(profil.kisi.email)"
                            [class.kopyalandi]="kopyalandi()"
                            [attr.aria-label]="dilDegeri === 'en' ? 'Copy email address' : 'E-posta adresini kopyala'">
                      @if (kopyalandi()) {
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"></path></svg>
                        <span>{{ dilDegeri === 'en' ? 'Copied' : 'Kopyalandı' }}</span>
                      } @else {
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <rect x="8" y="8" width="11" height="11" rx="1.5"></rect>
                          <path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-10A1.5 1.5 0 0 0 3 5.5v10A1.5 1.5 0 0 0 4.5 17H8"></path>
                        </svg>
                        <span>{{ dilDegeri === 'en' ? 'Copy' : 'Kopyala' }}</span>
                      }
                    </button>
                  </div>
                }
              } @else {
                <div class="personel-eposta-yok" role="status">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="9"></circle>
                    <path d="M12 8v5M12 16.5v.01"></path>
                  </svg>
                  <span>
                    {{ dilDegeri === 'en'
                      ? 'An email address has not been provided for this staff member.'
                      : 'Bu personel için e-posta bilgisi sisteme girilmemiştir.' }}
                  </span>
                </div>
              }
            </section>

            <footer class="personel-profil-alt">
              <img src="/hu-logo.svg" alt="" width="15" height="24">
              <span>{{ dilDegeri === 'en'
                ? 'Hacettepe University · IT Department'
                : 'Hacettepe Üniversitesi · Bilgi İşlem Daire Başkanlığı' }}</span>
            </footer>
          </div>
        </section>
      </div>
    }
  `
})
export class StaffListComponent {
  @Input({ required: true }) dilDegeri!: Language;

  private api = inject(Api);
  protected birimler = signal<StaffUnit[]>([]);
  protected seciliProfil = signal<{ kisi: StaffMember; birim: StaffUnit } | null>(null);
  protected epostaGorunur = signal(false);
  protected kopyalandi = signal(false);
  private oncekiOdak: HTMLElement | null = null;

  ngOnInit(): void {
    this.api.personel(this.dilDegeri).subscribe((liste) => this.birimler.set(liste));
  }

  /** Dâhili numara, kurum santraliyle birlikte aranabilir olsun diye
      tam biçime çevrilir; ekranda görünen metin değişmez. */
  protected telefonBaglantisi(numara: string): string {
    const rakam = numara.replace(/\D/g, '');
    return 'tel:' + (rakam.length <= 8 ? '+90312' + rakam : '+90' + rakam.replace(/^0/, ''));
  }

  protected profilAc(kisi: StaffMember, birim: StaffUnit): void {
    if (typeof document !== 'undefined') {
      this.oncekiOdak = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    }
    this.seciliProfil.set({ kisi, birim });
    this.epostaGorunur.set(false);
    this.kopyalandi.set(false);
    if (typeof document !== 'undefined') {
      setTimeout(() => document.querySelector<HTMLElement>('.personel-profil-panel')?.focus());
    }
  }

  protected profilKapat(): void {
    this.seciliProfil.set(null);
    this.epostaGorunur.set(false);
    this.kopyalandi.set(false);
    const hedef = this.oncekiOdak;
    this.oncekiOdak = null;
    if (hedef) queueMicrotask(() => hedef.focus());
  }

  protected katmanTiklandi(olay: MouseEvent): void {
    if (olay.target === olay.currentTarget) this.profilKapat();
  }

  protected profilTusu(olay: KeyboardEvent): void {
    if (olay.key === 'Escape') {
      olay.preventDefault();
      this.profilKapat();
      return;
    }
    if (olay.key !== 'Tab' || typeof document === 'undefined') return;

    const panel = document.querySelector<HTMLElement>('.personel-profil-panel');
    if (!panel) return;
    const odaklanabilir = [...panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter((oge) => oge.offsetParent !== null);
    if (!odaklanabilir.length) return;

    const ilk = odaklanabilir[0];
    const son = odaklanabilir[odaklanabilir.length - 1];
    if (olay.shiftKey && (document.activeElement === ilk || document.activeElement === panel)) {
      olay.preventDefault();
      son.focus();
    } else if (!olay.shiftKey && document.activeElement === son) {
      olay.preventDefault();
      ilk.focus();
    }
  }

  protected epostaGoster(): void {
    this.epostaGorunur.set(true);
  }

  protected async epostaKopyala(eposta: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(eposta);
    } catch {
      if (typeof document === 'undefined') return;
      const alan = document.createElement('textarea');
      alan.value = eposta;
      alan.style.position = 'fixed';
      alan.style.opacity = '0';
      document.body.appendChild(alan);
      alan.select();
      document.execCommand('copy');
      alan.remove();
    }
    this.kopyalandi.set(true);
    setTimeout(() => this.kopyalandi.set(false), 2200);
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
