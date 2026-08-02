import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { tiklamaSinirlayici } from './tiklama-siniri';
import {
  AdminApiService, ContactTicket, ContactTicketEvent
} from './admin-api.service';
import { AdminDilServisi } from './admin-dil.service';

/** Yönetim panelinde iletişim taleplerinin kayıt, atama ve işlem geçmişi görünümü. */
@Component({
  selector: 'bidb-contact-ticket-admin',
  imports: [FormsModule],
  template: `
    <section class="ticket-yonetim">
      <header class="ticket-ust">
        <div>
          <span class="bolum-no">{{ d.t('talepMerkezi') }}</span>
          <h2>{{ d.t('talepBaslik') }}</h2>
          <p>{{ d.t('talepTanitim') }}</p>
        </div>
        <div class="ticket-sayaclar" aria-label="Talep özeti">
          <span><strong>{{ acikSayisi() }}</strong>Açık</span>
          <span><strong>{{ yeniSayisi() }}</strong>Yeni</span>
          <span><strong>{{ tickets().length }}</strong>Toplam</span>
        </div>
      </header>

      <div class="ticket-filtreler">
        <label>
          <span class="sr-only">Taleplerde ara</span>
          <input type="search" [ngModel]="arama()" (ngModelChange)="arama.set($event)"
                 [placeholder]="d.t('talepAramaYerTutucu')">
        </label>
        <label>
          <span class="sr-only">{{ d.t('talepDurumFiltre') }}</span>
          <select [ngModel]="durumFiltresi()" (ngModelChange)="durumFiltresi.set($event)">
            <option value="">Tüm durumlar</option>
            @for (item of durumlar; track item.key) { <option [value]="item.key">{{ item.label }}</option> }
          </select>
        </label>
        <button type="button" class="ikincil" (click)="yukle()">Yenile</button>
      </div>

      @if (yukleniyor()) {
        <p class="aciklama" role="status">{{ d.t('talepBaslik') }} yükleniyor…</p>
      } @else {
        <div class="ticket-duzen" [class.detay-acik]="secili()">
          <div class="ticket-liste" aria-label="{{ d.t('talepBaslik') }}">
            @for (ticket of filtreli(); track ticket.id) {
              <button type="button" class="ticket-satir" [class.etkin]="secili()?.id === ticket.id"
                      (click)="ac(ticket)">
                <span class="ticket-durum" [attr.data-status]="ticket.status">{{ durumAdi(ticket.status) }}</span>
                <span class="ticket-kimlik">
                  <strong>{{ ticket.subject }}</strong>
                  <small>{{ ticket.referenceCode }} · {{ ticket.requesterFirstName }} {{ ticket.requesterLastName }}</small>
                </span>
                <span class="ticket-meta">
                  <small>{{ kategoriAdi(ticket.category) }}</small>
                  <time>{{ tarih(ticket.createdAt) }}</time>
                </span>
                @if (ticket.priority !== 'NORMAL') {
                  <span class="ticket-oncelik" [attr.data-priority]="ticket.priority">{{ oncelikAdi(ticket.priority) }}</span>
                }
              </button>
            } @empty {
              <div class="ticket-bos">
                <strong>Eşleşen talep bulunamadı</strong>
                <p>Arama veya durum filtresini değiştirin.</p>
              </div>
            }
          </div>

          @if (secili(); as ticket) {
            <aside class="ticket-detay">
              <header>
                <div>
                  <span>{{ ticket.referenceCode }}</span>
                  <h3>{{ ticket.subject }}</h3>
                </div>
                <button type="button" class="ikincil ticket-kapat" (click)="kapat()" aria-label="Talep detayını kapat">×</button>
              </header>

              <dl class="ticket-basvuran">
                <div><dt>Başvuru sahibi</dt><dd>{{ ticket.requesterFirstName }} {{ ticket.requesterLastName }}</dd></div>
                <div><dt>E-posta</dt><dd><a [href]="'mailto:' + ticket.requesterEmail">{{ ticket.requesterEmail }}</a></dd></div>
                @if (ticket.requesterPhone) {
                  <div><dt>Telefon</dt><dd><a [href]="'tel:' + ticket.requesterPhone">{{ ticket.requesterPhone }}</a></dd></div>
                }
                <div><dt>Kategori</dt><dd>{{ kategoriAdi(ticket.category) }}</dd></div>
              </dl>

              <section class="ticket-mesaj">
                <span class="bolum-no">Başvuru Mesajı</span>
                <p>{{ ticket.message }}</p>
                @if (ticket.attachmentUrl) {
                  <a class="ticket-ek" [href]="ticket.attachmentUrl" target="_blank" rel="noopener">
                    <span aria-hidden="true">
                      <svg viewBox="0 0 24 24"><path d="M8 12v6a3 3 0 0 0 6 0V9a5 5 0 0 0-10 0v9a2 2 0 0 0 4 0V9"></path></svg>
                    </span>
                    <span>
                      <strong>{{ ticket.attachmentName }}</strong>
                      <small>{{ ekBoyut(ticket.attachmentSizeBytes) }}</small>
                    </span>
                  </a>
                }
              </section>

              <form class="ticket-islem" (ngSubmit)="kaydet()">
                <div class="ticket-islem-izgara">
                  <label>Durum
                    <select name="ticketStatus" [ngModel]="ticket.status" (ngModelChange)="alan('status', $event)">
                      @for (item of durumlar; track item.key) { <option [value]="item.key">{{ item.label }}</option> }
                    </select>
                  </label>
                  <label>Öncelik
                    <select name="ticketPriority" [ngModel]="ticket.priority" (ngModelChange)="alan('priority', $event)">
                      @for (item of oncelikler; track item.key) { <option [value]="item.key">{{ item.label }}</option> }
                    </select>
                  </label>
                </div>
                <label>Sorumlu kişi / birim
                  <input name="assignedTo" [ngModel]="ticket.assignedTo" (ngModelChange)="alan('assignedTo', $event)"
                         maxlength="120" placeholder="örn. Ağ Birimi">
                </label>
                <label>Yönetici notu
                  <textarea name="adminNote" [ngModel]="ticket.adminNote" (ngModelChange)="alan('adminNote', $event)"
                            maxlength="4000" rows="4" placeholder="Yalnızca yönetim panelinde görünür"></textarea>
                </label>
                <label>İşlem geçmişi notu
                  <input name="eventNote" [(ngModel)]="islemNotu" maxlength="1000"
                         placeholder="Bu güncellemeyi açıklayan kısa not">
                </label>
                @if (mesaj()) { <p class="bilgi" role="status">{{ mesaj() }}</p> }
                <button type="submit" [disabled]="kaydediliyor()">
                  {{ kaydediliyor() ? 'Kaydediliyor…' : 'Güncellemeyi kaydet' }}
                </button>
              </form>

              <section class="ticket-gecmis">
                <span class="bolum-no">İşlem Geçmişi</span>
                @for (event of olaylar(); track event.id) {
                  <article>
                    <i aria-hidden="true"></i>
                    <div>
                      <strong>{{ olayAdi(event) }}</strong>
                      @if (event.note) { <p>{{ event.note }}</p> }
                      <small>{{ event.actor }} · {{ tarihSaat(event.createdAt) }}</small>
                    </div>
                  </article>
                } @empty {
                  <p class="aciklama">Henüz işlem geçmişi bulunmuyor.</p>
                }
              </section>
            </aside>
          }
        </div>
      }
    </section>
  `
})
export class ContactTicketAdminComponent implements OnInit {
  private api = inject(AdminApiService);
  protected d = inject(AdminDilServisi);
  protected tickets = signal<ContactTicket[]>([]);
  protected secili = signal<ContactTicket | null>(null);
  protected olaylar = signal<ContactTicketEvent[]>([]);
  protected yukleniyor = signal(true);
  protected kaydediliyor = signal(false);
  protected mesaj = signal('');
  protected arama = signal('');
  protected durumFiltresi = signal('');
  protected islemNotu = '';

  /* Getter: sabit dizi olsaydı dil değiştiğinde etiketler eski dilde
     kalırdı - dizi bir kez kurulup bir daha okunmazdı. */
  protected get durumlar() {
    return [
      { key: 'NEW', label: this.d.t('talepDurumYeni') },
      { key: 'IN_PROGRESS', label: this.d.t('talepDurumIslemde') },
      { key: 'WAITING', label: this.d.t('talepDurumBekliyor') },
      { key: 'RESOLVED', label: this.d.t('talepDurumCozuldu') },
      { key: 'CLOSED', label: this.d.t('talepDurumKapatildi') }
    ];
  }
  protected get oncelikler() {
    return [
      { key: 'NORMAL', label: this.d.t('talepOncelikNormal') },
      { key: 'HIGH', label: this.d.t('talepOncelikYuksek') },
      { key: 'URGENT', label: this.d.t('talepOncelikAcil') }
    ];
  }

  protected yeniSayisi = computed(() => this.tickets().filter(t => t.status === 'NEW').length);
  protected acikSayisi = computed(() => this.tickets().filter(t => !['RESOLVED', 'CLOSED'].includes(t.status)).length);
  protected filtreli = computed(() => {
    const query = this.arama().trim().toLocaleLowerCase('tr-TR');
    return this.tickets().filter(ticket =>
      (!this.durumFiltresi() || ticket.status === this.durumFiltresi()) &&
      (!query || [ticket.referenceCode, ticket.subject, ticket.requesterFirstName, ticket.requesterLastName, ticket.requesterEmail]
        .some(value => value.toLocaleLowerCase('tr-TR').includes(query))));
  });

  private yenileSiniri = tiklamaSinirlayici();

  ngOnInit(): void { this.yukle(); }

  protected yukle(): void {
    if (!this.yenileSiniri()) return;
    this.yukleniyor.set(true);
    this.api.contactTickets().subscribe({
      next: tickets => { this.tickets.set(tickets); this.yukleniyor.set(false); },
      error: () => { this.tickets.set([]); this.yukleniyor.set(false); }
    });
  }

  protected ac(ticket: ContactTicket): void {
    this.secili.set({ ...ticket });
    this.mesaj.set('');
    this.islemNotu = '';
    /* Talep listesi detay açıkken de tıklanabilir olduğu için bir talepten
       diğerine geçilebiliyor. Geçmiş önce boşaltılmazsa ve yeni okuma
       başarısız olursa, ÖNCEKİ talebin işlem geçmişi yeni talebin altında
       görünür — yönetici yanlış talebin kaydını okuyup ona göre işlem yapar. */
    this.olaylar.set([]);
    this.api.contactTicketEvents(ticket.id).subscribe({
      next: events => this.olaylar.set(events),
      error: () => this.mesaj.set('İşlem geçmişi alınamadı.')
    });
  }

  protected kapat(): void { this.secili.set(null); this.olaylar.set([]); }

  protected alan(field: keyof ContactTicket, value: unknown): void {
    const ticket = this.secili();
    if (ticket) this.secili.set({ ...ticket, [field]: value } as ContactTicket);
  }

  protected kaydet(): void {
    const ticket = this.secili();
    if (!ticket || this.kaydediliyor()) return;
    this.kaydediliyor.set(true);
    this.api.updateContactTicket(ticket, this.islemNotu).subscribe({
      next: updated => {
        this.tickets.update(items => items.map(item => item.id === updated.id ? updated : item));
        this.secili.set(updated);
        this.islemNotu = '';
        this.mesaj.set('Talep kaydı ve işlem geçmişi güncellendi.');
        this.kaydediliyor.set(false);
        this.api.contactTicketEvents(updated.id).subscribe(events => this.olaylar.set(events));
      },
      error: () => { this.mesaj.set('Güncelleme kaydedilemedi.'); this.kaydediliyor.set(false); }
    });
  }

  protected durumAdi(status: string): string {
    return this.durumlar.find(item => item.key === status)?.label ?? status;
  }
  protected oncelikAdi(priority: string): string {
    return this.oncelikler.find(item => item.key === priority)?.label ?? priority;
  }
  protected kategoriAdi(category: string): string {
    return ({
      GENERAL: this.d.t('talepKatGenel'), TECHNICAL_SUPPORT: this.d.t('talepKatTeknik'),
      EMAIL: this.d.t('talepKatEposta'), NETWORK: this.d.t('talepKatAg'),
      SOFTWARE: this.d.t('talepKatYazilim'), EBYS: 'EBYS',
      E_SIGNATURE: this.d.t('talepKatEimza'), SECURITY: this.d.t('talepKatGuvenlik'),
      WEB_SERVICES: this.d.t('talepKatWeb'), SUGGESTION: this.d.t('talepKatOneri')
    } as Record<string, string>)[category] ?? category;
  }
  protected ekBoyut(bayt: number | null): string {
    if (!bayt) return '';
    return bayt < 1024 * 1024
      ? Math.max(1, Math.round(bayt / 1024)) + ' KB'
      : (bayt / (1024 * 1024)).toFixed(1) + ' MB';
  }
  /** Tarih yerel biçimi panel dilini izler; ay kısaltmaları da çevrilsin. */
  private yerel(): string {
    return this.d.dil() === 'en' ? 'en-GB' : 'tr-TR';
  }

  protected tarih(value: string): string {
    return new Intl.DateTimeFormat(this.yerel(), { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
  }
  protected tarihSaat(value: string): string {
    return new Intl.DateTimeFormat(this.yerel(), { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  }
  protected olayAdi(event: ContactTicketEvent): string {
    if (event.eventType === 'CREATED') return 'Talep oluşturuldu';
    if (event.eventType === 'NOTE_ADDED') return 'İşlem notu eklendi';
    return `${this.durumAdi(event.fromStatus ?? '')} → ${this.durumAdi(event.toStatus ?? '')}`;
  }
}
