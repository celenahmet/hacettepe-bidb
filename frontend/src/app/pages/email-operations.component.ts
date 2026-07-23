import { Component, Input, signal } from '@angular/core';
import { Language } from '../core/models';

type IslemIkonu =
  | 'posta'
  | 'posta-ekle'
  | 'kullanici'
  | 'anahtar-soru'
  | 'anahtar-yenile'
  | 'kimlik'
  | 'telefon'
  | 'guvenlik'
  | 'exchange';

type IslemTonu = 'mavi' | 'kehribar' | 'kirmizi' | 'turkuaz' | 'mor';

interface EpostaIslemi {
  ad: string;
  adres: string;
  hedef: string | null;
  kategori: string;
  ikon: IslemIkonu;
  ton: IslemTonu;
}

interface IslemSunumu {
  kategori: string;
  ikon: IslemIkonu;
  ton: IslemTonu;
}

/**
 * E-Posta İşlemleri
 *
 * Kaynak içerikteki bağlantılar aynen korunur; yalnızca düz madde işaretli
 * liste, işlemin amacını ve hedefini ilk bakışta anlatan erişilebilir kartlara
 * dönüştürülür. Ayrıştırma DOM API'sine bağlı değildir ve Angular SSR sırasında
 * da aynı sonucu üretir.
 */
@Component({
  selector: 'bidb-email-operations',
  template: `
    @if (islemler().length) {
      <section class="eposta-merkezi"
               [attr.aria-label]="dilDegeri === 'en' ? 'Email account operations' : 'E-posta hesap işlemleri'">
        <header class="eposta-merkezi-ust">
          <div>
            <p class="eposta-merkezi-kod">
              {{ dilDegeri === 'en' ? 'Account and access center' : 'Hesap ve erişim merkezi' }}
            </p>
            <p class="eposta-merkezi-aciklama">
              {{ dilDegeri === 'en'
                ? 'Access your mailbox, recover your account or manage connection settings.'
                : 'Posta kutunuza erişin, hesabınızı yönetin veya bağlantı ayarlarına ulaşın.' }}
            </p>
          </div>
          <p class="eposta-merkezi-sayac" aria-hidden="true">
            <strong>{{ ikiHane(islemler().length) }}</strong>
            <span>{{ dilDegeri === 'en' ? 'operations' : 'işlem' }}</span>
          </p>
        </header>

        <ol class="eposta-islem-izgarasi">
          @for (islem of islemler(); track islem.adres; let sira = $index) {
            <li class="eposta-islem-kart" [class]="'eposta-islem-kart eposta-ton-' + islem.ton">
              <a [href]="islem.adres"
                 [attr.target]="islem.hedef"
                 [attr.rel]="islem.hedef === '_blank' ? 'noopener' : null"
                 [attr.aria-label]="kartEtiketi(islem)">
                <span class="eposta-kart-ust">
                  <span class="eposta-islem-sira">{{ ikiHane(sira + 1) }}</span>
                  <span class="eposta-islem-kategori">{{ islem.kategori }}</span>
                </span>

                <span class="eposta-islem-ikon" aria-hidden="true">
                  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor"
                       stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                    @switch (islem.ikon) {
                      @case ('posta') {
                        <rect x="4" y="7" width="24" height="18" rx="2"/>
                        <path d="m5 9 11 8 11-8"/>
                        <path d="M21.5 4.5h6v6"/>
                        <path d="m27.5 4.5-7 7"/>
                      }
                      @case ('posta-ekle') {
                        <rect x="3.5" y="8" width="19" height="15" rx="2"/>
                        <path d="m4.5 10 8.5 6 8.5-6"/>
                        <circle cx="24.5" cy="22.5" r="5"/>
                        <path d="M24.5 20v5M22 22.5h5"/>
                      }
                      @case ('kullanici') {
                        <circle cx="13" cy="10" r="5"/>
                        <path d="M4.5 27c.6-6 4-9 8.5-9 3.2 0 5.8 1.5 7.2 4.5"/>
                        <circle cx="25" cy="23" r="4.5"/>
                        <path d="M23.7 21.8c.2-1.1 2.3-1.2 2.6 0 .2.8-.3 1.2-.9 1.6-.5.3-.5.8-.5 1.1"/>
                        <path d="M25 26.2h.01"/>
                      }
                      @case ('anahtar-soru') {
                        <circle cx="10.5" cy="13.5" r="6"/>
                        <path d="m15 17.5 8.5 8.5M20.5 23l2.5-2.5M17.8 20.3l2.5-2.5"/>
                        <circle cx="25" cy="8" r="4.5"/>
                        <path d="M23.7 6.8c.2-1.1 2.3-1.2 2.6 0 .2.8-.3 1.2-.9 1.6-.5.3-.5.8-.5 1.1"/>
                        <path d="M25 11.2h.01"/>
                      }
                      @case ('anahtar-yenile') {
                        <circle cx="11" cy="13" r="6"/>
                        <path d="m15.5 17 8.5 8.5M21 22.5l2.5-2.5M18.5 20l2.5-2.5"/>
                        <path d="M20.5 5.5a7 7 0 0 1 7 7"/>
                        <path d="m24.5 5.5-4 .1.1 4"/>
                      }
                      @case ('kimlik') {
                        <rect x="3.5" y="6" width="25" height="20" rx="2"/>
                        <circle cx="11" cy="14" r="3.5"/>
                        <path d="M5.8 23c.5-3.6 2.5-5.5 5.2-5.5s4.7 1.9 5.2 5.5"/>
                        <path d="M19.5 12h5M19.5 16h5M19.5 20h3"/>
                        <path d="m25 5 2 2-3.5 3.5-2.5.5.5-2.5z"/>
                      }
                      @case ('telefon') {
                        <rect x="8.5" y="3.5" width="13" height="25" rx="2.5"/>
                        <path d="M13 6.5h4M13.5 25.5h3"/>
                        <path d="M23 11.5a6 6 0 0 1 4.5 5.8"/>
                        <path d="m25.5 11.5-2.5.1.1 2.5"/>
                        <path d="M7 20.5a6 6 0 0 1-2.5-5"/>
                        <path d="m4.5 20.5 2.5-.1-.1-2.5"/>
                      }
                      @case ('guvenlik') {
                        <path d="M16 3.5 27 8v7.5c0 6.2-4.4 10.8-11 13-6.6-2.2-11-6.8-11-13V8z"/>
                        <path d="M9.5 14.5h13M11 11l-1.5 3.5L11 18M21 11l1.5 3.5L21 18"/>
                        <path d="M13.5 22h5"/>
                      }
                      @case ('exchange') {
                        <rect x="3.5" y="7" width="16" height="12" rx="2"/>
                        <path d="m4.5 9 7 5 7-5"/>
                        <rect x="19.5" y="13" width="9" height="12" rx="1.5"/>
                        <path d="M22 17h4M22 20h4"/>
                        <path d="M9 23.5h8M13 19v4.5"/>
                      }
                    }
                  </svg>
                </span>

                <span class="eposta-islem-ad">{{ islem.ad }}</span>

                <span class="eposta-kart-alt" aria-hidden="true">
                  <span>{{ islem.hedef === '_blank'
                    ? (dilDegeri === 'en' ? 'Open in new tab' : 'Yeni sekmede aç')
                    : (dilDegeri === 'en' ? 'View details' : 'Ayrıntıları gör') }}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h13M14 7l5 5-5 5"/>
                  </svg>
                </span>
              </a>
            </li>
          }
        </ol>
      </section>
    }
  `
})
export class EmailOperationsComponent {
  @Input({ required: true }) set rawHtml(html: string) {
    this._islemler.set(this.ayristir(html ?? ''));
  }
  @Input() dilDegeri: Language = 'tr';

  private readonly _islemler = signal<EpostaIslemi[]>([]);
  protected readonly islemler = this._islemler.asReadonly();

  private readonly sunumlar: IslemSunumu[] = [
    { kategori: 'Posta kutusu', ikon: 'posta', ton: 'mavi' },
    { kategori: 'Hesap oluşturma', ikon: 'posta-ekle', ton: 'mavi' },
    { kategori: 'Hesap kurtarma', ikon: 'kullanici', ton: 'kehribar' },
    { kategori: 'Hesap kurtarma', ikon: 'anahtar-soru', ton: 'kehribar' },
    { kategori: 'Hesap güvenliği', ikon: 'anahtar-yenile', ton: 'kirmizi' },
    { kategori: 'Profil yönetimi', ikon: 'kimlik', ton: 'turkuaz' },
    { kategori: 'İletişim bilgisi', ikon: 'telefon', ton: 'turkuaz' },
    { kategori: 'Güvenlik kontrolü', ikon: 'guvenlik', ton: 'kirmizi' },
    { kategori: 'İstemci ayarları', ikon: 'exchange', ton: 'mor' }
  ];

  protected ikiHane(sayi: number): string {
    return String(sayi).padStart(2, '0');
  }

  protected kartEtiketi(islem: EpostaIslemi): string {
    const yeniSekme = islem.hedef === '_blank'
      ? (this.dilDegeri === 'en' ? ', opens in a new tab' : ', yeni sekmede açılır')
      : '';
    return `${islem.ad}${yeniSekme}`;
  }

  private ayristir(html: string): EpostaIslemi[] {
    const baglanti = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
    const sonuc: EpostaIslemi[] = [];
    let eslesme: RegExpExecArray | null;

    while ((eslesme = baglanti.exec(html)) !== null) {
      const nitelikler = eslesme[1];
      const adres = this.nitelik(nitelikler, 'href');
      const ad = this.metin(eslesme[2]);
      if (!adres || !ad) continue;

      const sunum = this.sunumlar[sonuc.length] ?? this.sunumlar[0];
      sonuc.push({
        ad,
        adres,
        hedef: this.nitelik(nitelikler, 'target'),
        kategori: sunum.kategori,
        ikon: sunum.ikon,
        ton: sunum.ton
      });
    }

    return sonuc;
  }

  private nitelik(nitelikler: string, ad: string): string | null {
    const eslesme = nitelikler.match(new RegExp(`\\b${ad}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
    return eslesme?.[2]?.trim() || null;
  }

  private metin(html: string): string {
    return html
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;|&#160;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;|&apos;/gi, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }
}
