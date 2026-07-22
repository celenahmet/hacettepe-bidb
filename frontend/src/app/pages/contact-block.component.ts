import { Component, Input, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Language } from '../core/models';

/** Panelden yönetilen tek bir iletişim kaydı. */
interface ContactChannel {
  id: number;
  /** address | phone | email | fax */
  type: string;
  label: string | null;
  value: string;
  sortOrder: number;
}

/**
 * Sayfa sonuna eklenen iletişim bilgileri.
 *
 * Bilgiler sayfa metnine yazılmaz; alt bilgiyle aynı kayıtlardan gelir.
 * Metne gömülselerdi panelden bir numara değiştiğinde alt bilgi doğruyu,
 * bu sayfa yanlışı gösterirdi.
 */
@Component({
  selector: 'bidb-contact-block',
  template: `
    @if (kanallar().length) {
      <section class="iletisim-blok">
        <h2>{{ dilDegeri === 'en' ? 'Contact' : 'İletişim' }}</h2>

        <dl>
          @if (tur('address').length) {
            <div>
              <dt>{{ dilDegeri === 'en' ? 'Address' : 'Adres' }}</dt>
              @for (a of tur('address'); track a.id) { <dd>{{ a.value }}</dd> }
            </div>
          }
          @if (tur('phone').length) {
            <div>
              <dt>{{ dilDegeri === 'en' ? 'Telephone' : 'Telefon' }}</dt>
              @for (t of tur('phone'); track t.id) {
                <dd><a [href]="'tel:' + telBaglanti(t.value)">{{ t.value }}</a></dd>
              }
            </div>
          }
          @if (tur('fax').length) {
            <div>
              <dt>{{ dilDegeri === 'en' ? 'Fax' : 'Faks' }}</dt>
              @for (f of tur('fax'); track f.id) { <dd>{{ f.value }}</dd> }
            </div>
          }
          @if (tur('email').length) {
            <div>
              <dt>{{ dilDegeri === 'en' ? 'E-mail' : 'E-Posta' }}</dt>
              @for (e of tur('email'); track e.id) {
                <dd><a [href]="'mailto:' + e.value">{{ e.value }}</a></dd>
              }
            </div>
          }
        </dl>
      </section>
    }
  `
})
export class ContactBlockComponent {
  @Input({ required: true }) dilDegeri!: Language;

  private http = inject(HttpClient);
  protected kanallar = signal<ContactChannel[]>([]);

  ngOnInit(): void {
    this.http.get<ContactChannel[]>(`/api/${this.dilDegeri}/contact-channels`)
      .subscribe((l) => this.kanallar.set(l));
  }

  protected tur(t: string): ContactChannel[] {
    return this.kanallar().filter((k) => k.type === t);
  }

  /** Numara, tuşlanabilir biçime çevrilir; ekranda görünen metin değişmez. */
  protected telBaglanti(deger: string): string {
    const rakam = deger.replace(/\D/g, '');
    return rakam.startsWith('90') ? '+' + rakam : '+90' + rakam.replace(/^0/, '');
  }
}
