import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Language } from '../core/models';

/**
 * E-İmza rehberi alt-gezinmesi.
 *
 * Kaynak alt sistemin her sayfasında bir sol menü vardı. O menü stored
 * içeriğe alınmadı (kaynağın şablonuna aitti); yerine bu bileşen, e-imza
 * sayfalarının hepsinde aynı gezinmeyi gösteriyor. Bağlantılar ve gruplama
 * kaynağın görünür menüsüyle birebir; kaynakta yorum satırına alınmış
 * (gizli) öğeler burada da yok.
 */
@Component({
  selector: 'bidb-eimza-nav',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="eimza-nav" [attr.aria-label]="dilDegeri === 'en' ? 'E-signature guide' : 'E-İmza rehberi'">
      <a class="eimza-nav-ust" routerLink="/tr/e-signature" routerLinkActive="etkin"
         [routerLinkActiveOptions]="{ exact: true }">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none"
             stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 20h16M6 16l9.5-9.5a2 2 0 013 3L9 19l-4 1z"/>
        </svg>
        Elektronik İmza Kullanma Rehberi
      </a>

      @for (b of bolumler; track b.baslik) {
        <div class="eimza-nav-grup">
          @if (b.baslik) { <span class="eimza-nav-grup-ad">{{ b.baslik }}</span> }
          <ul>
            @for (o of b.ogeler; track o.url) {
              <li>
                @if (o.dis) {
                  <a [href]="o.url" target="_blank" rel="noopener">{{ o.ad }}</a>
                } @else {
                  <a [routerLink]="o.url" routerLinkActive="etkin">{{ o.ad }}</a>
                }
              </li>
            }
          </ul>
        </div>
      }
    </nav>
  `
})
export class EImzaNavComponent {
  @Input() dilDegeri: Language = 'tr';

  /** Kaynağın görünür sol menüsüyle birebir; gizli (yorumlu) öğeler yok. */
  protected bolumler = [
    {
      baslik: '',
      ogeler: [
        { ad: 'E-İmza Hakkında', url: '/tr/e-signature-about' },
        { ad: 'Mevzuat', url: '/tr/e-signature-legislation' }
      ]
    },
    {
      baslik: 'Başvuru İşlemleri',
      ogeler: [
        { ad: 'Başvuru', url: '/tr/e-signature-application' },
        { ad: 'Başvuru Formu Doldurma', url: 'https://bidb.hacettepe.edu.tr/eimza/indir/yrd_bidb_basvuru_form_doldurma.pdf', dis: true },
        { ad: 'Sertifikamı Aldım, Ne Yapmalıyım?', url: '/tr/e-signature-certificate-received' }
      ]
    },
    {
      baslik: 'Sertifika İşlemleri',
      ogeler: [
        { ad: 'Güvenlik Sözcüğü Yenileme', url: '/tr/e-signature-security-word' },
        { ad: 'Yenileme', url: '/tr/e-signature-renewal' },
        { ad: 'Güncelleme', url: '/tr/e-signature-update' },
        { ad: 'İptal', url: '/tr/e-signature-cancellation' },
        { ad: 'Bilgi Güncelleme', url: '/tr/e-signature-info-update' }
      ]
    },
    {
      baslik: '',
      ogeler: [
        { ad: 'Şifre İşlemleri', url: '/tr/e-signature-password' },
        { ad: 'Birim E-İmza Sorumluları', url: '/tr/e-signature-unit-officers' },
        { ad: 'Sık Sorulan Sorular', url: '/tr/e-signature-faq' }
      ]
    }
  ] as { baslik: string; ogeler: { ad: string; url: string; dis?: boolean }[] }[];
}
