import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Dil, Sayfa } from './modeller';

const SITE_ADI = {
  tr: 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı',
  en: 'Hacettepe University Department of Information Technology'
};

/** Sayfa başlığı ve meta etiketleri. Sunucu tarafı render sayesinde
 *  bu değerler ilk yanıtın HTML'inde yer alır. */
@Injectable({ providedIn: 'root' })
export class Seo {
  private title = inject(Title);
  private meta = inject(Meta);
  private belge = inject(DOCUMENT);

  uygula(sayfa: Sayfa | null, dil: Dil, yol: string): void {
    const siteAdi = SITE_ADI[dil];
    // Kaynak sitede tüm sayfalar aynı <title> değerini taşıyor. Sayfaya özgü
    // başlık, arama sonuçlarında ayırt edilebilirlik için tercih edilir.
    const kaynakBaslik = sayfa?.seoTitle?.trim() ?? '';
    const genelMi = !kaynakBaslik || kaynakBaslik === siteAdi;
    const baslik = sayfa
      ? (genelMi ? `${sayfa.baslik} — ${siteAdi}` : kaynakBaslik)
      : siteAdi;

    this.title.setTitle(baslik);
    this.ayarla('description', sayfa?.seoDescription || '');
    this.ayarla('keywords', sayfa?.seoKeywords || '');

    this.meta.updateTag({ property: 'og:title', content: baslik });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: siteAdi });
    if (sayfa?.seoDescription) {
      this.meta.updateTag({ property: 'og:description', content: sayfa.seoDescription });
    }

    this.belge.documentElement.lang = dil;
    this.baglantiAyarla('canonical', yol);
    this.baglantiAyarla('alternate', yol.replace(/^\/(tr|en)/, '/tr'), 'tr');
    this.baglantiAyarla('alternate', yol.replace(/^\/(tr|en)/, '/en'), 'en');
  }

  private ayarla(ad: string, icerik: string): void {
    if (icerik) this.meta.updateTag({ name: ad, content: icerik });
    else this.meta.removeTag(`name='${ad}'`);
  }

  private baglantiAyarla(iliski: string, yol: string, dil?: string): void {
    const secici = dil ? `link[rel="${iliski}"][hreflang="${dil}"]` : `link[rel="${iliski}"]`;
    let el = this.belge.head.querySelector(secici) as HTMLLinkElement | null;
    if (!el) {
      el = this.belge.createElement('link') as HTMLLinkElement;
      el.setAttribute('rel', iliski);
      if (dil) el.setAttribute('hreflang', dil);
      this.belge.head.appendChild(el);
    }
    el.setAttribute('href', yol);
  }
}
