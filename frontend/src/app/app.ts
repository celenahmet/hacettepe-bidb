import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './layout/header.component';
import { FooterComponent } from './layout/footer.component';
import { CookieConsentComponent } from './layout/cookie-consent.component';
import { Language } from './core/models';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CookieConsentComponent],
  template: `
    @if (siteKabugu()) { <bidb-header [language]="language()"></bidb-header> }

    <router-outlet></router-outlet>

    @if (siteKabugu()) {
      <bidb-footer [language]="language()"></bidb-footer>
      <bidb-cookie-consent [language]="language()"></bidb-cookie-consent>
    }
  `
})
export class App {
  private router = inject(Router);

  protected language = signal<Language>('tr');

  /**
   * Yönetim paneli, ziyaretçi sitesinin üst şeridi ve alt bilgisi olmadan
   * tam ekran çalışır: kendi gezinme yapısı vardır ve çalışma yüzeyinin
   * bölünmemesi gerekir.
   */
  protected siteKabugu = signal(true);

  constructor() {
    this.rotayaGore(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.rotayaGore(e.urlAfterRedirects));
  }

  private rotayaGore(url: string): void {
    this.language.set(url.startsWith('/en') ? 'en' : 'tr');
    this.siteKabugu.set(!url.startsWith('/yonetim'));
  }
}
