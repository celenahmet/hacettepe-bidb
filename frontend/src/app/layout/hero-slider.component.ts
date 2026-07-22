import { Component, Input, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Language, Slide } from '../core/models';

/**
 * Ana sayfa açılış alanı.
 *
 * KOMPOZİSYON
 *
 * Klasik "fotoğrafın üstüne ortalanmış yazı" düzeninden çıkıldı. Alan iki
 * yüzeye bölündü: solda kurumsal lacivert bir panel, sağda tam kanama
 * fotoğraf. Panelin metni sayfa kabıyla aynı hizadan başlar; yani üstteki
 * logoyla aynı dikey çizgiye oturur. Bu, alanı sayfanın geri kalanına
 * bağlar — hazır bir slider bileşeni gibi durmasını engelleyen şey de
 * budur.
 *
 * Bölünmüş yapının üç kazancı var: fotoğraf hiç karartılmadığı için
 * olduğu gibi görünür; metin her zaman aynı kontrastta okunur, fotoğrafın
 * o bölgesinin açık ya da koyu olması fark etmez; ve geniş ekranda ortaya
 * çıkan boş koyu alan ortadan kalkar, çünkü o alan artık panelin kendisi.
 *
 * DENETİM
 *
 * İleri-geri düğmeleri ve ilerleme çizgisi panelin içinde, metinle aynı
 * hizada durur. Fotoğrafın üstünde yüzen denetimler tasarımdan kopuk
 * görünüyordu; panele alındıklarında yüzeyin parçası oluyorlar.
 *
 * ERİŞİLEBİLİRLİK
 * - İmleç veya klavye odağı alandayken dönme durur.
 * - Sol/sağ ok tuşlarıyla gezinilir, dokunmatikte kaydırılır.
 * - Hareket azaltma tercihinde dönme hiç başlamaz.
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
               (keydown.arrowleft)="oncekiSlayt()" (keydown.arrowright)="sonrakiSlayt()"
               (touchstart)="dokunusBasladi($event)" (touchend)="dokunusBitti($event)"
               tabindex="-1">

        <div class="hero-duzen">

          <!-- Kurumsal panel: metin ve denetim aynı yüzeyde -->
          <div class="hero-panel">
            <div class="hero-panel-ic">
              <!-- Slayt değişince bu blok yeniden kurulur: düğüm
                   yenilenmeden giriş hareketi baştan çalışmaz. -->
              @for (s of gecerliListe(); track etkin()) {
                <div class="hero-metin">
                  <span class="hero-isaret" aria-hidden="true"></span>
                  <h2 class="hero-baslik"><span>{{ s.title }}</span></h2>
                  @if (s.subtitle) { <p class="hero-ozet">{{ s.subtitle }}</p> }
                  @if (s.linkUrl) {
                    <a class="hero-dugme" [routerLink]="s.linkUrl">
                      <span>{{ dilDegeri === 'en' ? 'Read more' : 'Ayrıntılar' }}</span>
                      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"
                           fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M4 12h15M13 6l6 6-6 6"/>
                      </svg>
                    </a>
                  }
                </div>
              }

              <div class="hero-denetim">
                <button type="button" class="hero-ok" (click)="oncekiSlayt()"
                        [attr.aria-label]="dilDegeri === 'en' ? 'Previous slide' : 'Önceki görsel'">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"
                       fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M15 5l-7 7 7 7"/>
                  </svg>
                </button>
                <button type="button" class="hero-ok" (click)="sonrakiSlayt()"
                        [attr.aria-label]="dilDegeri === 'en' ? 'Next slide' : 'Sonraki görsel'">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"
                       fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M9 5l7 7-7 7"/>
                  </svg>
                </button>

                <!-- İlerleme çizgisi: kaç slayt olduğunu değil, sıradakine
                     ne kadar kaldığını gösterir. Panelin genişliğince
                     uzandığı için yüzeyin parçası olarak okunur. -->
                <span class="hero-ilerleme">
                  @for (x of gecerliListe(); track etkin()) {
                    <i [style.animation-duration.ms]="SURE"></i>
                  }
                </span>
              </div>
            </div>
          </div>

          <!-- Fotoğraf: hiç karartılmıyor, tam kanama sağ kenara kadar -->
          <div class="hero-gorseller">
            @for (s of slaytlar; track s.imageUrl; let i = $index) {
              <img class="hero-gorsel"
                   [class.etkin]="i === etkin()"
                   [src]="s.imageUrl"
                   [srcset]="darSurum(s.imageUrl) + ' 960w, ' + s.imageUrl + ' 1920w'"
                   sizes="(max-width: 64rem) 100vw, 60vw"
                   [alt]="i === etkin() ? (s.imageAlt ?? '') : ''"
                   [attr.aria-hidden]="i === etkin() ? null : 'true'"
                   [attr.loading]="i === 0 ? 'eager' : 'lazy'"
                   [attr.fetchpriority]="i === 0 ? 'high' : null"
                   width="1920" height="825">
            }
          </div>
        </div>

        <p class="sr-only" aria-live="polite">{{ gecerli()?.title }}</p>
      </section>
    }
  `
})
export class HeroSliderComponent implements OnDestroy {
  @Input({ required: true }) dilDegeri!: Language;
  @Input() slaytlar: Slide[] = [];

  /** Slayt başına bekleme süresi. */
  protected readonly SURE = 10000;

  protected etkin = signal(0);
  private sayac: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.basla();
  }

  ngOnDestroy(): void {
    this.durdur();
  }

  protected gecerli(): Slide | null {
    return this.slaytlar[this.etkin()] ?? null;
  }

  /** Şablonun tek elemanlı döngüyle çizebilmesi için; @for düğümü
      yenilediği için giriş hareketi her slaytta baştan çalışır. */
  protected gecerliListe(): Slide[] {
    const s = this.gecerli();
    return s ? [s] : [];
  }

  /** 1920'lik adresten 960'lık sürümü türetir; ayrı bir alan tutmaya gerek yok. */
  protected darSurum(adres: string): string {
    return adres.replace('-1920.webp', '-960.webp');
  }

  protected basla(): void {
    this.durdur();
    if (this.slaytlar.length < 2) return;
    // Sunucuda çalışırken zamanlayıcı kurulmaz; sunucu tarafı işleme
    // zamanlayıcıyı bekleyip yanıtı geciktirir.
    if (typeof window === 'undefined') return;
    // Hareket azaltma tercihinde kendiliğinden dönmez.
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

  /** Elle geçildiğinde sayaç sıfırlanır: yeni slayt hemen kaçmasın. */
  protected gec(i: number): void {
    this.etkin.set(i);
    this.basla();
  }

  /* ---- parmakla kaydırma ----

     Eşik 45px: bu değerin altındaki hareketler kaydırma değil, sayfayı
     aşağı kaydırırken oluşan yanlışlıkla yatay sapmalardır. */
  private dokunusX = 0;
  private dokunusY = 0;

  protected dokunusBasladi(olay: TouchEvent): void {
    this.dokunusX = olay.changedTouches[0].clientX;
    this.dokunusY = olay.changedTouches[0].clientY;
    this.durdur();
  }

  protected dokunusBitti(olay: TouchEvent): void {
    const dx = olay.changedTouches[0].clientX - this.dokunusX;
    const dy = olay.changedTouches[0].clientY - this.dokunusY;
    // Dikey hareket baskınsa sayfa kaydırılıyordur, slayt değişmemeli.
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? this.sonrakiSlayt() : this.oncekiSlayt();
    }
    this.basla();
  }
}
