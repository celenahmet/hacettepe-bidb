import { Component, ElementRef, HostListener, Input, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Api } from '../core/api.service';
import { Language, Menu } from '../core/models';

/**
 * Üst şerit: kurum kimliği ve ana gezinme.
 *
 * Sol menü sayfa içi ayrıntıyı taşır; üst şerit ise sitenin ana bölümlerine
 * her sayfadan erişim verir. "Kurumsal" başlığı altındaki bağlantılar menü
 * verisinden okunur — iki yerde ayrı liste tutulmaz.
 *
 * Sosyal medya bağlantıları buradan kaldırıldı; yalnızca alt bilgide,
 * ikonlarla yer alır.
 */
@Component({
  selector: 'bidb-header',
  imports: [RouterLink],
  template: `
    <a class="atla" href="#ana-icerik">{{ language === 'en' ? 'Skip to content' : 'İçeriğe atla' }}</a>

    <header class="ust">
      <div class="kap ust-ic">
        <a class="logo" [routerLink]="['/', language]">
          <img src="/hu-logo.svg" alt="" aria-hidden="true" width="46" height="52">
          <span class="logo-yazi">
            <strong>{{ language === 'en' ? 'Hacettepe University' : 'Hacettepe Üniversitesi' }}</strong>
            <small>{{ language === 'en' ? 'Department of Information Technology' : 'Bilgi İşlem Daire Başkanlığı' }}</small>
          </span>
        </a>

        <button type="button" class="menu-dugmesi" (click)="menuAcKapa()"
                [attr.aria-expanded]="menuAcik()"
                [attr.aria-label]="language === 'en' ? 'Menu' : 'Menü'">
          <span class="cizgiler" aria-hidden="true"></span>
          {{ language === 'en' ? 'Menu' : 'Menü' }}
        </button>

        <nav class="ust-menu" [class.acik]="menuAcik()"
             [attr.aria-label]="language === 'en' ? 'Main menu' : 'Ana menü'">
          <a [routerLink]="['/', language]" (click)="kapat()">
            {{ language === 'en' ? 'Home Page' : 'Ana Sayfa' }}
          </a>
          <a [routerLink]="['/', language, 'about']" (click)="kapat()">
            {{ language === 'en' ? 'About Us' : 'Hakkımızda' }}
          </a>

          @for (b of acilirBolumler(); track b.title) {
            <span class="acilir" [class.acik]="acikBolum() === b.title">
              <button type="button" (click)="bolumAcKapa(b.title)"
                      [attr.aria-expanded]="acikBolum() === b.title">
                {{ b.title }}
                <span class="ok" aria-hidden="true"></span>
              </button>

              <span class="acilir-liste">
                @for (o of b.items; track o.url) {
                  @if (o.newTab) {
                    <a [href]="o.url" target="_blank" rel="noopener" (click)="kapat()">{{ o.label }}</a>
                  } @else {
                    <a [routerLink]="o.url" (click)="kapat()">{{ o.label }}</a>
                  }
                }
              </span>
            </span>
          }

          <a [routerLink]="['/', language, 'contact']" (click)="kapat()">
            {{ language === 'en' ? 'Contact' : 'İletişim' }}
          </a>

          <span class="dil-secim">
            <a routerLink="/tr" [class.etkin]="language === 'tr'" (click)="kapat()">TR</a>
            <a routerLink="/en" [class.etkin]="language === 'en'" (click)="kapat()">EN</a>
          </span>
        </nav>
      </div>
    </header>
  `
})
export class HeaderComponent {
  @Input({ required: true }) language!: Language;

  private api = inject(Api);
  private kok = inject(ElementRef<HTMLElement>);

  /** Dar ekranda menü panelinin açık olup olmadığı */
  protected menuAcik = signal(false);

  /** Açık olan açılır başlık; aynı anda yalnızca biri açılır */
  protected acikBolum = signal<string | null>(null);

  /**
   * Üst şeritteki açılır başlıklar:
   *   1. Kurumsal — sol menünün ilk bölümü (aynı kaynak, ayrı liste yok)
   *   2. Servis ve Uygulamalar — ana sayfadaki servis karuselinin kayıtları
   *
   * İkisi de veriden gelir; panelden düzenlenince üst menü de değişir.
   */
  private kurumsal = signal<Menu | null>(null);
  private servisler = signal<Menu | null>(null);

  /* Sıra sabittir: iki istek hangi sırayla dönerse dönsün, başlıklar
     her zaman Kurumsal → Servis ve Uygulamalar olarak dizilir. */
  protected acilirBolumler = computed(() =>
    [this.kurumsal(), this.servisler()].filter((b): b is Menu => b !== null && b.items.length > 0)
  );

  ngOnInit(): void {
    this.api.menu(this.language).subscribe((menuler) => {
      this.kurumsal.set(menuler.length ? menuler[0] : null);
    });

    this.api.anaSayfa(this.language).subscribe((veri) => {
      this.servisler.set({
        title: this.language === "en" ? "Our Services" : "Hizmetlerimiz",
        items: veri.services.map((s) => ({ label: s.name, url: s.url, newTab: s.newTab }))
      });
    });
  }

  protected menuAcKapa(): void {
    this.menuAcik.update((a) => !a);
    if (!this.menuAcik()) this.acikBolum.set(null);
  }

  protected bolumAcKapa(ad: string): void {
    this.acikBolum.update((a) => (a === ad ? null : ad));
  }

  protected kapat(): void {
    this.menuAcik.set(false);
    this.acikBolum.set(null);
  }

  /** Dışarı tıklanınca açılır liste kapanır. */
  @HostListener('document:click', ['$event'])
  disariTiklandi(olay: MouseEvent): void {
    if (!this.kok.nativeElement.contains(olay.target as Node)) this.kapat();
  }

  /** Esc tuşu açık listeyi kapatır — klavye kullanıcısı kapana sıkışmaz. */
  @HostListener('document:keydown.escape')
  kacisTusu(): void {
    this.kapat();
  }
}
