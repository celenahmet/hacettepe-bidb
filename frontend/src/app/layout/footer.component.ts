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

/**
 * Sayfa altı: adres, telefon ve yasal bağlantılar.
 *
 * İletişim bilgileri koda gömülü değildir; her değer veritabanında kendi
 * kaydıdır ve yönetim panelinden düzenlenir.
 */
@Component({
  selector: 'bidb-footer',
  imports: [RouterLink],
  template: `
    <footer class="alt">
      <div class="kap alt-ic">
        @for (a of tur('address'); track a.id) {
          <p class="alt-adres">{{ a.value }}</p>
        }

        <dl class="alt-iletisim">
          @if (tur('phone').length) {
            <dt>{{ language === 'en' ? 'Contact us' : 'Bize Ulaşın' }}</dt>
            <dd>
              @for (t of tur('phone'); track t.id; let son = $last) {
                <a [href]="'tel:' + telBaglanti(t.value)">{{ t.value }}</a>{{ son ? '' : ' · ' }}
              }
            </dd>
          }

          @if (tur('fax').length) {
            <dt>{{ language === 'en' ? 'Fax' : 'Faks' }}</dt>
            <dd>
              @for (f of tur('fax'); track f.id; let son = $last) {
                {{ f.value }}{{ son ? '' : ' · ' }}
              }
            </dd>
          }

          @if (tur('email').length) {
            <dt>{{ language === 'en' ? 'E-mail' : 'E-Posta' }}</dt>
            <dd>
              @for (e of tur('email'); track e.id; let son = $last) {
                <a [href]="'mailto:' + e.value">{{ e.value }}</a>{{ son ? '' : ' · ' }}
              }
            </dd>
          }
        </dl>

        <p class="alt-baglantilar">
          <a [routerLink]="['/', language, 'disclaimer']">{{ language === 'en' ? 'Disclaimer' : 'Sorumluluk Sınırı' }}</a>
          <a [routerLink]="['/', language, 'accessibility']">{{ language === 'en' ? 'Accessibility Statement' : 'Erişilebilirlik Bildirimi' }}</a>
        </p>
      </div>
    </footer>
  `
})
export class FooterComponent {
  @Input({ required: true }) language!: Language;

  private http = inject(HttpClient);

  protected kanallar = signal<ContactChannel[]>([]);

  ngOnInit(): void {
    this.http
      .get<ContactChannel[]>(`/api/${this.language}/contact-channels`)
      .subscribe((l) => this.kanallar.set(l));
  }

  /** Belirli türdeki kayıtlar, sıra numarasına göre. */
  protected tur(t: string): ContactChannel[] {
    return this.kanallar().filter((k) => k.type === t);
  }

  /** "+90 312 297 62 62" -> "+903122976262" */
  protected telBaglanti(t: string): string {
    return t.replace(/[^\d+]/g, '');
  }
}
