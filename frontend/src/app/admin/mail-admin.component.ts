import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService, MailLogEntry, MailSetting } from './admin-api.service';
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
          <span class="bolum-no">Kurumsal İletişim</span>
          <h2>E-posta gönderim ayarları</h2>
          <p>
            Parola yenileme gibi otomatik iletiler bu sunucu üzerinden gönderilir.
            Yapılandırma tamamlanmadan gönderim açılamaz.
          </p>
        </div>
        <button type="button" class="ikincil" (click)="yukle()">Yenile</button>
      </header>

      @if (mesaj()) { <p class="bilgi" role="status">{{ mesaj() }}</p> }
      @if (hata()) { <p class="hata" role="alert">{{ hata() }}</p> }

      @if (ayar(); as a) {
        <!-- Durum satırı: yöneticinin neyin eksik olduğunu tahmin etmesi gerekmesin -->
        <p class="bilgi" [class.uyari]="!!a.blockingIssue" role="status">
          @if (a.blockingIssue) {
            Gönderim şu anda yapılamıyor — {{ a.blockingIssue }}
          } @else {
            Gönderim açık. İletiler {{ a.fromAddress }} adresinden gönderilecektir.
          }
        </p>

        <form class="duyuru-form" (ngSubmit)="kaydet()" #f="ngForm" novalidate>
          <div class="iletisim-form-izgara dort">
            <label>
              <span>Sunucu adresi</span>
              <input name="host" [ngModel]="taslak().host" (ngModelChange)="alan('host', $event)"
                     placeholder="örn. smtp.hacettepe.edu.tr" maxlength="200">
            </label>
            <label>
              <span>Kapı</span>
              <input name="port" type="number" min="1" max="65535"
                     [ngModel]="taslak().port" (ngModelChange)="alan('port', $event)">
            </label>
            <label>
              <span>Kullanıcı adı</span>
              <input name="username" [ngModel]="taslak().username"
                     (ngModelChange)="alan('username', $event)" maxlength="200"
                     autocomplete="off">
            </label>
            <label>
              <span>Güvenlik</span>
              <select name="securityMode" [ngModel]="taslak().securityMode"
                      (ngModelChange)="alan('securityMode', $event)">
                <option value="STARTTLS">STARTTLS (önerilen)</option>
                <option value="SSL">SSL/TLS</option>
                <option value="NONE">Şifresiz</option>
              </select>
            </label>
            <label>
              <span>Gönderen adresi</span>
              <input name="fromAddress" type="email" [ngModel]="taslak().fromAddress"
                     (ngModelChange)="alan('fromAddress', $event)" maxlength="254"
                     placeholder="örn. bidb@hacettepe.edu.tr">
            </label>
            <label>
              <span>Gönderen adı</span>
              <input name="fromName" [ngModel]="taslak().fromName"
                     (ngModelChange)="alan('fromName', $event)" maxlength="120"
                     placeholder="örn. Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı">
            </label>
          </div>

          @if (taslak().securityMode === 'NONE') {
            <p class="bilgi uyari" role="alert">
              Şifresiz bağlantıda kullanıcı adı ve parola ağ üzerinde açık gider.
              Yalnızca kurum içi güvenilir bir aktarıcı için seçiniz.
            </p>
          }

          <!-- Parola kutusu YOK; gerekçe kullanıcıya da açıklanır -->
          <p class="aciklama">
            Sunucu parolası güvenlik gereği panelde tutulmaz; sunucudaki
            <code>BIDB_MAIL_PAROLA</code> ortam değişkeninden okunur.
            Durum: <strong>{{ a.passwordDefined ? 'tanımlı' : 'tanımlı değil' }}</strong>.
          </p>

          <label class="onay">
            <input type="checkbox" name="enabled" [ngModel]="taslak().enabled"
                   (ngModelChange)="alan('enabled', $event)">
            <span>Gönderim açık</span>
          </label>

          <span class="dugmeler">
            <button type="submit" [disabled]="kaydediliyor()">Kaydet</button>
            <button type="button" class="ikincil" (click)="sinama()"
                    [disabled]="!!a.blockingIssue || sinaniyor()">
              Sınama iletisi gönder
            </button>
          </span>
          @if (a.blockingIssue) {
            <small>Sınama iletisi ancak gönderim açıkken gönderilebilir.</small>
          } @else {
            <small>Sınama iletisi yalnızca gönderen adresine yollanır.</small>
          }

          @if (a.updatedAt) {
            <small>Son güncelleme: {{ zaman(a.updatedAt) }}{{ a.updatedBy ? ' · ' + a.updatedBy : '' }}</small>
          }
        </form>
      }
    </section>

    <section class="kalite-bolum">
      <header>
        <div>
          <span class="bolum-no">Kurumsal İletişim</span>
          <h2>Gönderim günlüğü</h2>
          <p>
            Gönderilen ve gönderilemeyen iletilerin kaydı. İleti gövdesi güvenlik
            gereği saklanmaz: parola yenileme iletileri tek kullanımlık bağlantı taşır.
          </p>
        </div>
        <span class="gunluk-sayac">{{ gunluk().length }} kayıt</span>
      </header>

      @if (gunluk().length) {
        <div class="tablo-kaydir">
          <table class="yonetim-tablo">
            <thead>
              <tr>
                <th>Zaman</th>
                <th>Alıcı</th>
                <th>Konu</th>
                <th>Amaç</th>
                <th>Durum</th>
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
          <strong>Kayıt yok</strong>
          <p>Gönderilen ilk ileti burada görünecek.</p>
        </div>
      }
    </section>
  `
})
export class MailAdminComponent implements OnInit {
  private api = inject(AdminApiService);

  protected ayar = signal<MailSetting | null>(null);
  protected gunluk = signal<MailLogEntry[]>([]);
  protected mesaj = signal('');
  protected hata = signal('');
  protected kaydediliyor = signal(false);
  protected sinaniyor = signal(false);

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
      error: () => this.hata.set('E-posta ayarları alınamadı.')
    });
    this.api.mailLog().subscribe({
      next: (l) => this.gunluk.set(l),
      error: () => this.hata.set('Gönderim günlüğü alınamadı.')
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
        this.bildir('Ayarlar kaydedildi.');
      },
      error: (e) => {
        this.kaydediliyor.set(false);
        /* Sunucunun sebebi gösterilir: "Gönderim açılamadı: Sunucu adresi
           girilmemiş." gibi. Genel bir mesaj, hangi alanın eksik olduğunu
           yöneticiye aratırdı. */
        this.hata.set(typeof e?.error === 'string' && e.error
          ? e.error
          : 'Ayarlar kaydedilemedi.');
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
        this.hata.set(typeof e?.error === 'string' && e.error ? e.error : 'Sınama iletisi gönderilemedi.');
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
      case 'PAROLA_SIFIRLAMA': return 'Parola yenileme';
      case 'TALEP_BILDIRIM': return 'Talep bildirimi';
      case 'SINAMA': return 'Sınama';
      default: return a;
    }
  }

  protected durumEtiketi(d: MailLogEntry['status']): string {
    switch (d) {
      case 'SENT': return 'Gönderildi';
      case 'FAILED': return 'Başarısız';
      case 'SKIPPED': return 'Gönderilmedi';
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
