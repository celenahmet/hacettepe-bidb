import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { AdminApiService, AuditEvent } from './admin-api.service';

/**
 * Yönetim panelinde yapılan değişiklik işlemlerinin denetim kaydı.
 *
 * Diğer panel bölümlerinden bilinçli olarak farklı, "güvenlik konsolu"
 * hissi veren koyu/monospace bir görünüm kullanır — kayıt defteri dilinin
 * bir istisnası; içerik türü (denetim/olay akışı) bunu haklı kılıyor.
 */
@Component({
  selector: 'bidb-audit-log-admin',
  imports: [SlicePipe],
  template: `
    <section class="gunluk-panel">
      <header class="gunluk-tepe">
        <div>
          <span class="gunluk-canli" aria-hidden="true"></span>
          <span class="gunluk-etiket">GÜVENLİK DENETİMİ // İŞLEM GÜNLÜĞÜ</span>
          <h2>İşlem günlüğü</h2>
          <p>Panelde yapılan her oluşturma/güncelleme/silme işlemi — oturum, kullanıcı adı, genel ve yerel IPv4 ile.</p>
        </div>
        <button type="button" class="ikincil" (click)="yukle()">Yenile</button>
      </header>

      <div class="gunluk-arac-cubugu">
        <input type="search" class="gunluk-arama" placeholder="Filtrele: işlem, kullanıcı, oturum, yol…"
               [value]="filtre()" (input)="filtre.set($any($event.target).value)">
        <span class="gunluk-sayac">{{ filtrelenmis().length }} / {{ kayitlar().length }} kayıt</span>
      </div>

      @if (yukleniyor()) {
        <p class="gunluk-durum">kayıtlar yükleniyor…</p>
      } @else if (hata()) {
        <p class="gunluk-durum gunluk-hata">{{ hata() }}</p>
      } @else if (filtrelenmis().length) {
        <div class="tablo-kaydir">
          <table class="gunluk-tablo">
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
                  <td class="gunluk-zaman">{{ tarihSaat(k.occurredAt) }}</td>
                  <td><span class="gunluk-oturum" [style.--renk]="oturumRengi(k.sessionId)">{{ k.sessionId | slice: 0:8 }}</span></td>
                  <td>{{ k.attemptedUsername || '—' }}</td>
                  <td><span class="gunluk-eylem" [class]="'yontem-' + k.httpMethod.toLowerCase()">{{ k.actionLabel }}</span></td>
                  <td class="gunluk-yol"><small>{{ k.resourcePath }}</small></td>
                  <td><small>{{ k.ipAddress }}</small></td>
                  <td><small>{{ k.localIpAddress || '—' }}</small></td>
                  <td>
                    <span class="gunluk-durum-rozet" [class.basarili]="k.successful" [class.basarisiz]="!k.successful">
                      {{ k.httpStatus }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <div class="gunluk-bos">
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

  ngOnInit(): void {
    this.yukle();
  }

  protected yukle(): void {
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

  /** Aynı oturum kimliği her zaman aynı rengi alır — okuyucu "kim" sorusunu renkten de takip edebilir. */
  protected oturumRengi(sessionId: string): string {
    let toplam = 0;
    for (let i = 0; i < sessionId.length; i++) toplam = (toplam * 31 + sessionId.charCodeAt(i)) % 360;
    return `hsl(${toplam} 70% 55%)`;
  }

  protected tarihSaat(deger: string): string {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).format(new Date(deger));
  }
}
