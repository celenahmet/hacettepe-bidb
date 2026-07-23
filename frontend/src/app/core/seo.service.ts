import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Language, Page } from './models';

const SITE_NAME = {
  tr: 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı',
  en: 'Hacettepe University Department of Information Technology'
};

/** Kaynak sitede her sayfada tekrarlanan, sayfaya özgü olmayan başlıklar.
 *  Bunlar görüldüğünde sayfa adından başlık üretilir; aksi hâlde onlarca
 *  sayfa arama sonuçlarında aynı başlıkla görünür. */
const GENERIC_SOURCE_TITLES = [
  'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı',
  'Hacettepe University Comnputer Center',   // kaynaktaki yazım hatasıyla
  'Hacettepe University Computer Center'
];

/** Sayfa başlığı ve meta etiketleri. Sunucu tarafı render sayesinde
 *  bu değerler ilk yanıtın HTML'inde yer alır. */
@Injectable({ providedIn: 'root' })
export class Seo {
  private title = inject(Title);
  private meta = inject(Meta);
  private belge = inject(DOCUMENT);

  uygula(sayfa: Page | null, language: Language, yol: string): void {
    const siteAdi = SITE_NAME[language];
    // Kaynak sitede tüm sayfalar aynı <title> değerini taşıyor. Sayfaya özgü
    // başlık, arama sonuçlarında ayırt edilebilirlik için tercih edilir.
    //
    // Kaynaktaki genel başlıklar site adıyla birebir aynı değil (İngilizce
    // tarafta yazım hatası da var), bu yüzden ayrıca listelenir.
    const kaynakBaslik = sayfa?.seoTitle?.trim() ?? '';
    const genelMi =
      !kaynakBaslik ||
      kaynakBaslik === siteAdi ||
      GENERIC_SOURCE_TITLES.some((b) => b.toLowerCase() === kaynakBaslik.toLowerCase());
    const title = sayfa
      ? (genelMi ? `${sayfa.title} — ${siteAdi}` : kaynakBaslik)
      : siteAdi;

    this.title.setTitle(title);
    // Bir hata ekranından normal sayfaya istemci tarafında geçildiğinde
    // noindex kararı yeni sayfaya taşınmamalıdır.
    this.meta.removeTag("name='robots'");
    this.ayarla('description', sayfa?.seoDescription || '');
    this.ayarla('keywords', sayfa?.seoKeywords || '');

    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: siteAdi });
    if (sayfa?.seoDescription) {
      this.meta.updateTag({ property: 'og:description', content: sayfa.seoDescription });
    }

    this.belge.documentElement.lang = language;
    this.baglantiAyarla('canonical', yol);
    // hreflang yalnızca karşılığı gerçekten var olan sayfa için verilir.
    // Var olmayan bir çeviriyi bildirmek arama motorlarında hata üretir.
    const digerDil = language === 'en' ? 'tr' : 'en';
    this.baglantiAyarla('alternate', yol, language);
    if (sayfa?.hasTranslation) {
      this.baglantiAyarla('alternate', yol.replace(/^\/(tr|en)/, '/' + digerDil), digerDil);
    } else {
      this.baglantiKaldir('alternate', digerDil);
    }
  }

  /** Hata sayfaları arama sonuçlarına alınmaz; başlık ve açıklama yine de
   *  tarayıcı geçmişi ve erişilebilirlik araçları için anlamlı tutulur. */
  hata(code: number, baslik: string, aciklama: string, yol: string): void {
    const siteAdi = SITE_NAME.tr;
    const title = `${code} · ${baslik} — ${siteAdi}`;
    this.title.setTitle(title);
    this.ayarla('description', aciklama);
    this.ayarla('keywords', '');
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: aciklama });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: siteAdi });
    this.belge.documentElement.lang = 'tr';
    this.baglantiAyarla('canonical', yol);
    this.baglantiKaldir('alternate', 'tr');
    this.baglantiKaldir('alternate', 'en');
  }

  private ayarla(name: string, icerik: string): void {
    if (icerik) this.meta.updateTag({ name: name, content: icerik });
    else this.meta.removeTag(`name='${name}'`);
  }

  private baglantiKaldir(iliski: string, language: string): void {
    this.belge.head.querySelector(`link[rel="${iliski}"][hreflang="${language}"]`)?.remove();
  }

  private baglantiAyarla(iliski: string, yol: string, language?: string): void {
    const secici = language ? `link[rel="${iliski}"][hreflang="${language}"]` : `link[rel="${iliski}"]`;
    let el = this.belge.head.querySelector(secici) as HTMLLinkElement | null;
    if (!el) {
      el = this.belge.createElement('link') as HTMLLinkElement;
      el.setAttribute('rel', iliski);
      if (language) el.setAttribute('hreflang', language);
      this.belge.head.appendChild(el);
    }
    el.setAttribute('href', yol);
  }
}
