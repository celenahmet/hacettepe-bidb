import { Component, Input, signal } from '@angular/core';
import { Language } from '../core/models';

type MicrosoftUrunu = 'office' | 'teams';

interface MicrosoftRehberi {
  ad: string;
  adres: string;
  hedef: string | null;
  urun: MicrosoftUrunu;
  tur: string;
  aciklama: string;
}

interface RehberSunumu {
  ad: string;
  urun: MicrosoftUrunu;
  tur: string;
  aciklama: string;
}

/**
 * Office 365 belge merkezi.
 *
 * Kaynak sayfadaki üç PDF bağlantısı ve mevcut Office/Teams marka ikonları
 * korunur. Bağlantılar, hangi rehberin hangi ihtiyacı karşıladığını açıklayan
 * bağımsız kartlara dönüştürülür.
 */
@Component({
  selector: 'bidb-office365-guides',
  template: `
    @if (rehberler().length) {
      <section class="office-rehberleri"
               [attr.aria-label]="dilDegeri === 'en' ? 'Microsoft 365 guides' : 'Microsoft 365 rehberleri'">
        <header class="office-rehber-giris">
          <div>
            <p class="office-rehber-kod">
              {{ dilDegeri === 'en' ? 'Microsoft 365 service guides' : 'Microsoft 365 hizmet rehberleri' }}
            </p>
            <h2>
              {{ dilDegeri === 'en'
                ? 'From installation to daily use'
                : 'Kurulumdan günlük kullanıma kadar doğru adımlar' }}
            </h2>
            <p>
              {{ dilDegeri === 'en'
                ? 'Use the official guides prepared for Hacettepe University users to configure Office 365 and Microsoft Teams correctly.'
                : 'Office 365 ve Microsoft Teams hizmetlerini doğru yapılandırmak için Hacettepe Üniversitesi kullanıcılarına yönelik hazırlanan rehberleri inceleyiniz.' }}
            </p>
          </div>

          <div class="office-rehber-ozet" aria-hidden="true">
            <strong>{{ ikiHane(rehberler().length) }}</strong>
            <span>{{ dilDegeri === 'en' ? 'PDF guides' : 'PDF rehber' }}</span>
          </div>
        </header>

        <ol class="office-rehber-izgarasi">
          @for (rehber of rehberler(); track rehber.adres; let sira = $index) {
            <li class="office-rehber-kart" [class.office-rehber-kart-office]="rehber.urun === 'office'">
              <a [href]="rehber.adres"
                 [attr.target]="rehber.hedef"
                 [attr.rel]="rehber.hedef === '_blank' ? 'noopener' : null"
                 [attr.aria-label]="rehber.ad + (rehber.hedef === '_blank' ? ', PDF yeni sekmede açılır' : '')">
                <span class="office-rehber-ust">
                  <span class="office-rehber-sira">{{ ikiHane(sira + 1) }}</span>
                  <span class="office-rehber-tur">{{ rehber.tur }}</span>
                </span>

                <span class="office-rehber-marka" aria-hidden="true">
                  @if (rehber.urun === 'office') {
                    <!-- Mevcut Office ikonuyla aynı vektör yolları. -->
                    <svg viewBox="0 0 48 48">
                      <path fill="#EB3C00" d="M28 5 8 12v24l8 4V15l12-3v24l-12-4 12 8 12-4V9z"/>
                    </svg>
                  } @else {
                    <!-- Mevcut Teams ikonuyla aynı vektör yolları. -->
                    <svg viewBox="0 0 48 48">
                      <rect x="6" y="14" width="22" height="22" rx="3" fill="#5059C9"/>
                      <path fill="#fff" d="M11 19h12v3h-4.5v11h-3V22H11z"/>
                      <circle cx="34" cy="12" r="5" fill="#7B83EB"/>
                      <path fill="#7B83EB" d="M42 22c0-2-2-4-4-4h-8v13a6 6 0 0 0 12 0z"/>
                      <circle cx="23" cy="11" r="6" fill="#5059C9"/>
                    </svg>
                  }
                </span>

                <span class="office-rehber-icerik">
                  <span class="office-rehber-ad">{{ rehber.ad }}</span>
                  <span class="office-rehber-aciklama">{{ rehber.aciklama }}</span>
                </span>

                <span class="office-rehber-alt">
                  <span class="office-rehber-dosya">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"
                         aria-hidden="true">
                      <path d="M6 3.5h8l4 4V20.5H6z"/>
                      <path d="M14 3.5v4h4M8.5 13h7M8.5 16h5"/>
                    </svg>
                    PDF
                  </span>
                  <span class="office-rehber-eylem" aria-hidden="true">
                    {{ dilDegeri === 'en' ? 'View guide' : 'Rehberi incele' }}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M5 12h13M14 7l5 5-5 5"/>
                    </svg>
                  </span>
                </span>
              </a>
            </li>
          }
        </ol>
      </section>
    }
  `
})
export class Office365GuidesComponent {
  @Input({ required: true }) set rawHtml(html: string) {
    this._rehberler.set(this.ayristir(html ?? ''));
  }
  @Input() dilDegeri: Language = 'tr';

  private readonly _rehberler = signal<MicrosoftRehberi[]>([]);
  protected readonly rehberler = this._rehberler.asReadonly();

  private readonly sunumlar: RehberSunumu[] = [
    {
      ad: 'Microsoft Office 365 Kullanımı',
      urun: 'office',
      tur: 'Hesap ve kullanım',
      aciklama: 'Hacettepe hesabınızla Office 365 hizmetlerine erişim ve hesap oluşturma adımlarını inceleyin.'
    },
    {
      ad: 'Microsoft Teams Kurulum Kılavuzu',
      urun: 'teams',
      tur: 'Kurulum',
      aciklama: 'Teams uygulamasını cihazınıza kurma ve kurumsal hesabınızla oturum açma adımlarını takip edin.'
    },
    {
      ad: 'Microsoft Teams Kullanım Kılavuzu',
      urun: 'teams',
      tur: 'Kullanım',
      aciklama: 'Toplantı, ekip ve temel iletişim özelliklerini etkin biçimde kullanmaya başlamak için rehberi inceleyin.'
    }
  ];

  protected ikiHane(sayi: number): string {
    return String(sayi).padStart(2, '0');
  }

  private ayristir(html: string): MicrosoftRehberi[] {
    const baglanti = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
    const sonuc: MicrosoftRehberi[] = [];
    let eslesme: RegExpExecArray | null;

    while ((eslesme = baglanti.exec(html)) !== null) {
      const adres = this.nitelik(eslesme[1], 'href');
      if (!adres) continue;

      const sunum = this.sunumlar[sonuc.length];
      if (!sunum) break;

      sonuc.push({
        ...sunum,
        adres,
        hedef: this.nitelik(eslesme[1], 'target')
      });
    }

    return sonuc;
  }

  private nitelik(nitelikler: string, ad: string): string | null {
    const eslesme = nitelikler.match(new RegExp(`\\b${ad}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
    return eslesme?.[2]?.trim() || null;
  }
}
