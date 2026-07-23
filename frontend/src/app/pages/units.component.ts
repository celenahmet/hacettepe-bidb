import { Component, Input, signal } from '@angular/core';
import { Language } from '../core/models';

/** Birimin görev alanı — ada göre çıkarılır, ikonu belirler. */
type Alan = 'ag' | 'guvenlik' | 'sunucu' | 'yazilim' | 'imza' | 'mali'
          | 'insan' | 'destek' | 'web' | 'laboratuvar';

interface Birim {
  ad: string;
  /** Ad içindeki parantezli yerleşke: "(Beytepe)" → "Beytepe" */
  yerleske: string | null;
  aciklama: string;
  alan: Alan;
}

/**
 * Genel Tanıtım — birimlerin görev tanımları.
 *
 * Kaynak sayfa on iki birimi arka arkaya paragraf olarak sıralıyordu:
 * "<strong><u>Birim Adı (Yerleşke):</u></strong> açıklama". Tek blok hâlinde
 * okunması güç bir metin duvarıydı; hangi birimin nerede bittiği ancak
 * dikkatle ayırt ediliyordu.
 *
 * İÇERİK DEĞİŞMİYOR. Birim adları ve açıklamalar saklanan HTML'den birebir
 * ayrıştırılıyor. Yalnızca sunum: her birim kendi kartında, görev alanını
 * anlatan bir ikonla ve yerleşkesi ayrı bir rozette.
 *
 * Ayrıştırma hem tarayıcıda hem sunucuda çalışan düzenli ifadelerle
 * yapılıyor; liste arama motoruna da yapılı giriyor.
 */
@Component({
  selector: 'bidb-units',
  template: `
    @if (birimler().length) {
      <div class="birimler">
        @for (b of birimler(); track b.ad) {
          <article class="birim-kart">
            <span class="birim-ikon" [attr.data-alan]="b.alan" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none"
                   stroke="currentColor" stroke-width="1.6"
                   stroke-linecap="round" stroke-linejoin="round">
                @switch (b.alan) {
                  @case ('ag') {
                    <circle cx="12" cy="12" r="8.5"/>
                    <path d="M3.5 12h17M12 3.5c2.2 2.4 3.3 5.3 3.3 8.5s-1.1 6.1-3.3 8.5c-2.2-2.4-3.3-5.3-3.3-8.5S9.8 5.9 12 3.5z"/>
                  }
                  @case ('guvenlik') {
                    <path d="M12 3l7 3v5.5c0 4.3-2.9 7.4-7 8.5-4.1-1.1-7-4.2-7-8.5V6z"/>
                    <path d="M9.5 12l1.8 1.8 3.4-3.6"/>
                  }
                  @case ('sunucu') {
                    <rect x="3.5" y="4.5" width="17" height="6" rx="1"/>
                    <rect x="3.5" y="13.5" width="17" height="6" rx="1"/>
                    <path d="M7 7.5h.01M7 16.5h.01"/>
                  }
                  @case ('yazilim') {
                    <rect x="3" y="4.5" width="18" height="15" rx="1.5"/>
                    <path d="M3 8.5h18"/>
                    <path d="M8.5 12.5l-2 2 2 2M14.5 12.5l2 2-2 2"/>
                  }
                  @case ('imza') {
                    <path d="M4 20h16"/>
                    <path d="M6 16l9.5-9.5a2 2 0 013 3L9 19l-4 1z"/>
                  }
                  @case ('mali') {
                    <rect x="3" y="6" width="18" height="13" rx="2"/>
                    <path d="M3 10h18M7 15h4"/>
                  }
                  @case ('insan') {
                    <circle cx="9" cy="8" r="3.2"/>
                    <path d="M3.5 20c0-3.6 2.5-6 5.5-6s5.5 2.4 5.5 6"/>
                    <path d="M16 9.5a3 3 0 010 5M18.5 20c0-2.6-1-4.6-2.5-5.6"/>
                  }
                  @case ('destek') {
                    <path d="M4 13v-1a8 8 0 0116 0v1"/>
                    <rect x="2.5" y="13" width="4" height="6" rx="1.5"/>
                    <rect x="17.5" y="13" width="4" height="6" rx="1.5"/>
                    <path d="M19.5 19v.5a2.5 2.5 0 01-2.5 2.5H13"/>
                  }
                  @case ('web') {
                    <rect x="3" y="4.5" width="18" height="15" rx="1.5"/>
                    <path d="M3 9h18"/>
                    <path d="M6.2 6.7h.01M8.6 6.7h.01"/>
                  }
                  @default {
                    <rect x="3" y="5" width="18" height="11" rx="1.5"/>
                    <path d="M8 20h8M12 16v4"/>
                  }
                }
              </svg>
            </span>

            <div class="birim-govde">
              <h2 class="birim-ad">
                {{ b.ad }}
                @if (b.yerleske) { <span class="birim-yerleske">{{ b.yerleske }}</span> }
              </h2>
              <p class="birim-aciklama">{{ b.aciklama }}</p>
            </div>
          </article>
        }
      </div>
    }
  `
})
export class UnitsComponent {
  @Input({ required: true }) set rawHtml(html: string) {
    this._birimler.set(this.ayristir(html ?? ''));
  }
  @Input() dilDegeri: Language = 'tr';

  private _birimler = signal<Birim[]>([]);
  protected birimler = this._birimler.asReadonly();

  /**
   * "<strong><u>Ad (Yerleşke):</u></strong> açıklama" kalıbını çözer.
   * Altı çizili sarmalayıcı bazı maddelerde eksik olabildiği için <u>
   * isteğe bağlı tutuldu.
   */
  private ayristir(html: string): Birim[] {
    const desen = /<p[^>]*>\s*<strong>\s*(?:<u>)?([\s\S]*?)(?:<\/u>)?\s*<\/strong>([\s\S]*?)<\/p>/gi;
    const sonuc: Birim[] = [];
    let m: RegExpExecArray | null;

    while ((m = desen.exec(html)) !== null) {
      const hamAd = this.duz(m[1]).replace(/:\s*$/, '');
      const aciklama = this.duz(m[2]);
      if (!hamAd || !aciklama) continue;

      // Yerleşke adın sonundaki parantezde: "Ağ Birimi (Beytepe)"
      const yer = hamAd.match(/\(([^)]+)\)\s*$/);
      const ad = yer ? hamAd.slice(0, yer.index).trim() : hamAd;

      sonuc.push({ ad, yerleske: yer ? yer[1].trim() : null, aciklama, alan: this.alanBul(ad) });
    }
    return sonuc;
  }

  /** Boşlukları sadeleştirir; kaynakta çift boşluklar var. */
  private duz(html: string): string {
    return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();
  }

  /** Birim adından görev alanı (ikon) çıkarımı; en dar eşleşmeden genele. */
  private alanBul(ad: string): Alan {
    const a = ad.toLocaleLowerCase('tr');
    if (/laboratuvar/.test(a)) return 'laboratuvar';
    if (/web/.test(a)) return 'web';
    if (/kullan[ıi]c[ıi] destek|destek/.test(a)) return 'destek';
    if (/insan kaynak/.test(a)) return 'insan';
    if (/idari ve mali|mali/.test(a)) return 'mali';
    if (/bys|bireysel|e-?imza/.test(a)) return 'imza';
    if (/yaz[ıi]l[ıi]m geli[şs]tirme/.test(a)) return 'yazilim';
    if (/sistem yaz[ıi]l[ıi]m/.test(a)) return 'sunucu';
    if (/g[üu]venlik/.test(a)) return 'guvenlik';
    if (/a[ğg]/.test(a)) return 'ag';
    return 'sunucu';
  }
}
