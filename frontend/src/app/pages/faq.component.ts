import { Component, Input, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Language } from '../core/models';
import { disaBaglantilariGuvenceyeAl } from '../core/icerik-bicim';

interface Soru {
  soru: string;
  cevapHtml: string;
  /** Arama için normalize edilmiş düz metin (soru + cevap). */
  arama: string;
}

interface Kategori {
  ad: string;
  sorular: Soru[];
}

/**
 * Sık Sorulan Sorular — arama ve kategori filtresiyle.
 *
 * Kaynak içerik bir Bootstrap akordeonuydu; açıp kapatan JavaScript
 * yüklenmediği için bütün cevaplar aynı anda açık duruyor, 40 KB'lık sayfa
 * tek uzun blok hâlinde okunuyordu.
 *
 * İÇERİK DEĞİŞMİYOR. Sorular ve cevaplar saklanan HTML'den birebir
 * ayrıştırılıyor; tek kelime eklenmiyor, çıkarılmıyor. Yalnızca sunum
 * yenileniyor: her soru kendi açılır başlığında (details/summary — yerel,
 * JavaScript'siz, erişilebilir), üstte bir arama kutusu ve kategori
 * süzgeci.
 *
 * Ayrıştırma hem tarayıcıda hem sunucuda çalışan düzenli ifadelerle
 * yapılıyor (DOMParser sunucuda yok); böylece liste arama motoruna da
 * yapılı olarak giriyor.
 */
@Component({
  selector: 'bidb-faq',
  imports: [FormsModule],
  template: `
    <div class="sss">
      <div class="sss-arac">
        <div class="sss-arac-ust">
          <div class="sss-arama">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"
                 fill="none" stroke="currentColor" stroke-width="1.7"
                 stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
            </svg>
            <input type="search" [(ngModel)]="sorgu"
                   [attr.aria-label]="dilDegeri === 'en' ? 'Search questions' : 'Sorularda ara'"
                   [placeholder]="dilDegeri === 'en' ? 'Search questions…' : 'Sorularda ara…'">
            @if (sorgu()) {
              <button type="button" class="sss-temizle" (click)="sorgu.set('')"
                      [attr.aria-label]="dilDegeri === 'en' ? 'Clear search' : 'Aramayı temizle'">×</button>
            }
          </div>
          <p class="sss-sonuc-sayisi" aria-live="polite" aria-atomic="true">
            <strong>{{ gorunenSoruSayisi() }}</strong>
            <span>{{ dilDegeri === 'en' ? 'results' : 'sonuç' }}</span>
          </p>
        </div>

        @if (kategoriler().length > 1) {
          <div class="sss-filtre-satiri">
            <span class="sss-filtre-etiket">{{ dilDegeri === 'en' ? 'Topics' : 'Konular' }}</span>
            <div class="sss-suzgec" role="group"
                 [attr.aria-label]="dilDegeri === 'en' ? 'Categories' : 'Kategoriler'">
              <button type="button" [class.etkin]="etkinKategori() === null"
                      [attr.aria-pressed]="etkinKategori() === null"
                      (click)="etkinKategori.set(null)">
                {{ dilDegeri === 'en' ? 'All' : 'Tümü' }}
                <span class="sss-say">{{ toplamSoru() }}</span>
              </button>
              @for (k of kategoriler(); track k.ad) {
                <button type="button" [class.etkin]="etkinKategori() === k.ad"
                        [attr.aria-pressed]="etkinKategori() === k.ad"
                        (click)="etkinKategori.set(k.ad)">
                  {{ kategoriEtiketi(k.ad) }}
                  <span class="sss-say">{{ k.sorular.length }}</span>
                </button>
              }
            </div>
          </div>
        }
      </div>

      @if (sonuc().length) {
        @for (k of sonuc(); track k.ad) {
          <section class="sss-bolum">
            <div class="sss-bolum-ust">
              @if (k.ad) { <h2 class="sss-baslik">{{ kategoriEtiketi(k.ad) }}</h2> }
              <span>{{ k.sorular.length }} {{ dilDegeri === 'en' ? 'questions' : 'soru' }}</span>
            </div>
            @for (s of k.sorular; track s.soru; let soruSirasi = $index) {
              <details class="sss-oge">
                <summary>
                  <span class="sss-soru-sira" aria-hidden="true">{{ ikiHane(soruSirasi + 1) }}</span>
                  <span>{{ s.soru }}</span>
                  <span class="sss-isaret" aria-hidden="true"></span>
                </summary>
                <div class="sss-cevap" [innerHTML]="guvenli(s.cevapHtml)"></div>
              </details>
            }
          </section>
        }
      } @else {
        <div class="sss-bos">
          <svg viewBox="0 0 24 24" width="42" height="42" aria-hidden="true"
               fill="none" stroke="currentColor" stroke-width="1.4"
               stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M8.5 11h5"/>
          </svg>
          <strong>{{ dilDegeri === 'en' ? 'No matching question found' : 'Eşleşen soru bulunamadı' }}</strong>
          <span>
            {{ dilDegeri === 'en'
               ? 'Try a different keyword or clear the selected filters.'
               : 'Farklı bir anahtar kelime deneyin veya seçili filtreleri temizleyin.' }}
          </span>
          <button type="button" (click)="filtreleriTemizle()">
            {{ dilDegeri === 'en' ? 'Clear filters' : 'Filtreleri temizle' }}
          </button>
        </div>
      }
    </div>
  `
})
export class FaqComponent {
  private temizleyici = inject(DomSanitizer);

  @Input({ required: true }) set rawHtml(html: string) {
    this._kategoriler.set(this.ayristir(html ?? ''));
  }
  @Input() dilDegeri: Language = 'tr';

  private _kategoriler = signal<Kategori[]>([]);
  protected kategoriler = this._kategoriler.asReadonly();

  protected sorgu = signal('');
  protected etkinKategori = signal<string | null>(null);

  /** "Tümü" düğmesindeki sayaç için toplam soru sayısı. */
  protected toplamSoru = computed(() =>
    this._kategoriler().reduce((t, k) => t + k.sorular.length, 0));

  /** Arama + kategoriyle süzülmüş sonuç. */
  protected sonuc = computed<Kategori[]>(() => {
    const q = this.normalize(this.sorgu());
    const kat = this.etkinKategori();
    return this._kategoriler()
      .filter((k) => !kat || k.ad === kat)
      .map((k) => ({
        ad: k.ad,
        sorular: q ? k.sorular.filter((s) => s.arama.includes(q)) : k.sorular
      }))
      .filter((k) => k.sorular.length > 0);
  });

  protected gorunenSoruSayisi = computed(() =>
    this.sonuc().reduce((toplam, kategori) => toplam + kategori.sorular.length, 0)
  );

  protected ikiHane(sayi: number): string {
    return sayi.toString().padStart(2, '0');
  }

  protected filtreleriTemizle(): void {
    this.sorgu.set('');
    this.etkinKategori.set(null);
  }

  protected kategoriEtiketi(ad: string): string {
    const etiketler: Record<string, string> = {
      'E-POSTA HİZMETİ': 'E-posta hizmeti',
      'EBYS': 'EBYS',
      'PROXY': 'Proxy',
      'İNTERNET': 'İnternet',
      'WEB SERVİSİ': 'Web servisi',
      'E-İMZA': 'E-İmza',
      'HUYS': 'HUYS',
      'UYGULAMA VE PROGRAMLAR': 'Uygulama ve programlar',
      'DİĞER': 'Diğer'
    };

    return etiketler[ad] ?? ad;
  }

  protected guvenli(html: string): SafeHtml {
    return this.temizleyici.bypassSecurityTrustHtml(disaBaglantilariGuvenceyeAl(html));
  }

  private normalize(s: string): string {
    return s.replace(/\s+/g, ' ').trim().toLocaleLowerCase('tr');
  }

  private duzMetin(html: string): string {
    return this.normalize(html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' '));
  }

  /**
   * Bootstrap akordeon HTML'inden kategori ve soruları çıkarır.
   *
   * Belgeyi soldan sağa tarar: kırmızı kalın <p> bir KATEGORİ başlığı,
   * data-toggle="collapse" taşıyan <a> bir SORU, "panel-body" div'i o
   * sorunun CEVABI. Üçü belge sırasında geldiği için tek geçişte eşlenir.
   */
  private ayristir(html: string): Kategori[] {
    const kategoriler: Kategori[] = [];
    let gecerli: Kategori = { ad: '', sorular: [] };
    const ekle = () => {
      if (gecerli.sorular.length) kategoriler.push(gecerli);
    };

    // Üç kalıptan biri: kategori başlığı | soru bağlantısı | cevap gövdesi.
    const desen = /<p[^>]*color:\s*red[^>]*>([\s\S]*?)<\/p>|data-toggle=["']collapse["'][^>]*>([\s\S]*?)<\/a>|class=["'][^"']*panel-body[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi;

    let bekleyenSoru: string | null = null;
    let m: RegExpExecArray | null;
    while ((m = desen.exec(html)) !== null) {
      if (m[1] !== undefined) {
        // Yeni kategori: öncekini kapat.
        ekle();
        gecerli = { ad: this.metinTemizle(m[1]), sorular: [] };
        bekleyenSoru = null;
      } else if (m[2] !== undefined) {
        bekleyenSoru = this.metinTemizle(m[2]);
      } else if (m[3] !== undefined && bekleyenSoru) {
        const cevap = m[3].trim();
        gecerli.sorular.push({
          soru: bekleyenSoru,
          cevapHtml: cevap,
          arama: this.normalize(bekleyenSoru) + ' ' + this.duzMetin(cevap)
        });
        bekleyenSoru = null;
      }
    }
    ekle();
    return kategoriler;
  }

  private metinTemizle(html: string): string {
    return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();
  }
}
