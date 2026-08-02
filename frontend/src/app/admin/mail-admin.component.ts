import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminAccountView, AdminApiService, MailLogEntry, MailSetting } from './admin-api.service';
import { AdminDilServisi } from './admin-dil.service';
import { tiklamaSinirlayici } from './tiklama-siniri';

/**
 * Kurumsal e-posta yapılandırması ve gönderim günlüğü.
 *
 * PAROLA ALANI YOKTUR ve bu bilinçlidir. Sunucu parolası yalnızca
 * BIDB_MAIL_PAROLA ortam değişkeninden okunur; panele gelen tek bilgi
 * "tanımlı mı?" ikilisidir. Panelde bir parola kutusu olsaydı değer
 * tarayıcı geçmişine, ara belleklere ve panel yanıtlarına düşerdi.
 */
@Component({
  selector: 'bidb-mail-admin',
  imports: [FormsModule],
  template: `
    <section class="kalite-bolum">
      <header>
        <div>
          <span class="bolum-no">{{ d.t('epostaKurumsal') }}</span>
          <h2>{{ d.t('epostaAyarBaslik') }}</h2>
          <p>
            {{ d.t('epostaAyarTanitim') }}
          </p>
        </div>
        <button type="button" class="ikincil" (click)="yukle()">{{ d.t('epostaYenile') }}</button>
      </header>

      @if (mesaj()) { <p class="bilgi" role="status">{{ mesaj() }}</p> }
      @if (hata()) { <p class="hata" role="alert">{{ hata() }}</p> }

      @if (ayar(); as a) {
        <!-- Durum satırı: yöneticinin neyin eksik olduğunu tahmin etmesi gerekmesin -->
        <p class="bilgi" [class.uyari]="!!a.blockingIssue" role="status">
          @if (a.blockingIssue) {
            {{ d.t('epostaKapali') }} {{ a.blockingIssue }}
          } @else {
            {{ d.t('epostaAcik') }} {{ a.fromAddress }}
          }
        </p>

        <form class="duyuru-form" (ngSubmit)="kaydet()" #f="ngForm" novalidate>
          <div class="iletisim-form-izgara dort">
            <label>
              <span>{{ d.t('epostaSunucu') }}</span>
              <input name="host" [ngModel]="taslak().host" (ngModelChange)="alan('host', $event)"
                     [placeholder]="d.t('epostaSunucuOrnek')" maxlength="200">
            </label>
            <label>
              <span>{{ d.t('epostaKapi') }}</span>
              <input name="port" type="number" min="1" max="65535"
                     [ngModel]="taslak().port" (ngModelChange)="alan('port', $event)">
            </label>
            <label>
              <span>{{ d.t('epostaKullanici') }}</span>
              <input name="username" [ngModel]="taslak().username"
                     (ngModelChange)="alan('username', $event)" maxlength="200"
                     autocomplete="off">
            </label>
            <label>
              <span>{{ d.t('epostaGuvenlik') }}</span>
              <select name="securityMode" [ngModel]="taslak().securityMode"
                      (ngModelChange)="alan('securityMode', $event)">
                <option value="STARTTLS">{{ d.t('epostaGuvenlikOnerilen') }}</option>
                <option value="SSL">SSL/TLS</option>
                <option value="NONE">{{ d.t('epostaGuvenlikSifresiz') }}</option>
              </select>
            </label>
            <label>
              <span>{{ d.t('epostaGonderenAdres') }}</span>
              <input name="fromAddress" type="email" [ngModel]="taslak().fromAddress"
                     (ngModelChange)="alan('fromAddress', $event)" maxlength="254"
                     [placeholder]="d.t('epostaAdresOrnek')">
            </label>
            <label>
              <span>{{ d.t('epostaGonderenAd') }}</span>
              <input name="fromName" [ngModel]="taslak().fromName"
                     (ngModelChange)="alan('fromName', $event)" maxlength="120"
                     [placeholder]="d.t('epostaAdOrnek')">
            </label>
          </div>

          @if (taslak().securityMode === 'NONE') {
            <p class="bilgi uyari" role="alert">
              {{ d.t('epostaSifresizUyari') }}
            </p>
          }

          <!-- Parola kutusu YOK; gerekçe kullanıcıya da açıklanır -->
          <p class="aciklama">
            {{ d.t('epostaParolaNot1') }} <code>BIDB_MAIL_PAROLA</code> {{ d.t('epostaParolaNot2') }} <strong>{{ a.passwordDefined ? d.t('epostaTanimli') : d.t('epostaTanimliDegil') }}</strong>.
          </p>

          <label class="onay">
            <input type="checkbox" name="enabled" [ngModel]="taslak().enabled"
                   (ngModelChange)="alan('enabled', $event)">
            <span>{{ d.t('epostaGonderimAcik') }}</span>
          </label>

          <span class="dugmeler">
            <button type="submit" [disabled]="kaydediliyor()">{{ d.t('epostaKaydet') }}</button>
            <button type="button" class="ikincil" (click)="sinama()"
                    [disabled]="!!a.blockingIssue || sinaniyor()">
              {{ d.t('epostaSinamaGonder') }}
            </button>
          </span>
          @if (a.blockingIssue) {
            <small>{{ d.t('epostaSinamaKapali') }}</small>
          } @else {
            <small>{{ d.t('epostaSinamaNot') }}</small>
          }

          @if (a.updatedAt) {
            <small>{{ d.t('epostaSonGuncelleme') }} {{ zaman(a.updatedAt) }}{{ a.updatedBy ? ' · ' + a.updatedBy : '' }}</small>
          }
        </form>
      }
    </section>

    <section class="kalite-bolum">
      <header>
        <div>
          <span class="bolum-no">{{ d.t('epostaKurumsal') }}</span>
          <h2>{{ d.t('epostaHesapBaslik') }}</h2>
          <p>
            {{ d.t('epostaHesapTanitim') }}
          </p>
        </div>
      </header>

      @if (hesap(); as h) {
        @if (!h.email) {
          <p class="bilgi uyari" role="alert">
            {{ d.t('epostaHesapUyari') }}
          </p>
        }
        <form class="duyuru-form" (ngSubmit)="hesapKaydet()" novalidate>
          <label>
            <span>{{ d.t('epostaKullanici') }}</span>
            <input name="username" [value]="h.username" disabled>
          </label>
          <label>
            <span>{{ d.t('epostaBildirimAdresi') }}</span>
            <input name="accountEmail" type="email" maxlength="254"
                   [ngModel]="hesapEposta()" (ngModelChange)="hesapEposta.set($event)"
                   [placeholder]="d.t('epostaAdresOrnek')">
          </label>
          <!-- Parola alanı YOK; gerekçe kullanıcıya da söyleniyor -->
          <p class="aciklama">
            {{ d.t('epostaParolaDegismez') }}
            @if (h.passwordUpdatedAt) {
              {{ d.t('epostaSonParolaDegisikligi') }} {{ zaman(h.passwordUpdatedAt) }}.
            }
          </p>
          <span class="dugmeler">
            <button type="submit" [disabled]="hesapKaydediliyor()">{{ d.t('epostaAdresKaydet') }}</button>
          </span>
        </form>
      }
    </section>

    <section class="kalite-bolum">
      <header>
        <div>
          <span class="bolum-no">{{ d.t('epostaKurumsal') }}</span>
          <h2>{{ d.t('epostaGunlukBaslik') }}</h2>
          <p>
            {{ d.t('epostaGunlukTanitim') }}
          </p>
        </div>
        <span class="gunluk-sayac">{{ gunluk().length }} {{ d.t('epostaKayit') }}</span>
      </header>

      @if (gunluk().length) {
        <div class="tablo-kaydir">
          <table class="yonetim-tablo">
            <thead>
              <tr>
                <th>{{ d.t('epostaZaman') }}</th>
                <th>{{ d.t('epostaAlici') }}</th>
                <th>{{ d.t('epostaKonu') }}</th>
                <th>{{ d.t('epostaAmac') }}</th>
                <th>{{ d.t('epostaDurum') }}</th>
              </tr>
            </thead>
            <tbody>
              @for (k of gunluk(); track k.id) {
                <tr>
                  <td><small>{{ zaman(k.createdAt) }}</small></td>
                  <td><small>{{ k.toAddress }}</small></td>
                  <td>
                    {{ k.subject }}
                    @if (k.errorMessage) { <br><small class="gunluk-yol">{{ k.errorMessage }}</small> }
                  </td>
                  <td><small>{{ amacEtiketi(k.purpose) }}</small></td>
                  <td>
                    <span class="giris-kayit-rozet"
                          [class.basarili]="k.status === 'SENT'"
                          [class.basarisiz]="k.status === 'FAILED'">
                      {{ durumEtiketi(k.status) }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <div class="kalite-bos">
          <strong>{{ d.t('epostaKayitYok') }}</strong>
          <p>{{ d.t('epostaKayitYokAciklama') }}</p>
        </div>
      }
    </section>
  `
})
export class MailAdminComponent implements OnInit {
  private api = inject(AdminApiService);
  /** Şablonda kısa olsun diye tek harf: d.t('anahtar') */
  protected d = inject(AdminDilServisi);

  protected ayar = signal<MailSetting | null>(null);
  protected gunluk = signal<MailLogEntry[]>([]);
  protected mesaj = signal('');
  protected hata = signal('');
  protected kaydediliyor = signal(false);
  protected sinaniyor = signal(false);

  protected hesap = signal<AdminAccountView | null>(null);
  protected hesapEposta = signal<string>('');
  protected hesapKaydediliyor = signal(false);

  /** Düzenlenen kopya; kaydedilene kadar sunucudaki değere dokunulmaz. */
  private duzenlenen = signal<MailSetting | null>(null);
  protected taslak = computed(() => this.duzenlenen() ?? this.bosTaslak());

  private yenileSiniri = tiklamaSinirlayici();

  ngOnInit(): void {
    this.yukle();
  }

  protected yukle(): void {
    if (!this.yenileSiniri()) return;
    this.api.mailSettings().subscribe({
      next: (a) => { this.ayar.set(a); this.duzenlenen.set({ ...a }); },
      error: () => this.hata.set(this.d.t('epostaAyarAlinamadi'))
    });
    this.api.mailLog().subscribe({
      next: (l) => this.gunluk.set(l),
      error: () => this.hata.set(this.d.t('epostaGunlukAlinamadi'))
    });
    this.api.mailAccount().subscribe({
      next: (h) => { this.hesap.set(h); this.hesapEposta.set(h.email ?? ''); },
      error: () => this.hata.set(this.d.t('epostaHesapAlinamadi'))
    });
  }

  protected alan(ad: keyof MailSetting, deger: unknown): void {
    const t = this.duzenlenen();
    if (!t) return;
    this.duzenlenen.set({ ...t, [ad]: deger } as MailSetting);
  }

  protected kaydet(): void {
    const t = this.duzenlenen();
    if (!t || this.kaydediliyor()) return;
    this.kaydediliyor.set(true);
    this.hata.set('');
    this.api.saveMailSettings({
      host: t.host, port: t.port, username: t.username,
      fromAddress: t.fromAddress, fromName: t.fromName,
      securityMode: t.securityMode, enabled: t.enabled
    }).subscribe({
      next: (a) => {
        this.ayar.set(a);
        this.duzenlenen.set({ ...a });
        this.kaydediliyor.set(false);
        this.bildir(this.d.t('epostaAyarKaydedildi'));
      },
      error: (e) => {
        this.kaydediliyor.set(false);
        /* Sunucunun sebebi gösterilir: "Gönderim açılamadı: Sunucu adresi
           girilmemiş." gibi. Genel bir mesaj, hangi alanın eksik olduğunu
           yöneticiye aratırdı. */
        this.hata.set(typeof e?.error === 'string' && e.error
          ? e.error
          : this.d.t('epostaAyarKaydedilemedi'));
      }
    });
  }

  protected hesapKaydet(): void {
    if (this.hesapKaydediliyor()) return;
    this.hesapKaydediliyor.set(true);
    this.hata.set('');
    const deger = this.hesapEposta().trim();
    this.api.saveMailAccount(deger === '' ? null : deger).subscribe({
      next: (h) => {
        this.hesap.set(h);
        this.hesapEposta.set(h.email ?? '');
        this.hesapKaydediliyor.set(false);
        this.bildir(h.email ? this.d.t('epostaAdresKaydedildi') : this.d.t('epostaAdresKaldirildi'));
      },
      error: (e) => {
        this.hesapKaydediliyor.set(false);
        this.hata.set(typeof e?.error === 'string' && e.error
          ? e.error
          : this.d.t('epostaAdresKaydedilemedi'));
      }
    });
  }

  protected sinama(): void {
    if (this.sinaniyor()) return;
    this.sinaniyor.set(true);
    this.hata.set('');
    this.api.sendTestMail().subscribe({
      next: (m) => { this.sinaniyor.set(false); this.bildir(m); this.yukle(); },
      error: (e) => {
        this.sinaniyor.set(false);
        this.hata.set(typeof e?.error === 'string' && e.error ? e.error : this.d.t('epostaSinamaGonderilemedi'));
        // Başarısız deneme de günlüğe düşer; liste tazelenir ki sebep görünsün.
        this.yukle();
      }
    });
  }

  protected zaman(z: string): string {
    const d = new Date(z);
    if (Number.isNaN(d.getTime())) return z;
    const iki = (n: number) => String(n).padStart(2, '0');
    return `${iki(d.getDate())}.${iki(d.getMonth() + 1)}.${d.getFullYear()} ${iki(d.getHours())}:${iki(d.getMinutes())}`;
  }

  protected amacEtiketi(a: MailLogEntry['purpose']): string {
    switch (a) {
      case 'PAROLA_SIFIRLAMA': return this.d.t('epostaAmacParola');
      case 'TALEP_BILDIRIM': return this.d.t('epostaAmacTalep');
      case 'SINAMA': return this.d.t('epostaAmacSinama');
      default: return a;
    }
  }

  protected durumEtiketi(d: MailLogEntry['status']): string {
    switch (d) {
      case 'SENT': return this.d.t('epostaDurumGonderildi');
      case 'FAILED': return this.d.t('epostaDurumBasarisiz');
      case 'SKIPPED': return this.d.t('epostaDurumGonderilmedi');
      default: return d;
    }
  }

  private bildir(m: string): void {
    this.mesaj.set(m);
    setTimeout(() => this.mesaj.set(''), 5000);
  }

  private bosTaslak(): MailSetting {
    return {
      host: null, port: 587, username: null, fromAddress: null, fromName: null,
      securityMode: 'STARTTLS', enabled: false, updatedAt: null, updatedBy: null,
      passwordDefined: false, blockingIssue: null
    };
  }
}
