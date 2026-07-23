import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Language, Shortcut, Slide } from '../core/models';

/**
 * Ana sayfanın açılış alanı.
 *
 * İlk görünüm backend tarafından yönetilen hızlı erişim bağlantılarını sunar.
 * Ardından mevcut içerik slaytları kendi sıralarını bozmadan devam eder.
 */
@Component({
  selector: 'bidb-hero-slider',
  imports: [RouterLink],
  template: `
    @if (slaytlar.length) {
      <section class="hero"
               [class.hero--servis]="servisSlaytiEtkin()"
               [attr.aria-label]="dilDegeri === 'en' ? 'Featured' : 'Öne çıkanlar'"
               (mouseenter)="durdur()" (mouseleave)="basla()"
               (focusin)="durdur()" (focusout)="basla()"
               (keydown.arrowleft)="elleOnceki()" (keydown.arrowright)="elleSonraki()"
               (touchstart)="dokunusBasladi($event)" (touchend)="dokunusBitti($event)"
               tabindex="-1">

        <div class="hero-gorseller">
          @if (servisSlaytiEtkin()) {
            <img class="hero-gorsel hero-gorsel--servis etkin"
                 src="/images/slider/slide3-service-1920.webp"
                 srcset="/images/slider/slide3-service-640.webp 640w,
                         /images/slider/slide3-service-800.webp 800w,
                         /images/slider/slide3-service-960.webp 960w,
                         /images/slider/slide3-service-1440.webp 1440w,
                         /images/slider/slide3-service-1920.webp 1920w"
                 sizes="100vw"
                 alt=""
                 aria-hidden="true"
                 loading="eager"
                 decoding="async"
                 fetchpriority="high"
                 width="1920" height="825">
          } @else {
            @for (s of gecerliListe(); track s.imageUrl) {
              <img class="hero-gorsel etkin"
                   [class.hero-gorsel--tabela]="tabelaGorseli(s.imageUrl)"
                   [src]="s.imageUrl"
                   [srcset]="mobilSurum(s.imageUrl) + ' 640w, ' + tabletSurum(s.imageUrl) + ' 800w, ' + darSurum(s.imageUrl) + ' 960w, ' + masaustuSurum(s.imageUrl) + ' 1440w, ' + s.imageUrl + ' 1920w'"
                   sizes="100vw"
                   [alt]="s.imageAlt ?? ''"
                   loading="eager"
                   decoding="async"
                   fetchpriority="auto"
                   width="1920" height="825">
            }
          }
        </div>

        <div class="hero-kap">
          @if (servisSlaytiEtkin()) {
            <div class="hero-servis-panel">
              <div class="hero-servis-ust">
                <div>
                  <p class="hero-etiket hero-servis-etiket">
                    <span class="hero-etiket-cizgi" aria-hidden="true"></span>
                    {{ dilDegeri === 'en' ? 'Quick access' : 'Hızlı erişim' }}
                  </p>
                  <h2 class="hero-servis-baslik">
                    {{ dilDegeri === 'en' ? 'Digital Services' : 'Dijital Servisler' }}
                  </h2>
                </div>
                <p class="hero-servis-aciklama">
                  {{ dilDegeri === 'en'
                    ? 'Access the university’s frequently used digital services from a single secure point.'
                    : 'Üniversitemizin sık kullanılan dijital hizmetlerine tek ve güvenli bir noktadan ulaşın.' }}
                </p>
              </div>

              <nav class="hero-servis-izgara"
                   [attr.aria-label]="dilDegeri === 'en' ? 'Digital services' : 'Dijital servisler'">
                @for (k of gorunenKisayollar(); track k.url) {
                  <a class="hero-servis-karti"
                     [href]="k.url"
                     [attr.target]="k.newTab ? '_blank' : null"
                     [attr.rel]="k.newTab ? 'noopener' : null">
                    <span class="hero-servis-ikon">
                      @if (k.iconUrl) {
                        <img [src]="k.iconUrl" alt="" aria-hidden="true"
                             width="46" height="46" loading="lazy" decoding="async" fetchpriority="low">
                      }
                    </span>
                    <span class="hero-servis-adi">{{ k.name }}</span>
                    <svg class="hero-servis-ok" viewBox="0 0 24 24" width="15" height="15"
                         aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M5 12h14M13 6l6 6-6 6"/>
                    </svg>
                  </a>
                }
              </nav>
            </div>
          } @else {
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
          }
        </div>

        <div class="hero-noktalar" role="tablist"
             [attr.aria-label]="dilDegeri === 'en' ? 'Slides' : 'Görseller'">
          @if (servisSlaytiVar()) {
            <button type="button" role="tab"
                    [class.etkin]="etkin() === 0"
                    [attr.aria-selected]="etkin() === 0"
                    [attr.aria-label]="dilDegeri === 'en' ? 'Digital Services' : 'Dijital Servisler'"
                    (click)="gec(0)">
              <span class="hero-nokta-dolgu" [style.animation-duration.ms]="etkinSure()"></span>
            </button>
          }
          @for (s of slaytlar; track s.imageUrl; let i = $index) {
            <button type="button" role="tab"
                    [class.etkin]="slaytKonumu(i) === etkin()"
                    [attr.aria-selected]="slaytKonumu(i) === etkin()"
                    [attr.aria-label]="s.title"
                    (click)="gec(slaytKonumu(i))">
              <span class="hero-nokta-dolgu" [style.animation-duration.ms]="etkinSure()"></span>
            </button>
          }
        </div>

        <p class="sr-only" aria-live="polite">
          {{ servisSlaytiEtkin()
            ? (dilDegeri === 'en' ? 'Digital Services' : 'Dijital Servisler')
            : gecerli()?.title }}
        </p>
      </section>
    }
  `
})
export class HeroSliderComponent implements OnInit, OnDestroy {
  @Input({ required: true }) dilDegeri!: Language;
  @Input() slaytlar: Slide[] = [];
  @Input() kisayollar: Shortcut[] = [];

  protected readonly NORMAL_SURE = 10000;
  protected readonly SERVIS_SURE = 20000;
  protected etkin = signal(0);

  private sayac: ReturnType<typeof setTimeout> | null = null;
  private dokunusX = 0;
  private dokunusY = 0;

  ngOnInit(): void {
    this.basla();
  }

  ngOnDestroy(): void {
    this.durdur();
  }

  protected servisSlaytiVar(): boolean {
    return this.kisayollar.length > 0;
  }

  protected servisSlaytiEtkin(): boolean {
    return this.servisSlaytiVar() && this.etkin() === 0;
  }

  protected gorunenKisayollar(): Shortcut[] {
    return this.kisayollar.slice(0, 12);
  }

  protected slaytKonumu(slaytIndeksi: number): number {
    return slaytIndeksi + (this.servisSlaytiVar() ? 1 : 0);
  }

  protected etkinSure(): number {
    return this.servisSlaytiEtkin() ? this.SERVIS_SURE : this.NORMAL_SURE;
  }

  protected gecerli(): Slide | null {
    const konum = this.etkin() - (this.servisSlaytiVar() ? 1 : 0);
    return konum >= 0 ? (this.slaytlar[konum] ?? null) : null;
  }

  protected gecerliListe(): Slide[] {
    const slayt = this.gecerli();
    return slayt ? [slayt] : [];
  }

  protected darSurum(adres: string): string {
    return adres.replace('-1920.webp', '-960.webp');
  }

  protected mobilSurum(adres: string): string {
    return adres.replace('-1920.webp', '-640.webp');
  }

  protected tabletSurum(adres: string): string {
    return adres.replace('-1920.webp', '-800.webp');
  }

  protected masaustuSurum(adres: string): string {
    return adres.replace('-1920.webp', '-1440.webp');
  }

  /** Beytepe giriş tabelasının yazısını metin alanından uzaklaştıran özel kadraj. */
  protected tabelaGorseli(adres: string): boolean {
    return /\/slide5-(?:960|1920)\.webp(?:[?#].*)?$/i.test(adres);
  }

  protected basla(): void {
    this.durdur();
    if (this.toplamSlayt() < 2 || typeof window === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    this.sayac = setTimeout(() => {
      this.sonrakiSlayt();
      this.basla();
    }, this.etkinSure());
  }

  protected durdur(): void {
    if (this.sayac !== null) {
      clearTimeout(this.sayac);
      this.sayac = null;
    }
  }

  protected sonrakiSlayt(): void {
    this.etkin.update((i) => (i + 1) % this.toplamSlayt());
  }

  protected oncekiSlayt(): void {
    this.etkin.update((i) => (i - 1 + this.toplamSlayt()) % this.toplamSlayt());
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

  private toplamSlayt(): number {
    return this.slaytlar.length + (this.servisSlaytiVar() ? 1 : 0);
  }
}
