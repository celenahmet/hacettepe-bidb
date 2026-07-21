import { Component, Input, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Language } from '../core/models';

/**
 * Sayfa altı: adres, telefon ve yasal bağlantılar.
 *
 * İletişim bilgileri koda gömülü değildir; veritabanından okunur ve
 * yönetim panelinden düzenlenir. Sunucu tarafı çizimde de yüklendiği için
 * bilgiler ilk yanıtın HTML'inde yer alır.
 */
@Component({
  selector: 'bidb-footer',
  imports: [RouterLink],
  template: `
    <footer class="alt">
      <div class="kap alt-ic">
        @if (adres()) { <p class="alt-adres">{{ adres() }}</p> }

        <dl class="alt-iletisim">
          @if (telefonlar().length) {
            <dt>{{ dil === 'en' ? 'Contact us' : 'Bize Ulaşın' }}</dt>
            <dd>
              @for (t of telefonlar(); track t; let son = $last) {
                <a [href]="'tel:' + telBaglanti(t)">{{ t }}</a>{{ son ? '' : ' · ' }}
              }
            </dd>
          }

          @if (faks()) {
            <dt>{{ dil === 'en' ? 'Fax' : 'Faks' }}</dt>
            <dd>{{ faks() }}</dd>
          }

          @if (epostalar().length) {
            <dt>{{ dil === 'en' ? 'E-mail' : 'E-Posta' }}</dt>
            <dd>
              @for (e of epostalar(); track e; let son = $last) {
                <a [href]="'mailto:' + e">{{ e }}</a>{{ son ? '' : ' · ' }}
              }
            </dd>
          }
        </dl>

        <p class="alt-baglantilar">
          <a [routerLink]="['/', dil, 'disclaimer']">{{ dil === 'en' ? 'Disclaimer' : 'Sorumluluk Sınırı' }}</a>
          <a [routerLink]="['/', dil, 'accessibility']">{{ dil === 'en' ? 'Accessibility Statement' : 'Erişilebilirlik Bildirimi' }}</a>
        </p>
      </div>
    </footer>
  `
})
export class FooterComponent {
  @Input({ required: true }) dil!: Language;

  private http = inject(HttpClient);

  protected adres = signal('');
  protected faks = signal('');
  protected telefonlar = signal<string[]>([]);
  protected epostalar = signal<string[]>([]);

  ngOnInit(): void {
    this.http.get<Record<string, string>>(`/api/${this.dil}/ayarlar`).subscribe((a) => {
      this.adres.set(a['iletisim_adres'] ?? '');
      this.faks.set(a['iletisim_faks'] ?? '');
      // Birden çok numara/adres " · " ile ayrılarak tek alanda tutulur
      this.telefonlar.set(this.ayir(a['iletisim_telefon']));
      this.epostalar.set(this.ayir(a['iletisim_eposta']));
    });
  }

  private ayir(deger: string | undefined): string[] {
    return (deger ?? '').split('·').map((p) => p.trim()).filter(Boolean);
  }

  /** "+90 312 297 62 62" -> "+903122976262" */
  protected telBaglanti(t: string): string {
    return t.replace(/[^\d+]/g, '');
  }
}
