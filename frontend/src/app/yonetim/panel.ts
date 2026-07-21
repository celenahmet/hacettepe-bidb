import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DuyuruYonetim, Kisayol, MenuOgeYonetim, MenuYonetim, SayfaYonetim, Slayt, YonetimApi } from './yonetim-api';

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
          <button type="button" [class.etkin]="sekme() === 'slider'" (click)="sekmeSlider()">
            Slider ({{ slaytlar().length }})
          </button>
          <button type="button" [class.etkin]="sekme() === 'kisayollar'" (click)="sekmeKisayol()">
            Kısayollar ({{ kisayollar().length }})
          </button>
          <button type="button" [class.etkin]="sekme() === 'menuler'" (click)="sekmeMenu()">
            Menüler ({{ menuler().length }})
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
        } @else if (sekme() === 'duyurular') {
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
        } @else if (sekme() === 'slider') {
          <button type="button" (click)="slaytDuzenle(null)">Yeni slayt</button>

          @if (slayt(); as sl) {
            <form class="duyuru-form" (ngSubmit)="slaytKaydet()">
              <h2>{{ sl.id ? 'Slaytı düzenle' : 'Yeni slayt' }}</h2>
              <label for="sbaslik">Başlık</label>
              <input id="sbaslik" name="sbaslik" [ngModel]="sl.baslik" (ngModelChange)="slaytAlan('baslik', $event)">
              <label for="sgorsel">Görsel adresi</label>
              <input id="sgorsel" name="sgorsel" [ngModel]="sl.gorselUrl" (ngModelChange)="slaytAlan('gorselUrl', $event)" required>
              <label for="salt">Görsel açıklaması (erişilebilirlik)</label>
              <input id="salt" name="salt" [ngModel]="sl.gorselAlt" (ngModelChange)="slaytAlan('gorselAlt', $event)">
              <label for="ssira">Sıra</label>
              <input id="ssira" name="ssira" type="number" [ngModel]="sl.sira" (ngModelChange)="slaytAlan('sira', +$event)">
              <span class="dugmeler">
                <button type="submit">Kaydet</button>
                <button type="button" class="ikincil" (click)="slayt.set(null)">Vazgeç</button>
              </span>
            </form>
          }

          <table class="yonetim-tablo">
            <thead><tr><th>Sıra</th><th>Başlık</th><th>Görsel</th><th>Dil</th><th></th></tr></thead>
            <tbody>
              @for (sl of slaytlar(); track sl.id) {
                <tr>
                  <td>{{ sl.sira }}</td>
                  <td>{{ sl.baslik }}</td>
                  <td><small>{{ sl.gorselUrl }}</small></td>
                  <td>{{ sl.dil }}</td>
                  <td>
                    <button type="button" class="ikincil" (click)="slaytDuzenle(sl)">Düzenle</button>
                    <button type="button" class="tehlike" (click)="slaytSil(sl)">Sil</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        } @else if (sekme() === 'menuler') {
          @if (menuOge(); as md) {
            <form class="duyuru-form" (ngSubmit)="ogeKaydet()">
              <h2>{{ md.oge.id ? 'Bağlantıyı düzenle' : 'Yeni bağlantı' }}</h2>
              <label for="metiket">Etiket</label>
              <input id="metiket" name="metiket" [ngModel]="md.oge.etiket" (ngModelChange)="ogeAlan('etiket', $event)" required>

              <label for="msayfa">Sayfa (iç bağlantı)</label>
              <select id="msayfa" name="msayfa" [ngModel]="md.oge.sayfaId" (ngModelChange)="ogeAlan('sayfaId', $event ? +$event : null)">
                <option [value]="null">— dış bağlantı kullan —</option>
                @for (sf of sayfalar(); track sf.id) {
                  <option [value]="sf.id">{{ sf.dil }}/{{ sf.slug }} — {{ sf.baslik }}</option>
                }
              </select>

              <label for="mdis">Dış adres (sayfa seçilmediyse)</label>
              <input id="mdis" name="mdis" [ngModel]="md.oge.disAdres" (ngModelChange)="ogeAlan('disAdres', $event)">

              <label for="msira">Sıra</label>
              <input id="msira" name="msira" type="number" [ngModel]="md.oge.sira" (ngModelChange)="ogeAlan('sira', +$event)">

              <label class="onay">
                <input type="checkbox" name="myeni" [ngModel]="md.oge.yeniSekme" (ngModelChange)="ogeAlan('yeniSekme', $event)"> Yeni sekmede açılsın
              </label>

              <span class="dugmeler">
                <button type="submit">Kaydet</button>
                <button type="button" class="ikincil" (click)="menuOge.set(null)">Vazgeç</button>
              </span>
            </form>
          }

          @for (m of menuler(); track m.id) {
            <section class="menu-bolum">
              <h2>{{ m.baslik }} <small>({{ m.dil }})</small></h2>
              <button type="button" class="ikincil" (click)="ogeDuzenle(m.id, null)">Bağlantı ekle</button>
              <table class="yonetim-tablo">
                <thead><tr><th>Sıra</th><th>Etiket</th><th>Hedef</th><th></th></tr></thead>
                <tbody>
                  @for (o of m.ogeler; track o.id) {
                    <tr>
                      <td>{{ o.sira }}</td>
                      <td>{{ o.etiket }}</td>
                      <td><small>{{ o.sayfaYolu || o.disAdres }}</small></td>
                      <td>
                        <button type="button" class="ikincil" (click)="ogeDuzenle(m.id, o)">Düzenle</button>
                        <button type="button" class="tehlike" (click)="ogeSil(o)">Sil</button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </section>
          }
        } @else {
          <button type="button" (click)="kisayolDuzenle(null)">Yeni kısayol</button>

          @if (kisayol(); as ks) {
            <form class="duyuru-form" (ngSubmit)="kisayolKaydet()">
              <h2>{{ ks.id ? 'Kısayolu düzenle' : 'Yeni kısayol' }}</h2>
              <label for="kad">Ad</label>
              <input id="kad" name="kad" [ngModel]="ks.ad" (ngModelChange)="kisayolAlan('ad', $event)" required>
              <label for="kadres">Adres</label>
              <input id="kadres" name="kadres" [ngModel]="ks.adres" (ngModelChange)="kisayolAlan('adres', $event)" required>
              <label for="kikon">İkon adresi</label>
              <input id="kikon" name="kikon" [ngModel]="ks.ikonUrl" (ngModelChange)="kisayolAlan('ikonUrl', $event)">
              <label for="ksira">Sıra (100 ve üzeri servis karuselinde görünür)</label>
              <input id="ksira" name="ksira" type="number" [ngModel]="ks.sira" (ngModelChange)="kisayolAlan('sira', +$event)">
              <label class="onay">
                <input type="checkbox" name="kyeni" [ngModel]="ks.yeniSekme" (ngModelChange)="kisayolAlan('yeniSekme', $event)"> Yeni sekmede açılsın
              </label>
              <span class="dugmeler">
                <button type="submit">Kaydet</button>
                <button type="button" class="ikincil" (click)="kisayol.set(null)">Vazgeç</button>
              </span>
            </form>
          }

          <table class="yonetim-tablo">
            <thead><tr><th>Sıra</th><th>Ad</th><th>Adres</th><th>Dil</th><th></th></tr></thead>
            <tbody>
              @for (ks of kisayollar(); track ks.id) {
                <tr>
                  <td>{{ ks.sira }}</td>
                  <td>{{ ks.ad }}</td>
                  <td><small>{{ ks.adres }}</small></td>
                  <td>{{ ks.dil }}</td>
                  <td>
                    <button type="button" class="ikincil" (click)="kisayolDuzenle(ks)">Düzenle</button>
                    <button type="button" class="tehlike" (click)="kisayolSil(ks)">Sil</button>
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

  protected sekme = signal<'sayfalar' | 'duyurular' | 'slider' | 'kisayollar' | 'menuler'>('sayfalar');
  protected sayfalar = signal<SayfaYonetim[]>([]);
  protected duyurular = signal<DuyuruYonetim[]>([]);
  protected secili = signal<SayfaYonetim | null>(null);
  protected duyuru = signal<DuyuruYonetim>(this.bosDuyuru());
  protected slaytlar = signal<Slayt[]>([]);
  protected kisayollar = signal<Kisayol[]>([]);
  protected slayt = signal<Slayt | null>(null);
  protected kisayol = signal<Kisayol | null>(null);
  protected menuler = signal<MenuYonetim[]>([]);
  protected menuOge = signal<{ menuId: number; oge: MenuOgeYonetim } | null>(null);

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

  protected sekmeSlider(): void {
    this.sekme.set('slider');
    this.api.slaytlar().subscribe((l) => this.slaytlar.set(l));
  }

  protected sekmeKisayol(): void {
    this.sekme.set('kisayollar');
    this.api.kisayollar().subscribe((l) => this.kisayollar.set(l));
  }

  protected slaytDuzenle(s: Slayt | null): void {
    this.slayt.set(s ? { ...s } : { id: null, dil: 'tr', baslik: '', altBaslik: '', gorselUrl: '', gorselAlt: '', baglanti: null, sira: 0, yayinda: true });
  }

  protected slaytAlan(alan: keyof Slayt, deger: unknown): void {
    const s = this.slayt();
    if (s) this.slayt.set({ ...s, [alan]: deger } as Slayt);
  }

  protected slaytKaydet(): void {
    const s = this.slayt();
    if (!s) return;
    this.api.slaytKaydet(s).subscribe({
      next: () => { this.slayt.set(null); this.sekmeSlider(); this.mesaj('Slayt kaydedildi.'); },
      error: () => this.mesaj('Slayt kaydedilemedi.')
    });
  }

  protected slaytSil(s: Slayt): void {
    if (!s.id) return;
    this.api.slaytSil(s.id).subscribe({
      next: () => { this.slaytlar.update((l) => l.filter((x) => x.id !== s.id)); this.mesaj('Slayt silindi.'); },
      error: () => this.mesaj('Silinemedi.')
    });
  }

  protected kisayolDuzenle(k: Kisayol | null): void {
    this.kisayol.set(k ? { ...k } : { id: null, dil: 'tr', ad: '', ikonUrl: '', adres: '', yeniSekme: false, sira: 0, yayinda: true });
  }

  protected kisayolAlan(alan: keyof Kisayol, deger: unknown): void {
    const k = this.kisayol();
    if (k) this.kisayol.set({ ...k, [alan]: deger } as Kisayol);
  }

  protected kisayolKaydet(): void {
    const k = this.kisayol();
    if (!k) return;
    this.api.kisayolKaydet(k).subscribe({
      next: () => { this.kisayol.set(null); this.sekmeKisayol(); this.mesaj('Kısayol kaydedildi.'); },
      error: () => this.mesaj('Kısayol kaydedilemedi.')
    });
  }

  protected kisayolSil(k: Kisayol): void {
    if (!k.id) return;
    this.api.kisayolSil(k.id).subscribe({
      next: () => { this.kisayollar.update((l) => l.filter((x) => x.id !== k.id)); this.mesaj('Kısayol silindi.'); },
      error: () => this.mesaj('Silinemedi.')
    });
  }

  protected sekmeMenu(): void {
    this.sekme.set('menuler');
    this.api.menuler().subscribe((l) => this.menuler.set(l));
  }

  protected ogeDuzenle(menuId: number, o: MenuOgeYonetim | null): void {
    this.menuOge.set({
      menuId,
      oge: o ? { ...o } : { id: null, etiket: '', sayfaId: null, sayfaYolu: null, disAdres: '', yeniSekme: false, sira: 0 }
    });
  }

  protected ogeAlan(alan: keyof MenuOgeYonetim, deger: unknown): void {
    const d = this.menuOge();
    if (d) this.menuOge.set({ menuId: d.menuId, oge: { ...d.oge, [alan]: deger } as MenuOgeYonetim });
  }

  protected ogeKaydet(): void {
    const d = this.menuOge();
    if (!d) return;
    this.api.menuOgeKaydet(d.menuId, d.oge).subscribe({
      next: () => { this.menuOge.set(null); this.sekmeMenu(); this.mesaj('Menü bağlantısı kaydedildi.'); },
      error: () => this.mesaj('Kaydedilemedi.')
    });
  }

  protected ogeSil(o: MenuOgeYonetim): void {
    if (!o.id) return;
    this.api.menuOgeSil(o.id).subscribe({
      next: () => { this.sekmeMenu(); this.mesaj('Bağlantı silindi.'); },
      error: () => this.mesaj('Silinemedi.')
    });
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
