import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Api } from '../core/api.service';
import { Seo } from '../core/seo.service';
import { Language, NewsAudience, NewsSummary } from '../core/models';
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
          <div class="duyuru-filtre-alani">
            <div class="duyuru-filtre-grubu">
              @if (kategoriler().length > 1) {
                <label class="duyuru-filtre">
                  <span>{{ language() === 'en' ? 'Category' : 'Kategori' }}</span>
                  <select [value]="seciliKategori() ?? ''" (change)="seciliKategori.set($any($event.target).value || null)">
                    <option value="">{{ language() === 'en' ? 'All' : 'Tümü' }}</option>
                    @for (k of kategoriler(); track k) {
                      <option [value]="k">{{ kategoriMetni(k) }}</option>
                    }
                  </select>
                </label>
              }
              @if (hedefKitleler().length > 1) {
                <label class="duyuru-filtre">
                  <span>{{ language() === 'en' ? 'Audience' : 'Hedef Kitle' }}</span>
                  <select [value]="seciliHedefKitle() ?? ''" (change)="seciliHedefKitle.set($any($event.target).value || null)">
                    <option value="">{{ language() === 'en' ? 'All' : 'Tümü' }}</option>
                    @for (k of hedefKitleler(); track k) {
                      <option [value]="k">{{ hedefKitleMetni(k) }}</option>
                    }
                  </select>
                </label>
              }
            </div>

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
              <bidb-news-card [haber]="d" [dilDegeri]="language()" [oneCikan]="i === 0 && !aramaMetni() && !seciliKategori() && !seciliHedefKitle()"></bidb-news-card>
            }
          </div>

          @if (filtrelenmisDuyurular().length === 0) {
            <p style="margin-top: 2rem; color: var(--tema-metin-soluk);">
              {{ language() === 'en' ? 'No news found.' : 'Bu kriterlere uygun haber bulunmuyor.' }}
            </p>
          }

          @if (language() === 'tr' && seciliKategori() === null && seciliHedefKitle() === null && !aramaMetni()) {
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
    .duyuru-filtre-alani {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      margin-bottom: 3rem;
      padding: 1.25rem 1.5rem;
      border: 1px solid var(--cizgi);
      border-left: 3px solid var(--hu-kirmizi);
      background: var(--zemin);
    }
    @media (min-width: 768px) {
      .duyuru-filtre-alani {
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;
        gap: 2rem;
      }
    }
    .duyuru-filtre-grubu {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      flex: 1;
    }
    .duyuru-filtre {
      display: grid;
      gap: 0.35rem;
      min-width: 200px;
    }
    .duyuru-filtre span {
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--metin-3);
    }
    .duyuru-filtre select {
      width: 100%;
      padding: 0.55rem 0.65rem;
      border: 1px solid var(--cizgi-koyu);
      border-radius: 2px;
      background: var(--yuzey);
      color: var(--metin);
      font: inherit;
      font-size: 0.9rem;
      cursor: pointer;
    }
    .duyuru-filtre select:focus {
      outline: 2px solid color-mix(in srgb, var(--hu-kirmizi) 25%, transparent);
      border-color: var(--hu-kirmizi);
    }
    .arama-kutusu {
      position: relative;
      min-width: 250px;
    }
    .arama-kutusu::before {
      content: '⚲';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%) rotate(-45deg);
      font-size: 1.2rem;
      color: var(--hu-kirmizi);
      pointer-events: none;
    }
    .arama-kutusu input {
      width: 100%;
      padding: 0.5rem 0 0.5rem 2rem;
      border: none;
      border-bottom: 2px solid #ddd;
      background: transparent;
      font-size: 0.95rem;
      color: var(--metin);
      outline: none;
      transition: border-color 0.3s ease;
    }
    .arama-kutusu input:focus {
      border-bottom-color: var(--hu-kirmizi);
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
  protected seciliHedefKitle = signal<string | null>(null);
  protected aramaMetni = signal<string>('');

  protected filtrelenmisDuyurular = computed(() => {
    let tumu = this.duyurular();
    const kategori = this.seciliKategori();
    const hedefKitle = this.seciliHedefKitle();
    const arama = this.aramaMetni().toLowerCase().trim();

    if (kategori) {
      tumu = tumu.filter(d => d.category === kategori);
    }

    if (hedefKitle) {
      tumu = tumu.filter(d => d.audience === hedefKitle);
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
    // "general" (Genel Duyurular), "Tümü" filtresinin hemen yanında ilk
    // sırada gösterilir; diğer kategoriler alfabetik sırada onu izler.
    return Array.from(set).sort((a, b) => {
      if (a === 'general') return -1;
      if (b === 'general') return 1;
      return a.localeCompare(b);
    });
  });

  protected hedefKitleler = computed(() => {
    const tumu = this.duyurular();
    const set = new Set(tumu.map(d => d.audience).filter(a => a));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  });

  protected hedefKitleMetni(k: string): string {
    const dil = this.language();
    const tr: Record<NewsAudience, string> = {
      'all-users': 'Tüm Kullanıcılar',
      'students': 'Öğrenciler',
      'academic-staff': 'Akademik Personel',
      'administrative-staff': 'İdari Personel',
      'all-staff': 'Tüm Personel',
      'alumni': 'Mezunlar',
      'unit-managers': 'Birim Yöneticileri'
    };
    const en: Record<NewsAudience, string> = {
      'all-users': 'All Users',
      'students': 'Students',
      'academic-staff': 'Academic Staff',
      'administrative-staff': 'Administrative Staff',
      'all-staff': 'All Staff',
      'alumni': 'Alumni',
      'unit-managers': 'Unit Managers'
    };
    const lookup = (dil === 'en' ? en : tr) as Record<string, string>;
    return lookup[k] || k;
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

  ngOnInit(): void {
    this.rota.paramMap.subscribe((p) => {
      const dil = (p.get('language') as Language) ?? 'tr';
      this.language.set(dil);
      this.seciliKategori.set(null); // Dil değiştiğinde filtreyi sıfırla
      this.seciliHedefKitle.set(null);
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
