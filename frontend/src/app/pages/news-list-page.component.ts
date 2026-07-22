import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Api } from '../core/api.service';
import { Seo } from '../core/seo.service';
import { Language, NewsSummary } from '../core/models';
import { SideMenuComponent } from '../layout/side-menu.component';

/**
 * Haber ve duyuruların tamamı: /tr/news, /en/news
 *
 * Duyurular yalnızca ana sayfada listeleniyordu. Sol menüden "Haberler ve
 * Duyurular" denildiğinde ana sayfaya dönmek, menüde zaten "Ana Sayfa"
 * varken anlamsız olurdu; duyuruların kendi adresi olması gerekiyordu.
 * Adresi olan bir liste ayrıca paylaşılabilir ve arama motoruna girer.
 *
 * Veri ana sayfayla aynı uçtan gelir — duyurular tek bir yerde tutulur.
 */
@Component({
  selector: 'bidb-news-list-page',
  imports: [SideMenuComponent, RouterLink, DatePipe],
  template: `
    <div class="kap sayfa-duzen">
      <aside class="yan">
        <bidb-side-menu [dilDegeri]="language()"></bidb-side-menu>
      </aside>

      <main id="ana-icerik" class="icerik-alani">
        <header class="sayfa-tepe">
          <h1 class="sayfa-baslik">
            {{ language() === 'en' ? 'News and Announcements' : 'Haber ve Duyurular' }}
          </h1>
        </header>

        @if (duyurular().length) {
          <section class="duyurular">
            <ul>
              @for (d of duyurular(); track d.title) {
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

          <!-- Eski duyurular kaynak sitede ayrı bir sayfada tutuluyor;
               listenin sonunda ona bağlanmak doğal yer. -->
          @if (language() === 'tr') {
            <p class="duyuru-arsiv">
              <a routerLink="/tr/archive">Daha eski duyurular için Arşiv sayfasına bakabilirsiniz.</a>
            </p>
          }
        } @else {
          <p>{{ language() === 'en' ? 'No announcements yet.' : 'Henüz duyuru bulunmuyor.' }}</p>
        }
      </main>
    </div>
  `
})
export class NewsListPageComponent {
  private rota = inject(ActivatedRoute);
  private api = inject(Api);
  private seo = inject(Seo);

  protected language = signal<Language>('tr');
  protected duyurular = signal<NewsSummary[]>([]);

  ngOnInit(): void {
    this.rota.paramMap.subscribe((p) => {
      const dil = (p.get('language') as Language) ?? 'tr';
      this.language.set(dil);

      this.api.anaSayfa(dil).subscribe((v) => this.duyurular.set(v.news));

      // Sayfa veritabanında bir kayıt değil; başlık ve açıklaması burada
      // üretilir. Seo servisi eksik alanları site adıyla tamamlar.
      this.seo.uygula({
        slug: 'news',
        language: dil,
        title: dil === 'en' ? 'News and Announcements' : 'Haber ve Duyurular',
        contentHtml: null,
        seoTitle: null,
        seoDescription: dil === 'en'
          ? 'All news and announcements from the Hacettepe University Department of Information Technology.'
          : 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığının haber ve duyurularının tamamı.',
        seoKeywords: null,
        documents: []
      }, dil, `/${dil}/news`);
    });
  }
}
