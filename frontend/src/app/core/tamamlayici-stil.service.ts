import { Injectable, afterNextRender, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

/**
 * Sayfa tipine özgü tamamlayıcı CSS paketleri (bkz. server.ts
 * gerekliStilAnahtarlari) yalnızca SUNUCU TARAFI ilk yanıt sırasında
 * enjekte edilir. Kullanıcı bir bağlantıya TIKLAYARAK (Angular Router'ın
 * kendi istemci tarafı gezinmesiyle) farklı bir sayfa tipine geçtiğinde bu
 * paketi yükleyen bir mekanizma yoktu — sayfa, gerektiği stil hiç
 * gelmediği için "birbirine girmiş" görünüyordu (iletişim formu, haber
 * ızgarası, organizasyon şeması vb.).
 *
 * Bu servis, server.ts'teki eşlemenin aynısını istemci tarafında tutar ve
 * her rota değişiminde eksik paketi <link> olarak ekler. Zaten SSR ile
 * gelen paketler tekrar eklenmez.
 */
const SAYFA_TIPI_STIL: Record<string, string> = {
  faq: 'tamamlayici-sss',
  staff: 'tamamlayici-personel',
  overview: 'tamamlayici-birimler',
  'org-chart': 'tamamlayici-sema',
  committees: 'tamamlayici-kurul',
  cms: 'tamamlayici-cms',
  documents: 'tamamlayici-dokumanlar',
  'web-services': 'tamamlayici-web-servisleri',
  proxy: 'tamamlayici-proxy',
  email: 'tamamlayici-eposta',
  webmail: 'tamamlayici-webmail',
  office365: 'tamamlayici-office365',
  contact: 'tamamlayici-iletisim',
};

/** server.ts'teki gerekliStilAnahtarlari ile birebir aynı kalmalı. */
function gerekliStilAnahtarlari(yol: string): string[] {
  const p = yol.replace(/\/+$/, '') || yol;

  if (p === '/yonetim' || p.startsWith('/yonetim/')) return ['tamamlayici', 'tamamlayici-admin'];
  if (/^\/error\/\d{3}$/.test(p)) return ['tamamlayici', 'tamamlayici-hata'];
  if (/^\/(tr|en)\/(news|newsItem)(\/|$)/.test(p)) return ['tamamlayici', 'tamamlayici-haberler'];
  if (/^\/(tr|en)$/.test(p)) return ['tamamlayici', 'tamamlayici-haberler'];

  const icerik = p.match(/^\/(tr|en)\/([^/]+)$/);
  if (icerik) {
    const ozel = SAYFA_TIPI_STIL[icerik[2]];
    if (ozel) return ['tamamlayici', ozel];
  }
  if (/^\/(tr|en)\//.test(p)) return ['tamamlayici'];
  return [];
}

@Injectable({ providedIn: 'root' })
export class TamamlayiciStilServisi {
  private router = inject(Router);
  private yuklenenler = new Set<string>();

  constructor() {
    afterNextRender(() => {
      // SSR ile zaten gelmiş paketleri kayda al ki tekrar eklenmesin.
      document.querySelectorAll('link[rel="stylesheet"][href^="/tamamlayici"]').forEach((el) => {
        const href = el.getAttribute('href');
        if (href) this.yuklenenler.add(href);
      });

      this.router.events
        .pipe(filter((olay): olay is NavigationEnd => olay instanceof NavigationEnd))
        .subscribe((olay) => this.gerekliStilleriYukle(olay.urlAfterRedirects));
    });
  }

  private gerekliStilleriYukle(yol: string): void {
    const temizYol = yol.split(/[?#]/)[0];
    for (const anahtar of gerekliStilAnahtarlari(temizYol)) {
      const href = `/${anahtar}.css`;
      if (this.yuklenenler.has(href)) continue;
      this.yuklenenler.add(href);
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  }
}
