import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  ViewChild,
  effect,
  inject
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Language } from '../core/models';
import { CookiePreferencesService } from '../core/cookie-preferences.service';

/**
 * İlk ziyaret bildirimi ve ortak tercih merkezi.
 *
 * Site şu anda zorunlu olmayan çerez kullanmadığı için yanıltıcı bir
 * "tümünü kabul et" düğmesi yoktur. Panel, kullanılan iki teknik depolama
 * kaydını ve kullanılmayan kategorileri açık biçimde gösterir.
 */
@Component({
  selector: 'bidb-cookie-consent',
  imports: [RouterLink],
  template: `
    @if (preferences.bannerVisible()) {
      <aside class="cerez-bildirimi" aria-labelledby="cerez-bildirim-baslik">
        <div class="cerez-bildirim-ikon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M20.5 13.2A8.7 8.7 0 0 1 10.8 3.5a8.8 8.8 0 1 0 9.7 9.7Z"></path>
            <circle cx="9" cy="10" r="1"></circle>
            <circle cx="13.5" cy="15" r="1"></circle>
            <circle cx="8" cy="16.5" r=".7"></circle>
          </svg>
        </div>
        <div class="cerez-bildirim-metin">
          <h2 id="cerez-bildirim-baslik">
            {{ language === 'en' ? 'About browser storage' : 'Tarayıcı depolaması hakkında' }}
          </h2>
          <p>
            {{ language === 'en'
              ? 'This site currently uses only technically necessary browser storage. No analytics or advertising cookies are active.'
              : 'Bu site şu anda yalnızca teknik olarak gerekli tarayıcı depolamasını kullanır. Analiz veya reklam çerezi etkin değildir.' }}
          </p>
          <a [routerLink]="['/', language, 'cookies']">
            {{ language === 'en' ? 'Read the cookie policy' : 'Çerez politikasını inceleyin' }}
          </a>
        </div>
        <div class="cerez-bildirim-eylemler">
          <button type="button" class="ikincil" (click)="preferences.openPanel()">
            {{ language === 'en' ? 'View details' : 'Tercihleri görüntüle' }}
          </button>
          <button type="button" class="birincil" (click)="preferences.acceptNecessary()">
            {{ language === 'en' ? 'Continue' : 'Anladım, devam et' }}
          </button>
        </div>
      </aside>
    }

    @if (preferences.panelOpen()) {
      <div class="cerez-perde" (click)="preferences.closePanel()">
        <section class="cerez-panel" role="dialog" aria-modal="true"
                 aria-labelledby="cerez-panel-baslik" (click)="$event.stopPropagation()">
          <header>
            <div>
              <p>{{ language === 'en' ? 'Privacy controls' : 'Gizlilik denetimleri' }}</p>
              <h2 #panelTitle id="cerez-panel-baslik" tabindex="-1">
                {{ language === 'en' ? 'Cookie preferences' : 'Çerez tercihleri' }}
              </h2>
            </div>
            <button type="button" class="cerez-kapat" (click)="preferences.closePanel()"
                    [attr.aria-label]="language === 'en' ? 'Close' : 'Kapat'">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18"></path>
              </svg>
            </button>
          </header>

          <p class="cerez-panel-giris">
            {{ language === 'en'
              ? 'Hacettepe University Department of Information Technology does not currently use analytics, personalisation or advertising cookies on this public website.'
              : 'Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı bu kamusal web sitesinde şu anda analiz, kişiselleştirme veya reklam çerezi kullanmamaktadır.' }}
          </p>

          <div class="cerez-kategoriler">
            <article>
              <span class="cerez-durum etkin">{{ language === 'en' ? 'Always active' : 'Her zaman etkin' }}</span>
              <h3>{{ language === 'en' ? 'Necessary technologies' : 'Gerekli teknolojiler' }}</h3>
              <p>
                {{ language === 'en'
                  ? 'They maintain the preference record and, only in the administration panel, the authenticated browser session.'
                  : 'Tercih kaydını ve yalnızca yönetim panelinde doğrulanmış tarayıcı oturumunu sürdürür.' }}
              </p>
            </article>
            <article>
              <span class="cerez-durum kapali">{{ language === 'en' ? 'Not in use' : 'Kullanılmıyor' }}</span>
              <h3>{{ language === 'en' ? 'Analytics' : 'Analiz' }}</h3>
              <p>
                {{ language === 'en'
                  ? 'No visitor measurement, profiling or analytics provider is active.'
                  : 'Ziyaretçi ölçümü, profilleme veya analiz sağlayıcısı etkin değildir.' }}
              </p>
            </article>
            <article>
              <span class="cerez-durum kapali">{{ language === 'en' ? 'Not in use' : 'Kullanılmıyor' }}</span>
              <h3>{{ language === 'en' ? 'Advertising and marketing' : 'Reklam ve pazarlama' }}</h3>
              <p>
                {{ language === 'en'
                  ? 'No advertising network, tracking pixel or marketing cookie is used.'
                  : 'Reklam ağı, izleme pikseli veya pazarlama çerezi kullanılmaz.' }}
              </p>
            </article>
          </div>

          <footer>
            <a [routerLink]="['/', language, 'cookies']" (click)="preferences.closePanel()">
              {{ language === 'en' ? 'Detailed cookie policy' : 'Ayrıntılı çerez politikası' }}
            </a>
            <button type="button" class="birincil" (click)="preferences.acceptNecessary()">
              {{ language === 'en' ? 'Save and continue' : 'Tercihi kaydet ve devam et' }}
            </button>
          </footer>
        </section>
      </div>
    }
  `
})
export class CookieConsentComponent implements OnDestroy {
  @Input({ required: true }) language!: Language;
  @ViewChild('panelTitle') private panelTitle?: ElementRef<HTMLElement>;

  protected preferences = inject(CookiePreferencesService);
  private document = inject(DOCUMENT);

  constructor() {
    effect(() => {
      const open = this.preferences.panelOpen();
      this.document.body.classList.toggle('cerez-panel-acik', open);
      if (open) {
        setTimeout(() => this.panelTitle?.nativeElement.focus());
      }
    });
  }

  @HostListener('document:keydown.escape')
  protected escape(): void {
    if (this.preferences.panelOpen()) this.preferences.closePanel();
  }

  ngOnDestroy(): void {
    this.document.body.classList.remove('cerez-panel-acik');
  }
}
