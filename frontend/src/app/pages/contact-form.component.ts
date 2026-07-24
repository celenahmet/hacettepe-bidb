import { Component, Input, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Language } from '../core/models';

interface TicketForm {
  category: string;
  subject: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  website: string;
}

interface TicketResponse {
  referenceCode: string;
  status: string;
  receivedAt: string;
}

/** İletişim sayfasındaki doğrulanmış form; sonucu yönetim paneline ticket olarak iletir. */
@Component({
  selector: 'bidb-contact-form',
  imports: [FormsModule],
  template: `
    <section class="iletisim-form-bolumu" aria-labelledby="iletisim-form-baslik">
      <header class="iletisim-form-baslik">
        <div>
          <p>{{ dilDegeri === 'en' ? 'Request management' : 'Talep yönetimi' }}</p>
          <h2 id="iletisim-form-baslik">
            {{ dilDegeri === 'en' ? 'Contact the department' : 'Daire başkanlığına ulaşın' }}
          </h2>
        </div>
        <span>
          {{ dilDegeri === 'en'
            ? 'Your request is registered with a tracking number and reviewed by the relevant unit.'
            : 'Talebiniz takip numarasıyla kaydedilir ve ilgili birim tarafından değerlendirilir.' }}
        </span>
      </header>

      @if (sonuc(); as ticket) {
        <div class="iletisim-form-sonuc" role="status" tabindex="-1">
          <span aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"></path></svg>
          </span>
          <div>
            <p>{{ dilDegeri === 'en' ? 'Your request has been received' : 'Talebiniz alındı' }}</p>
            <h3>{{ ticket.referenceCode }}</h3>
            <small>
              {{ dilDegeri === 'en'
                ? 'Keep this reference number for future correspondence.'
                : 'Sonraki yazışmalarınız için bu takip numarasını saklayın.' }}
            </small>
          </div>
          <button type="button" (click)="yenile()">
            {{ dilDegeri === 'en' ? 'Create another request' : 'Yeni talep oluştur' }}
          </button>
        </div>
      } @else {
        <form class="iletisim-ticket-form" (ngSubmit)="gonder()" #ticketForm="ngForm">
          <div class="iletisim-form-giris">
            <span class="iletisim-form-no">01</span>
            <div>
              <strong>{{ dilDegeri === 'en' ? 'Request details' : 'Talep bilgileri' }}</strong>
              <small>{{ dilDegeri === 'en' ? 'Select the most relevant service.' : 'Talebinizle en ilgili hizmeti seçin.' }}</small>
            </div>
          </div>

          <div class="iletisim-form-izgara">
            <label>
              <span>{{ dilDegeri === 'en' ? 'Category' : 'Kategori' }} *</span>
              <select name="category" [(ngModel)]="form.category" required>
                @for (item of kategoriler; track item.key) {
                  <option [value]="item.key">{{ dilDegeri === 'en' ? item.en : item.tr }}</option>
                }
              </select>
            </label>
            <label>
              <span>{{ dilDegeri === 'en' ? 'Subject' : 'Konu' }} *</span>
              <input name="subject" [(ngModel)]="form.subject" required minlength="5" maxlength="160"
                     [placeholder]="dilDegeri === 'en' ? 'Briefly describe your request' : 'Talebinizi kısaca belirtin'">
            </label>
          </div>

          <div class="iletisim-form-giris">
            <span class="iletisim-form-no">02</span>
            <div>
              <strong>{{ dilDegeri === 'en' ? 'Contact information' : 'İletişim bilgileri' }}</strong>
              <small>{{ dilDegeri === 'en' ? 'Fields marked with * are required.' : '* işaretli alanlar zorunludur.' }}</small>
            </div>
          </div>

          <div class="iletisim-form-izgara uc">
            <label>
              <span>{{ dilDegeri === 'en' ? 'Name and surname' : 'Ad soyad' }} *</span>
              <input name="name" [(ngModel)]="form.name" required minlength="2" maxlength="120" autocomplete="name">
            </label>
            <label>
              <span>{{ dilDegeri === 'en' ? 'E-mail address' : 'E-posta adresi' }} *</span>
              <input name="email" [(ngModel)]="form.email" type="email" required maxlength="254" autocomplete="email">
            </label>
            <label>
              <span>{{ dilDegeri === 'en' ? 'Telephone (optional)' : 'Telefon (isteğe bağlı)' }}</span>
              <input name="phone" [(ngModel)]="form.phone" type="tel" maxlength="30" autocomplete="tel">
            </label>
          </div>

          <label class="iletisim-form-mesaj">
            <span>{{ dilDegeri === 'en' ? 'Your message' : 'Mesajınız' }} *</span>
            <textarea name="message" [(ngModel)]="form.message" required minlength="20"
                      maxlength="5000" rows="7"></textarea>
            <small>{{ form.message.length }} / 5000</small>
          </label>

          <!-- İnsanların görmediği alan; otomatik form doldurucuları sessizce elenir. -->
          <label class="iletisim-form-tuzak" aria-hidden="true">
            Website <input name="website" [(ngModel)]="form.website" tabindex="-1" autocomplete="off">
          </label>

          @if (hata()) { <p class="iletisim-form-hata" role="alert">{{ hata() }}</p> }

          <footer>
            <p>
              {{ dilDegeri === 'en'
                ? 'The information you submit is used solely to process and follow up your request.'
                : 'İlettiğiniz bilgiler yalnızca talebinizin değerlendirilmesi ve takibi amacıyla kullanılır.' }}
            </p>
            <button type="submit" [disabled]="gonderiliyor() || ticketForm.invalid">
              {{ gonderiliyor()
                ? (dilDegeri === 'en' ? 'Submitting…' : 'Gönderiliyor…')
                : (dilDegeri === 'en' ? 'Submit request' : 'Talebi gönder') }}
              <span aria-hidden="true">→</span>
            </button>
          </footer>
        </form>
      }
    </section>
  `
})
export class ContactFormComponent {
  private http = inject(HttpClient);
  @Input() dilDegeri: Language = 'tr';

  protected readonly kategoriler = [
    { key: 'GENERAL', tr: 'Genel bilgi ve yönlendirme', en: 'General information' },
    { key: 'TECHNICAL_SUPPORT', tr: 'Teknik destek', en: 'Technical support' },
    { key: 'EMAIL', tr: 'E-posta hizmetleri', en: 'E-mail services' },
    { key: 'NETWORK', tr: 'Ağ, internet ve kablosuz erişim', en: 'Network and wireless access' },
    { key: 'SOFTWARE', tr: 'Yazılım ve lisans hizmetleri', en: 'Software and licences' },
    { key: 'EBYS', tr: 'EBYS', en: 'EDMS' },
    { key: 'E_SIGNATURE', tr: 'E-imza', en: 'E-signature' },
    { key: 'SECURITY', tr: 'Bilgi güvenliği', en: 'Information security' },
    { key: 'WEB_SERVICES', tr: 'Web hizmetleri', en: 'Web services' },
    { key: 'SUGGESTION', tr: 'Görüş ve öneri', en: 'Feedback and suggestions' }
  ];

  protected form: TicketForm = this.bosForm();
  protected gonderiliyor = signal(false);
  protected hata = signal('');
  protected sonuc = signal<TicketResponse | null>(null);

  protected gonder(): void {
    if (this.gonderiliyor()) return;
    this.hata.set('');
    this.gonderiliyor.set(true);
    this.http.post<TicketResponse>('/api/contact/tickets', {
      language: this.dilDegeri,
      ...this.form
    }).subscribe({
      next: (response) => {
        this.sonuc.set(response);
        this.gonderiliyor.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.hata.set(error.status === 429
          ? (this.dilDegeri === 'en' ? 'Too many requests. Please try again later.' : 'Kısa sürede çok sayıda talep gönderildi. Lütfen daha sonra tekrar deneyin.')
          : (this.dilDegeri === 'en' ? 'Your request could not be submitted. Please check the fields and try again.' : 'Talebiniz gönderilemedi. Alanları kontrol ederek yeniden deneyin.'));
        this.gonderiliyor.set(false);
      }
    });
  }

  protected yenile(): void {
    this.form = this.bosForm();
    this.sonuc.set(null);
    this.hata.set('');
  }

  private bosForm(): TicketForm {
    return { category: 'GENERAL', subject: '', name: '', email: '', phone: '', message: '', website: '' };
  }
}
