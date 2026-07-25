import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, DatePipe } from '@angular/common';
import { switchMap, tap } from 'rxjs/operators';
import { Api } from '../core/api.service';
import { Seo } from '../core/seo.service';
import { Language, NewsSummary } from '../core/models';
import { RouterLink } from '@angular/router';
import { SideMenuComponent } from '../layout/side-menu.component';
import { HeroSliderComponent } from '../layout/hero-slider.component';
import { NewsCardComponent } from './news-card.component';

/** Ana sayfa: slider, kısayollar, news ve services. */
@Component({
  selector: 'bidb-home-page',
  imports: [SideMenuComponent, HeroSliderComponent, NewsCardComponent, AsyncPipe, RouterLink],
  template: `
    @if (veri$ | async; as v) {
      @defer (hydrate on idle) {
        <bidb-hero-slider
          [dilDegeri]="language()"
          [slaytlar]="v.slider"
          [kisayollar]="v.shortcuts">
        </bidb-hero-slider>
      }

      @defer (hydrate on viewport; hydrate on timer(100ms)) {
      <div class="kap sayfa-duzen">
        <aside class="yan">
          <bidb-side-menu [dilDegeri]="language()"></bidb-side-menu>
        </aside>

        <main id="ana-icerik" class="icerik-alani">
          <h1 class="sr-only">
            {{ metin('Bilgi İşlem Daire Başkanlığı', 'Department of Information Technology') }}
          </h1>

          @if (v.news.length) {
              <section class="duyurular">
                <div class="bolum-baslik">
                  <h2>{{ metin('Haber ve Duyurular', 'News and Announcements') }}</h2>
                  <a class="bolum-tumu" [routerLink]="['/', language(), 'news']">
                    {{ metin('Tümü', 'All') }}
                    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"
                         fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                  </a>
                </div>

                <div class="haber-izgara">
                  @for (d of v.news.slice(0, 7); track d.title; let i = $index) {
                    <bidb-news-card [haber]="d" [dilDegeri]="language()" [oneCikan]="i === 0"></bidb-news-card>
                  }
                </div>
              </section>
          }

          @if (v.services.length) {
              <section class="servisler">
                <h2>{{ metin('Servisler ve Uygulamalar', 'Services and Applications') }}</h2>
                <div class="servis-listesi">
                  @for (s of v.services; track s.url) {
                    <a class="servis" [href]="s.url"
                       [attr.target]="s.newTab ? '_blank' : null"
                       [attr.rel]="s.newTab ? 'noopener' : null">
                      @if (s.iconUrl) {
                        <img [src]="s.iconUrl" alt="" aria-hidden="true" loading="lazy">
                      } @else if (s.url === '/tr/email' || s.url === '/en/email') {
                        <!-- E-Posta hizmeti Exchange üzerinden yürütülür; kaynak logo
                             64x64 olduğu için kartın tamamına gerilip bulanıklaşmasın
                             diye kurumsal zemin üstünde doğal boyutunda gösterilir. -->
                        <span class="servis-simge" aria-hidden="true">
                          <img src="/images/icon_exchange2.jpg" alt="" width="56" height="56" loading="lazy">
                        </span>
                      } @else {
                        <span class="servis-simge" aria-hidden="true">
                          <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="2"/>
                            <path d="m2 7 10 7 10-7"/>
                          </svg>
                        </span>
                      }
                      <span>{{ s.name }}</span>
                    </a>
                  }
                </div>
              </section>
          }
        </main>
      </div>
      } @placeholder {
        <main id="ana-icerik" class="ana-devam-tetikleyici" tabindex="-1">
          <span class="sr-only">
            {{ metin('Ana içerik kaydırıldığında yüklenir.', 'Main content loads on scroll.') }}
          </span>
        </main>
      }
    }
  `,
  styles: []
})
export class HomePageComponent {
  private rota = inject(ActivatedRoute);
  private api = inject(Api);
  private seo = inject(Seo);

  protected language = signal<Language>('tr');

  protected veri$ = this.rota.paramMap.pipe(
    tap((p) => {
      const language = (p.get('language') as Language) ?? 'tr';
      this.language.set(language);
    }),
    switchMap((p) => this.api.anaSayfa((p.get('language') as Language) ?? 'tr')),
    tap((veri) => {
      const language = this.language();
      this.seo.uygula(veri.seo, language, `/${language}`, {
        image: veri.slider[0]?.imageUrl,
        imageAlt: veri.slider[0]?.imageAlt
      });
    })
  );

  protected metin(tr: string, en: string): string {
    return this.language() === 'en' ? en : tr;
  }
}
