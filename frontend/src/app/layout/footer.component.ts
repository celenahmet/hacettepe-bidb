import { Component, Input, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Language } from '../core/models';

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

          @if (sosyal().length) {
            <div class="alt-sosyal">
              <span class="alt-etiket">{{ language === 'en' ? 'Follow us' : 'Bizi takip edin' }}</span>
              <p>
                @for (s of sosyal(); track s.id) {
                  <a [href]="s.url" target="_blank" rel="noopener">{{ agAdi(s.network) }}</a>
                }
              </p>
            </div>
          }
        </div>

        <!-- kurumsal -->
        <nav class="alt-sutun" [attr.aria-label]="language === 'en' ? 'Corporate' : 'Kurumsal'">
          <span class="alt-etiket">{{ language === 'en' ? 'Corporate' : 'Kurumsal' }}</span>
          <ul>
            <li><a [routerLink]="['/', language, 'about']">{{ language === 'en' ? 'Overview' : 'Genel Tanıtım' }}</a></li>
            <li><a [routerLink]="['/', language, 'management']">{{ language === 'en' ? 'Administration' : 'Yönetim' }}</a></li>
            <li><a [routerLink]="['/', language, 'mission-vision']">{{ language === 'en' ? 'Mission and Vision' : 'Misyon ve Vizyon' }}</a></li>
            @if (language === 'tr') {
              <li><a routerLink="/tr/staff">Personel</a></li>
              <li><a routerLink="/tr/security-policy">Bilgi Güvenliği Politikası</a></li>
            }
          </ul>
        </nav>

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

          @if (tur('phone').length) {
            <dl>
              <dt>{{ language === 'en' ? 'Telephone' : 'Telefon' }}</dt>
              @for (t of tur('phone'); track t.id) {
                <dd><a [href]="'tel:' + telBaglanti(t.value)">{{ t.value }}</a></dd>
              }
            </dl>
          }

          @if (tur('fax').length) {
            <dl>
              <dt>{{ language === 'en' ? 'Fax' : 'Faks' }}</dt>
              @for (f of tur('fax'); track f.id) { <dd>{{ f.value }}</dd> }
            </dl>
          }

          @if (tur('email').length) {
            <dl>
              <dt>{{ language === 'en' ? 'E-mail' : 'E-Posta' }}</dt>
              @for (e of tur('email'); track e.id) {
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
            © {{ yil }} Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı
          </small>
          <p class="alt-baglantilar">
            <a [routerLink]="['/', language, 'disclaimer']">{{ language === 'en' ? 'Disclaimer' : 'Sorumluluk Sınırı' }}</a>
            <a [routerLink]="['/', language, 'accessibility']">{{ language === 'en' ? 'Accessibility' : 'Erişilebilirlik Bildirimi' }}</a>
          </p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  @Input({ required: true }) language!: Language;

  private http = inject(HttpClient);

  protected readonly yil = new Date().getFullYear();
  protected kanallar = signal<ContactChannel[]>([]);
  protected sosyal = signal<SocialAccount[]>([]);

  ngOnInit(): void {
    this.http.get<ContactChannel[]>(`/api/${this.language}/contact-channels`)
      .subscribe((l) => this.kanallar.set(l));
    this.http.get<SocialAccount[]>(`/api/${this.language}/social-accounts`)
      .subscribe((l) => this.sosyal.set(l));
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
