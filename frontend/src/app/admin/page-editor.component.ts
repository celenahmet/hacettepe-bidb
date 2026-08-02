import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AdminDocument, AdminPage, Revision, AdminApiService } from './admin-api.service';
import { disaBaglantilariGuvenceyeAl } from '../core/icerik-bicim';

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
        <h2>{{ sayfa().title }}</h2>
        <code>/{{ sayfa().language }}/{{ sayfa().slug }}</code>
        <button type="button" class="ikincil" (click)="kapat.emit()">Kapat</button>
      </header>

      <nav class="sekmeler ic">
        <button type="button" [class.etkin]="bolum() === 'metin'" (click)="bolum.set('metin')">Metin</button>
        <button type="button" [class.etkin]="bolum() === 'url'" (click)="bolum.set('url')">Başlık ve url</button>
        <button type="button" [class.etkin]="bolum() === 'belge'" (click)="belgeBolumu()">Belgeler</button>
        <button type="button" [class.etkin]="bolum() === 'revision'" (click)="surumBolumu()">Sürüm geçmişi</button>
      </nav>

      @if (mesaj()) { <p class="bilgi" role="status">{{ mesaj() }}</p> }

      @if (bolum() === 'metin') {
        <p class="aciklama">
          Metin HTML olarak saklanır. Yayınlamadan önce önizleyin.
          Her kayıtta önceki hâl sürüm geçmişine eklenir.
        </p>

        @if (metinOkunamadi()) {
          <p class="bilgi uyari" role="alert">
            Sayfa metni sunucudan okunamadı. Aşağıdaki kutu bu sayfanın içeriği DEĞİL.
            Yayınlama, içeriğin boşla ezilmemesi için kapatıldı.
          </p>
        }

        <label for="metin">Sayfa metni</label>
        <textarea id="metin" name="metin" rows="18" class="kod"
                  [ngModel]="metin()" (ngModelChange)="metin.set($event)"></textarea>

        <label for="not">Değişiklik notu (sürüm geçmişinde görünür)</label>
        <input id="not" name="not" [ngModel]="not()" (ngModelChange)="not.set($event)"
               placeholder="örn. telefon numarası güncellendi">

        <span class="dugmeler">
          <button type="button" class="ikincil" (click)="onizle()"
                  [disabled]="metinOkunamadi()">Önizle</button>
          <button type="button" (click)="yayinla()"
                  [disabled]="!onizlendi() || metinOkunamadi()">Yayınla</button>
          @if (!onizlendi() && !metinOkunamadi()) { <small>Yayınlamak için önce önizleyin.</small> }
        </span>

        @if (onizleme(); as o) {
          <section class="onizleme">
            <h3>Önizleme</h3>
            <div class="icerik" [innerHTML]="o"></div>
          </section>
        }
      } @else if (bolum() === 'url') {
        <label for="sbaslik2">Sayfa başlığı</label>
        <input id="sbaslik2" name="sbaslik2" [ngModel]="yeniBaslik()" (ngModelChange)="yeniBaslik.set($event)">

        <label for="sslug">Adres</label>
        <input id="sslug" name="sslug" [ngModel]="yeniSlug()" (ngModelChange)="yeniSlug.set($event)">
        <p class="aciklama">
          Yeni url: <code>/{{ sayfa().language }}/{{ yeniSlug() }}</code><br>
          Adresi değiştirirseniz eski url yenisine yönlendirilir; dışarıdan
          verilmiş bağlantılar çalışmaya devam eder.
        </p>

        <span class="dugmeler">
          <button type="button" (click)="adresKaydet()">Kaydet</button>
          <button type="button" class="tehlike" (click)="deletePage()">Sayfayı sil</button>
        </span>
      } @else if (bolum() === 'belge') {
        <p class="aciklama">Sayfanın altında listelenen documents.</p>

        <div class="yukleme">
          <label for="dosya">Yeni dosya yükle (PDF, Word, Excel, görsel — en fazla 25 MB)</label>
          <input id="dosya" type="file" (change)="dosyaSec($event)">
          @if (yukleniyor()) { <small>Yükleniyor…</small> }
        </div>

        <div class="tablo-kaydir">

          <table class="yonetim-tablo">
            <thead><tr><th>Sıra</th><th>Ad</th><th>Adres</th><th></th></tr></thead>
            <tbody>
              @for (b of documents(); track b.id) {
                <tr>
                  <td><input type="number" [ngModel]="b.sortOrder" (ngModelChange)="belgeAlan(b, 'sortOrder', +$event)" class="dar"></td>
                  <td><input [ngModel]="b.name" (ngModelChange)="belgeAlan(b, 'name', $event)"></td>
                  <td><input [ngModel]="b.url" (ngModelChange)="belgeAlan(b, 'url', $event)"></td>
                  <td>
                    <button type="button" class="ikincil" (click)="saveDocument(b)">Kaydet</button>
                    <button type="button" class="tehlike" (click)="deleteDocument(b)">Sil</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>

        </div>

        <button type="button" (click)="belgeEkle()">Belge satırı ekle</button>
      } @else {
        <p class="aciklama">
          En üstteki en yeni kayıttır. Bir sürüme dönmeden önce mevcut hâl de
          saklanır, yani geri alma işlemi de geri alınabilir.
        </p>

        <div class="tablo-kaydir">

          <table class="yonetim-tablo">
            <thead><tr><th>Tarih</th><th>Açıklama</th><th>Kaydeden</th><th>Uzunluk</th><th></th></tr></thead>
            <tbody>
              @for (s of revisions(); track s.id) {
                <tr>
                  <td><small>{{ zamanBicimi(s.savedAt) }}</small></td>
                  <td>{{ s.note || '—' }}</td>
                  <td>{{ s.savedBy }}</td>
                  <td>{{ s.length }} krkt</td>
                  <td><button type="button" class="ikincil" (click)="restoreRevision(s)">Bu sürüme dön</button></td>
                </tr>
              }
            </tbody>
          </table>

        </div>
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

  protected bolum = signal<'metin' | 'url' | 'belge' | 'revision'>('metin');
  protected mesaj = signal('');

  protected metin = signal('');
  /* Sayfa metni okunamadıysa yayınlama KAPATILIR — bkz. ngOnInit */
  protected metinOkunamadi = signal(false);
  protected not = signal('');
  protected onizleme = signal<SafeHtml | null>(null);
  protected onizlendi = signal(false);

  protected yeniBaslik = signal('');
  protected yeniSlug = signal('');

  protected documents = signal<AdminDocument[]>([]);
  protected revisions = signal<Revision[]>([]);
  protected yukleniyor = signal(false);

  ngOnInit(): void {
    const s = this.sayfa();
    this.yeniBaslik.set(s.title);
    this.yeniSlug.set(s.slug);
    /* Liste görünümünde içerik gelmediği için sayfa ayrıca okunur.

       Bu çağrı başarısız olursa metin kutusu BOŞ kalır — sayfanın gerçekten
       içeriği yokmuş gibi görünür. Yayınla denirse boş metin kaydedilir ve
       sayfanın tüm içeriği silinir. Bu yüzden hata yalnızca bildirilmiyor,
       yayınlama da kapatılıyor: kullanıcının okumadığı bir uyarı, içeriği
       kurtarmaya yetmez. */
    this.api.fullPage(s.language, s.slug).subscribe({
      next: (tam) => this.metin.set(tam?.contentHtml ?? ''),
      error: () => {
        this.metinOkunamadi.set(true);
        this.bildir('Sayfa metni okunamadı. Yayınlama kapatıldı; düzenlemeyi kapatıp yeniden açın.');
      }
    });
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
    this.onizleme.set(this.temizleyici.bypassSecurityTrustHtml(disaBaglantilariGuvenceyeAl(this.metin())));
    this.onizlendi.set(true);
  }

  protected yayinla(): void {
    // Düğme zaten kapalı; buradaki kontrol, metin okunamamışken hiçbir yoldan
    // boş içerik kaydedilememesi içindir.
    if (this.metinOkunamadi()) return;
    this.api.saveContent(this.sayfa().id, {
      title: this.yeniBaslik(),
      contentHtml: this.metin(),
      note: this.not() || 'Panelden düzenlendi'
    }).subscribe({
      next: () => {
        this.onizlendi.set(false);
        this.not.set('');
        this.bildir('Sayfa yayınlandı. Önceki hâli sürüm geçmişinde.');
        this.degisti.emit();
      },
      error: () => this.bildir('Kaydedilemedi.')
    });
  }

  /* ---------- url ---------- */

  protected adresKaydet(): void {
    this.api.changeAddress(this.sayfa().id, { slug: this.yeniSlug(), title: this.yeniBaslik() }).subscribe({
      next: () => { this.bildir('Kaydedildi. Eski url yenisine yönlendiriliyor.'); this.degisti.emit(); },
      error: (e) => this.bildir(typeof e?.error === 'string' ? e.error : 'Kaydedilemedi.')
    });
  }

  protected deletePage(): void {
    if (!confirm(`"${this.sayfa().title}" sayfası silinecek. Emin misiniz?`)) return;
    this.api.deletePage(this.sayfa().id).subscribe({
      next: () => { this.bildir('Sayfa silindi.'); this.degisti.emit(); this.kapat.emit(); },
      error: () => this.bildir('Silinemedi.')
    });
  }

  /* ---------- documents ---------- */

  protected belgeBolumu(): void {
    this.bolum.set('belge');
    /* Liste önce boşaltılır: aksi hâlde yeniden yükleme başarısız olduğunda
       bir önceki okumanın belgeleri ekranda kalır ve güncel sanılır. */
    this.documents.set([]);
    this.api.documents(this.sayfa().id).subscribe({
      next: (l) => this.documents.set(l),
      error: () => this.bildir('Belge listesi alınamadı. Liste eksik görünüyor olabilir.')
    });
  }

  protected belgeAlan(b: AdminDocument, alan: keyof AdminDocument, value: unknown): void {
    this.documents.update((l) => l.map((x) => (x === b ? { ...x, [alan]: value } as AdminDocument : x)));
  }

  protected belgeEkle(): void {
    this.documents.update((l) => [...l, { id: null, name: '', url: '', sortOrder: l.length }]);
  }

  protected saveDocument(b: AdminDocument): void {
    this.api.saveDocument(this.sayfa().id, b).subscribe({
      next: () => { this.bildir('Belge kaydedildi.'); this.belgeBolumu(); },
      error: () => this.bildir('Kaydedilemedi.')
    });
  }

  protected deleteDocument(b: AdminDocument): void {
    if (!b.id) { this.documents.update((l) => l.filter((x) => x !== b)); return; }
    if (!confirm(`"${b.name}" belgesi silinecek. Onaylıyor musunuz?`)) return;
    this.api.deleteDocument(b.id).subscribe({
      next: () => { this.documents.update((l) => l.filter((x) => x !== b)); this.bildir('Belge silindi.'); },
      error: () => this.bildir('Silinemedi.')
    });
  }

  protected dosyaSec(olay: Event): void {
    const girdi = olay.target as HTMLInputElement;
    const dosya = girdi.files?.[0];
    if (!dosya) return;
    this.yukleniyor.set(true);
    this.api.uploadFile(dosya).subscribe({
      next: (s) => {
        this.yukleniyor.set(false);
        girdi.value = '';
        // Yüklenen dosya doğrudan belge satırı olarak eklenir
        this.documents.update((l) => [...l, { id: null, name: dosya.name, url: s.url, sortOrder: l.length }]);
        this.bildir('Yüklendi: ' + s.url + ' — satırı kaydetmeyi unutmayın.');
      },
      error: (e) => {
        this.yukleniyor.set(false);
        this.bildir(typeof e?.error === 'string' ? e.error : 'Yüklenemedi.');
      }
    });
  }

  /* ---------- sürümler ---------- */

  protected surumBolumu(): void {
    this.bolum.set('revision');
    this.api.revisions(this.sayfa().id).subscribe((l) => this.revisions.set(l));
  }

  protected restoreRevision(s: Revision): void {
    if (!confirm('Sayfa bu sürüme döndürülecek. Mevcut hâli yine de saklanacak. Devam edilsin mi?')) return;
    this.api.restoreRevision(this.sayfa().id, s.id).subscribe({
      next: () => {
        this.bildir('Sayfa bu sürüme döndürüldü.');
        this.api.fullPage(this.sayfa().language, this.sayfa().slug)
          .subscribe((tam) => this.metin.set(tam?.contentHtml ?? ''));
        this.surumBolumu();
        this.degisti.emit();
      },
      error: () => this.bildir('Geri alınamadı.')
    });
  }
}
