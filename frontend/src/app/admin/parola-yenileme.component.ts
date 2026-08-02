import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';

/**
 * Yönetim paneli parola yenileme ekranı.
 *
 * İki kipte çalışır:
 *   1. Adres verilmediyse (jeton yok): yenileme talebi alınır.
 *   2. Adreste jeton varsa: yeni parola belirlenir.
 *
 * Talep kipinde yanıt HER ZAMAN aynıdır — adres kayıtlı olsun ya da
 * olmasın. Farklı bir metin göstermek, bir adresin sistemde kayıtlı olup
 * olmadığını ele verirdi (adres saymağı). Sunucu da aynı gövdeyi döndürür;
 * buradaki metin onun karşılığıdır.
 */
@Component({
  selector: 'bidb-parola-yenileme',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="yonetim">
      <div class="giris-duzen">
        <div class="giris-kutu">
          <header class="giris-marka">
            <img src="/hu-logo.svg" alt="" aria-hidden="true" width="40" height="45">
            <span class="kurum">HACETTEPE ÜNİVERSİTESİ</span>
            <strong>Bilgi İşlem<br>Daire Başkanlığı</strong>
          </header>

          <div class="giris-alan">
            <h1>Parola Yenileme</h1>

            @if (sonuc()) {
              <p class="bilgi" role="status">{{ sonuc() }}</p>
              <span class="dugmeler">
                <a class="ikincil" routerLink="/yonetim">Giriş ekranına dön</a>
              </span>
            } @else if (jeton()) {
              <!-- 2. kip: yeni parola belirleme -->
              @if (jetonGecerli() === false) {
                <p class="hata" role="alert">
                  Bu bağlantı geçersiz ya da süresi dolmuş. Parola yenileme bağlantıları
                  otuz dakika süreyle ve yalnızca bir kez geçerlidir.
                </p>
                <span class="dugmeler">
                  <a class="ikincil" routerLink="/yonetim/parola-yenileme">Yeniden talep oluştur</a>
                </span>
              } @else if (jetonGecerli() === true) {
                <p class="aciklama">
                  Lütfen yeni parolanızı belirleyiniz. Parolanız en az {{ ASGARI }} karakter
                  uzunluğunda olmalı ve kullanıcı adınızdan farklı olmalıdır.
                </p>
                <form (ngSubmit)="tamamla()" novalidate>
                  <label for="yeniParola">Yeni parola</label>
                  <input id="yeniParola" name="yeniParola" type="password" autocomplete="new-password"
                         [ngModel]="parola()" (ngModelChange)="parola.set($event)" maxlength="200">

                  <label for="parolaTekrar">Yeni parola (tekrar)</label>
                  <input id="parolaTekrar" name="parolaTekrar" type="password" autocomplete="new-password"
                         [ngModel]="parolaTekrar()" (ngModelChange)="parolaTekrar.set($event)" maxlength="200">

                  @if (hata()) { <p class="hata" role="alert">{{ hata() }}</p> }

                  <span class="dugmeler">
                    <button type="submit" [disabled]="calisiyor()">
                      {{ calisiyor() ? 'Kaydediliyor…' : 'Parolayı güncelle' }}
                    </button>
                  </span>
                </form>
              } @else {
                <p class="aciklama" role="status">Bağlantı denetleniyor…</p>
              }
            } @else {
              <!-- 1. kip: talep -->
              <p class="aciklama">
                Yönetim paneli hesabınıza tanımlı e-posta adresini giriniz. Adres
                kayıtlıysa parola yenileme yönergesi bu adrese gönderilecektir.
              </p>
              <form (ngSubmit)="iste()" novalidate>
                <label for="eposta">E-posta adresi</label>
                <input id="eposta" name="eposta" type="email" autocomplete="email"
                       [ngModel]="eposta()" (ngModelChange)="eposta.set($event)" maxlength="254">

                @if (hata()) { <p class="hata" role="alert">{{ hata() }}</p> }

                <span class="dugmeler">
                  <button type="submit" [disabled]="calisiyor()">
                    {{ calisiyor() ? 'Gönderiliyor…' : 'Yenileme yönergesi gönder' }}
                  </button>
                  <a class="ikincil" routerLink="/yonetim">Vazgeç</a>
                </span>
              </form>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class ParolaYenilemeComponent implements OnInit {
  /** Sunucudaki kuralla aynı; metinde kullanılır. */
  protected readonly ASGARI = 12;

  private http = inject(HttpClient);
  private rota = inject(ActivatedRoute);

  protected jeton = signal<string>('');
  /** null: henüz denetlenmedi. */
  protected jetonGecerli = signal<boolean | null>(null);
  protected eposta = signal('');
  protected parola = signal('');
  protected parolaTekrar = signal('');
  protected hata = signal('');
  protected sonuc = signal('');
  protected calisiyor = signal(false);

  ngOnInit(): void {
    const j = this.rota.snapshot.queryParamMap.get('jeton') ?? '';
    this.jeton.set(j);
    if (!j) return;

    /* Jeton önce denetlenir: süresi dolmuş bir bağlantıda kullanıcıya boş
       yere parola yazdırmamak için. Denetim ucu yalnızca geçerli/geçersiz
       döner, başka bilgi vermez. */
    this.http.get<{ valid: boolean }>(
      '/api/admin/password-reset/validate?token=' + encodeURIComponent(j)
    ).subscribe({
      next: (y) => this.jetonGecerli.set(y.valid),
      error: () => this.jetonGecerli.set(false)
    });
  }

  protected iste(): void {
    if (this.calisiyor()) return;
    const adres = this.eposta().trim();
    if (!adres) {
      this.hata.set('Lütfen e-posta adresinizi giriniz.');
      return;
    }
    this.calisiyor.set(true);
    this.hata.set('');
    this.http.post<{ message: string }>('/api/admin/password-reset/request', { email: adres })
      .subscribe({
        next: (y) => { this.calisiyor.set(false); this.sonuc.set(y.message); },
        error: () => {
          this.calisiyor.set(false);
          this.hata.set('Talep şu anda alınamadı. Lütfen bir süre sonra yeniden deneyiniz.');
        }
      });
  }

  protected tamamla(): void {
    if (this.calisiyor()) return;
    if (this.parola() !== this.parolaTekrar()) {
      this.hata.set('Girilen parolalar birbiriyle uyuşmuyor.');
      return;
    }
    if (this.parola().length < this.ASGARI) {
      // Sunucu da denetler; burada erken uyarmak boş bir tur atmayı önler.
      this.hata.set(`Parola en az ${this.ASGARI} karakter olmalıdır.`);
      return;
    }
    this.calisiyor.set(true);
    this.hata.set('');
    this.http.post<{ message: string }>('/api/admin/password-reset/confirm',
      { token: this.jeton(), password: this.parola() })
      .subscribe({
        next: (y) => { this.calisiyor.set(false); this.sonuc.set(y.message); },
        error: (e) => {
          this.calisiyor.set(false);
          this.hata.set(e?.error?.message
            ?? 'Parola güncellenemedi. Bağlantı geçersiz ya da süresi dolmuş olabilir.');
        }
      });
  }
}
