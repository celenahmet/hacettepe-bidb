import { Component, Input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Language, NewsSummary } from '../core/models';

/** Bir haberin konusu — başlıktan çıkarılır, görsel dili buna göre değişir. */
type Konu = 'personel' | 'yazilim' | 'eposta' | 'duyuru';

/**
 * Tek bir haber/duyuru kartı.
 *
 * Hem ana sayfada hem duyuru listesinde kullanılır; kart tasarımı tek
 * yerde durur, iki sayfada ayrı kod tekrarlanmaz.
 *
 * ── GÖRSEL KARARI ─────────────────────────────────────────────────────
 *
 * Duyuruların çoğunda fotoğraf yok. Fotoğraf varsa kullanılır. Yoksa
 * "boş kart" ya da alakasız bir stok görsel yerine, KONUYA göre üretilen
 * bir kapak çiziliyor: kurumsal renklerde bir zemin ve o konuyu anlatan
 * ince bir çizgi-ikon. Kapak tamamen CSS + inline SVG ile üretiliyor,
 * dış görsele bağlı değil — bu yüzden hiç kırılmıyor ve yıllar içinde
 * eskimiyor.
 *
 * Konu başlıktan çıkarılıyor: bir personel alımı duyurusuyla bir yazılım
 * lisansı duyurusu farklı kapak alıyor, böylece liste tek renk bir yığın
 * gibi durmuyor. Uydurma bir sınıflandırma değil; yalnızca zaten başlıkta
 * yazan konuyu görünür kılıyor.
 */
@Component({
  selector: 'bidb-news-card',
  imports: [RouterLink, DatePipe, DecimalPipe],
  host: {
    '[class.one-cikan-kapsayici]': 'oneCikan'
  },
  template: `
    <article class="haber-kart" [class.one-cikan]="oneCikan">
      <div class="haber-kapak" [attr.data-konu]="konu()">
        @if (haber.imageUrl) {
          <img [src]="haber.imageUrl" [alt]="haber.imageAlt || haber.title"
               loading="lazy" decoding="async">
        } @else {
          <svg class="haber-kapak-ikon" viewBox="0 0 24 24" width="46" height="46"
               aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4"
               stroke-linecap="round" stroke-linejoin="round">
            @switch (konu()) {
              @case ('personel') {
                <circle cx="9" cy="8" r="3.2"/>
                <path d="M3.5 20c0-3.6 2.5-6 5.5-6s5.5 2.4 5.5 6"/>
                <path d="M16 9h5M16 13h5M16 17h3"/>
              }
              @case ('yazilim') {
                <rect x="3" y="4.5" width="18" height="15" rx="1.5"/>
                <path d="M3 8.5h18"/>
                <path d="M8.5 12.5l-2 2 2 2M14.5 12.5l2 2-2 2"/>
              }
              @case ('eposta') {
                <rect x="3" y="5.5" width="18" height="13" rx="1.5"/>
                <path d="M3.5 6.5l8.5 6 8.5-6"/>
              }
              @default {
                <path d="M4 10v4a1 1 0 001 1h2l6 4V5L7 9H5a1 1 0 00-1 1z"/>
                <path d="M17 8.5a5 5 0 010 7"/>
              }
            }
          </svg>
        }
        <span class="haber-etiket">{{ etiket() }}</span>
      </div>

      <div class="haber-govde">
        <div class="haber-meta">
          <time class="haber-tarih" [attr.datetime]="haber.date">
            {{ haber.date | date: 'd MMMM yyyy' : '' : dil }}
          </time>
          <span class="haber-goruntulenme"
                [attr.aria-label]="goruntulenmeEtiketi()">
            <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"
                 fill="none" stroke="currentColor" stroke-width="1.6">
              <path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6z"/>
              <circle cx="12" cy="12" r="2.6"/>
            </svg>
            <span>{{ haber.viewCount | number: '1.0-0' : dil }}</span>
          </span>
        </div>

        <h3 class="haber-baslik">
          @if (haber.hasOwnPage) {
            <a [routerLink]="haber.url">{{ haber.title }}</a>
          } @else {
            <a [href]="haber.url" target="_blank" rel="noopener"
               (click)="disBaglantiGoruntulenmesi()">{{ haber.title }}</a>
          }
        </h3>

        @if (haber.summary) {
          <p class="haber-ozet">{{ haber.summary }}</p>
        }
      </div>
    </article>
  `
})
export class NewsCardComponent {
  @Input({ required: true }) haber!: NewsSummary;
  @Input() dilDegeri: Language = 'tr';
  /** Öne çıkan kart, listenin ilk (en yeni) duyurusu için daha büyük durur. */
  @Input() oneCikan = false;

  protected get dil(): string {
    return this.dilDegeri === 'en' ? 'en-US' : 'tr-TR';
  }

  protected goruntulenmeEtiketi(): string {
    const sayi = this.haber?.viewCount ?? 0;
    return this.dilDegeri === 'en' ? `${sayi} views` : `${sayi} görüntülenme`;
  }

  /**
   * Dış bağlantılı duyuruların kendi detay sayfası olmadığı için tıklamayı
   * sayaca tarayıcı kapanmadan güvenilir biçimde iletir.
   */
  protected disBaglantiGoruntulenmesi(): void {
    if (typeof navigator === 'undefined' || this.haber.hasOwnPage || !this.haber.id) return;
    const adres = `/api/${this.dilDegeri}/news/${this.haber.id}/view`;
    const veri = new Blob([], { type: 'text/plain;charset=UTF-8' });
    if (!navigator.sendBeacon(adres, veri)) {
      void fetch(adres, { method: 'POST', keepalive: true });
    }
  }

  /** Başlıktan konu çıkarımı; en dar eşleşmeden genele doğru sıralı. */
  protected konu = computed<Konu>(() => {
    const b = (this.haber?.title ?? '').toLocaleLowerCase('tr');
    if (/(personel|bili[şs]im personeli|s[ıi]nav|i[şs]kur|s[öo]zle[şs]meli|al[ıi]m|kadro)/.test(b)) return 'personel';
    if (/(office|microsoft|lisans|yaz[ıi]l[ıi]m|onedrive|365|exchange|teams|matlab|spss|ansys|sas)/.test(b)) return 'yazilim';
    if (/(e-?posta|mail|g[üu]venli)/.test(b)) return 'eposta';
    return 'duyuru';
  });

  protected etiket = computed(() => {
    const en = this.dilDegeri === 'en';
    switch (this.konu()) {
      case 'personel': return en ? 'Recruitment' : 'Personel Alımı';
      case 'yazilim':  return en ? 'Software & Licensing' : 'Yazılım ve Lisans';
      case 'eposta':   return en ? 'E-mail' : 'E-Posta';
      default:         return en ? 'Announcement' : 'Duyuru';
    }
  });

  /** Konuya göre ince çizgi-ikon (inline SVG). currentColor ile boyanır. */
  protected ikon = computed(() => {
    const yollar: Record<Konu, string> = {
      // kişi + kadro
      personel: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 20c0-3.6 2.5-6 5.5-6s5.5 2.4 5.5 6"/><path d="M16 9h5M16 13h5M16 17h3"/>',
      // pencere + kod
      yazilim: '<rect x="3" y="4.5" width="18" height="15" rx="1.5"/><path d="M3 8.5h18"/><path d="M8.5 12.5l-2 2 2 2M14.5 12.5l2 2-2 2"/>',
      // zarf
      eposta: '<rect x="3" y="5.5" width="18" height="13" rx="1.5"/><path d="M3.5 6.5l8.5 6 8.5-6"/>',
      // megafon / duyuru
      duyuru: '<path d="M4 10v4a1 1 0 001 1h2l6 4V5L7 9H5a1 1 0 00-1 1z"/><path d="M17 8.5a5 5 0 010 7"/>'
    };
    const ic = yollar[this.konu()];
    return `<svg viewBox="0 0 24 24" width="46" height="46" fill="none" stroke="currentColor"
      stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${ic}</svg>`;
  });
}
