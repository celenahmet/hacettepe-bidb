import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Language, Page } from './models';

const SITE_ORIGIN = 'https://bidb.hacettepe.edu.tr';
const DEFAULT_IMAGE = '/images/slider/slide1-1920.webp';
const SITE_NAME = {
  tr: 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı',
  en: 'Hacettepe University Department of Information Technology'
};

const GENERIC_SOURCE_TITLES = [
  'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı',
  'Hacettepe University Comnputer Center',
  'Hacettepe University Computer Center'
];

export interface SeoExtras {
  type?: 'website' | 'article';
  image?: string | null;
  imageAlt?: string | null;
  publishedAt?: string | null;
  modifiedAt?: string | null;
}

/**
 * Bütün sayfalarda tek SEO çıkışı üretir.
 *
 * Değerler Page/Home/News API yanıtlarından geldiği için SSR ilk HTML yanıtına
 * title, canonical, sosyal kartlar ve JSON-LD birlikte yazılır. İstemci içi
 * gezinmede önceki sayfanın etiketi kalmasın diye isteğe bağlı alanlar da
 * açıkça temizlenir.
 */
@Injectable({ providedIn: 'root' })
export class Seo {
  private title = inject(Title);
  private meta = inject(Meta);
  private belge = inject(DOCUMENT);

  uygula(sayfa: Page | null, language: Language, yol: string, extras: SeoExtras = {}): void {
    const siteAdi = SITE_NAME[language];
    const kaynakBaslik = sayfa?.seoTitle?.trim() ?? '';
    const genelMi =
      !kaynakBaslik ||
      kaynakBaslik === siteAdi ||
      GENERIC_SOURCE_TITLES.some((b) => b.toLowerCase() === kaynakBaslik.toLowerCase());
    const title = sayfa
      ? (genelMi ? `${sayfa.title} — ${siteAdi}` : kaynakBaslik)
      : siteAdi;
    const description = sayfa?.seoDescription?.trim() ||
      (sayfa
        ? (language === 'tr'
          ? `${sayfa.title} hakkında Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı tarafından sunulan güncel bilgiler.`
          : `Current information about ${sayfa.title} from Hacettepe University Department of Information Technology.`)
        : (language === 'tr'
          ? 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı hizmetleri ve güncel duyuruları.'
          : 'Services and current announcements from Hacettepe University Department of Information Technology.'));
    const canonical = this.tamUrl(yol);
    const image = this.tamUrl(extras.image || sayfa?.seoImage || DEFAULT_IMAGE);
    const type = extras.type ?? (sayfa?.seoSchemaType === 'NewsArticle' ? 'article' : 'website');
    const robots = sayfa?.seoRobots?.trim() || 'index, follow, max-image-preview:large';

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'robots', content: robots });
    this.ayarla('description', description);
    this.ayarla('keywords', sayfa?.seoKeywords?.trim() ?? '');
    this.meta.updateTag({ name: 'author', content: siteAdi });
    this.meta.updateTag({ name: 'theme-color', content: '#b31821' });

    this.ozellik('og:title', title);
    this.ozellik('og:description', description);
    this.ozellik('og:type', type);
    this.ozellik('og:site_name', siteAdi);
    this.ozellik('og:url', canonical);
    this.ozellik('og:locale', language === 'tr' ? 'tr_TR' : 'en_GB');
    this.ozellik('og:locale:alternate', language === 'tr' ? 'en_GB' : 'tr_TR');
    this.ozellik('og:image', image);
    this.ozellik('og:image:alt', extras.imageAlt || sayfa?.title || siteAdi);

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.ayarla('twitter:description', description);
    this.meta.updateTag({ name: 'twitter:image', content: image });

    if (type === 'article') {
      this.ozellik('article:published_time', extras.publishedAt ?? '');
      this.ozellik('article:modified_time', extras.modifiedAt ?? extras.publishedAt ?? '');
    } else {
      this.meta.removeTag("property='article:published_time'");
      this.meta.removeTag("property='article:modified_time'");
    }

    this.belge.documentElement.lang = language;
    this.baglantiAyarla('canonical', canonical);
    const digerDil = language === 'en' ? 'tr' : 'en';
    this.baglantiAyarla('alternate', canonical, language);
    if (sayfa?.hasTranslation) {
      const alternatif = this.tamUrl(yol.replace(/^\/(tr|en)/, '/' + digerDil));
      this.baglantiAyarla('alternate', alternatif, digerDil);
      this.baglantiAyarla('alternate', language === 'tr' ? canonical : alternatif, 'x-default');
    } else {
      this.baglantiKaldir('alternate', digerDil);
      this.baglantiKaldir('alternate', 'x-default');
    }

    this.yapisalVeri({
      '@context': 'https://schema.org',
      '@type': type === 'article' ? 'NewsArticle' : (sayfa?.seoSchemaType || 'WebPage'),
      headline: type === 'article' ? sayfa?.title : undefined,
      name: type !== 'article'
        ? (sayfa?.seoSchemaType === 'WebSite' ? siteAdi : (sayfa?.title || siteAdi))
        : undefined,
      description: description || undefined,
      url: canonical,
      image,
      datePublished: extras.publishedAt || undefined,
      dateModified: extras.modifiedAt || sayfa?.updatedAt || extras.publishedAt || undefined,
      inLanguage: language === 'tr' ? 'tr-TR' : 'en-GB',
      isPartOf: {
        '@type': 'WebSite',
        name: siteAdi,
        url: `${SITE_ORIGIN}/${language}`
      },
      publisher: {
        '@type': 'Organization',
        name: siteAdi,
        url: `${SITE_ORIGIN}/${language}`,
        logo: { '@type': 'ImageObject', url: `${SITE_ORIGIN}/hu-logo.svg` }
      }
    });
  }

  hata(code: number, baslik: string, aciklama: string, yol: string): void {
    const siteAdi = SITE_NAME.tr;
    const title = `${code} · ${baslik} — ${siteAdi}`;
    this.title.setTitle(title);
    this.ayarla('description', aciklama);
    this.ayarla('keywords', '');
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow, noarchive' });
    this.ozellik('og:title', title);
    this.ozellik('og:description', aciklama);
    this.ozellik('og:type', 'website');
    this.ozellik('og:site_name', siteAdi);
    this.ozellik('og:url', this.tamUrl(yol));
    this.ozellik('og:image', this.tamUrl(DEFAULT_IMAGE));
    this.ozellik('og:image:alt', siteAdi);
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: aciklama });
    this.meta.updateTag({ name: 'twitter:image', content: this.tamUrl(DEFAULT_IMAGE) });
    this.meta.removeTag("property='article:published_time'");
    this.meta.removeTag("property='article:modified_time'");
    this.belge.documentElement.lang = 'tr';
    this.baglantiAyarla('canonical', this.tamUrl(yol));
    this.baglantiKaldir('alternate', 'tr');
    this.baglantiKaldir('alternate', 'en');
    this.baglantiKaldir('alternate', 'x-default');
    this.yapisalVeri(null);
  }

  private tamUrl(value: string): string {
    if (/^https?:\/\//i.test(value)) return value;
    return SITE_ORIGIN + (value.startsWith('/') ? value : '/' + value);
  }

  private ayarla(name: string, icerik: string): void {
    if (icerik) this.meta.updateTag({ name, content: icerik });
    else this.meta.removeTag(`name='${name}'`);
  }

  private ozellik(property: string, icerik: string): void {
    if (icerik) this.meta.updateTag({ property, content: icerik });
    else this.meta.removeTag(`property='${property}'`);
  }

  private yapisalVeri(veri: Record<string, unknown> | null): void {
    this.belge.getElementById('bidb-yapisal-veri')?.remove();
    if (!veri) return;
    const script = this.belge.createElement('script');
    script.id = 'bidb-yapisal-veri';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(
      veri,
      (_key, value) => value === undefined ? undefined : value
    ).replace(/</g, '\\u003c');
    this.belge.head.appendChild(script);
  }

  private baglantiKaldir(iliski: string, language: string): void {
    this.belge.head.querySelector(`link[rel="${iliski}"][hreflang="${language}"]`)?.remove();
  }

  private baglantiAyarla(iliski: string, yol: string, language?: string): void {
    const secici = language
      ? `link[rel="${iliski}"][hreflang="${language}"]`
      : `link[rel="${iliski}"]:not([hreflang])`;
    let el = this.belge.head.querySelector(secici) as HTMLLinkElement | null;
    if (!el) {
      el = this.belge.createElement('link');
      el.rel = iliski;
      if (language) el.hreflang = language;
      this.belge.head.appendChild(el);
    }
    el.href = yol;
  }
}
