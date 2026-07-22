import { Component, Input, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Language, Slide } from '../core/models';

/**
 * Ana sayfa görsel alanı.
 *
 * TASARIM KARARLARI
 *
 * Metnin ardında kutu yok; doğrudan fotoğrafın üstünde duruyor. Okunurluk,
 * metnin altına zemin koyarak değil fotoğrafın tamamı eşit biçimde
 * koyulaştırılarak sağlanıyor — ayrıntısı styles/hero.css içinde.
 *
 * Geçiş yalnızca sönümlemeyle yapılır, kaydırmayla değil. Kayan slaytlar
 * gözü izlemeye zorlar; kurumsal bir sayfada gereksiz bir hareket.
 *
 * Denetim yalnızca göstergelerden ibaret: dolan ince çizgiler hem kaç slayt
 * olduğunu hem sıradakine ne kadar kaldığını gösterir, hem de tıklanabilir.
 * Ayrı ok düğmelerine gerek kalmaz; onlar fotoğrafın üstünde iki kutu
 * olarak durup alanın sadeliğini bozuyordu.
 *
 * Hiçbir öge fotoğrafın dışına taşmaz: metin de denetim de çerçevenin
 * içinde durur.
 *
 * ERİŞİLEBİLİRLİK
 * - İmleç veya klavye odağı alan üzerindeyken dönme durur.
 * - Sol/sağ ok tuşlarıyla gezinilir.
 * - Hareket azaltma tercihi açıksa dönme hiç başlamaz (CSS'te geçiş de
 *   kapanır); ziyaretçi slaytlar arasında kendisi geçer.
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

        <div class="hero-govde">
          <!-- görseller: hepsi basılır, yalnızca etkin olan görünür.
               Böylece geçişte yeniden indirme olmaz. -->
          <div class="hero-gorseller">
            @for (s of slaytlar; track s.imageUrl; let i = $index) {
              <img [class.etkin]="i === etkin()"
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

          <div class="kap hero-kap">
            <!-- Slayt değişince bu blok yeniden kurulur: düğüm yenilenmeden
                 CSS animasyonu baştan çalışmaz, metin sessizce değişir ve
                 geçiş fark edilmezdi. -->
            @for (s of gecerliListe(); track etkin()) {
              <div class="hero-panel">
                <h2 class="hero-baslik"><span>{{ s.title }}</span></h2>
                @if (s.subtitle) { <p class="hero-ozet">{{ s.subtitle }}</p> }
                @if (s.linkUrl) {
                  <a class="hero-baglanti" [routerLink]="s.linkUrl">
                    {{ dilDegeri === 'en' ? 'Read more' : 'Ayrıntılar' }}
                  </a>
                }
              </div>
            }
          </div>
        </div>

        <!-- Denetim yalnızca göstergelerden ibaret: her çizgi tıklanabilir,
             yani ileri-geri gitmek için ayrı ok düğmesine gerek yok. Ok
             düğmeleri fotoğrafın üstünde iki kutu olarak duruyor ve alanın
             sadeliğini bozuyordu. Klavyeyle ok tuşları çalışmayı sürdürüyor. -->
        <div class="kap hero-denetim">
          <ol class="hero-izler">
            @for (s of slaytlar; track s.imageUrl; let i = $index) {
              <li>
                <button type="button"
                        [class.etkin]="i === etkin()"
                        [class.gecmis]="i < etkin()"
                        [attr.aria-current]="i === etkin() ? 'true' : null"
                        (click)="gec(i)">
                  <span class="hero-iz-dolgu" [style.animation-duration.ms]="SURE"></span>
                  <span class="sr-only">{{ s.title }}</span>
                </button>
              </li>
            }
          </ol>
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
      yenilediği için giriş animasyonu her slaytta baştan çalışır. */
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

     Dar ekranda gösterge çizgileri küçük kalıyor; kaydırmak, dokunmatik
     ekranda slayt gezinmenin beklenen yolu. Eşik 45px: bu değerin altındaki
     hareketler kaydırma değil, sayfayı aşağı kaydırırken oluşan yanlışlıkla
     yatay sapmalardır. */
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
