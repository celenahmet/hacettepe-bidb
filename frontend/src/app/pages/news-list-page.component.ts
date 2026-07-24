import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Api } from '../core/api.service';
import { Seo } from '../core/seo.service';
import { Language, NewsSummary } from '../core/models';
import { SideMenuComponent } from '../layout/side-menu.component';
import { NewsCardComponent } from './news-card.component';

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
  imports: [SideMenuComponent, RouterLink, NewsCardComponent],
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
          @if (kategoriler().length > 1) {
            <div class="kategori-filtreleri">
              <button 
                [class.aktif]="seciliKategori() === null"
                (click)="seciliKategori.set(null)"
                class="kategori-buton">
                {{ language() === 'en' ? 'All' : 'Tümü' }}
              </button>
              @for (k of kategoriler(); track k) {
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
            @for (d of filtrelenmisDuyurular(); track d.title; let i = $index) {
              <bidb-news-card [haber]="d" [dilDegeri]="language()" [oneCikan]="i === 0"></bidb-news-card>
            }
          </div>

          @if (filtrelenmisDuyurular().length === 0) {
            <p style="margin-top: 2rem; color: var(--tema-metin-soluk);">
              {{ language() === 'en' ? 'No news found in this category.' : 'Bu kategoride haber bulunmuyor.' }}
            </p>
          }

          @if (language() === 'tr' && seciliKategori() === null) {
            <p class="duyuru-arsiv">
              <a routerLink="/tr/archive">Daha eski duyurular için Arşiv sayfasına bakabilirsiniz.</a>
            </p>
          }
        } @else {
          <p>{{ language() === 'en' ? 'No announcements yet.' : 'Henüz duyuru bulunmuyor.' }}</p>
        }
      </main>
    </div>
  `,
  styles: [`
    .kategori-filtreleri {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }
    .kategori-buton {
      padding: 0.4rem 1rem;
      border-radius: 999px;
      border: 1px solid var(--tema-kenarlik, #ddd);
      background: var(--tema-zemin, #fff);
      color: var(--tema-metin, #333);
      cursor: pointer;
      font-size: 0.9rem;
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
export class NewsListPageComponent {
  private rota = inject(ActivatedRoute);
  private api = inject(Api);
  private seo = inject(Seo);

  protected language = signal<Language>('tr');
  protected duyurular = signal<NewsSummary[]>([]);
  protected seciliKategori = signal<string | null>(null);

  protected filtrelenmisDuyurular = computed(() => {
    const tumu = this.duyurular();
    const kategori = this.seciliKategori();
    if (!kategori) return tumu;
    return tumu.filter(d => d.category === kategori);
  });

  protected kategoriler = computed(() => {
    const tumu = this.duyurular();
    const set = new Set(tumu.map(d => d.category).filter(c => c));
    return Array.from(set).sort();
  });

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

  ngOnInit(): void {
    this.rota.paramMap.subscribe((p) => {
      const dil = (p.get('language') as Language) ?? 'tr';
      this.language.set(dil);
      this.seciliKategori.set(null); // Dil değiştiğinde filtreyi sıfırla

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
