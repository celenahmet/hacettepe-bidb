import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Language, Slide } from '../core/models';

/**
 * Ana sayfa açılış alanı.
 *
 * Metin doğrudan tam alan fotoğrafın üzerinde yer alır. Okunurluk, cam veya
 * bulanıklık efekti yerine fotoğrafın tamamına uygulanan tek renkli koyu bir
 * kontrast katmanıyla sağlanır. İçerik sayfa omurgasıyla hizalanır.
 *
 * Teknik sıra sayacı ve ok düğmeleri gösterilmez. Alttaki sade göstergeler,
 * klavye okları ve dokunmatik kaydırma gezinmek için yeterlidir.
 *
 * Erişilebilirlik:
 * - İmleç veya klavye odağı alandayken otomatik dönüş durur.
 * - Sol/sağ ok tuşlarıyla gezinilir, dokunmatikte kaydırılır.
 * - Hareket azaltma tercihinde otomatik dönüş başlamaz.
 * - Etkin slaytın başlığı ekran okuyucuya bildirilir.
 */
@Component({
  selector: 'bidb-hero-slider',
  imports: [RouterLink],
  template: `
    @if (slaytlar.length) {
      <section class="hero"
               [attr.aria-label]="dilDegeri === 'en' ? 'Featured' : 'Öne çıkanlar'"
               (mouseenter)="durdur()" (mouseleave)="basla()"
               (focusin)="durdur()" (focusout)="basla()"
               (keydown.arrowleft)="elleOnceki()" (keydown.arrowright)="elleSonraki()"
               (touchstart)="dokunusBasladi($event)" (touchend)="dokunusBitti($event)"
               tabindex="-1">

        <div class="hero-gorseller">
          @for (s of slaytlar; track s.imageUrl; let i = $index) {
            <img class="hero-gorsel"
                 [class.etkin]="i === etkin()"
                 [src]="s.imageUrl"
                 [srcset]="darSurum(s.imageUrl) + ' 960w, ' + s.imageUrl + ' 1920w'"
                 sizes="100vw"
                 [alt]="i === etkin() ? (s.imageAlt ?? '') : ''"
                 [attr.aria-hidden]="i === etkin() ? null : 'true'"
                 [attr.loading]="i === 0 ? 'eager' : 'lazy'"
                 [attr.fetchpriority]="i === 0 ? 'high' : null"
                 width="1920" height="825">
          }
        </div>

        <div class="hero-kap">
          @for (s of gecerliListe(); track etkin()) {
            <div class="hero-panel">
              <p class="hero-etiket">
                <span class="hero-etiket-cizgi" aria-hidden="true"></span>
                {{ dilDegeri === 'en'
                  ? 'Department of Information Technology'
                  : 'Bilgi İşlem Daire Başkanlığı' }}
              </p>

              <h2 class="hero-baslik"><span>{{ s.title }}</span></h2>

              @if (s.subtitle) {
                <p class="hero-ozet">{{ s.subtitle }}</p>
              }

              @if (s.linkUrl) {
                <div class="hero-alt">
                  <a class="hero-dugme" [routerLink]="s.linkUrl">
                    <span>{{ dilDegeri === 'en' ? 'Read more' : 'Ayrıntılar' }}</span>
                    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"
                         fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M4 12h15M13 6l6 6-6 6"/>
                    </svg>
                  </a>
                </div>
              }
            </div>
          }
        </div>

        <div class="hero-noktalar" role="tablist"
             [attr.aria-label]="dilDegeri === 'en' ? 'Slides' : 'Görseller'">
          @for (s of slaytlar; track s.imageUrl; let i = $index) {
            <button type="button" role="tab"
                    [class.etkin]="i === etkin()"
                    [attr.aria-selected]="i === etkin()"
                    [attr.aria-label]="s.title"
                    (click)="gec(i)">
              <span class="hero-nokta-dolgu" [style.animation-duration.ms]="SURE"></span>
            </button>
          }
        </div>

        <p class="sr-only" aria-live="polite">{{ gecerli()?.title }}</p>
      </section>
    }
  `
})
export class HeroSliderComponent implements OnInit, OnDestroy {
  @Input({ required: true }) dilDegeri!: Language;
  @Input() slaytlar: Slide[] = [];

  protected readonly SURE = 10000;
  protected etkin = signal(0);

  private sayac: ReturnType<typeof setInterval> | null = null;
  private dokunusX = 0;
  private dokunusY = 0;

  ngOnInit(): void {
    this.basla();
  }

  ngOnDestroy(): void {
    this.durdur();
  }

  protected gecerli(): Slide | null {
    return this.slaytlar[this.etkin()] ?? null;
  }

  protected gecerliListe(): Slide[] {
    const slayt = this.gecerli();
    return slayt ? [slayt] : [];
  }

  protected darSurum(adres: string): string {
    return adres.replace('-1920.webp', '-960.webp');
  }

  protected basla(): void {
    this.durdur();
    if (this.slaytlar.length < 2 || typeof window === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    this.sayac = setInterval(() => this.sonrakiSlayt(), this.SURE);
  }

  protected durdur(): void {
    if (this.sayac !== null) {
      clearInterval(this.sayac);
      this.sayac = null;
    }
  }

  protected sonrakiSlayt(): void {
    this.etkin.update((i) => (i + 1) % this.slaytlar.length);
  }

  protected oncekiSlayt(): void {
    this.etkin.update((i) => (i - 1 + this.slaytlar.length) % this.slaytlar.length);
  }

  protected elleOnceki(): void {
    this.oncekiSlayt();
    this.basla();
  }

  protected elleSonraki(): void {
    this.sonrakiSlayt();
    this.basla();
  }

  protected gec(i: number): void {
    this.etkin.set(i);
    this.basla();
  }

  protected dokunusBasladi(olay: TouchEvent): void {
    this.dokunusX = olay.changedTouches[0].clientX;
    this.dokunusY = olay.changedTouches[0].clientY;
    this.durdur();
  }

  protected dokunusBitti(olay: TouchEvent): void {
    const dx = olay.changedTouches[0].clientX - this.dokunusX;
    const dy = olay.changedTouches[0].clientY - this.dokunusY;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? this.sonrakiSlayt() : this.oncekiSlayt();
    }
    this.basla();
  }
}
