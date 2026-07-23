import { Component, Input } from '@angular/core';
import { Language, NewsAudience, NewsCategory, NewsCoverTemplate } from '../core/models';

const KATEGORI_ETIKETLERI: Record<NewsCategory, [string, string]> = {
  general: ['Genel Duyurular', 'General Announcements'],
  'service-outage': ['Hizmet Kesintisi', 'Service Interruption'],
  maintenance: ['Planlı Bakım', 'Scheduled Maintenance'],
  'cyber-security': ['Siber Güvenlik', 'Cyber Security'],
  'network-internet': ['Ağ ve İnternet', 'Network and Internet'],
  email: ['E-Posta', 'E-mail'],
  'software-license': ['Yazılım ve Lisans', 'Software and Licensing'],
  'ebys-esignature': ['EBYS ve E-İmza', 'EDMS and E-Signature'],
  'web-services': ['Web Hizmetleri', 'Web Services'],
  'training-event': ['Eğitim ve Etkinlik', 'Training and Events'],
  recruitment: ['Personel Alımı', 'Recruitment'],
  iskur: ['İŞKUR Duyuruları', 'İŞKUR Announcements'],
  procurement: ['Satın Alma ve İhale', 'Procurement and Tender']
};

const HEDEF_ETIKETLERI: Record<NewsAudience, [string, string]> = {
  'all-users': ['Tüm Kullanıcılar', 'All Users'],
  students: ['Öğrenciler', 'Students'],
  'academic-staff': ['Akademik Personel', 'Academic Staff'],
  'administrative-staff': ['İdari Personel', 'Administrative Staff'],
  'all-staff': ['Tüm Personel', 'All Staff'],
  alumni: ['Mezunlar', 'Alumni'],
  'unit-managers': ['Birim Yöneticileri', 'Unit Managers']
};

/** Fotoğrafı veya yönetim panelinden seçilen kurumsal şablonu üretir. */
@Component({
  selector: 'bidb-news-cover',
  host: { class: 'haber-kapak-kapsayici' },
  template: `
    <figure class="haber-kapak" [class.sablon-kapak]="!imageUrl"
            [attr.data-kategori]="category"
            [attr.data-sablon]="template">
      @if (imageUrl) {
        <img [src]="imageUrl"
             [srcset]="yerelKucukGorsel(imageUrl) ? yerelKucukGorsel(imageUrl) + ' 480w, ' + yerelOrtaGorsel(imageUrl) + ' 720w, ' + imageUrl + ' 1000w' : null"
             sizes="(max-width: 48rem) calc(100vw - 2.5rem), 24rem"
             [alt]="imageAlt || title" loading="lazy" decoding="async">
      } @else {
        <span class="haber-sablon-cizgi" aria-hidden="true"></span>
        <span class="haber-sablon-nokta" aria-hidden="true"></span>

        <svg class="haber-kapak-ikon" viewBox="0 0 24 24" width="54" height="54"
             aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.35"
             stroke-linecap="round" stroke-linejoin="round">
          @switch (category) {
            @case ('service-outage') {
              <path d="M13 2L5.5 13h6L10.5 22 18.5 10h-6L13 2z"/>
            }
            @case ('maintenance') {
              <path d="M14.5 6.5a4.5 4.5 0 01-5.7 5.7L3.5 17.5a2.1 2.1 0 003 3l5.3-5.3a4.5 4.5 0 005.7-5.7l-2.8 2.8-3-3 2.8-2.8z"/>
            }
            @case ('cyber-security') {
              <path d="M12 3l7 3v5c0 4.7-2.8 8-7 10-4.2-2-7-5.3-7-10V6l7-3z"/>
              <path d="M9.2 12l1.8 1.8 3.9-4.1"/>
            }
            @case ('network-internet') {
              <circle cx="5" cy="12" r="2.2"/><circle cx="19" cy="6" r="2.2"/><circle cx="19" cy="18" r="2.2"/>
              <path d="M7.2 11.2l9.6-4.4M7.2 12.8l9.6 4.4"/>
            }
            @case ('email') {
              <rect x="3" y="5.5" width="18" height="13" rx="1.5"/><path d="M3.5 6.5l8.5 6 8.5-6"/>
            }
            @case ('software-license') {
              <rect x="3" y="4.5" width="18" height="15" rx="1.5"/><path d="M3 8.5h18"/>
              <path d="M8.5 12.5l-2 2 2 2M14.5 12.5l2 2-2 2"/>
            }
            @case ('ebys-esignature') {
              <path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 16c2-3 3-3 4-1 1-2 2-2 3 0"/>
            }
            @case ('web-services') {
              <circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/>
            }
            @case ('training-event') {
              <path d="M3 9l9-5 9 5-9 5-9-5zM7 12v5c3 2 7 2 10 0v-5M21 9v6"/>
            }
            @case ('recruitment') {
              <circle cx="9" cy="8" r="3.2"/><path d="M3.5 20c0-3.6 2.5-6 5.5-6s5.5 2.4 5.5 6"/>
              <path d="M18 9v6M15 12h6"/>
            }
            @case ('iskur') {
              <rect x="3" y="7" width="18" height="13" rx="1.5"/><path d="M9 7V4h6v3M3 12h18M10 12v2h4v-2"/>
            }
            @case ('procurement') {
              <path d="M4 9h16M6 9v9M10 9v9M14 9v9M18 9v9M3 20h18M12 3l9 4H3l9-4z"/>
            }
            @default {
              <path d="M4 10v4a1 1 0 001 1h2l6 4V5L7 9H5a1 1 0 00-1 1z"/>
              <path d="M17 8.5a5 5 0 010 7"/>
            }
          }
        </svg>

        <p class="haber-kapak-metin">{{ kapakMetni() }}</p>
      }

      <span class="haber-etiket">{{ kategoriEtiketi() }}</span>
      <span class="haber-hedef">
        <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"
             fill="none" stroke="currentColor" stroke-width="1.7">
          <circle cx="12" cy="8" r="3"/><path d="M5.5 20c0-4 2.8-6.5 6.5-6.5s6.5 2.5 6.5 6.5"/>
        </svg>
        {{ hedefEtiketi() }}
      </span>
    </figure>
  `
})
export class NewsCoverComponent {
  @Input() imageUrl: string | null = null;
  @Input() imageAlt: string | null = null;

  protected yerelKucukGorsel(adres: string | null): string | null {
    if (!adres || !/^\/images\/news\/[^?#]+\.webp(?:[?#].*)?$/i.test(adres)) return null;
    return adres.replace(/\.webp(?=([?#]|$))/i, '-480.webp');
  }

  protected yerelOrtaGorsel(adres: string | null): string | null {
    if (!adres || !/^\/images\/news\/[^?#]+\.webp(?:[?#].*)?$/i.test(adres)) return null;
    return adres.replace(/\.webp(?=([?#]|$))/i, '-720.webp');
  }
  @Input() title = '';
  @Input() category: NewsCategory = 'general';
  @Input() audience: NewsAudience = 'all-users';
  @Input() template: NewsCoverTemplate = 'institutional';
  @Input() coverText: string | null = null;
  @Input() language: Language = 'tr';

  protected kategoriEtiketi(): string {
    const etiket = KATEGORI_ETIKETLERI[this.category] ?? KATEGORI_ETIKETLERI.general;
    return etiket[this.language === 'en' ? 1 : 0];
  }

  protected hedefEtiketi(): string {
    const etiket = HEDEF_ETIKETLERI[this.audience] ?? HEDEF_ETIKETLERI['all-users'];
    return etiket[this.language === 'en' ? 1 : 0];
  }

  protected kapakMetni(): string {
    return this.coverText?.trim() || this.kategoriEtiketi();
  }
}
