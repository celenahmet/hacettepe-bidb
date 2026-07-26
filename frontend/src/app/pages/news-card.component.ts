import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Language, NewsSummary } from '../core/models';
import { NewsCoverComponent } from './news-cover.component';

/** Ana sayfa ve arşiv görünümünün ortak haber/duyuru kartı. */
@Component({
  selector: 'bidb-news-card',
  imports: [RouterLink, DatePipe, DecimalPipe, NewsCoverComponent],
  host: {
    '[class.one-cikan-kapsayici]': 'oneCikan'
  },
  template: `
    <article class="haber-kart" [class.one-cikan]="oneCikan">
      <bidb-news-cover
        [imageUrl]="haber.imageUrl"
        [imageAlt]="haber.imageAlt"
        [title]="haber.title"
        [category]="haber.category"
        [audience]="haber.audience"
        [template]="haber.coverTemplate"
        [coverText]="haber.coverText"
        [language]="dilDegeri" />

      <div class="haber-govde">
        <div class="haber-meta">
          <time class="haber-tarih" [attr.datetime]="haber.date">
            {{ haber.date | date: 'd MMMM yyyy' : '' : dil }}
          </time>
          <span class="haber-goruntulenme" [attr.aria-label]="goruntulenmeEtiketi()">
            <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"
                 fill="none" stroke="currentColor" stroke-width="1.6">
              <path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6z"/>
              <circle cx="12" cy="12" r="2.6"/>
            </svg>
            <span>{{ haber.viewCount | number: '1.0-0' : dil }}</span>
          </span>
        </div>

        <!-- Başlık seviyesi sayfaya göre değişir: ana sayfada kartlar
             "Haber ve Duyurular" (h2) bölümünün altında olduğu için h3,
             duyuru listesinde ise doğrudan sayfa başlığının (h1) altında
             olduğu için h2 gelmelidir. Sabit h3 kullanıldığında duyuru
             listesinde h1'den h3'e atlanıyor, başlık hiyerarşisi kırılıyordu. -->
        @if (baslikSeviyesi === 2) {
          <h2 class="haber-baslik">
            @if (haber.hasOwnPage) {
              <a [routerLink]="haber.url">{{ haber.title }}</a>
            } @else {
              <a [href]="haber.url" target="_blank" rel="noopener"
                 (click)="disBaglantiGoruntulenmesi()">{{ haber.title }}</a>
            }
          </h2>
        } @else {
          <h3 class="haber-baslik">
            @if (haber.hasOwnPage) {
              <a [routerLink]="haber.url">{{ haber.title }}</a>
            } @else {
              <a [href]="haber.url" target="_blank" rel="noopener"
                 (click)="disBaglantiGoruntulenmesi()">{{ haber.title }}</a>
            }
          </h3>
        }

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
  @Input() oneCikan = false;
  /** Kartın başlık seviyesi; kullanıldığı sayfadaki hiyerarşiye göre verilir. */
  @Input() baslikSeviyesi: 2 | 3 = 3;

  protected get dil(): string {
    return this.dilDegeri === 'en' ? 'en-US' : 'tr-TR';
  }

  protected goruntulenmeEtiketi(): string {
    const sayi = this.haber?.viewCount ?? 0;
    return this.dilDegeri === 'en' ? `${sayi} views` : `${sayi} görüntülenme`;
  }

  protected disBaglantiGoruntulenmesi(): void {
    if (typeof navigator === 'undefined' || this.haber.hasOwnPage || !this.haber.id) return;
    const adres = `/api/${this.dilDegeri}/news/${this.haber.id}/view`;
    const veri = new Blob([], { type: 'text/plain;charset=UTF-8' });
    if (!navigator.sendBeacon(adres, veri)) {
      void fetch(adres, { method: 'POST', keepalive: true });
    }
  }
}
