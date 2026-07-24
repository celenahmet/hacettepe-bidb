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

                @if (kategoriler(v.news).length > 1) {
                  <div class="kategori-filtreleri" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
                    <button 
                      [class.aktif]="seciliKategori() === null"
                      (click)="seciliKategori.set(null)"
                      class="kategori-buton">
                      {{ metin('Tümü', 'All') }}
                    </button>
                    @for (k of kategoriler(v.news); track k) {
                      <button 
                        [class.aktif]="seciliKategori() === k"
                        (click)="seciliKategori.set(k)"
                        class="kategori-buton">
                        {{ kategoriMetni(k) }}
                      </button>
                    }
                  </div>
                }

                <div class="haber-izgara">
                  @for (d of filtrelenmisHaberler(v.news).slice(0, 7); track d.title; let i = $index) {
                    <bidb-news-card [haber]="d" [dilDegeri]="language()" [oneCikan]="i === 0"></bidb-news-card>
                  }
                </div>
                
                @if (filtrelenmisHaberler(v.news).length === 0) {
                  <p style="margin-top: 1rem; color: var(--tema-metin-soluk);">
                    {{ metin('Bu kategoride haber bulunmuyor.', 'No news found in this category.') }}
                  </p>
                }
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
  `,
  styles: [`
    .kategori-buton {
      padding: 0.4rem 1rem;
      border-radius: 999px;
      border: 1px solid var(--tema-kenarlik, #ddd);
      background: var(--tema-zemin, #fff);
      color: var(--tema-metin, #333);
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s ease;
    }
    .kategori-buton:hover {
      background: var(--tema-kenarlik, #eee);
    }
    .kategori-buton.aktif {
      background: var(--tema-vurgu, #0055a4);
      color: #fff;
      border-color: var(--tema-vurgu, #0055a4);
    }
  `]
})
export class HomePageComponent {
  private rota = inject(ActivatedRoute);
  private api = inject(Api);
  private seo = inject(Seo);

  protected language = signal<Language>('tr');
  protected seciliKategori = signal<string | null>(null);

  protected veri$ = this.rota.paramMap.pipe(
    tap((p) => {
      const language = (p.get('language') as Language) ?? 'tr';
      this.language.set(language);
      this.seciliKategori.set(null); // Dil değiştiğinde filtreyi sıfırla
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

  protected filtrelenmisHaberler(news: NewsSummary[]): NewsSummary[] {
    const kategori = this.seciliKategori();
    if (!kategori) return news;
    return news.filter(n => n.category === kategori);
  }

  protected kategoriler(news: NewsSummary[]): string[] {
    const set = new Set(news.map(n => n.category).filter(c => c));
    return Array.from(set).sort();
  }

  protected kategoriMetni(k: string): string {
    const dil = this.language();
    const tr: Record<string, string> = {
      'general': 'Genel',
      'service-outage': 'Servis Kesintisi',
      'maintenance': 'Bakım',
      'cyber-security': 'Siber Güvenlik',
      'network-internet': 'Ağ ve İnternet',
      'email': 'E-Posta',
      'software-license': 'Yazılım Lisansları',
      'ebys-esignature': 'EBYS ve E-İmza',
      'web-services': 'Web Servisleri',
      'training-event': 'Eğitim ve Etkinlik',
      'recruitment': 'Personel Alımı',
      'iskur': 'İŞKUR',
      'procurement': 'İhale ve Satın Alma'
    };
    const en: Record<string, string> = {
      'general': 'General',
      'service-outage': 'Service Outage',
      'maintenance': 'Maintenance',
      'cyber-security': 'Cyber Security',
      'network-internet': 'Network & Internet',
      'email': 'Email',
      'software-license': 'Software Licenses',
      'ebys-esignature': 'EBYS & E-Signature',
      'web-services': 'Web Services',
      'training-event': 'Training & Event',
      'recruitment': 'Recruitment',
      'iskur': 'ISKUR',
      'procurement': 'Procurement'
    };
    const lookup = dil === 'en' ? en : tr;
    return lookup[k] || k;
  }
}
