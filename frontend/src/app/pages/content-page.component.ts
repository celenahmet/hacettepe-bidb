import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

/** /tr/<slug> ve /en/<slug> adreslerindeki içerik sayfası. */
@Component({
  selector: 'bidb-content-page',
  imports: [SideMenuComponent, StaffListComponent, ContactBlockComponent, FaqComponent, EImzaNavComponent, UnitsComponent],
  template: `
    <div class="kap sayfa-duzen">
      <aside class="yan">
        <!-- E-imza rehberi kendi menüsüyle gelir (kaynakta da öyleydi);
             site geneline üst şeritten erişilir. -->
        @if (sayfa()?.slug?.startsWith('e-signature')) {
          <bidb-eimza-nav [dilDegeri]="language()" [etkinYol]="etkinYol()"></bidb-eimza-nav>
        } @else {
          <bidb-side-menu [dilDegeri]="language()"></bidb-side-menu>
        }
      </aside>

      <main id="ana-icerik" class="icerik-alani"
            [class.web-servis-sayfasi]="sayfa()?.slug === 'web-services'"
            [class.kurul-sayfasi]="sayfa()?.slug === 'committees'"
            [class.organizasyon-sayfasi]="sayfa()?.slug === 'org-chart'">
        @if (sayfa(); as s) {
          <header class="sayfa-tepe">
            @if (bolum(); as b) { <p class="sayfa-bolum">{{ b }}</p> }
            <h1 class="sayfa-baslik">{{ s.title }}</h1>
          </header>
          @if (s.slug === 'org-chart') {
            <p class="organizasyon-giris">
              {{ language() === 'en'
                ? 'The organizational structure of the Information Technology Department is shown below.'
                : 'Bilgi İşlem Daire Başkanlığımızın organizasyon yapısı aşağıda gösterilmiştir.' }}
            </p>
          }
          @if (s.slug === 'overview') {
            <!-- Genel Tanıtım: birim görev tanımları kart ızgarasına
                 ayrıştırılır; içerik birebir korunur. -->
            <bidb-units [rawHtml]="s.contentHtml ?? ''" [dilDegeri]="language()"></bidb-units>
          } @else if (s.slug === 'faq') {
            <!-- SSS: kaynak akordeon HTML'i arama+filtreli modern bir
                 akordeona ayrıştırılır; içerik birebir korunur. -->
            <bidb-faq [rawHtml]="s.contentHtml ?? ''" [dilDegeri]="language()"></bidb-faq>
          } @else {
            <div class="icerik" [innerHTML]="govde()"></div>
          }

          <!-- Personel listesi HTML olarak saklanmaz; birim ve kişi
               kayıtlarından üretilir. Sayfa kaydı başlık, adres, menü bağı
               ve arama motoru bilgileri için durmayı sürdürür. -->
          @if (s.slug === 'staff') {
            <bidb-staff-list [dilDegeri]="language()"></bidb-staff-list>
          }

          <!-- İletişim bilgileri sayfa metnine yazılmaz; alt bilgiyle aynı
               kayıtlardan gelir. Metne gömülselerdi panelden bir numara
               değiştiğinde alt bilgi doğruyu, bu sayfa yanlışı gösterirdi. -->
          @if (s.slug === 'about' || s.slug === 'contact') {
            <bidb-contact-block [dilDegeri]="language()"></bidb-contact-block>
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
  private api = inject(Api);
  private seo = inject(Seo);
  private temizleyici = inject(DomSanitizer);

  protected language = signal<Language>('tr');
  protected govde = signal<SafeHtml>('');

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
        return this.api.sayfa(language, slug).pipe(
          tap((s) => {
            this.seo.uygula(s, language, `/${language}/${slug}`);
            // İçerik kaynaktan birebir alındığı ve kurum tarafından yönetildiği için
            // olduğu gibi basılır.
            this.govde.set(this.temizleyici.bypassSecurityTrustHtml(icerigiHazirla(s?.contentHtml ?? '')));
          }),
          map((s) => s as Page | null)
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
