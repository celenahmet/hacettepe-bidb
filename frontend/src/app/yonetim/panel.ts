import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DuyuruYonetim, SayfaYonetim, YonetimApi } from './yonetim-api';

/** Yönetim paneli: giriş, sayfa SEO düzenleme ve duyuru yönetimi. */
@Component({
  selector: 'bidb-yonetim-panel',
  imports: [FormsModule],
  template: `
    <div class="kap yonetim">
      @if (!api.girisYapildi()) {
        <form class="giris" (ngSubmit)="giris()">
          <h1>Yönetim Girişi</h1>

          <label for="kullanici">Kullanıcı adı</label>
          <input id="kullanici" name="kullanici" [(ngModel)]="kullanici" autocomplete="username" required>

          <label for="parola">Parola</label>
          <input id="parola" name="parola" type="password" [(ngModel)]="parola" autocomplete="current-password" required>

          @if (hata()) { <p class="hata" role="alert">{{ hata() }}</p> }

          <button type="submit" [disabled]="calisiyor()">
            {{ calisiyor() ? 'Denetleniyor…' : 'Giriş Yap' }}
          </button>
        </form>
      } @else {
        <header class="yonetim-ust">
          <h1>Yönetim Paneli</h1>
          <button type="button" class="ikincil" (click)="api.cikis()">Çıkış</button>
        </header>

        <nav class="sekmeler">
          <button type="button" [class.etkin]="sekme() === 'sayfalar'" (click)="sekme.set('sayfalar')">
            Sayfalar ({{ sayfalar().length }})
          </button>
          <button type="button" [class.etkin]="sekme() === 'duyurular'" (click)="sekmeDuyuru()">
            Duyurular ({{ duyurular().length }})
          </button>
        </nav>

        @if (bilgi()) { <p class="bilgi" role="status">{{ bilgi() }}</p> }

        @if (sekme() === 'sayfalar') {
          <p class="aciklama">
            Sayfa metinleri kurumdan geldiği gibi korunur ve buradan değiştirilemez.
            Yalnızca arama motoru bilgileri ve yayın durumu düzenlenir.
          </p>

          <table class="yonetim-tablo">
            <thead>
              <tr><th>Sayfa</th><th>Dil</th><th>İçerik</th><th>Yayında</th><th></th></tr>
            </thead>
            <tbody>
              @for (s of sayfalar(); track s.id) {
                <tr>
                  <td>{{ s.baslik }}<br><small>/{{ s.dil }}/{{ s.slug }}</small></td>
                  <td>{{ s.dil }}</td>
                  <td>{{ s.icerikUzunlugu }} krkt</td>
                  <td>{{ s.yayinda ? 'Evet' : 'Hayır' }}</td>
                  <td><button type="button" class="ikincil" (click)="duzenle(s)">SEO düzenle</button></td>
                </tr>

                @if (secili()?.id === s.id) {
                  <tr class="duzenleme">
                    <td colspan="5">
                      <form (ngSubmit)="seoKaydet()">
                        <label [attr.for]="'t' + s.id">Başlık (title)</label>
                        <input [attr.id]="'t' + s.id" name="seoTitle" [ngModel]="secili()!.seoTitle"
                               (ngModelChange)="alanDegis('seoTitle', $event)">

                        <label [attr.for]="'d' + s.id">Açıklama (description)</label>
                        <textarea [attr.id]="'d' + s.id" name="seoDescription" rows="2"
                                  [ngModel]="secili()!.seoDescription"
                                  (ngModelChange)="alanDegis('seoDescription', $event)"></textarea>

                        <label [attr.for]="'k' + s.id">Anahtar kelimeler</label>
                        <input [attr.id]="'k' + s.id" name="seoKeywords" [ngModel]="secili()!.seoKeywords"
                               (ngModelChange)="alanDegis('seoKeywords', $event)">

                        <label class="onay">
                          <input type="checkbox" name="yayinda" [ngModel]="secili()!.yayinda"
                                 (ngModelChange)="alanDegis('yayinda', $event)"> Yayında
                        </label>

                        <span class="dugmeler">
                          <button type="submit">Kaydet</button>
                          <button type="button" class="ikincil" (click)="secili.set(null)">Vazgeç</button>
                        </span>
                      </form>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        } @else {
          <form class="duyuru-form" (ngSubmit)="duyuruKaydet()">
            <h2>{{ duyuru().id ? 'Duyuruyu düzenle' : 'Yeni duyuru' }}</h2>

            <label for="dbaslik">Başlık</label>
            <input id="dbaslik" name="baslik" [ngModel]="duyuru().baslik"
                   (ngModelChange)="duyuruAlan('baslik', $event)" required>

            <label for="dtarih">Yayın tarihi</label>
            <input id="dtarih" name="yayinTarihi" type="date" [ngModel]="duyuru().yayinTarihi"
                   (ngModelChange)="duyuruAlan('yayinTarihi', $event)" required>

            <label for="dadres">Bağlantı (belge veya sayfa adresi)</label>
            <input id="dadres" name="disAdres" [ngModel]="duyuru().disAdres"
                   (ngModelChange)="duyuruAlan('disAdres', $event)">

            <label for="ddil">Dil</label>
            <select id="ddil" name="dil" [ngModel]="duyuru().dil" (ngModelChange)="duyuruAlan('dil', $event)">
              <option value="tr">Türkçe</option>
              <option value="en">İngilizce</option>
            </select>

            <span class="dugmeler">
              <button type="submit">{{ duyuru().id ? 'Güncelle' : 'Ekle' }}</button>
              @if (duyuru().id) {
                <button type="button" class="ikincil" (click)="duyuruSifirla()">Vazgeç</button>
              }
            </span>
          </form>

          <table class="yonetim-tablo">
            <thead><tr><th>Tarih</th><th>Başlık</th><th>Dil</th><th></th></tr></thead>
            <tbody>
              @for (d of duyurular(); track d.id) {
                <tr>
                  <td>{{ d.yayinTarihi }}</td>
                  <td>{{ d.baslik }}</td>
                  <td>{{ d.dil }}</td>
                  <td>
                    <button type="button" class="ikincil" (click)="duyuruDuzenle(d)">Düzenle</button>
                    <button type="button" class="tehlike" (click)="duyuruSil(d)">Sil</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
      }
    </div>
  `
})
export class YonetimPanel {
  protected api = inject(YonetimApi);

  protected kullanici = '';
  protected parola = '';
  protected hata = signal('');
  protected bilgi = signal('');
  protected calisiyor = signal(false);

  protected sekme = signal<'sayfalar' | 'duyurular'>('sayfalar');
  protected sayfalar = signal<SayfaYonetim[]>([]);
  protected duyurular = signal<DuyuruYonetim[]>([]);
  protected secili = signal<SayfaYonetim | null>(null);
  protected duyuru = signal<DuyuruYonetim>(this.bosDuyuru());

  constructor() {
    if (this.api.girisYapildi()) this.sayfalariYukle();
  }

  protected giris(): void {
    this.hata.set('');
    this.calisiyor.set(true);
    this.api.girisDene(this.kullanici, this.parola).subscribe({
      next: (liste) => {
        this.api.girisOnayla();
        this.sayfalar.set(liste);
        this.calisiyor.set(false);
        this.parola = '';
      },
      error: () => {
        this.hata.set('Kullanıcı adı veya parola hatalı.');
        this.calisiyor.set(false);
      }
    });
  }

  protected duzenle(s: SayfaYonetim): void {
    this.secili.set(this.secili()?.id === s.id ? null : { ...s });
  }

  protected alanDegis(alan: keyof SayfaYonetim, deger: unknown): void {
    const s = this.secili();
    if (s) this.secili.set({ ...s, [alan]: deger } as SayfaYonetim);
  }

  protected duyuruAlan(alan: keyof DuyuruYonetim, deger: unknown): void {
    this.duyuru.set({ ...this.duyuru(), [alan]: deger } as DuyuruYonetim);
  }

  protected seoKaydet(): void {
    const s = this.secili();
    if (!s) return;
    this.api.seoKaydet(s.id, s).subscribe({
      next: (guncel) => {
        this.sayfalar.update((liste) => liste.map((x) => (x.id === guncel.id ? guncel : x)));
        this.secili.set(null);
        this.mesaj(guncel.baslik + ' güncellendi.');
      },
      error: () => this.mesaj('Kaydedilemedi.')
    });
  }

  protected sekmeDuyuru(): void {
    this.sekme.set('duyurular');
    this.api.duyurular().subscribe((d) => this.duyurular.set(d));
  }

  protected duyuruKaydet(): void {
    const d = this.duyuru();
    const istek = d.id ? this.api.duyuruGuncelle(d.id, d) : this.api.duyuruEkle(d);
    istek.subscribe({
      next: () => {
        this.duyuruSifirla();
        this.sekmeDuyuru();
        this.mesaj('Duyuru kaydedildi.');
      },
      error: () => this.mesaj('Duyuru kaydedilemedi.')
    });
  }

  protected duyuruSil(d: DuyuruYonetim): void {
    if (!d.id) return;
    this.api.duyuruSil(d.id).subscribe({
      next: () => {
        this.duyurular.update((liste) => liste.filter((x) => x.id !== d.id));
        this.mesaj('Duyuru silindi.');
      },
      error: () => this.mesaj('Silinemedi.')
    });
  }

  protected duyuruDuzenle(d: DuyuruYonetim): void {
    this.duyuru.set({ ...d });
  }

  protected duyuruSifirla(): void {
    this.duyuru.set(this.bosDuyuru());
  }

  private sayfalariYukle(): void {
    this.api.sayfalar().subscribe({
      next: (l) => this.sayfalar.set(l),
      error: () => this.api.cikis()
    });
  }

  private bosDuyuru(): DuyuruYonetim {
    return {
      id: null,
      dil: 'tr',
      baslik: '',
      ozet: null,
      yayinTarihi: new Date().toISOString().slice(0, 10),
      oneCikan: false,
      yayinda: true,
      disAdres: null
    };
  }

  private mesaj(m: string): void {
    this.bilgi.set(m);
    setTimeout(() => this.bilgi.set(''), 4000);
  }
}
