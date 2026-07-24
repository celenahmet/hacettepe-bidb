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

        <!-- kurumsal yerine yasal -->
        <nav class="alt-sutun" [attr.aria-label]="language === 'en' ? 'Corporate' : 'Kurumsal'">
          <span class="alt-etiket">{{ language === 'en' ? 'Corporate' : 'Kurumsal' }}</span>
          <ul>
            <li><a [routerLink]="['/', language, 'disclaimer']">{{ language === 'en' ? 'Disclaimer' : 'Sorumluluk Sınırı' }}</a></li>
            <li><a [routerLink]="['/', language, 'accessibility']">{{ language === 'en' ? 'Accessibility Statement' : 'Erişilebilirlik Bildirimi' }}</a></li>
            <li><a [routerLink]="['/', language, 'cookies']">{{ language === 'en' ? 'Cookie Policy' : 'Çerez Politikası' }}</a></li>
            <li><button type="button" class="sutun-baglanti-dugme" (click)="cerezTercihleri.openPanel()">
              {{ language === 'en' ? 'Cookie Preferences' : 'Çerez Tercihleri' }}
            </button></li>
          </ul>
        </nav>

        <!-- servisler -->
        @if (language === 'tr') {
          <nav class="alt-sutun" aria-label="Servisler">
            <span class="alt-etiket">Servisler</span>
            <ul>
              <li><a href="https://portal.hacettepe.edu.tr/" target="_blank" rel="noopener">Hacettepe Portalı</a></li>
              <li><a routerLink="/tr/email">E-Posta İşlemleri</a></li>
              <li><a routerLink="/tr/wireless">Kablosuz Erişim</a></li>
              <li><a routerLink="/tr/office365">Office Uygulamaları</a></li>
              <li><a routerLink="/tr/faq">Sık Sorulan Sorular</a></li>
              <li><a href="https://yazilimdeposu.hacettepe.edu.tr/" target="_blank" rel="noopener">Yazılım Deposu</a></li>
            </ul>
          </nav>
        }

        <!-- iletişim ve medya -->
        <div class="alt-sutun alt-iletisim">
          <span class="alt-etiket">{{ language === 'en' ? 'Contact & Media' : 'İletişim ve Medya' }}</span>

          <nav class="alt-sosyal-medya" [attr.aria-label]="language === 'en' ? 'Social media' : 'Sosyal medya'">
            <a href="https://www.linkedin.com/school/hacettepe-university/" target="_blank" rel="noopener" aria-label="LinkedIn" title="LinkedIn">
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="#0A66C2">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="https://instagram.com/hacettepe_pr" target="_blank" rel="noopener" aria-label="Instagram" title="Instagram">
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                <defs>
                  <linearGradient id="ig-grad" x1="20%" y1="100%" x2="80%" y2="0%">
                    <stop offset="0%" stop-color="#fd5949" />
                    <stop offset="50%" stop-color="#d6249f" />
                    <stop offset="100%" stop-color="#285AEB" />
                  </linearGradient>
                </defs>
                <path fill="url(#ig-grad)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a href="https://x.com/Hacettepe1967" target="_blank" rel="noopener" aria-label="X (Twitter)" title="X (Twitter)">
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="#000000">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://www.youtube.com/user/HacettepeUniversites" target="_blank" rel="noopener" aria-label="YouTube" title="YouTube">
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="#FF0000">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </nav>

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
          
          <div class="alt-cerez-kapsayici">
            <button type="button" class="sutun-baglanti-dugme" (click)="cerezTercihleri.openPanel()">
              {{ language === 'en' ? 'Cookie Preferences' : 'Çerez Tercihleri' }}
            </button>
          </div>
        </div>
      </div>

      <!-- alt şerit -->
      <div class="alt-serit">
        <div class="kap alt-serit-ic" style="justify-content: center; text-align: center;">
          <small>
            Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı © {{ yenilenmeYili }} Tüm Hakları Saklıdır.
          </small>
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

  protected sosyal = signal<SocialAccount[]>([]);

  ngOnInit(): void {
    this.http.get<ContactChannel[]>(`/api/${this.language}/contact-channels`)
      .pipe(yenidenDene()).subscribe((l) => this.kanallar.set(l));
    this.http.get<SocialAccount[]>(`/api/${this.language}/social-accounts`)
      .pipe(yenidenDene()).subscribe((l) => this.sosyal.set(l));
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
