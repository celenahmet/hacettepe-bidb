import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, DatePipe } from '@angular/common';
import { switchMap, tap } from 'rxjs/operators';
import { Api } from '../core/api.service';
import { Seo } from '../core/seo.service';
import { Language } from '../core/models';
import { RouterLink } from '@angular/router';
import { SideMenuComponent } from '../layout/side-menu.component';

/** Ana sayfa: slider, kısayollar, news ve services. */
@Component({
  selector: 'bidb-home-page',
  imports: [SideMenuComponent, AsyncPipe, DatePipe, RouterLink],
  template: `
    @if (veri$ | async; as v) {
      <section class="slider" [attr.aria-label]="metin('Öne çıkanlar', 'Featured')">
        @for (s of v.slider; track s.imageUrl; let sortOrder = $index) {
          @if (sortOrder === 0) {
            <div class="slayt" [style.background-image]="'url(' + s.imageUrl + ')'"
                 role="img" [attr.aria-label]="s.imageAlt">
              <div class="kap">
                <div class="slayt-yazi">
                  <div class="slayt-baslik">{{ s.title }}</div>
                  @if (s.subtitle) { <div class="slayt-ozet">{{ s.subtitle }}</div> }
                </div>
              </div>
            </div>
          }
        }
      </section>

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
              <h2>{{ metin('Haber ve Duyurular', 'News and Announcements') }}</h2>
              <ul>
                @for (d of v.news; track d.title) {
                  <li [class.gorselli]="d.imageUrl">
                    @if (d.imageUrl) {
                      <a [routerLink]="d.url" class="duyuru-gorsel">
                        <img [src]="d.imageUrl" [alt]="d.imageAlt || d.title" loading="lazy" width="120" height="80">
                      </a>
                    }
                    <span class="duyuru-yazi">
                      @if (d.hasOwnPage) {
                        <a [routerLink]="d.url">{{ d.title }}</a>
                      } @else {
                        <a [href]="d.url" target="_blank" rel="noopener">{{ d.title }}</a>
                      }
                      @if (d.summary) { <small class="duyuru-ozet">{{ d.summary }}</small> }
                    </span>
                    <time [attr.datetime]="d.date">{{ d.date | date: 'dd.MM.yyyy' }}</time>
                  </li>
                }
              </ul>
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
      this.seo.uygula(null, language, `/${language}`);
    }),
    switchMap((p) => this.api.anaSayfa((p.get('language') as Language) ?? 'tr'))
  );

  protected metin(tr: string, en: string): string {
    return this.language() === 'en' ? en : tr;
  }
}
