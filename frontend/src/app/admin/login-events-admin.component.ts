import { Component, OnInit, inject, signal } from '@angular/core';
import { AdminApiService, LoginEvent } from './admin-api.service';

/** Yönetim paneline yapılan giriş denemelerinin kaydı (güvenlik denetimi). */
@Component({
  selector: 'bidb-login-events-admin',
  template: `
    <section class="kalite-bolum">
      <header>
        <div>
          <span class="bolum-no">Güvenlik Denetimi</span>
          <h2>Giriş kayıtları</h2>
          <p>Yönetim paneline yapılan son 200 giriş denemesi — cihaz, tarayıcı, IP ve tahmini konum ile.</p>
        </div>
        <button type="button" class="ikincil" (click)="yukle()">Yenile</button>
      </header>

      <div class="giris-koruma-notu">
        <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20"
             fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
        <p>
          Kaba kuvvet koruması etkin: aynı IP adresinden 5 dakika içinde
          8'den fazla başarısız giriş denemesi yapılırsa, o adres geçici
          olarak engellenir (429 yanıtı) — doğru parola girilse bile.
          Pencere süresi dolunca engel kendiliğinden kalkar.
        </p>
      </div>

      @if (yukleniyor()) {
        <p class="aciklama" role="status">Kayıtlar yükleniyor…</p>
      } @else if (hata()) {
        <p class="hata" role="alert">{{ hata() }}</p>
      } @else if (kayitlar().length) {
        <div class="tablo-kaydir">
          <table class="yonetim-tablo giris-kayit-tablo">
            <thead>
              <tr>
                <th>Zaman</th>
                <th>Durum</th>
                <th>Kullanıcı adı</th>
                <th>Genel IPv4</th>
                <th>Konum</th>
                <th>Cihaz</th>
                <th>Tarayıcı / İşletim sistemi</th>
              </tr>
            </thead>
            <tbody>
              @for (k of kayitlar(); track k.id) {
                <tr class="giris-kayit-satir" tabindex="0" role="button"
                    [attr.aria-label]="'Ayrıntıları gör: ' + tarihSaat(k.occurredAt)"
                    (click)="detayAc(k)" (keydown.enter)="detayAc(k)">
                  <td><small>{{ tarihSaat(k.occurredAt) }}</small></td>
                  <td>
                    <span class="giris-kayit-rozet" [class.basarili]="k.successful" [class.basarisiz]="!k.successful">
                      {{ k.successful ? 'Başarılı' : 'Başarısız' }}
                    </span>
                  </td>
                  <td>{{ k.attemptedUsername || '—' }}</td>
                  <td><small>{{ k.ipAddress }}</small></td>
                  <td>{{ konum(k) }}</td>
                  <td>{{ cihazEtiketi(k) }}</td>
                  <td><small>{{ k.browser || '—' }} · {{ k.operatingSystem || '—' }}</small></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <div class="kalite-bos">
          <strong>Henüz kayıt yok</strong>
          <p>Yönetim paneline yapılan bir sonraki giriş denemesi burada görünecek.</p>
        </div>
      }
    </section>

    @if (acikKayit(); as k) {
      <div class="vital-perde" (click)="acikKayit.set(null)"></div>
      <div class="giris-detay-pencere" role="dialog" aria-modal="true" aria-label="Giriş denemesi ayrıntısı"
           [class.basarili]="k.successful" [class.basarisiz]="!k.successful"
           (keydown.escape)="acikKayit.set(null)">
        <header>
          <span class="giris-kayit-rozet" [class.basarili]="k.successful" [class.basarisiz]="!k.successful">
            {{ k.successful ? 'Başarılı giriş' : 'Başarısız deneme' }}
          </span>
          <button type="button" class="ikincil" (click)="acikKayit.set(null)" aria-label="Kapat">
            <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18"
                 fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <path d="M6 6l12 12M18 6 6 18"/>
            </svg>
          </button>
        </header>

        <ul class="giris-detay-liste">
          <li>
            <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
            <span><small>Zaman</small>{{ tarihSaat(k.occurredAt) }}</span>
          </li>
          <li>
            <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            <span><small>Kullanıcı adı denemesi</small>{{ k.attemptedUsername || '—' }}</span>
          </li>
          <li>
            <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18"/></svg>
            <span><small>Genel IPv4 (public)</small>{{ k.ipAddress }}</span>
          </li>
          @if (k.localIpAddress && k.localIpAddress !== k.ipAddress) {
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="2"/></svg>
              <span><small>Yerel IPv4 (private)</small>{{ k.localIpAddress }}</span>
            </li>
          }
          <li class="giris-konum-satiri">
            <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>
            <span>
              <small>Tahmini konum</small>
              <span class="konum-deger-satiri">
                {{ konum(k) }}
                <button type="button" class="konum-info-buton" aria-label="Konum bilgisi hakkında"
                        [attr.aria-expanded]="konumBilgiAcik()" (click)="konumBilgiAcik.set(!konumBilgiAcik())">i</button>
              </span>
              @if (k.isp) {
                <span class="konum-saglayici">İnternet sağlayıcısı: {{ k.isp }}</span>
              }
              @if (konumBilgiAcik()) {
                <p class="konum-info-metni">
                  Bu konum, IP adresinin WHOIS/bölgesel kayıt bilgisine göre yapılan bir tahmindir.
                  Kurum içi ağlar, VPN, mobil operatör veya proxy gibi birçok sebepten dolayı
                  gerçek fiziksel konumdan farklı — hatta yanlış — görünebilir; kesin kabul edilmemelidir.
                </p>
              }
            </span>
          </li>
          <li>
            <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 18h4"/></svg>
            <span><small>Cihaz</small>{{ cihazEtiketi(k) }}</span>
          </li>
          <li>
            <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18"/></svg>
            <span><small>Tarayıcı / işletim sistemi</small>{{ k.browser || '—' }} · {{ k.operatingSystem || '—' }}</span>
          </li>
        </ul>
      </div>
    }
  `
})
export class LoginEventsAdminComponent implements OnInit {
  private api = inject(AdminApiService);

  protected kayitlar = signal<LoginEvent[]>([]);
  protected yukleniyor = signal(false);
  protected hata = signal('');
  protected acikKayit = signal<LoginEvent | null>(null);
  protected konumBilgiAcik = signal(false);

  ngOnInit(): void {
    this.yukle();
  }

  protected yukle(): void {
    this.yukleniyor.set(true);
    this.hata.set('');
    this.api.loginEvents().subscribe({
      next: (liste) => {
        this.kayitlar.set(liste);
        this.yukleniyor.set(false);
      },
      error: () => {
        this.hata.set('Giriş kayıtları alınamadı.');
        this.yukleniyor.set(false);
      }
    });
  }

  protected detayAc(k: LoginEvent): void {
    this.konumBilgiAcik.set(false);
    this.acikKayit.set(k);
  }

  protected konum(k: LoginEvent): string {
    if (k.city && k.country) return `${k.city}, ${k.country}`;
    return k.city || k.country || '—';
  }

  protected cihazEtiketi(k: LoginEvent): string {
    const sinif = ({ mobile: 'Telefon', tablet: 'Tablet', desktop: 'Masaüstü' } as Record<string, string>)[k.deviceClass ?? ''] ?? '—';
    return k.deviceModel ? `${sinif} (${k.deviceModel})` : sinif;
  }

  protected tarihSaat(deger: string): string {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(new Date(deger));
  }
}
