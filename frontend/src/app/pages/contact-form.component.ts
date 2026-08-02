import { Component, Input, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Language } from '../core/models';

interface TicketForm {
  category: string;
  subject: string;
  firstName: string;
  lastName: string;
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
        <form class="iletisim-ticket-form" (ngSubmit)="gonder(ticketForm)" #ticketForm="ngForm" novalidate>
          <p class="iletisim-form-zorunlu-not">
            <span aria-hidden="true">*</span>
            {{ dilDegeri === 'en' ? 'Marks required fields.' : 'Zorunlu alanları belirtir.' }}
          </p>

          <div class="iletisim-form-giris">
            <div>
              <strong>{{ dilDegeri === 'en' ? 'Request details' : 'Talep bilgileri' }}</strong>
              <small>{{ dilDegeri === 'en' ? 'Select the most relevant service.' : 'Talebinizle en ilgili hizmeti seçin.' }}</small>
            </div>
          </div>

          <div class="iletisim-form-izgara">
            <label>
              <span>{{ dilDegeri === 'en' ? 'Category' : 'Kategori' }} <b class="zorunlu-isaret" aria-hidden="true">*</b></span>
              <select name="category" #categoryAlani="ngModel" [(ngModel)]="form.category" required>
                <!-- Boş seçenek olmadan bu alan hiç geçersiz olamıyordu: öntanımlı
                     GENERAL geldiği için required hiç ihlal edilmiyor, altındaki
                     "Kategori seçin." uyarısı hiç görünemiyor ve etiketteki yıldız
                     kullanıcının doldurması gereken bir şeyi işaret etmiyordu. -->
                <option value="">{{ dilDegeri === 'en' ? 'Select a category' : 'Kategori seçin' }}</option>
                @for (item of kategoriler; track item.key) {
                  <option [value]="item.key">{{ dilDegeri === 'en' ? item.en : item.tr }}</option>
                }
              </select>
            
              @if (categoryAlani.invalid && (categoryAlani.dirty || categoryAlani.touched)) {
                <small class="iletisim-form-alan-hata">
                  {{ dilDegeri === 'en' ? 'Select a category.' : 'Kategori seçin.' }}
                </small>
              }
            </label>
            <label>
              <span>{{ dilDegeri === 'en' ? 'Subject' : 'Konu' }} <b class="zorunlu-isaret" aria-hidden="true">*</b></span>
              <input name="subject" #subjectAlani="ngModel" [(ngModel)]="form.subject" required minlength="5" maxlength="160"
                     [placeholder]="dilDegeri === 'en' ? 'Briefly describe your request' : 'Talebinizi kısaca belirtin'">
            
              @if (subjectAlani.invalid && (subjectAlani.dirty || subjectAlani.touched)) {
                <small class="iletisim-form-alan-hata">
                  {{ subjectAlani.errors?.['required']
                    ? (dilDegeri === 'en' ? 'Enter a subject.' : 'Konu girin.')
                    : (dilDegeri === 'en' ? 'Subject must be at least 5 characters.' : 'Konu en az 5 karakter olmalı.') }}
                </small>
              }
            </label>
          </div>

          <div class="iletisim-form-giris">
            <div>
              <strong>{{ dilDegeri === 'en' ? 'Contact information' : 'İletişim bilgileri' }}</strong>
            </div>
          </div>

          <div class="iletisim-form-izgara dort">
            <label>
              <span>{{ dilDegeri === 'en' ? 'First name' : 'Ad' }} <b class="zorunlu-isaret" aria-hidden="true">*</b></span>
              <input name="firstName" #firstNameAlani="ngModel" [(ngModel)]="form.firstName" required minlength="2" maxlength="80" autocomplete="given-name">
            
              @if (firstNameAlani.invalid && (firstNameAlani.dirty || firstNameAlani.touched)) {
                <small class="iletisim-form-alan-hata">
                  {{ firstNameAlani.errors?.['required']
                    ? (dilDegeri === 'en' ? 'Enter your first name.' : 'Adınızı girin.')
                    : (dilDegeri === 'en' ? 'First name must be at least 2 characters.' : 'Ad en az 2 karakter olmalı.') }}
                </small>
              }
            </label>
            <label>
              <span>{{ dilDegeri === 'en' ? 'Last name' : 'Soyad' }} <b class="zorunlu-isaret" aria-hidden="true">*</b></span>
              <input name="lastName" #lastNameAlani="ngModel" [(ngModel)]="form.lastName" required minlength="2" maxlength="80" autocomplete="family-name">
            
              @if (lastNameAlani.invalid && (lastNameAlani.dirty || lastNameAlani.touched)) {
                <small class="iletisim-form-alan-hata">
                  {{ lastNameAlani.errors?.['required']
                    ? (dilDegeri === 'en' ? 'Enter your last name.' : 'Soyadınızı girin.')
                    : (dilDegeri === 'en' ? 'Last name must be at least 2 characters.' : 'Soyad en az 2 karakter olmalı.') }}
                </small>
              }
            </label>
            <label>
              <span>{{ dilDegeri === 'en' ? 'E-mail address' : 'E-posta adresi' }} <b class="zorunlu-isaret" aria-hidden="true">*</b></span>
              <!-- type="email" TEK BAŞINA Angular doğrulaması yapmaz; onu ancak
                   "email" yönergesi devreye sokar. Yoksa "duzmetin" gibi @
                   içermeyen bir değer bile geçerli sayılıp gönderiliyor, backend
                   genel bir 400 döndürüyor ve ziyaretçi hangi alanın hatalı
                   olduğunu öğrenemiyordu (ölçüldü).
                   Desen ayrıca noktalı bir alan adı ve en az iki harfli bir uzantı
                   ister: "a@b" ile "a@b.c" tek başına e-posta doğrulayıcısını
                   geçiyor ama gerçek bir adres değiller. -->
              <input name="email" #emailAlani="ngModel" [(ngModel)]="form.email" type="email"
                     required email maxlength="254" autocomplete="email"
                     pattern="^[A-Za-z0-9._%+\-]+@[A-Za-z0-9]([A-Za-z0-9\-]*[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9\-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$">
              @if (emailAlani.invalid && (emailAlani.dirty || emailAlani.touched)) {
                <small class="iletisim-form-alan-hata">
                  {{ emailAlani.errors?.['required']
                    ? (dilDegeri === 'en' ? 'Enter your e-mail address.' : 'E-posta adresinizi girin.')
                    : (dilDegeri === 'en' ? 'Enter a valid e-mail address.' : 'Geçerli bir e-posta adresi girin.') }}
                </small>
              }
            </label>
            <label>
              <span>{{ dilDegeri === 'en' ? 'Telephone' : 'Telefon' }} <b class="zorunlu-isaret" aria-hidden="true">*</b></span>
              <input name="phone" #phoneAlani="ngModel" [(ngModel)]="form.phone" type="tel" required minlength="7"
                     maxlength="30" autocomplete="tel" pattern="^[0-9+()\-.\s]+$">
              <!-- Boş alanda biçim uyarısı vermek yanıltıcıydı: hiç yazmamış
                   ziyaretçiye "yalnızca rakam kullanın" deniyordu. -->
              @if (phoneAlani.invalid && (phoneAlani.dirty || phoneAlani.touched)) {
                <small class="iletisim-form-alan-hata">
                  {{ phoneAlani.errors?.['required']
                    ? (dilDegeri === 'en' ? 'Enter your telephone number.' : 'Telefon numaranızı girin.')
                    : (dilDegeri === 'en' ? 'Use only digits and common separators (+, (), -).' : 'Yalnızca rakam ve yaygın ayraçlar kullanın (+, (), -).') }}
                </small>
              }
            </label>
          </div>

          <label class="iletisim-form-mesaj">
            <span>{{ dilDegeri === 'en' ? 'Your message' : 'Mesajınız' }} <b class="zorunlu-isaret" aria-hidden="true">*</b></span>
            <textarea name="message" #messageAlani="ngModel" [(ngModel)]="form.message" required minlength="20"
                      maxlength="5000" rows="7"></textarea>
            @if (messageAlani.invalid && (messageAlani.dirty || messageAlani.touched)) {
              <small class="iletisim-form-alan-hata">
                {{ messageAlani.errors?.['required']
                  ? (dilDegeri === 'en' ? 'Write your message.' : 'Mesajınızı yazın.')
                  : (dilDegeri === 'en' ? 'Your message must be at least 20 characters.' : 'Mesajınız en az 20 karakter olmalı.') }}
              </small>
            }
            <small>{{ form.message.length }} / 5000</small>
          </label>

          <label class="iletisim-form-ek">
            <span>{{ dilDegeri === 'en' ? 'Attachment (optional)' : 'Ek dosya (isteğe bağlı)' }}</span>
            <span class="iletisim-form-ek-kutu">
              <input #ekGirdi type="file" accept=".pdf,.jpg,.jpeg,.png,.docx" (change)="ekSec($event)">
              @if (ek(); as dosya) {
                <span class="iletisim-form-ek-secili">
                  {{ dosya.name }} · {{ ekBoyut(dosya.size) }}
                  <button type="button" (click)="ekKaldir(ekGirdi)">
                    {{ dilDegeri === 'en' ? 'Remove' : 'Kaldır' }}
                  </button>
                </span>
              }
            </span>
            <small>
              {{ dilDegeri === 'en'
                ? 'PDF, JPG, PNG or DOCX, up to 10 MB.'
                : 'PDF, JPG, PNG ya da DOCX, en fazla 10 MB.' }}
            </small>
            @if (ekHata()) { <small class="iletisim-form-ek-hata">{{ ekHata() }}</small> }
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
            <!-- Yalnızca gönderim sürerken kapatılır. Geçersiz formda da kapatmak,
                 ziyaretçiye ölü bir düğme gösterip nedenini söylememek demekti;
                 artık tıklanınca eksik alanlar yazılıyor ve ilkine odaklanılıyor. -->
            <button type="submit" [disabled]="gonderiliyor()">
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
  private belge = inject(DOCUMENT);
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

  /** Ek dosyada izin verilen uzantılar; backend ile aynı liste. */
  private readonly ekIzinliUzantilar = ['pdf', 'jpg', 'jpeg', 'png', 'docx'];
  private readonly ekAzamiBoyut = 10 * 1024 * 1024;
  protected ek = signal<File | null>(null);
  protected ekHata = signal('');

  protected ekSec(event: Event): void {
    const girdi = event.target as HTMLInputElement;
    const dosya = girdi.files?.[0] ?? null;
    this.ekHata.set('');
    if (!dosya) { this.ek.set(null); return; }

    const uzanti = dosya.name.split('.').pop()?.toLowerCase() ?? '';
    if (!this.ekIzinliUzantilar.includes(uzanti)) {
      this.ekHata.set(this.dilDegeri === 'en'
        ? 'Unsupported file type. Allowed: PDF, JPG, PNG, DOCX.'
        : 'Desteklenmeyen dosya türü. İzin verilenler: PDF, JPG, PNG, DOCX.');
      this.ek.set(null);
      girdi.value = '';
      return;
    }
    if (dosya.size > this.ekAzamiBoyut) {
      this.ekHata.set(this.dilDegeri === 'en'
        ? 'The file must be smaller than 10 MB.'
        : "Dosya 10 MB'den küçük olmalıdır.");
      this.ek.set(null);
      girdi.value = '';
      return;
    }
    this.ek.set(dosya);
  }

  protected ekKaldir(girdi: HTMLInputElement): void {
    this.ek.set(null);
    this.ekHata.set('');
    girdi.value = '';
  }

  protected ekBoyut(bayt: number): string {
    return bayt < 1024 * 1024
      ? Math.max(1, Math.round(bayt / 1024)) + ' KB'
      : (bayt / (1024 * 1024)).toFixed(1) + ' MB';
  }

  /** Zorunlu alanların ekranda görünen adları; eksik alan uyarısı bunlarla yazılır. */
  private readonly alanAdlari: Record<string, { tr: string; en: string }> = {
    category:  { tr: 'Kategori',        en: 'Category' },
    subject:   { tr: 'Konu',            en: 'Subject' },
    firstName: { tr: 'Ad',              en: 'First name' },
    lastName:  { tr: 'Soyad',           en: 'Last name' },
    email:     { tr: 'E-posta adresi',  en: 'E-mail address' },
    phone:     { tr: 'Telefon',         en: 'Telephone' },
    message:   { tr: 'Mesajınız',       en: 'Your message' }
  };

  protected gonder(kunye: NgForm): void {
    if (this.gonderiliyor()) return;

    // Form eksikse gönderme düğmesi ARTIK KAPATILMIYOR; tıklanınca neyin eksik
    // olduğu söyleniyor. Önceden düğme geçersiz formda devre dışıydı: ziyaretçi
    // sayfaya girdiğinde ölü bir düğme görüyor, hangi alanın eksik olduğunu
    // anlatan hiçbir şey olmadığı için de çıkmaza giriyordu. Yedi zorunlu alanın
    // yalnızca ikisinde (e-posta, telefon) hata mesajı vardı.
    if (kunye.invalid) {
      // Dokunulmamış alanlar da işaretlenir; Angular hata mesajlarını ancak
      // alana dokunulduğunda gösteriyor, oysa hiç dokunulmamış boş alan da eksik.
      kunye.control.markAllAsTouched();

      const eksik = Object.keys(this.alanAdlari)
        .filter((ad) => kunye.control.get(ad)?.invalid)
        .map((ad) => this.alanAdlari[ad][this.dilDegeri === 'en' ? 'en' : 'tr']);

      this.hata.set(
        this.dilDegeri === 'en'
          ? `Please complete the required fields: ${eksik.join(', ')}.`
          : `Lütfen zorunlu alanları doldurun: ${eksik.join(', ')}.`
      );

      // İlk eksik alana odaklanılır: uzun formda ziyaretçi nereye bakacağını
      // aramak zorunda kalmasın.
      const ilk = Object.keys(this.alanAdlari).find((ad) => kunye.control.get(ad)?.invalid);
      if (ilk) {
        const el = this.belge.querySelector<HTMLElement>(`.iletisim-ticket-form [name="${ilk}"]`);
        el?.focus();
        el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
      return;
    }

    this.hata.set('');
    this.gonderiliyor.set(true);
    const govde = new FormData();
    govde.set('language', this.dilDegeri);
    govde.set('category', this.form.category);
    govde.set('subject', this.form.subject);
    govde.set('firstName', this.form.firstName);
    govde.set('lastName', this.form.lastName);
    govde.set('email', this.form.email);
    govde.set('phone', this.form.phone);
    govde.set('message', this.form.message);
    govde.set('website', this.form.website);
    const dosya = this.ek();
    if (dosya) govde.set('attachment', dosya);

    this.http.post<TicketResponse>('/api/contact/tickets', govde).subscribe({
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
    this.ek.set(null);
    this.ekHata.set('');
    this.sonuc.set(null);
    this.hata.set('');
  }

  private bosForm(): TicketForm {
    // category boş başlar: talebin hangi birime düşeceğini öntanımlı bir değer
    // değil, kullanıcı belirlesin. Öntanımlı GENERAL'de düşünmeden geçilen her
    // talep "genel" olarak kaydoluyordu.
    return { category: '', subject: '', firstName: '', lastName: '', email: '', phone: '', message: '', website: '' };
  }
}
