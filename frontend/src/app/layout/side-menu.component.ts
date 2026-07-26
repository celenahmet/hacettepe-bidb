import { Component, Input, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Api } from '../core/api.service';
import { Language, Menu, MenuItem } from '../core/models';

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
        <details class="sol-bolum" [open]="bolumEtkin(m.items)">
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
          </ul>
        </details>

        <!-- Uygulama sistemleri kendi başına bir bölümdür; menüde
             "Servislerimiz"in hemen ardından, diğer bölümlerle aynı
             açılır-kapanır davranışla durur. Önceden Servislerimiz'in
             listesine iliştiriliyordu: o bölüm her açıldığında bu yedi
             bağlantı da zorunlu olarak açılıyor, menü içerikten uzun
             hâle gelip kartın dışına taşmış gibi görünüyordu. -->
        @if (m.title === 'Servislerimiz' || m.title === 'Services') {
          <details class="sol-bolum" [open]="bolumEtkin(uygulamaSistemleri)">
            <summary>{{ language === 'en' ? 'Application Systems' : 'Uygulama Sistemleri' }}</summary>
            <ul>
              @for (app of uygulamaSistemleri; track app.url) {
                <li>
                  @if (app.newTab) {
                    <a [href]="app.url" target="_blank" rel="noopener">{{ language === 'en' ? app.labelEn : app.label }}</a>
                  } @else {
                    <a [routerLink]="['/', language, app.url]" routerLinkActive="etkin">{{ language === 'en' ? app.labelEn : app.label }}</a>
                  }
                </li>
              }
            </ul>
          </details>
        }
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
  // Girdi ayarlayıcısı ilk değeri hemen verdiği için burada ayrı bir
  // istek başlatılmaz; sabit 'tr' ile yapılan eski çağrı, dil İngilizce
  // olsa bile boşa bir menü isteği açıyordu.
  protected menus$!: Observable<Menu[]>;

  protected uygulamaSistemleri = [
    { label: 'Hacettepe Portal', labelEn: 'Hacettepe Portal', url: 'https://portal.hacettepe.edu.tr/', newTab: true },
    // Bu girdi "Web Servisleri" yazıp /tr/webmail adresine gidiyordu; o sayfanın
    // başlığı "E-posta" ve menüde zaten "E-Posta Giriş" adıyla yer alıyor.
    // Ziyaretçi ada göre WEB Servisleri beklerken e-posta sayfasına düşüyordu.
    // Etiket, adının karşılığı olan sayfaya bağlandı. Kurumda bu ad ayrı bir
    // uygulamaya (dış adres) karşılık geliyorsa buradaki url onunla değiştirilmelidir.
    { label: 'Web Servisleri', labelEn: 'Web Services', url: 'web-services', newTab: false },
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
