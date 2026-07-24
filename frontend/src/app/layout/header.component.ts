import { Component, ElementRef, HostListener, Input, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { RouterLink, Router } from '@angular/router';
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

        <!-- Dar ekranda dil seçimi menüden bağımsızdır; kullanıcı gezinme
             panelini açmadan dil değiştirebilir. Masaüstündeki dil seçimi
             aşağıdaki ana menüde kalır. -->
        <span class="ust-eylemler">
          <span class="dil-secim dil-secim-mobil">
            <a [routerLink]="getDilLinki('tr')" [class.etkin]="language === 'tr'" (click)="kapat()">TR</a>
            <a [routerLink]="getDilLinki('en')" [class.etkin]="language === 'en'" (click)="kapat()">EN</a>
          </span>

          <button type="button" class="menu-dugmesi" (click)="menuAcKapa()"
                  [attr.aria-expanded]="menuAcik()"
                  [attr.aria-label]="menuAcik()
                    ? (language === 'en' ? 'Close main menu' : 'Ana menüyü kapat')
                    : (language === 'en' ? 'Open main menu' : 'Ana menüyü aç')">
            <span class="cizgiler" aria-hidden="true"></span>
          </button>
        </span>

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

          <span class="dil-secim dil-secim-masaustu">
            <a [routerLink]="getDilLinki('tr')" [class.etkin]="language === 'tr'" (click)="kapat()">TR</a>
            <a [routerLink]="getDilLinki('en')" [class.etkin]="language === 'en'" (click)="kapat()">EN</a>
          </span>
        </nav>
      </div>
    </header>
  `
})
export class HeaderComponent {
  private _language!: Language;
  @Input({ required: true }) set language(val: Language) {
    if (this._language !== val) {
      this._language = val;
      this.yukle();
    }
  }
  get language(): Language {
    return this._language;
  }

  private api = inject(Api);
  private kok = inject(ElementRef<HTMLElement>);
  private router = inject(Router);

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
  /* İki başlık TEK ADIMDA yerleşir.
     Önce iki istek ayrı ayrı yazılıyordu; hangisi önce dönerse liste önce
     tek başlıkla, sonra iki başlıkla çiziliyordu. Sunucuda oluşan sıra ile
     tarayıcıda oluşan sıra farklı olduğu için, tarayıcı hazır işaretlemeyi
     devralırken düğümleri yanlış eşleştiriyor ve iki menünün bağlantıları
     birbirine karışıyordu. Ara durum olmayınca eşleştirilecek yanlış düğüm
     de kalmıyor. */
  protected acilirBolumler = signal<Menu[]>([]);

  ngOnInit(): void {
    this.yukle();
  }

  private yukle(): void {
    if (!this._language) return;
    
    forkJoin({
      menuler: this.api.menu(this._language),
      anaSayfa: this.api.anaSayfa(this._language)
    }).subscribe(({ menuler, anaSayfa }) => {
      const kurumsal = menuler.length ? menuler[0] : null;
      const servisler: Menu = {
        title: this._language === 'en' ? 'Our Services' : 'Hizmetlerimiz',
        items: anaSayfa.services.map((s) => ({ label: s.name, url: s.url, newTab: s.newTab }))
      };
      // Sıra sabit: Kurumsal → Hizmetlerimiz.
      this.acilirBolumler.set([kurumsal, servisler]
        .filter((b): b is Menu => b !== null && b.items.length > 0));
    });
  }

  getDilLinki(hedefDil: Language): string {
    const url = this.router.url.split(/[?#]/)[0];
    if (url.startsWith('/' + this.language)) {
      return url.replace('/' + this.language, '/' + hedefDil);
    }
    return '/' + hedefDil;
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

