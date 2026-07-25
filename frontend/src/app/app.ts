import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './layout/header.component';
import { RouteProgressComponent } from './layout/route-progress.component';
import { FooterComponent } from './layout/footer.component';
import { CookieConsentComponent } from './layout/cookie-consent.component';
import { AccessibilityMenuComponent } from './layout/accessibility-menu.component';
import { Language } from './core/models';
import { QualityMetricsService } from './core/quality-metrics.service';
import { TamamlayiciStilServisi } from './core/tamamlayici-stil.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    CookieConsentComponent,
    AccessibilityMenuComponent,
    RouteProgressComponent
  ],
  template: `
    <bidb-route-progress></bidb-route-progress>

    @if (siteKabugu()) { <bidb-header [language]="language()"></bidb-header> }

    <router-outlet></router-outlet>

    @if (siteKabugu()) {
      <bidb-accessibility-menu [language]="language()"></bidb-accessibility-menu>
      @defer (hydrate on viewport; hydrate on timer(100ms)) {
        <bidb-footer [language]="language()"></bidb-footer>
      } @placeholder {
        <div class="alt-tetikleyici" aria-hidden="true"></div>
      }
      <bidb-cookie-consent [language]="language()"></bidb-cookie-consent>
    }
  `
})
export class App {
  private router = inject(Router);
  // Servisin oluşturulması, tarayıcı hydration sonrasında anonim Web Vitals
  // gözlemcilerini başlatır; SSR sırasında hiçbir ölçüm yapılmaz.
  private qualityMetrics = inject(QualityMetricsService);
  // Rota değişiminde sayfa tipine özgü tamamlayıcı CSS paketini eksikse ekler
  // (bkz. TamamlayiciStilServisi) — tıklayarak gezinmede sayfaların stilsiz
  // kalmasının (iletişim formu, haber ızgarası, şemalar vb.) düzeltmesi.
  private tamamlayiciStil = inject(TamamlayiciStilServisi);

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
