import { Component, Input, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Language, Menu } from '../core/models';
import { yenidenDene } from '../core/yeniden-dene';
import { CookiePreferencesService } from '../core/cookie-preferences.service';

/** Alt bilgideki tek bir iletişim kaydı. */
interface ContactChannel {
  id: number;
  language: string;
  /** address | phone | email | fax */
  type: string;
  label: string | null;
  value: string;
  sortOrder: number;
}

interface SocialAccount {
  id: number;
  network: string;
  url: string;
}

/**
 * Sayfa altı.
 *
 * Dört sütunlu asimetrik düzen: kurum kimliği solda geniş bir alanda,
 * gezinme ve iletişim sağda daha dar sütunlarda. Eşit genişlikte dört kutu
 * yerine asimetri, hazır şablon görünümünden uzaklaştırır ve okuma sırasını
 * belirler.
 *
 * İletişim bilgileri ve sosyal medya hesapları veritabanından gelir;
 * yönetim panelinden düzenlenir.
 */
@Component({
  selector: 'bidb-footer',
  imports: [RouterLink],
  template: `
    <footer class="alt">
      <div class="kap alt-izgara">
        <!-- kurum -->
        <div class="alt-kurum">
          <span class="alt-marka">
            <img src="/hu-logo.svg" alt="" aria-hidden="true" width="40" height="45">
            <span>
              <strong>{{ language === 'en' ? 'Hacettepe University' : 'Hacettepe Üniversitesi' }}</strong>
              <small>{{ language === 'en' ? 'Department of Information Technology' : 'Bilgi İşlem Daire Başkanlığı' }}</small>
            </span>
          </span>

          @for (a of tur('address'); track a.id) {
            <p class="alt-adres">{{ a.value }}</p>
          }

        </div>

        <!-- kurumsal -->
        @if (kurumsal(); as k) {
          <nav class="alt-sutun" [attr.aria-label]="k.title">
            <span class="alt-etiket">{{ k.title }}</span>
            <ul>
              @for (o of k.items; track o.url) {
                <li><a [routerLink]="o.url">{{ o.label }}</a></li>
              }
            </ul>
          </nav>
        }

        <!-- servisler -->
        @if (language === 'tr') {
          <nav class="alt-sutun" aria-label="Servisler">
            <span class="alt-etiket">Servisler</span>
            <ul>
              <li><a routerLink="/tr/email">E-Posta İşlemleri</a></li>
              <li><a routerLink="/tr/wireless">Kablosuz Erişim</a></li>
              <li><a routerLink="/tr/software">Lisanslı Yazılım</a></li>
              <li><a routerLink="/tr/faq">Sık Sorulan Sorular</a></li>
              <li><a routerLink="/tr/forms">Formlar</a></li>
            </ul>
          </nav>
        }

        <!-- iletişim -->
        <div class="alt-sutun alt-iletisim">
          <span class="alt-etiket">{{ language === 'en' ? 'Contact' : 'İletişim' }}</span>

          <dl>
            <dt>{{ language === 'en' ? 'Telephone' : 'Telefon' }}</dt>
            <dd><a [href]="'tel:' + telBaglanti(anaTelefon())">{{ anaTelefon() }}</a></dd>
          </dl>

          @if (epostalar().length) {
            <dl>
              <dt>{{ language === 'en' ? 'E-mail' : 'E-Posta' }}</dt>
              @for (e of epostalar(); track e.id) {
                <dd><a [href]="'mailto:' + e.value">{{ e.value }}</a></dd>
              }
            </dl>
          }
        </div>
      </div>

      <!-- alt şerit -->
      <div class="alt-serit">
        <div class="kap alt-serit-ic">
          <small>
            © {{ yenilenmeYili }} Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı
          </small>
          <div class="alt-yardimci">
            @if (sosyal().length) {
              <nav class="alt-sosyal-alt" [attr.aria-label]="language === 'en' ? 'Social media' : 'Sosyal medya'">
                @for (s of sosyal(); track s.id) {
                  <a [href]="s.url" target="_blank" rel="noopener"
                     [attr.aria-label]="agAdi(s.network)" [attr.title]="agAdi(s.network)">
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"
                         fill="none" stroke="currentColor" stroke-width="1.6">
                      @switch (s.network) {
                        @case ("instagram") {
                          <rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/>
                          <circle cx="12" cy="12" r="4"/>
                          <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/>
                        }
                        @case ("facebook") {
                          <path d="M14.5 8.5h2.2V5.4h-2.4c-2.3 0-3.6 1.4-3.6 3.6v1.8H8.5v3.1h2.2V21h3.3v-7.1h2.4l.4-3.1h-2.8V9.4c0-.6.2-.9.9-.9z"
                                stroke="none" fill="currentColor"/>
                        }
                        @case ("twitter") {
                          <path d="M4.5 4.5l15 15M19.5 4.5l-15 15"/>
                        }
                        @case ("linkedin") {
                          <rect x="3.5" y="3.5" width="17" height="17" rx="2"/>
                          <path d="M7.5 10.5V17M7.5 7.6v.01M11.5 17v-4a2.5 2.5 0 015 0v4"/>
                        }
                        @case ("youtube") {
                          <rect x="3" y="6" width="18" height="12" rx="3"/>
                          <path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none"/>
                        }
                        @default {
                          <circle cx="12" cy="12" r="8.5"/>
                          <path d="M3.5 12h17M12 3.5c2.2 2.4 3.3 5.3 3.3 8.5s-1.1 6.1-3.3 8.5"/>
                        }
                      }
                    </svg>
                  </a>
                }
              </nav>
            }
            <nav class="alt-baglantilar" [attr.aria-label]="language === 'en' ? 'Legal and accessibility' : 'Yasal ve erişilebilirlik'">
              <a [routerLink]="['/', language, 'disclaimer']">{{ language === 'en' ? 'Disclaimer' : 'Sorumluluk Sınırı' }}</a>
              <a [routerLink]="['/', language, 'accessibility']">{{ language === 'en' ? 'Accessibility Statement' : 'Erişilebilirlik Bildirimi' }}</a>
              <a [routerLink]="['/', language, 'cookies']">{{ language === 'en' ? 'Cookie Policy' : 'Çerez Politikası' }}</a>
              <button type="button" (click)="cerezTercihleri.openPanel()">
                {{ language === 'en' ? 'Cookie Preferences' : 'Çerez Tercihleri' }}
              </button>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  @Input({ required: true }) language!: Language;

  private http = inject(HttpClient);
  protected cerezTercihleri = inject(CookiePreferencesService);

  /** Telif yılı değil, sitenin kurumsal olarak yenilendiği yıl gösterilir.
   *  Bu nedenle takvim yılı ilerlediğinde otomatik olarak değişmemelidir. */
  protected readonly yenilenmeYili = 2026;
  protected kanallar = signal<ContactChannel[]>([]);
  protected anaTelefon = computed(() => {
    const ana = this.kanallar().find(
      (kanal) => kanal.type === 'phone' && this.telBaglanti(kanal.value) === '+903122976200'
    );
    return ana?.value ?? '+90 312 297 62 00';
  });
  protected epostalar = computed(() =>
    this.kanallar().filter((kanal) => kanal.type === 'email').slice(0, 2)
  );

  /* Kurumsal sütunu menü verisinden okunur. Önce elle yazılmış bir liste
     vardı; İngilizce sürümde karşılığı olmayan sayfalara bağlanıyordu ve
     bir sayfanın adresi değiştiğinde burası sessizce kırılıyordu. Üst
     şerit de aynı kaynaktan besleniyor — iki yerde ayrı liste tutulmaz. */
  protected kurumsal = signal<Menu | null>(null);
  protected sosyal = signal<SocialAccount[]>([]);

  ngOnInit(): void {
    this.http.get<ContactChannel[]>(`/api/${this.language}/contact-channels`)
      .pipe(yenidenDene()).subscribe((l) => this.kanallar.set(l));
    this.http.get<SocialAccount[]>(`/api/${this.language}/social-accounts`)
      .pipe(yenidenDene()).subscribe((l) => this.sosyal.set(l));
    this.http.get<Menu[]>(`/api/${this.language}/menus`)
      .pipe(yenidenDene()).subscribe((l) => this.kurumsal.set(l.length ? l[0] : null));
  }

  protected tur(t: string): ContactChannel[] {
    return this.kanallar().filter((k) => k.type === t);
  }

  /** "twitter" -> "X", diğerleri baş harfi büyük */
  protected agAdi(ag: string): string {
    if (ag === 'twitter') return 'X';
    return ag.charAt(0).toUpperCase() + ag.slice(1);
  }

  /** "+90 312 297 62 62" -> "+903122976262" */
  protected telBaglanti(t: string): string {
    return t.replace(/[^\d+]/g, '');
  }
}
