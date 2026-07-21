import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, DatePipe } from '@angular/common';
import { switchMap, tap } from 'rxjs/operators';
import { Api } from '../cekirdek/api';
import { Seo } from '../cekirdek/seo';
import { Dil } from '../cekirdek/modeller';
import { SolMenu } from '../duzen/sol-menu';

/** Ana sayfa: slider, kısayollar, duyurular ve servisler. */
@Component({
  selector: 'bidb-ana-sayfa',
  imports: [SolMenu, AsyncPipe, DatePipe],
  template: `
    @if (veri$ | async; as v) {
      <section class="slider" [attr.aria-label]="metin('Öne çıkanlar', 'Featured')">
        @for (s of v.slider; track s.gorselUrl; let sira = $index) {
          @if (sira === 0) {
            <div class="slayt" [style.background-image]="'url(' + s.gorselUrl + ')'"
                 role="img" [attr.aria-label]="s.gorselAlt">
              <div class="kap">
                <div class="slayt-yazi">
                  <div class="slayt-baslik">{{ s.baslik }}</div>
                  @if (s.altBaslik) { <div class="slayt-ozet">{{ s.altBaslik }}</div> }
                </div>
              </div>
            </div>
          }
        }
      </section>

      <div class="kap sayfa-duzen">
        <aside class="yan">
          <bidb-sol-menu [dilDegeri]="dil()"></bidb-sol-menu>
        </aside>

        <main id="ana-icerik" class="icerik-alani">
          <h1 class="sr-only">
            {{ metin('Bilgi İşlem Daire Başkanlığı', 'Department of Information Technology') }}
          </h1>

          @if (v.kisayollar.length) {
            <nav class="kisayollar" [attr.aria-label]="metin('Hızlı erişim', 'Quick access')">
              @for (k of v.kisayollar; track k.adres) {
                <a class="kisayol" [href]="k.adres"
                   [attr.target]="k.yeniSekme ? '_blank' : null"
                   [attr.rel]="k.yeniSekme ? 'noopener' : null">
                  @if (k.ikonUrl) {
                    <img [src]="k.ikonUrl" alt="" aria-hidden="true" width="52" height="52" loading="lazy">
                  }
                  <span>{{ k.ad }}</span>
                </a>
              }
            </nav>
          }

          @if (v.duyurular.length) {
            <section class="duyurular">
              <h2>{{ metin('Haber ve Duyurular', 'News and Announcements') }}</h2>
              <ul>
                @for (d of v.duyurular; track d.baslik) {
                  <li>
                    <a [href]="d.adres" target="_blank" rel="noopener">{{ d.baslik }}</a>
                    <time [attr.datetime]="d.tarih">{{ d.tarih | date: 'dd.MM.yyyy' }}</time>
                  </li>
                }
              </ul>
            </section>
          }

          @if (v.servisler.length) {
            <section class="servisler">
              <h2>{{ metin('Servisler ve Uygulamalar', 'Services and Applications') }}</h2>
              <div class="servis-listesi">
                @for (s of v.servisler; track s.adres) {
                  <a class="servis" [href]="s.adres"
                     [attr.target]="s.yeniSekme ? '_blank' : null"
                     [attr.rel]="s.yeniSekme ? 'noopener' : null">
                    @if (s.ikonUrl) {
                      <img [src]="s.ikonUrl" alt="" aria-hidden="true" loading="lazy">
                    }
                    <span>{{ s.ad }}</span>
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
export class AnaSayfa {
  private rota = inject(ActivatedRoute);
  private api = inject(Api);
  private seo = inject(Seo);

  protected dil = signal<Dil>('tr');

  protected veri$ = this.rota.paramMap.pipe(
    tap((p) => {
      const dil = (p.get('dil') as Dil) ?? 'tr';
      this.dil.set(dil);
      this.seo.uygula(null, dil, `/${dil}`);
    }),
    switchMap((p) => this.api.anaSayfa((p.get('dil') as Dil) ?? 'tr'))
  );

  protected metin(tr: string, en: string): string {
    return this.dil() === 'en' ? en : tr;
  }
}
