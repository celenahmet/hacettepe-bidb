import { Component, Input, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Language } from '../core/models';
import { yenidenDene } from '../core/yeniden-dene';

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

        @if (haritaGoster) {
          <section class="konum-bolumu" aria-labelledby="konum-baslik">
            <header class="konum-baslik">
              <div>
                <p>{{ dilDegeri === 'en' ? 'Beytepe Campus' : 'Beytepe Yerleşkesi' }}</p>
                <h3 id="konum-baslik">
                  {{ dilDegeri === 'en' ? 'Location and directions' : 'Konum ve yol tarifi' }}
                </h3>
              </div>
              <span>
                {{ dilDegeri === 'en'
                  ? 'Hacettepe University Department of Information Technology'
                  : 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı' }}
              </span>
            </header>

            <div class="konum-harita">
              @if (haritaYuklendi()) {
                <iframe
                  src="https://maps.google.com/maps?q=Hacettepe+%C3%9Cniversitesi+Bilgi+%C4%B0%C5%9Flem+Daire+Ba%C5%9Fkanl%C4%B1%C4%9F%C4%B1,+Beytepe,+Ankara&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  [title]="dilDegeri === 'en'
                    ? 'Map showing Hacettepe University Department of Information Technology'
                    : 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı konum haritası'"
                  referrerpolicy="no-referrer-when-downgrade"
                  allowfullscreen>
                </iframe>
              } @else {
                <div class="konum-onizleme">
                  <svg viewBox="0 0 900 390" preserveAspectRatio="none" aria-hidden="true">
                    <path class="ana-yol" d="M-30 310C125 245 215 285 345 218S610 145 930 88"></path>
                    <path d="M30 72c145 50 210 35 290-22M110 405c36-138 85-190 170-300M420-20c-12 97 38 164 155 212s180 78 227 213M325 405c45-107 117-171 214-191s174-58 243-148M650-20c-18 87 12 138 90 185"></path>
                    <path class="ince-yol" d="M-20 185c120 5 210-30 281-107M514 405c-8-72 12-133 62-185M720 405c-43-92-37-164 19-215"></path>
                  </svg>
                  <button type="button" (click)="haritaYuklendi.set(true)">
                    <span aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 21s6-5.8 6-11a6 6 0 1 0-12 0c0 5.2 6 11 6 11Z"></path>
                        <circle cx="12" cy="10" r="2.2"></circle>
                      </svg>
                    </span>
                    <strong>{{ dilDegeri === 'en' ? 'Load interactive map' : 'Etkileşimli haritayı aç' }}</strong>
                    <small>
                      {{ dilDegeri === 'en'
                        ? 'The map is provided by Google Maps.'
                        : 'Harita Google Maps tarafından sağlanır.' }}
                    </small>
                  </button>
                </div>
              }
              <div class="konum-etiket">
                <span class="konum-pin" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 21s6-5.8 6-11a6 6 0 1 0-12 0c0 5.2 6 11 6 11Z"></path>
                    <circle cx="12" cy="10" r="2.2"></circle>
                  </svg>
                </span>
                <div>
                  <strong>
                    {{ dilDegeri === 'en'
                      ? 'Department of Information Technology'
                      : 'Bilgi İşlem Daire Başkanlığı' }}
                  </strong>
                  <small>06800 Beytepe / Ankara</small>
                </div>
              </div>
            </div>

            <div class="konum-alt">
              <div>
                <strong>{{ dilDegeri === 'en' ? 'Plan your visit' : 'Ziyaretinizi planlayın' }}</strong>
                <p>
                  {{ dilDegeri === 'en'
                    ? 'Open the destination in your preferred map application and get directions from your current location.'
                    : 'Konumu tercih ettiğiniz harita uygulamasında açarak bulunduğunuz yerden yol tarifi alabilirsiniz.' }}
                </p>
              </div>
              <nav class="konum-uygulamalar" [attr.aria-label]="dilDegeri === 'en' ? 'Map applications' : 'Harita uygulamaları'">
                <a href="https://www.google.com/maps/dir/?api=1&destination=Hacettepe+%C3%9Cniversitesi+Bilgi+%C4%B0%C5%9Flem+Daire+Ba%C5%9Fkanl%C4%B1%C4%9F%C4%B1,+Beytepe,+Ankara"
                   target="_blank" rel="noopener">
                  <svg class="google-maps-ikon" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#34a853" d="M12 2a7.5 7.5 0 0 0-7.5 7.5c0 5.5 7.5 12.5 7.5 12.5s7.5-7 7.5-12.5A7.5 7.5 0 0 0 12 2Z"/>
                    <path fill="#4285f4" d="M4.8 7.4 12 15l3.1-3.4A4.3 4.3 0 0 0 12 5.2a4.3 4.3 0 0 0-4.2 4.3c0 .6.1 1.1.3 1.6Z"/>
                    <path fill="#fbbc04" d="M4.5 9.5c0 1.9.9 4 2.1 5.9L12 15 8.1 11a4.3 4.3 0 0 1-.3-1.5Z"/>
                    <path fill="#ea4335" d="M12 2a7.5 7.5 0 0 0-7.2 5.4L8.1 11a4.3 4.3 0 0 1 7-4.7L18 3.9A7.5 7.5 0 0 0 12 2Z"/>
                    <circle cx="12" cy="9.5" r="1.8" fill="#fff"/>
                  </svg>
                  <span>
                    <small>Google Maps</small>
                    <strong>{{ dilDegeri === 'en' ? 'Get directions' : 'Yol tarifi al' }}</strong>
                  </span>
                  <svg class="konum-ok" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h13M14 7l5 5-5 5"></path>
                  </svg>
                </a>

                <a href="https://maps.apple.com/?daddr=Hacettepe+%C3%9Cniversitesi+Bilgi+%C4%B0%C5%9Flem+Daire+Ba%C5%9Fkanl%C4%B1%C4%9F%C4%B1,+Beytepe,+Ankara&dirflg=d"
                   target="_blank" rel="noopener">
                  <span class="apple-maps-ikon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M15.9 12.7c0-2.1 1.7-3.1 1.8-3.2a3.9 3.9 0 0 0-3.1-1.7c-1.3-.1-2.5.8-3.2.8-.7 0-1.7-.8-2.8-.8A4.2 4.2 0 0 0 5 10c-1.5 2.7-.4 6.6 1.1 8.8.8 1.1 1.7 2.3 2.9 2.2 1.1 0 1.6-.7 3.1-.7 1.4 0 1.9.7 3.1.7 1.3 0 2.1-1.1 2.8-2.2a9 9 0 0 0 1.3-2.7 3.8 3.8 0 0 1-3.4-3.4ZM13.7 6.4a3.8 3.8 0 0 0 .9-2.8 4 4 0 0 0-2.6 1.3 3.6 3.6 0 0 0-1 2.7 3.3 3.3 0 0 0 2.7-1.2Z"></path>
                    </svg>
                  </span>
                  <span>
                    <small>Apple Maps</small>
                    <strong>{{ dilDegeri === 'en' ? 'Get directions' : 'Yol tarifi al' }}</strong>
                  </span>
                  <svg class="konum-ok" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h13M14 7l5 5-5 5"></path>
                  </svg>
                </a>
              </nav>
            </div>
          </section>
        }
      </section>
    }
  `
})
export class ContactBlockComponent {
  @Input({ required: true }) dilDegeri!: Language;
  /** Harita yalnızca İletişim sayfasında gösterilir; aynı bilgi bloğunu kullanan
   *  Hakkımızda sayfasına büyük bir konum bölümü taşınmaz. */
  @Input() haritaGoster = false;

  private http = inject(HttpClient);
  protected kanallar = signal<ContactChannel[]>([]);
  protected haritaYuklendi = signal(false);

  ngOnInit(): void {
    this.http.get<ContactChannel[]>(`/api/${this.dilDegeri}/contact-channels`)
      .pipe(yenidenDene()).subscribe((l) => this.kanallar.set(l));
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
