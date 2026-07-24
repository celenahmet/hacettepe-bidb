import { Component, Input, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Api } from '../core/api.service';
import { Language, MenuItem } from '../core/models';

/** Sol menü. Bölümler API'den gelir; açılır-kapanır çalışır. */
@Component({
  selector: 'bidb-side-menu',
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  template: `
    <nav class="sol-menu" [attr.aria-label]="language === 'en' ? 'Section menu' : 'Bölüm menüsü'">
      <a class="sol-menu-ana" [routerLink]="['/', language]" routerLinkActive="etkin"
         [routerLinkActiveOptions]="{ exact: true }">
        {{ language === 'en' ? 'Home Page' : 'Ana Sayfa' }}
      </a>
      <a class="sol-menu-ana" [routerLink]="['/', language, 'news']" routerLinkActive="etkin">
        {{ language === 'en' ? 'News and Announcements' : 'Haberler ve Duyurular' }}
      </a>      @for (m of menus$ | async; track m.title) {
        <details class="sol-bolum" [open]="bolumEtkin(m.items) || ((m.title === 'Servislerimiz' || m.title === 'Services') && bolumEtkin(uygulamaSistemleri))">
          <summary>{{ m.title }}</summary>
          <ul>
            @for (o of m.items; track o.url) {
              <li>
                @if (o.newTab) {
                  <a [href]="o.url" target="_blank" rel="noopener">{{ o.label }}</a>
                } @else {
                  <a [routerLink]="o.url" routerLinkActive="etkin">{{ o.label }}</a>
                }
              </li>
            }
            @if (m.title === 'Servislerimiz' || m.title === 'Services') {
              <li style="padding: 8px 16px 4px 16px; font-weight: 700; font-size: 0.8em; text-transform: uppercase; color: var(--hu-kirmizi); border-top: 1px solid var(--cizgi); margin-top: 8px;">
                {{ language === 'en' ? 'Application Systems' : 'Uygulama Sistemleri' }}
              </li>
              @for (app of uygulamaSistemleri; track app.url) {
                <li>
                  @if (app.newTab) {
                    <a [href]="app.url" target="_blank" rel="noopener">{{ language === 'en' ? app.labelEn : app.label }}</a>
                  } @else {
                    <a [routerLink]="['/', language, app.url]" routerLinkActive="etkin">{{ language === 'en' ? app.labelEn : app.label }}</a>
                  }
                </li>
              }
            }
          </ul>
        </details>
      }

    </nav>
  `
})
export class SideMenuComponent {
  @Input({ required: true }) set dilDegeri(d: Language) {
    this.language = d;
    this.menus$ = this.api.menu(d);
  }
  protected language: Language = 'tr';
  private api = inject(Api);
  private router = inject(Router);
  protected menus$ = this.api.menu('tr');

  protected uygulamaSistemleri = [
    { label: 'Hacettepe Portal', labelEn: 'Hacettepe Portal', url: 'https://portal.hacettepe.edu.tr/', newTab: true },
    { label: 'Web Servisleri', labelEn: 'Web Services', url: 'webmail', newTab: false },
    { label: 'HÜ İçerik Yönetim Sistemi', labelEn: 'HU Content Management System', url: 'http://hu-iys.hacettepe.edu.tr/', newTab: true },
    { label: 'Akademik Ön Değerlendirme Başvuru Sistemi', labelEn: 'Academic Pre-Evaluation Application System', url: 'https://kriter.hacettepe.edu.tr', newTab: true },
    { label: 'GSF Başvuru Sistemi', labelEn: 'GSF Application System', url: 'https://ozelyeteneksinavi.hacettepe.edu.tr/giris/', newTab: true },
    { label: 'Eğitim Fakültesi Mezun Bilgi Sistemi', labelEn: 'Faculty of Education Alumni Info System', url: 'http://egitimmezun.hacettepe.edu.tr/', newTab: true },
    { label: 'Sticker Başvurusu', labelEn: 'Sticker Application', url: 'http://guvenlik.hacettepe.edu.tr/sticker/', newTab: true }
  ];

  /** Yalnızca bulunulan sayfayı içeren bölüm başlangıçta açık gelir.
   *  Diğer bölümler yükseklik ayırmaz; kullanıcı isterse summary üzerinden
   *  bağımsız olarak açabilir. */
  protected bolumEtkin(items: { url: string, newTab: boolean }[] | MenuItem[]): boolean {
    const etkinYol = this.router.url.split(/[?#]/, 1)[0].replace(/\/+$/, '');
    return items.some((item) =>
      !item.newTab && (
        item.url.replace(/\/+$/, '') === etkinYol || 
        (typeof item.url === 'string' && etkinYol.endsWith('/' + item.url))
      )
    );
  }
}
