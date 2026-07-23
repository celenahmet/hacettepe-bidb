import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Language } from '../core/models';

interface Oge { ad: string; url: string; dis?: boolean; }
interface Bolum { baslik: string; ogeler: Oge[]; }

/**
 * E-İmza rehberi sol menüsü.
 *
 * Kaynak alt sistemin her sayfasında kendi sol menüsü vardı: tek başına
 * duran maddeler ve açılır gruplar (Başvuru İşlemleri, Sertifika
 * İşlemleri). Bu bileşen o menüyü sitenin KENDİ menü altyapısıyla
 * yeniden kuruyor — aynı .sol-menu işaretlemesi ve aynı details/summary
 * davranışı, böylece e-imza sayfaları sitenin geri kalanıyla aynı
 * gezinme dilini konuşuyor.
 *
 * Bağlantılar ve gruplama kaynağın görünür menüsüyle birebir; kaynakta
 * yorum satırına alınmış (gizli) öğeler burada da yok. İçinde bulunulan
 * sayfanın grubu kendiliğinden açık gelir.
 */
@Component({
  selector: 'bidb-eimza-nav',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="sol-menu"
         [attr.aria-label]="dilDegeri === 'en' ? 'E-signature guide' : 'E-İmza rehberi'">

      <a class="sol-menu-ana" routerLink="/tr/e-signature" routerLinkActive="etkin"
         [routerLinkActiveOptions]="{ exact: true }">
        {{ dilDegeri === 'en' ? 'E-Signature Guide' : 'E-İmza Kullanma Rehberi' }}
      </a>

      @for (b of bolumler; track b.baslik + b.ogeler[0].url) {
        @if (b.baslik) {
          <!-- Açılır grup: içinde bulunulan sayfa buradaysa açık başlar. -->
          <details class="sol-bolum" [open]="acikMi(b)">
            <summary>{{ b.baslik }}</summary>
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
          </details>
        } @else {
          <!-- Grupsuz maddeler: menünün üst düzeyinde tek satır. -->
          @for (o of b.ogeler; track o.url) {
            @if (o.dis) {
              <a class="sol-menu-ana" [href]="o.url" target="_blank" rel="noopener">{{ o.ad }}</a>
            } @else {
              <a class="sol-menu-ana" [routerLink]="o.url" routerLinkActive="etkin">{{ o.ad }}</a>
            }
          }
        }
      }
    </nav>
  `
})
export class EImzaNavComponent {
  @Input() dilDegeri: Language = 'tr';
  /** İçinde bulunulan sayfanın adresi; grubu açık başlatmak için. */
  @Input() etkinYol = '';

  /** Kaynağın görünür sol menüsüyle birebir; gizli (yorumlu) öğeler yok. */
  protected bolumler: Bolum[] = [
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
        { ad: 'Sertifikamı Aldım Ne Yapmalıyım?', url: '/tr/e-signature-certificate-received' }
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
  ];

  /** Bulunulan sayfa bu grubun içindeyse grup açık gelir. */
  protected acikMi(b: Bolum): boolean {
    return b.ogeler.some((o) => !o.dis && o.url === this.etkinYol);
  }
}
