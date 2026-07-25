import { Component, Input, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Language } from '../core/models';
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
 * Sayfa altı — referans tasarıma birebir uygun.
 *
 * Krem zemin üzerinde dört sütunlu düzen:
 *  1. Kurum kimliği (logo + kırmızı separator + adres)
 *  2. Kurumsal bağlantılar
 *  3. Servisler
 *  4. İletişim ve medya (ince çerçeveli sosyal butonlar + ikonlu kanallar)
 */
@Component({
  selector: 'bidb-footer',
  imports: [RouterLink],
  template: `
    <footer class="alt">
      <div class="alt-icerik">
        <div class="kap alt-izgara">

          <!-- 1. Kurum kimliği -->
          <div class="alt-kurum">
            <div class="alt-logo-blok">
              <img src="/hu-logo.svg" alt="" aria-hidden="true" width="52" height="59">
              <div class="alt-logo-yazi">
                <strong>HACETTEPE</strong>
                <strong>{{ language === 'en' ? 'UNIVERSITY' : 'ÜNİVERSİTESİ' }}</strong>
              </div>
            </div>

            <hr class="alt-cizgi">

            @for (a of tur('address'); track a.id) {
              <p class="alt-adres">{{ a.value }}</p>
            }
            @if (!tur('address').length) {
              <p class="alt-adres">06800 Beytepe / ANKARA</p>
            }
          </div>

          <!-- 2. Kurumsal -->
          <nav class="alt-sutun" [attr.aria-label]="language === 'en' ? 'Corporate' : 'Kurumsal'">
            <span class="alt-etiket">{{ language === 'en' ? 'CORPORATE' : 'KURUMSAL' }}</span>
            <ul>
              <li>
                <a [routerLink]="['/', language, 'faq']">
                  {{ language === 'en' ? 'Frequently Asked Questions' : 'Sık Sorulan Sorular' }}
                  <span class="alt-ok" aria-hidden="true">›</span>
                </a>
              </li>
              <li>
                <a [routerLink]="['/', language, 'disclaimer']">
                  {{ language === 'en' ? 'Disclaimer' : 'Sorumluluk Sınırı' }}
                  <span class="alt-ok" aria-hidden="true">›</span>
                </a>
              </li>
              <li>
                <a [routerLink]="['/', language, 'accessibility']">
                  {{ language === 'en' ? 'Accessibility Statement' : 'Erişilebilirlik Bildirimi' }}
                  <span class="alt-ok" aria-hidden="true">›</span>
                </a>
              </li>
              <li>
                <a [routerLink]="['/', language, 'cookies']">
                  {{ language === 'en' ? 'Cookie Policy' : 'Çerez Politikası' }}
                  <span class="alt-ok" aria-hidden="true">›</span>
                </a>
              </li>
              <li>
                <button type="button" class="sutun-baglanti-dugme" (click)="cerezTercihleri.openPanel()">
                  {{ language === 'en' ? 'Cookie Preferences' : 'Çerez Tercihleri' }}
                  <span class="alt-ok" aria-hidden="true">›</span>
                </button>
              </li>
            </ul>
          </nav>

          <!-- 3. Servisler -->
          <nav class="alt-sutun" [attr.aria-label]="language === 'en' ? 'Services' : 'Servisler'">
            <span class="alt-etiket">{{ language === 'en' ? 'SERVICES' : 'SERVİSLER' }}</span>
            <ul>
              <li>
                <a href="https://portal.hacettepe.edu.tr/" target="_blank" rel="noopener">
                  {{ language === 'en' ? 'Hacettepe Portal' : 'Hacettepe Portalı' }}
                  <span class="alt-ok" aria-hidden="true">›</span>
                </a>
              </li>
              <li>
                <a [routerLink]="['/', language, 'email']">
                  {{ language === 'en' ? 'E-mail Services' : 'E-Posta İşlemleri' }}
                  <span class="alt-ok" aria-hidden="true">›</span>
                </a>
              </li>
              <li>
                <a [routerLink]="['/', language, 'wireless']">
                  {{ language === 'en' ? 'Wireless Access' : 'Kablosuz Erişim' }}
                  <span class="alt-ok" aria-hidden="true">›</span>
                </a>
              </li>
              <li>
                <a [routerLink]="['/', language, 'office365']">
                  {{ language === 'en' ? 'Office Applications' : 'Office Uygulamaları' }}
                  <span class="alt-ok" aria-hidden="true">›</span>
                </a>
              </li>
              <li>
                <a href="https://yazilimdeposu.hacettepe.edu.tr/" target="_blank" rel="noopener">
                  {{ language === 'en' ? 'Software Repository' : 'Yazılım Deposu' }}
                  <span class="alt-ok" aria-hidden="true">›</span>
                </a>
              </li>
            </ul>
          </nav>

          <!-- 4. İletişim ve Medya -->
          <div class="alt-sutun alt-iletisim">
            <span class="alt-etiket">{{ language === 'en' ? 'CONTACT & MEDIA' : 'İLETİŞİM VE MEDYA' }}</span>

            <!-- Sosyal medya: koyu kare butonlar. Hesap adresleri sabit kodlanmaz —
                 yönetim panelinden (Sosyal Medya sekmesi) gelir, tek doğru kaynak
                 orasıdır; burada yalnızca ağ adına göre uygun ikon seçilir. -->
            <nav class="alt-sosyal" [attr.aria-label]="language === 'en' ? 'Social media' : 'Sosyal medya'">
              @for (s of sosyal(); track s.id) {
                <a [href]="s.url" target="_blank" rel="noopener"
                   [attr.aria-label]="agAdi(s.network)" [title]="agAdi(s.network)" class="sosyal-buton">
                  @switch (s.network) {
                    @case ('instagram') {
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                    }
                    @case ('facebook') {
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                      </svg>
                    }
                    @case ('twitter') {
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    }
                    @case ('linkedin') {
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    }
                    @case ('youtube') {
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    }
                    @default {
                      <span class="sosyal-harf" aria-hidden="true">{{ s.network.charAt(0).toUpperCase() }}</span>
                    }
                  }
                </a>
              }
            </nav>

            <!-- Telefon -->
            <div class="alt-kanal">
              <span class="alt-kanal-ikon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.01 2.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92v2z"/>
                </svg>
              </span>
              <div>
                <dt>{{ language === 'en' ? 'TELEPHONE' : 'TELEFON' }}</dt>
                <dd><a [href]="'tel:' + telBaglanti(anaTelefon())">{{ anaTelefon() }}</a></dd>
              </div>
            </div>

            <!-- E-Posta -->
            @if (epostalar().length) {
              <div class="alt-kanal">
                <span class="alt-kanal-ikon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m2 7 10 7 10-7"/>
                  </svg>
                </span>
                <div>
                  <dt>{{ language === 'en' ? 'E-MAIL' : 'E-POSTA' }}</dt>
                  @for (e of epostalar(); track e.id) {
                    <dd><a [href]="'mailto:' + e.value">{{ e.value }}</a></dd>
                  }
                </div>
              </div>
            }
          </div>

        </div>
      </div>

      <!-- Telif satırı -->
      <div class="alt-serit">
        <div class="kap">
          <small>
            {{ language === 'en'
              ? 'Hacettepe University Department of Information Technology © ' + yenilenmeYili + ' All Rights Reserved.'
              : 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı © ' + yenilenmeYili + ' Tüm Hakları Saklıdır.' }}
          </small>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  private _language!: Language;
  @Input({ required: true }) set language(val: Language) {
    if (this._language !== val) {
      this._language = val;
      this.yukle();
    }
  }
  get language(): Language {
    return this._language;
  }

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

  /** Dil değiştiğinde iletişim kanalları ve sosyal hesaplar yeniden çekilir. */
  private yukle(): void {
    this.http.get<ContactChannel[]>(`/api/${this._language}/contact-channels`)
      .pipe(yenidenDene()).subscribe((l) => this.kanallar.set(l));
    this.http.get<SocialAccount[]>(`/api/${this._language}/social-accounts`)
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
