import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { AdminApiService, AuditEvent } from './admin-api.service';
import { tiklamaSinirlayici } from './tiklama-siniri';

/** Yönetim panelinde yapılan değişiklik işlemlerinin denetim kaydı. */
@Component({
  selector: 'bidb-audit-log-admin',
  imports: [SlicePipe],
  template: `
    <section class="kalite-bolum">
      <header>
        <div>
          <span class="bolum-no">Güvenlik Denetimi</span>
          <h2>İşlem günlüğü</h2>
          <p>Panelde yapılan her oluşturma/güncelleme/silme işlemi — oturum, kullanıcı adı, genel ve yerel IPv4 ile.</p>
        </div>
        <button type="button" class="ikincil" (click)="yukle()">Yenile</button>
      </header>

      <div class="gunluk-arac-cubugu">
        <!-- Yer tutucu metin erişilebilir ad yerine geçmez; ad, panelin geri
             kalanıyla aynı örüntüyle (görünmez etiket) veriliyor —
             bkz. contact-ticket-admin.component.ts. -->
        <label class="gunluk-arama-etiket">
          <span class="sr-only">Kayıtlarda filtrele</span>
          <input type="search" class="gunluk-arama" placeholder="Filtrele: işlem, kullanıcı, oturum, yol…"
                 [value]="filtre()" (input)="filtre.set($any($event.target).value)">
        </label>
        <span class="gunluk-sayac">{{ filtrelenmis().length }} / {{ kayitlar().length }} kayıt</span>
      </div>

      @if (yukleniyor()) {
        <p class="aciklama" role="status">Kayıtlar yükleniyor…</p>
      } @else if (hata()) {
        <p class="hata" role="alert">{{ hata() }}</p>
      } @else if (filtrelenmis().length) {
        <div class="tablo-kaydir">
          <table class="yonetim-tablo">
            <thead>
              <tr>
                <th>Zaman</th>
                <th>Oturum</th>
                <th>Kullanıcı</th>
                <th>İşlem</th>
                <th>Kaynak</th>
                <th>Genel IPv4</th>
                <th>Yerel IPv4</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              @for (k of filtrelenmis(); track k.id) {
                <tr>
                  <td><small>{{ tarihSaat(k.occurredAt) }}</small></td>
                  <td><code class="gunluk-oturum">{{ k.sessionId | slice: 0:8 }}</code></td>
                  <td>{{ k.attemptedUsername || '—' }}</td>
                  <td>{{ k.actionLabel }}</td>
                  <td class="gunluk-yol"><small>{{ k.resourcePath }}</small></td>
                  <td><small>{{ k.ipAddress }}</small></td>
                  <td><small>{{ k.localIpAddress || '—' }}</small></td>
                  <td>
                    <span class="giris-kayit-rozet" [class.basarili]="k.successful" [class.basarisiz]="!k.successful">
                      {{ k.httpStatus }}
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
          <p>Panelde yapılan bir sonraki değişiklik işlemi burada görünecek.</p>
        </div>
      }
    </section>
  `
})
export class AuditLogAdminComponent implements OnInit {
  private api = inject(AdminApiService);

  protected kayitlar = signal<AuditEvent[]>([]);
  protected yukleniyor = signal(false);
  protected hata = signal('');
  protected filtre = signal('');

  protected filtrelenmis = computed(() => {
    const sorgu = this.filtre().trim().toLowerCase();
    if (!sorgu) return this.kayitlar();
    return this.kayitlar().filter((k) =>
      k.actionLabel.toLowerCase().includes(sorgu) ||
      k.resourcePath.toLowerCase().includes(sorgu) ||
      k.sessionId.toLowerCase().includes(sorgu) ||
      (k.attemptedUsername ?? '').toLowerCase().includes(sorgu) ||
      k.ipAddress.toLowerCase().includes(sorgu));
  });

  private yenileSiniri = tiklamaSinirlayici();

  ngOnInit(): void {
    this.yukle();
  }

  protected yukle(): void {
    if (!this.yenileSiniri()) return;
    this.yukleniyor.set(true);
    this.hata.set('');
    this.api.auditEvents().subscribe({
      next: (liste) => {
        this.kayitlar.set(liste);
        this.yukleniyor.set(false);
      },
      error: () => {
        this.hata.set('İşlem günlüğü alınamadı.');
        this.yukleniyor.set(false);
      }
    });
  }

  protected tarihSaat(deger: string): string {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).format(new Date(deger));
  }
}
