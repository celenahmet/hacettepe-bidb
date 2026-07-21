import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AdminDocument, AdminPage, Revision, AdminApiService } from './admin-api.service';

/**
 * Bir sayfanın tüm düzenlenebilir yönleri: metin, adres, belgeler ve
 * sürüm geçmişi.
 *
 * Metin doğrudan yayına girmez: önce önizlenir, sonra yayınlanır. Her
 * kayıttan önce eski hâl sürüm olarak saklandığı için yanlış bir
 * değişiklik geri alınabilir.
 */
@Component({
  selector: 'bidb-page-editor',
  imports: [FormsModule],
  template: `
    <div class="duzenleyici">
      <header class="duzenleyici-ust">
        <h2>{{ sayfa().baslik }}</h2>
        <code>/{{ sayfa().dil }}/{{ sayfa().slug }}</code>
        <button type="button" class="ikincil" (click)="kapat.emit()">Kapat</button>
      </header>

      <nav class="sekmeler ic">
        <button type="button" [class.etkin]="bolum() === 'metin'" (click)="bolum.set('metin')">Metin</button>
        <button type="button" [class.etkin]="bolum() === 'adres'" (click)="bolum.set('adres')">Başlık ve adres</button>
        <button type="button" [class.etkin]="bolum() === 'belge'" (click)="belgeBolumu()">Belgeler</button>
        <button type="button" [class.etkin]="bolum() === 'surum'" (click)="surumBolumu()">Sürüm geçmişi</button>
      </nav>

      @if (mesaj()) { <p class="bilgi" role="status">{{ mesaj() }}</p> }

      @if (bolum() === 'metin') {
        <p class="aciklama">
          Metin HTML olarak saklanır. Yayınlamadan önce önizleyin.
          Her kayıtta önceki hâl sürüm geçmişine eklenir.
        </p>

        <label for="metin">Page metni</label>
        <textarea id="metin" name="metin" rows="18" class="kod"
                  [ngModel]="metin()" (ngModelChange)="metin.set($event)"></textarea>

        <label for="not">Değişiklik notu (sürüm geçmişinde görünür)</label>
        <input id="not" name="not" [ngModel]="not()" (ngModelChange)="not.set($event)"
               placeholder="örn. telefon numarası güncellendi">

        <span class="dugmeler">
          <button type="button" class="ikincil" (click)="onizle()">Önizle</button>
          <button type="button" (click)="yayinla()" [disabled]="!onizlendi()">Yayınla</button>
          @if (!onizlendi()) { <small>Yayınlamak için önce önizleyin.</small> }
        </span>

        @if (onizleme(); as o) {
          <section class="onizleme">
            <h3>Önizleme</h3>
            <div class="icerik" [innerHTML]="o"></div>
          </section>
        }
      } @else if (bolum() === 'adres') {
        <label for="sbaslik2">Page başlığı</label>
        <input id="sbaslik2" name="sbaslik2" [ngModel]="yeniBaslik()" (ngModelChange)="yeniBaslik.set($event)">

        <label for="sslug">Adres</label>
        <input id="sslug" name="sslug" [ngModel]="yeniSlug()" (ngModelChange)="yeniSlug.set($event)">
        <p class="aciklama">
          Yeni adres: <code>/{{ sayfa().dil }}/{{ yeniSlug() }}</code><br>
          Adresi değiştirirseniz eski adres yenisine yönlendirilir; dışarıdan
          verilmiş bağlantılar çalışmaya devam eder.
        </p>

        <span class="dugmeler">
          <button type="button" (click)="adresKaydet()">Kaydet</button>
          <button type="button" class="tehlike" (click)="sayfaSil()">Sayfayı sil</button>
        </span>
      } @else if (bolum() === 'belge') {
        <p class="aciklama">Sayfanın altında listelenen belgeler.</p>

        <div class="yukleme">
          <label for="dosya">Yeni dosya yükle (PDF, Word, Excel, görsel — en fazla 25 MB)</label>
          <input id="dosya" type="file" (change)="dosyaSec($event)">
          @if (yukleniyor()) { <small>Yükleniyor…</small> }
        </div>

        <table class="yonetim-tablo">
          <thead><tr><th>Sıra</th><th>Ad</th><th>Adres</th><th></th></tr></thead>
          <tbody>
            @for (b of belgeler(); track b.id) {
              <tr>
                <td><input type="number" [ngModel]="b.sira" (ngModelChange)="belgeAlan(b, 'sira', +$event)" class="dar"></td>
                <td><input [ngModel]="b.ad" (ngModelChange)="belgeAlan(b, 'ad', $event)"></td>
                <td><input [ngModel]="b.adres" (ngModelChange)="belgeAlan(b, 'adres', $event)"></td>
                <td>
                  <button type="button" class="ikincil" (click)="belgeKaydet(b)">Kaydet</button>
                  <button type="button" class="tehlike" (click)="belgeSil(b)">Sil</button>
                </td>
              </tr>
            }
          </tbody>
        </table>

        <button type="button" (click)="belgeEkle()">Document satırı ekle</button>
      } @else {
        <p class="aciklama">
          En üstteki en yeni kayıttır. Bir sürüme dönmeden önce mevcut hâl de
          saklanır, yani geri alma işlemi de geri alınabilir.
        </p>

        <table class="yonetim-tablo">
          <thead><tr><th>Tarih</th><th>Açıklama</th><th>Kaydeden</th><th>Uzunluk</th><th></th></tr></thead>
          <tbody>
            @for (s of surumler(); track s.id) {
              <tr>
                <td><small>{{ zamanBicimi(s.zaman) }}</small></td>
                <td>{{ s.aciklama || '—' }}</td>
                <td>{{ s.kaydeden }}</td>
                <td>{{ s.uzunluk }} krkt</td>
                <td><button type="button" class="ikincil" (click)="geriAl(s)">Bu sürüme dön</button></td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
  styles: [`
    .duzenleyici { border: 1px solid var(--cizgi); border-radius: 6px; padding: 18px; margin: 18px 0; background: #fff; }
    .duzenleyici-ust { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin-bottom: 12px; }
    .duzenleyici-ust h2 { margin: 0; font-size: 1.15rem; }
    .duzenleyici-ust code { color: var(--metin-acik); font-size: .85rem; }
    .duzenleyici-ust button { margin-left: auto; }
    .sekmeler.ic { margin-bottom: 14px; }
    textarea.kod { width: 100%; font-family: Consolas, "Courier New", monospace; font-size: .85rem; }
    .onizleme { margin-top: 18px; border-top: 2px solid var(--cizgi); padding-top: 14px; }
    .onizleme h3 { font-size: 1rem; color: var(--metin-acik); }
    .yukleme { margin-bottom: 16px; padding: 12px; background: var(--zemin); border-radius: 4px; }
    input.dar { width: 70px; }
    .yonetim-tablo input { width: 100%; }
  `]
})
export class PageEditorComponent {
  private api = inject(AdminApiService);
  private temizleyici = inject(DomSanitizer);

  sayfa = input.required<AdminPage>();
  kapat = output<void>();
  degisti = output<void>();

  protected bolum = signal<'metin' | 'adres' | 'belge' | 'surum'>('metin');
  protected mesaj = signal('');

  protected metin = signal('');
  protected not = signal('');
  protected onizleme = signal<SafeHtml | null>(null);
  protected onizlendi = signal(false);

  protected yeniBaslik = signal('');
  protected yeniSlug = signal('');

  protected belgeler = signal<AdminDocument[]>([]);
  protected surumler = signal<Revision[]>([]);
  protected yukleniyor = signal(false);

  ngOnInit(): void {
    const s = this.sayfa();
    this.yeniBaslik.set(s.baslik);
    this.yeniSlug.set(s.slug);
    // Liste görünümünde içerik gelmediği için sayfa ayrıca okunur
    this.api.sayfaTam(s.dil, s.slug).subscribe((tam) => this.metin.set(tam?.icerikHtml ?? ''));
  }

  /** 2026-07-21T20:54:59Z -> 21.07.2026 20:54 */
  protected zamanBicimi(z: string): string {
    const t = new Date(z);
    if (isNaN(t.getTime())) return z;
    const ik = (n: number) => String(n).padStart(2, "0");
    return ik(t.getDate()) + "." + ik(t.getMonth() + 1) + "." + t.getFullYear() +
           " " + ik(t.getHours()) + ":" + ik(t.getMinutes());
  }

  private bildir(m: string): void {
    this.mesaj.set(m);
    setTimeout(() => this.mesaj.set(''), 4000);
  }

  /* ---------- metin ---------- */

  protected onizle(): void {
    this.onizleme.set(this.temizleyici.bypassSecurityTrustHtml(this.metin()));
    this.onizlendi.set(true);
  }

  protected yayinla(): void {
    this.api.icerikKaydet(this.sayfa().id, {
      baslik: this.yeniBaslik(),
      icerikHtml: this.metin(),
      aciklama: this.not() || 'Panelden düzenlendi'
    }).subscribe({
      next: () => {
        this.onizlendi.set(false);
        this.not.set('');
        this.bildir('Page yayınlandı. Önceki hâli sürüm geçmişinde.');
        this.degisti.emit();
      },
      error: () => this.bildir('Kaydedilemedi.')
    });
  }

  /* ---------- adres ---------- */

  protected adresKaydet(): void {
    this.api.adresDegistir(this.sayfa().id, { slug: this.yeniSlug(), baslik: this.yeniBaslik() }).subscribe({
      next: () => { this.bildir('Kaydedildi. Eski adres yenisine yönlendiriliyor.'); this.degisti.emit(); },
      error: (e) => this.bildir(typeof e?.error === 'string' ? e.error : 'Kaydedilemedi.')
    });
  }

  protected sayfaSil(): void {
    if (!confirm(`"${this.sayfa().baslik}" sayfası silinecek. Emin misiniz?`)) return;
    this.api.sayfaSil(this.sayfa().id).subscribe({
      next: () => { this.bildir('Page silindi.'); this.degisti.emit(); this.kapat.emit(); },
      error: () => this.bildir('Silinemedi.')
    });
  }

  /* ---------- belgeler ---------- */

  protected belgeBolumu(): void {
    this.bolum.set('belge');
    this.api.belgeler(this.sayfa().id).subscribe((l) => this.belgeler.set(l));
  }

  protected belgeAlan(b: AdminDocument, alan: keyof AdminDocument, deger: unknown): void {
    this.belgeler.update((l) => l.map((x) => (x === b ? { ...x, [alan]: deger } as AdminDocument : x)));
  }

  protected belgeEkle(): void {
    this.belgeler.update((l) => [...l, { id: null, ad: '', adres: '', sira: l.length }]);
  }

  protected belgeKaydet(b: AdminDocument): void {
    this.api.belgeKaydet(this.sayfa().id, b).subscribe({
      next: () => { this.bildir('Document kaydedildi.'); this.belgeBolumu(); },
      error: () => this.bildir('Kaydedilemedi.')
    });
  }

  protected belgeSil(b: AdminDocument): void {
    if (!b.id) { this.belgeler.update((l) => l.filter((x) => x !== b)); return; }
    this.api.belgeSil(b.id).subscribe({
      next: () => { this.belgeler.update((l) => l.filter((x) => x !== b)); this.bildir('Document silindi.'); },
      error: () => this.bildir('Silinemedi.')
    });
  }

  protected dosyaSec(olay: Event): void {
    const girdi = olay.target as HTMLInputElement;
    const dosya = girdi.files?.[0];
    if (!dosya) return;
    this.yukleniyor.set(true);
    this.api.dosyaYukle(dosya).subscribe({
      next: (s) => {
        this.yukleniyor.set(false);
        girdi.value = '';
        // Yüklenen dosya doğrudan belge satırı olarak eklenir
        this.belgeler.update((l) => [...l, { id: null, ad: dosya.name, adres: s.adres, sira: l.length }]);
        this.bildir('Yüklendi: ' + s.adres + ' — satırı kaydetmeyi unutmayın.');
      },
      error: (e) => {
        this.yukleniyor.set(false);
        this.bildir(typeof e?.error === 'string' ? e.error : 'Yüklenemedi.');
      }
    });
  }

  /* ---------- sürümler ---------- */

  protected surumBolumu(): void {
    this.bolum.set('surum');
    this.api.surumler(this.sayfa().id).subscribe((l) => this.surumler.set(l));
  }

  protected geriAl(s: Revision): void {
    if (!confirm('Page bu sürüme döndürülecek. Mevcut hâli yine de saklanacak. Devam edilsin mi?')) return;
    this.api.geriAl(this.sayfa().id, s.id).subscribe({
      next: () => {
        this.bildir('Page bu sürüme döndürüldü.');
        this.api.sayfaTam(this.sayfa().dil, this.sayfa().slug)
          .subscribe((tam) => this.metin.set(tam?.icerikHtml ?? ''));
        this.surumBolumu();
        this.degisti.emit();
      },
      error: () => this.bildir('Geri alınamadı.')
    });
  }
}
