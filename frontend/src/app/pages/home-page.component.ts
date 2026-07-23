import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, DatePipe } from '@angular/common';
import { switchMap, tap } from 'rxjs/operators';
import { Api } from '../core/api.service';
import { Seo } from '../core/seo.service';
import { Language } from '../core/models';
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
      @defer (hydrate on interaction; hydrate on timer(5s)) {
        <bidb-hero-slider
          [dilDegeri]="language()"
          [slaytlar]="v.slider"
          [kisayollar]="v.shortcuts">
        </bidb-hero-slider>
      }

      @defer (on viewport; on timer(100ms)) {
      <div class="kap sayfa-duzen">
        <aside class="yan">
          <bidb-side-menu [dilDegeri]="language()"></bidb-side-menu>
        </aside>

        <main id="ana-icerik" class="icerik-alani">
          <h1 class="sr-only">
            {{ metin('Bilgi İşlem Daire Başkanlığı', 'Department of Information Technology') }}
          </h1>

          @if (v.shortcuts.length) {
            <nav class="kisayollar" [attr.aria-label]="metin('Hızlı erişim', 'Quick access')">
              @for (k of v.shortcuts; track k.url) {
                <a class="kisayol" [href]="k.url"
                   [attr.target]="k.newTab ? '_blank' : null"
                   [attr.rel]="k.newTab ? 'noopener' : null">
                  @if (k.iconUrl) {
                    <img [src]="k.iconUrl" alt="" aria-hidden="true" width="52" height="52" loading="lazy">
                  }
                  <span>{{ k.name }}</span>
                </a>
              }
            </nav>
          }

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
  `
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
