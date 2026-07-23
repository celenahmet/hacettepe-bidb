import { Component, Input, signal } from '@angular/core';
import { Language } from '../core/models';

interface EpostaServisi {
  ad: string;
  adres: string;
  hedef: string | null;
  gorsel: string;
  kullanici: string;
  aciklama: string;
  alanAdi: string;
}

interface ServisAciklamasi {
  kullanici: string;
  aciklama: string;
}

/**
 * E-posta servis girişleri.
 *
 * Kaynak HTML'deki üç bağlantı, başlık ve görsel aynen korunur. Yalnızca bu
 * sayfada kullanıcıların doğru servisi seçebilmesi için kurumsal açıklamalar
 * ve güvenli kullanım yönlendirmesi eklenir.
 */
@Component({
  selector: 'bidb-webmail-services',
  template: `
    @if (servisler().length) {
      <section class="webmail-servisleri"
               [attr.aria-label]="dilDegeri === 'en' ? 'Email access services' : 'E-posta erişim servisleri'">
        <div class="webmail-giris">
          <div class="webmail-giris-isaret" aria-hidden="true">
            <svg viewBox="0 0 44 44" fill="none" stroke="currentColor"
                 stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <rect x="5" y="9" width="34" height="26" rx="2"/>
              <path d="m7 12 15 11 15-11"/>
              <path d="M12 5h20"/>
              <path d="M12 39h20"/>
            </svg>
          </div>

          <div class="webmail-giris-metin">
            <p class="webmail-giris-kod">
              {{ dilDegeri === 'en' ? 'INSTITUTIONAL COMMUNICATION INFRASTRUCTURE' : 'KURUMSAL İLETİŞİM ALTYAPISI' }}
            </p>
            <h2>
              {{ dilDegeri === 'en'
                ? 'Access email services through the correct channel'
                : 'E-posta hizmetlerine doğru kanaldan erişin' }}
            </h2>
            <p>
              {{ dilDegeri === 'en'
                ? 'Select the service matching your account type. These access points are presented in line with Hacettepe University’s institutional quality and information security approach.'
                : 'Hesap türünüze uygun servisi seçiniz. Erişim noktaları, Hacettepe Üniversitesi’nin kurumsal kalite ve bilgi güvenliği yaklaşımı doğrultusunda açık ve doğrulanabilir biçimde sunulmaktadır.' }}
            </p>
          </div>

          <div class="webmail-giris-durum" aria-hidden="true">
            <span class="webmail-durum-nokta"></span>
            <span>{{ dilDegeri === 'en' ? '3 OFFICIAL ACCESS POINTS' : '3 RESMÎ ERİŞİM NOKTASI' }}</span>
          </div>
        </div>

        <header class="webmail-secim-baslik">
          <div>
            <p>{{ dilDegeri === 'en' ? 'SERVICE SELECTION' : 'HİZMET SEÇİMİ' }}</p>
            <h2>{{ dilDegeri === 'en' ? 'Which account would you like to access?' : 'Hangi hesabınıza erişmek istiyorsunuz?' }}</h2>
          </div>
          <span>{{ dilDegeri === 'en' ? 'Choose by user profile' : 'Kullanıcı profiline göre seçim' }}</span>
        </header>

        <ol class="webmail-servis-izgarasi">
          @for (servis of servisler(); track servis.adres; let sira = $index) {
            <li class="webmail-servis-kart" [class.webmail-servis-ana]="sira === 0">
              <a [href]="servis.adres"
                 [attr.target]="servis.hedef"
                 [attr.rel]="servis.hedef === '_blank' ? 'noopener' : null"
                 [attr.aria-label]="servis.ad + (servis.hedef === '_blank' ? ', yeni sekmede açılır' : '')">
                <span class="webmail-kart-ust">
                  <span class="webmail-servis-sira">{{ ikiHane(sira + 1) }}</span>
                  <span class="webmail-servis-tur">{{ servis.kullanici }}</span>
                </span>

                <span class="webmail-servis-gorsel" aria-hidden="true">
                  <img [src]="servis.gorsel" alt="" width="48" height="48">
                </span>

                <span class="webmail-servis-icerik">
                  <span class="webmail-servis-ad">{{ servis.ad }}</span>
                  <span class="webmail-servis-aciklama">{{ servis.aciklama }}</span>
                </span>

                <span class="webmail-servis-alt">
                  <span class="webmail-servis-alan">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"
                         aria-hidden="true">
                      <path d="M12 3a9 9 0 1 0 9 9"/>
                      <path d="M3 12h12M12 3c2.2 2.5 3.3 5.5 3.3 9M12 3C9.8 5.5 8.7 8.5 8.7 12"/>
                      <path d="M17 4h4v4M21 4l-6 6"/>
                    </svg>
                    {{ servis.alanAdi }}
                  </span>
                  <span class="webmail-servis-eylem" aria-hidden="true">
                    {{ dilDegeri === 'en' ? 'ACCESS SERVICE' : 'SERVİSE ERİŞ' }}
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

        <aside class="webmail-guvenlik" aria-labelledby="webmail-guvenlik-baslik">
          <span class="webmail-guvenlik-ikon" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none" stroke="currentColor"
                 stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 3.5 27 8v7.5c0 6.2-4.4 10.8-11 13-6.6-2.2-11-6.8-11-13V8z"/>
              <path d="m10.5 15.5 3.5 3.5 7.5-8"/>
            </svg>
          </span>
          <div>
            <p class="webmail-guvenlik-kod">{{ dilDegeri === 'en' ? 'SECURE USE' : 'GÜVENLİ KULLANIM' }}</p>
            <h2 id="webmail-guvenlik-baslik">
              {{ dilDegeri === 'en' ? 'Verify the address before signing in' : 'Oturum açmadan önce adresi doğrulayın' }}
            </h2>
            <p>
              {{ dilDegeri === 'en'
                ? 'Check the domain displayed in your browser’s address bar and never share your password by email, telephone or message.'
                : 'Tarayıcınızın adres çubuğunda görüntülenen alan adını kontrol ediniz; parolanızı e-posta, telefon veya mesaj yoluyla hiç kimseyle paylaşmayınız.' }}
            </p>
          </div>
        </aside>
      </section>
    }
  `
})
export class WebmailServicesComponent {
  @Input({ required: true }) set rawHtml(html: string) {
    this._servisler.set(this.ayristir(html ?? ''));
  }
  @Input() dilDegeri: Language = 'tr';

  private readonly _servisler = signal<EpostaServisi[]>([]);
  protected readonly servisler = this._servisler.asReadonly();

  private readonly aciklamalar: ServisAciklamasi[] = [
    {
      kullanici: 'PERSONEL VE ÖĞRENCİ',
      aciklama: 'Aktif Hacettepe Üniversitesi personel ve öğrenci hesapları için Microsoft Exchange posta kutusuna güvenli erişim.'
    },
    {
      kullanici: 'MEZUN KULLANICI',
      aciklama: 'Mezun e-posta hesabı bulunan kullanıcılar için Outlook web arayüzü üzerinden posta kutusu erişimi.'
    },
    {
      kullanici: 'HESAP İŞLEMLERİ',
      aciklama: 'Kullanıcı adı, parola ve hesap bilgilerinizle ilgili işlemleri yönetebileceğiniz BİDB hizmet portalı.'
    }
  ];

  protected ikiHane(sayi: number): string {
    return String(sayi).padStart(2, '0');
  }

  private ayristir(html: string): EpostaServisi[] {
    const kartDeseni = /<div class="card-body">([\s\S]*?)<\/div>\s*<\/div>/gi;
    const sonuc: EpostaServisi[] = [];
    let kart: RegExpExecArray | null;

    while ((kart = kartDeseni.exec(html)) !== null) {
      const govde = kart[1];
      const gorsel = govde.match(/<img\b[^>]*\bsrc\s*=\s*(["'])(.*?)\1/i)?.[2];
      const baglanti = govde.match(/<a\b([^>]*)>([\s\S]*?)<\/a>/i);
      if (!gorsel || !baglanti) continue;

      const adres = this.nitelik(baglanti[1], 'href');
      const ad = this.metin(baglanti[2]);
      if (!adres || !ad) continue;

      const sunum = this.aciklamalar[sonuc.length] ?? this.aciklamalar[0];
      sonuc.push({
        ad,
        adres,
        hedef: this.nitelik(baglanti[1], 'target'),
        gorsel,
        kullanici: sunum.kullanici,
        aciklama: sunum.aciklama,
        alanAdi: this.alanAdi(adres)
      });
    }

    return sonuc;
  }

  private alanAdi(adres: string): string {
    const eslesme = adres.match(/^https?:\/\/([^/]+)/i);
    return eslesme?.[1] ?? adres;
  }

  private nitelik(nitelikler: string, ad: string): string | null {
    const eslesme = nitelikler.match(new RegExp(`\\b${ad}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
    return eslesme?.[2]?.trim() || null;
  }

  private metin(html: string): string {
    return html
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;|&#160;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
