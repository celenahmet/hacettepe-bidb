import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map, tap } from 'rxjs/operators';
import { Api } from '../core/api.service';
import { Seo } from '../core/seo.service';
import { icerigiHazirla } from '../core/icerik-bicim';
import { Language, Page } from '../core/models';
import { SideMenuComponent } from '../layout/side-menu.component';
import { StaffListComponent } from './staff-list.component';
import { ContactBlockComponent } from './contact-block.component';
import { FaqComponent } from './faq.component';
import { EImzaNavComponent } from './e-imza-nav.component';
import { UnitsComponent } from './units.component';
import { EmailOperationsComponent } from './email-operations.component';
import { WebmailServicesComponent } from './webmail-services.component';
import { Office365GuidesComponent } from './office365-guides.component';
import { ContactFormComponent } from './contact-form.component';

/** /tr/<slug> ve /en/<slug> adreslerindeki içerik sayfası. */
@Component({
  selector: 'bidb-content-page',
  imports: [
    RouterLink,
    SideMenuComponent,
    StaffListComponent,
    ContactBlockComponent,
    FaqComponent,
    EImzaNavComponent,
    UnitsComponent,
    EmailOperationsComponent,
    WebmailServicesComponent,
    Office365GuidesComponent,
    ContactFormComponent
  ],
  template: `
    <header class="sayfa-seridi">
      <div class="kap sayfa-seridi-ic">
        @if (bolum(); as b) { <p class="sayfa-seridi-etiket">{{ b }}</p> }
        @if (sayfa(); as s) {
          <h1 class="sayfa-seridi-baslik">{{ s.title }}</h1>
          @if (seritAciklamasi(); as a) { <p class="sayfa-seridi-aciklama">{{ a }}</p> }
        }
        <nav [attr.aria-label]="language() === 'en' ? 'Breadcrumb' : 'Sayfa yolu'">
          <ol class="sayfa-iz">
            <li><a [routerLink]="'/' + language()">{{ language() === 'en' ? 'Home' : 'Ana Sayfa' }}</a></li>
            @if (bolum(); as b) { <li><span>{{ b }}</span></li> }
            @if (sayfa(); as s) { <li aria-current="page"><span>{{ s.title }}</span></li> }
          </ol>
        </nav>
      </div>
    </header>
    <div class="kap sayfa-duzen">
      <aside class="yan">
        <!-- E-imza rehberi kendi menüsüyle gelir (kaynakta da öyleydi);
             site geneline üst şeritten erişilir. -->
        @if (sayfa()?.slug?.startsWith('e-signature')) {
          @defer (hydrate on immediate) {
            <bidb-eimza-nav [dilDegeri]="language()" [etkinYol]="etkinYol()"></bidb-eimza-nav>
          }
        } @else {
          <bidb-side-menu [dilDegeri]="language()"></bidb-side-menu>
        }
      </aside>

      <main id="ana-icerik" class="icerik-alani"
            [class.web-servis-sayfasi]="sayfa()?.slug === 'web-services'"
            [class.dokumanlar-sayfasi]="sayfa()?.slug === 'documents'"
            [class.kurul-sayfasi]="sayfa()?.slug === 'committees'"
            [class.cms-sayfasi]="sayfa()?.slug === 'cms'"
            [class.proxy-sayfasi]="sayfa()?.slug === 'proxy'"
            [class.personel-sayfasi]="sayfa()?.slug === 'staff'"
            [class.organizasyon-sayfasi]="sayfa()?.slug === 'org-chart'">
        @if (sayfa(); as s) {
          <!-- Sayfa başlığı (h1) üstteki şeritte; burada tekrarlanmaz.
               Personel sayfasının amblemli ayracı listeyi başlattığı için
               kendi başına durur. -->
          @if (s.slug === 'staff') {
            <div class="personel-baslik-ayrac" aria-hidden="true">
              <span><img src="/hu-logo.svg" alt="" width="16" height="26"></span>
            </div>
          }
          @if (s.slug === 'org-chart') {
            <p class="organizasyon-giris">
              {{ language() === 'en'
                ? 'The organizational structure of the Information Technology Department is shown below.'
                : 'Bilgi İşlem Daire Başkanlığımızın organizasyon yapısı aşağıda gösterilmiştir.' }}
            </p>
          }
          @if (s.slug === 'office365') {
            <!-- Office 365: kaynak PDF bağlantıları, mevcut Microsoft
                 ikonları ve kısa kullanım açıklamalarıyla ayrıştırılır. -->
            @defer (hydrate on immediate) {
              <bidb-office365-guides
                [rawHtml]="s.contentHtml ?? ''"
                [dilDegeri]="language()"></bidb-office365-guides>
            }
          } @else if (s.slug === 'webmail') {
            <!-- E-posta giriş servisleri: kaynak görseller ve bağlantılar
                 korunur; yalnızca bu sayfaya özel kullanım yönlendirmesi
                 ve güvenli erişim açıklamasıyla sunulur. -->
            @defer (hydrate on immediate) {
              <bidb-webmail-services
                [rawHtml]="s.contentHtml ?? ''"
                [dilDegeri]="language()"></bidb-webmail-services>
            }
          } @else if (s.slug === 'email') {
            <!-- E-Posta İşlemleri: kaynak bağlantıları, amaçlarına göre
                 ayrışan erişilebilir işlem kartlarına dönüştürülür. -->
            @defer (hydrate on immediate) {
              <bidb-email-operations
                [rawHtml]="s.contentHtml ?? ''"
                [dilDegeri]="language()"></bidb-email-operations>
            }
          } @else if (s.slug === 'overview') {
            <!-- Genel Tanıtım: birim görev tanımları kart ızgarasına
                 ayrıştırılır; içerik birebir korunur. -->
            @defer (hydrate on immediate) {
              <bidb-units [rawHtml]="s.contentHtml ?? ''" [dilDegeri]="language()"></bidb-units>
            }
          } @else if (s.slug === 'faq') {
            <!-- SSS: kaynak akordeon HTML'i arama+filtreli modern bir
                 akordeona ayrıştırılır; içerik birebir korunur. -->
            @defer (hydrate on immediate) {
              <bidb-faq [rawHtml]="s.contentHtml ?? ''" [dilDegeri]="language()"></bidb-faq>
            }
          } @else {
            <!-- mailto bağlantıları kaynak HTML'in kendi içinde geldiği için
                 (ör. organizasyon şeması), tek tek düzenlenemez; tıklamayı
                 üstten yakalayıp panoya kopyalama davranışı ekleniyor. -->
            <div class="icerik" [innerHTML]="govde()" (click)="epostaTiklama($event)"></div>
          }

          @if (kopyalandiEposta(); as eposta) {
            <div class="eposta-kopyalandi-bildirim" role="status">
              <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6"></path></svg>
              {{ language() === 'en' ? 'Copied to clipboard: ' : 'Panoya kopyalandı: ' }}{{ eposta }}
            </div>
          }

          <!-- Personel listesi HTML olarak saklanmaz; birim ve kişi
               kayıtlarından üretilir. Sayfa kaydı başlık, adres, menü bağı
               ve arama motoru bilgileri için durmayı sürdürür. -->
          @if (s.slug === 'staff') {
            @defer (hydrate on immediate) {
              <bidb-staff-list [dilDegeri]="language()"></bidb-staff-list>
            }
          }

          <!-- İletişim bilgileri sayfa metnine yazılmaz; alt bilgiyle aynı
               kayıtlardan gelir. Metne gömülselerdi panelden bir numara
               değiştiğinde alt bilgi doğruyu, bu sayfa yanlışı gösterirdi. -->
          @if (s.slug === 'about' || s.slug === 'contact') {
            @defer (hydrate on immediate) {
              <bidb-contact-block
                [dilDegeri]="language()"
                [haritaGoster]="s.slug === 'contact'">
              </bidb-contact-block>
            }
          }
          @if (s.slug === 'contact') {
            @defer (hydrate on immediate) {
              <bidb-contact-form [dilDegeri]="language()"></bidb-contact-form>
            }
          }

          @if (belgeler().length) {
            <section class="belgeler">
              <h2>{{ language() === 'en' ? 'Documents' : 'Belgeler' }}</h2>
              <ul>
                @for (b of belgeler(); track b.url) {
                  <li>
                    <a [href]="b.url" target="_blank" rel="noopener">
                      <span class="belge-tur">{{ b.fileType }}</span>{{ b.name }}
                    </a>
                  </li>
                }
              </ul>
            </section>
          }
        } @else {
          <h1 class="sayfa-baslik">{{ language() === 'en' ? 'Page not found' : 'Sayfa bulunamadı' }}</h1>
          <p>{{ language() === 'en' ? 'The address may have changed or the page may have been removed.' : 'Adres değişmiş veya sayfa kaldırılmış olabilir.' }}</p>
        }
      </main>
    </div>
  `
})
export class ContentPageComponent {
  private rota = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(Api);
  private seo = inject(Seo);
  private temizleyici = inject(DomSanitizer);

  protected language = signal<Language>('tr');
  protected govde = signal<SafeHtml>('');
  protected kopyalandiEposta = signal<string | null>(null);
  private kopyalandiZamanlayici?: ReturnType<typeof setTimeout>;

  /**
   * mailto bağlantısına tıklamayı yakalar: varsayılan davranış (e-posta
   * istemcisinin açılması) engellenmez, ayrıca adres panoya kopyalanıp
   * kısa süreli bir bildirim gösterilir.
   */
  protected async epostaTiklama(event: MouseEvent): Promise<void> {
    const hedef = (event.target as HTMLElement).closest?.('a[href^="mailto:"]') as HTMLAnchorElement | null;
    if (!hedef) return;
    const eposta = hedef.href.replace(/^mailto:/, '').split('?')[0];
    if (!eposta) return;

    try {
      await navigator.clipboard.writeText(eposta);
    } catch {
      if (typeof document === 'undefined') return;
      const alan = document.createElement('textarea');
      alan.value = eposta;
      alan.style.position = 'fixed';
      alan.style.opacity = '0';
      document.body.appendChild(alan);
      alan.select();
      document.execCommand('copy');
      alan.remove();
    }

    clearTimeout(this.kopyalandiZamanlayici);
    this.kopyalandiEposta.set(eposta);
    this.kopyalandiZamanlayici = setTimeout(() => this.kopyalandiEposta.set(null), 2500);
  }

  /**
   * Sayfaya bağlı belgelerden, metinde ZATEN bağlantısı verilmiş olanlar
   * çıkarılır.
   *
   * Aktarımda belgeler sayfa metnindeki bağlantılardan türetildi; sonuç,
   * aynı yedi PDF'in önce metinde sonra "Belgeler" başlığı altında bir kez
   * daha listelenmesi oldu. Ziyaretçi aynı listeyi iki kez okuyor,
   * hangisinin farklı olduğunu anlamaya çalışıyordu.
   *
   * Bölüm kaldırılmıyor: metinde geçmeyen bir belge varsa (panelden
   * eklenmiş bir form gibi) orada görünmeyi sürdürüyor. Yalnızca tekrar
   * ayıklanıyor.
   */
  protected belgeler = computed(() => {
    const sayfa = this.sayfa();
    if (!sayfa?.documents?.length) return [];
    const govde = sayfa.contentHtml ?? '';
    return sayfa.documents.filter((b) => !govde.includes(b.url));
  });

  /**
   * Başlık şeridinde başlığın altında gösterilecek kısa tanıtım cümlesi.
   *
   * Sayfa kayıtlarındaki seoDescription iki farklı yoldan doluyor: bir kısmı
   * elle yazılmış gerçek bir tanıtım ("Hacettepe Üniversitesi Bilgi İşlem
   * Daire Başkanlığı: kuruluş ve yasal dayanak…"), bir kısmı ise sayfa
   * metninin ilk cümlelerinden otomatik kırpılmış ham bir parça ("Mustafa
   * Gökhan GÜZEL Daire Başkanı gokhan{at}hacettepe.edu.tr…"). İkincisi bir
   * tanıtım cümlesi değil ve şeritte okunmaz görünüyor.
   *
   * Otomatik kırpılanlar sonuna "…" konarak üretildiği için ayırt edilebilir;
   * yalnızca düzgün noktalanmış, makul uzunluktaki metinler gösterilir.
   */
  protected seritAciklamasi = computed(() => {
    const metin = this.sayfa()?.seoDescription?.trim();
    if (!metin || metin.endsWith('…') || metin.endsWith('...')) return null;
    if (metin.length > 220 || metin.includes('{at}')) return null;
    return metin;
  });

  /** Sayfanın ait olduğu menü bölümü ("Kurumsal", "Servislerimiz"…).
   *  Başlığın üstünde bağlam olarak gösterilir; ziyaretçi sitenin neresinde
   *  olduğunu tek bakışta anlar. Menü verisinden türetilir, uydurulmaz. */
  protected bolum = signal<string | null>(null);

  /** Bulunulan sayfanın adresi; e-imza menüsünde grubu açmak için. */
  protected etkinYol = signal('');

  protected sayfa = toSignal(
    this.rota.paramMap.pipe(
      switchMap((p) => {
        const language = (p.get('language') as Language) ?? 'tr';
        const slug = p.get('slug') ?? 'home';
        this.language.set(language);
        this.etkinYol.set("/" + language + "/" + slug);
        this.bolumuCoz(language, "/" + language + "/" + slug);
        return this.api.sayfaSonucu(language, slug).pipe(
          tap(({ page: s, status }) => {
            if (!s) {
              void this.router.navigate(['/error', status], { replaceUrl: true });
              return;
            }
            this.seo.uygula(s, language, `/${language}/${slug}`);
            // İçerik kaynaktan birebir alındığı ve kurum tarafından yönetildiği için
            // olduğu gibi basılır.
            this.govde.set(this.temizleyici.bypassSecurityTrustHtml(icerigiHazirla(s?.contentHtml ?? '')));
          }),
          map(({ page }) => page as Page | null)
        );
      })
    ),
    { initialValue: null }
  );

  /** Adresi menüde arar ve içinde bulunduğu bölümün başlığını alır. */
  private bolumuCoz(language: Language, yol: string): void {
    this.api.menu(language).subscribe((menuler) => {
      const bulunan = menuler.find((m) => m.items.some((o) => o.url === yol));
      this.bolum.set(bulunan ? bulunan.title : null);
    });
  }
}
