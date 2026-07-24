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
          <div class="duyuru-kontrolleri">
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

            <div class="arama-kutusu">
              <input 
                type="text" 
                [placeholder]="language() === 'en' ? 'Search announcements...' : 'Duyurularda ara...'"
                (input)="aramaMetni.set($any($event.target).value)"
                [value]="aramaMetni()">
            </div>
          </div>

          <div class="haber-izgara">
            @for (d of filtrelenmisDuyurular(); track d.title; let i = $index) {
              <bidb-news-card [haber]="d" [dilDegeri]="language()" [oneCikan]="i === 0 && !aramaMetni() && !seciliKategori()"></bidb-news-card>
            }
          </div>

          @if (filtrelenmisDuyurular().length === 0) {
            <p style="margin-top: 2rem; color: var(--tema-metin-soluk);">
              {{ language() === 'en' ? 'No news found.' : 'Bu kriterlere uygun haber bulunmuyor.' }}
            </p>
          }

          @if (language() === 'tr' && seciliKategori() === null && !aramaMetni()) {
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
    .duyuru-kontrolleri {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    @media (min-width: 768px) {
      .duyuru-kontrolleri {
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
      }
    }
    .kategori-filtreleri {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      flex: 1;
    }
    .arama-kutusu input {
      padding: 0.4rem 1rem;
      border-radius: 999px;
      border: 1px solid var(--tema-kenarlik, #ddd);
      font-size: 0.9rem;
      width: 100%;
      min-width: 250px;
      outline: none;
      transition: border-color 0.2s;
    }
    .arama-kutusu input:focus {
      border-color: var(--hu-kirmizi, #b31821);
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
      background: var(--hu-kirmizi, #b31821);
      color: #fff;
      border-color: var(--hu-kirmizi, #b31821);
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
  protected aramaMetni = signal<string>('');

  protected filtrelenmisDuyurular = computed(() => {
    let tumu = this.duyurular();
    const kategori = this.seciliKategori();
    const arama = this.aramaMetni().toLowerCase().trim();

    if (kategori) {
      tumu = tumu.filter(d => d.category === kategori);
    }

    if (arama) {
      tumu = tumu.filter(d => 
        d.title.toLowerCase().includes(arama) || 
        (d.summary && d.summary.toLowerCase().includes(arama))
      );
    }

    return tumu;
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
      this.aramaMetni.set(''); // Arama metnini sıfırla

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
