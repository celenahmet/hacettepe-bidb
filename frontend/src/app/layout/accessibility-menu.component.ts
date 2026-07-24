import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  inject,
  signal
} from '@angular/core';
import { Language } from '../core/models';

type TogglePreference = 'contrast' | 'links' | 'cursor' | 'guide' | 'images';

interface AccessibilityState {
  font: number;
  contrast: boolean;
  links: boolean;
  cursor: boolean;
  guide: boolean;
  images: boolean;
  compact: boolean;
  positionY: number;
  version: number;
}

const STORAGE_KEY = 'bidb-accessibility-preferences';
const ROOT_CLASSES = [
  'a11y-font-1',
  'a11y-font-2',
  'a11y-contrast',
  'a11y-links',
  'a11y-cursor',
  'a11y-guide',
  'a11y-images'
];
const DEFAULT_STATE: AccessibilityState = {
  font: 0,
  contrast: false,
  links: false,
  cursor: false,
  guide: false,
  images: false,
  compact: true,
  positionY: 0.7,
  version: 1
};

/**
 * Ziyaretçi sitesinin erişilebilirlik araçları.
 *
 * Tercihler, çerez politikasındaki "gerekli teknolojiler" kapsamında yalnızca
 * bu tarayıcıda saklanır. Sunucuya kullanıcı, cihaz veya tercih verisi gitmez.
 */
@Component({
  selector: 'bidb-accessibility-menu',
  template: `
    <aside #widget class="a11y-widget" [class.compact]="state().compact"
           [style.--a11y-widget-y.px]="widgetY()"
           [attr.aria-label]="metin('Erişilebilirlik menüsü', 'Accessibility menu')">
      <button #trigger class="a11y-trigger" type="button"
              [class.dragging]="dragging()"
              [attr.aria-expanded]="panelOpen()"
              aria-controls="a11y-panel"
              [attr.aria-label]="metin('Erişilebilirlik menüsünü aç', 'Open accessibility menu')"
              [attr.title]="metin('Açmak için tıklayın, taşımak için sürükleyin', 'Click to open, drag to move')"
              (pointerdown)="dragStart($event)"
              (pointermove)="dragMove($event)"
              (pointerup)="dragEnd($event)"
              (pointercancel)="dragEnd($event)"
              (click)="togglePanel($event)">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="4.5" r="2"/>
          <path d="M5 8h14M12 7.5v12M8 21l4-6 4 6"/>
        </svg>
        <svg class="a11y-move-icon" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 1v14M1 8h14M5.5 3.5 8 1l2.5 2.5M5.5 12.5 8 15l2.5-2.5M3.5 5.5 1 8l2.5 2.5M12.5 5.5 15 8l-2.5 2.5"/>
        </svg>
      </button>

      @if (panelOpen()) {
        <section #panel class="a11y-panel" id="a11y-panel" role="dialog"
                 [attr.aria-label]="metin('Erişilebilirlik ayarları', 'Accessibility settings')"
                 [style.top.px]="panelTop()">
          <header>
            <span>
              <small>{{ metin('GÖRÜNÜM VE OKUMA', 'DISPLAY AND READING') }}</small>
              <strong>{{ metin('Erişilebilirlik araçları', 'Accessibility tools') }}</strong>
            </span>
            <span class="a11y-panel-tools">
              <button class="a11y-compact-toggle" type="button"
                      [class.active]="state().compact"
                      [attr.aria-pressed]="state().compact"
                      [attr.aria-label]="state().compact
                        ? metin('Düğmeyi normal boyuta getir', 'Use normal button size')
                        : metin('Düğmeyi kompakt yap', 'Use compact button size')"
                      (click)="toggleCompact()">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m8 3-5 5M3 4v4h4M16 21l5-5M21 20v-4h-4"/>
                </svg>
              </button>
              <button class="a11y-close" type="button" (click)="closePanel()"
                      [attr.aria-label]="metin('Menüyü kapat', 'Close menu')">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
              </button>
            </span>
          </header>

          <div class="a11y-grid">
            <button class="a11y-action" type="button" [class.active]="state().font > 0"
                    [attr.aria-pressed]="state().font > 0" (click)="cycleFont()">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 19 9.5 5h2L17 19M6 14h9M18 8h4M20 6v4"/>
              </svg>
              <span>{{ metin('Yazı boyutu', 'Text size') }}</span>
              <small>{{ fontLabel() }}</small>
            </button>

            <button class="a11y-action" type="button" [class.active]="state().contrast"
                    [attr.aria-pressed]="state().contrast" (click)="toggle('contrast')">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="8"/>
                <path d="M12 4v16M12 4a8 8 0 0 1 0 16" class="dolu"/>
              </svg>
              <span>{{ metin('Yüksek kontrast', 'High contrast') }}</span>
            </button>

            <button class="a11y-action" type="button" [class.active]="speaking()"
                    [attr.aria-pressed]="speaking()" (click)="speak()">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 10v4h3l4 3V7l-4 3H5Z"/>
                <path d="M15 9c1.5 1.6 1.5 4.4 0 6M18 6c3.2 3.3 3.2 8.7 0 12"/>
              </svg>
              <span>{{ metin('Sesli okuma', 'Read aloud') }}</span>
            </button>

            <button class="a11y-action" type="button" [class.active]="state().links"
                    [attr.aria-pressed]="state().links" (click)="toggle('links')">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m10 13 4-4M8.5 16.5l-1 1a3.5 3.5 0 0 1-5-5l3-3a3.5 3.5 0 0 1 5 0M15.5 7.5l1-1a3.5 3.5 0 0 1 5 5l-3 3a3.5 3.5 0 0 1-5 0"/>
              </svg>
              <span>{{ metin('Bağlantıları vurgula', 'Highlight links') }}</span>
            </button>

            <button class="a11y-action" type="button" [class.active]="state().cursor"
                    [attr.aria-pressed]="state().cursor" (click)="toggle('cursor')">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 3 12 9-6 1 3 6-2.5 1.2-3-6L6 19V3Z"/>
              </svg>
              <span>{{ metin('Büyük imleç', 'Large cursor') }}</span>
            </button>

            <button class="a11y-action" type="button" [class.active]="state().guide"
                    [attr.aria-pressed]="state().guide" (click)="toggle('guide')">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg>
              <span>{{ metin('Okuma kılavuzu', 'Reading guide') }}</span>
            </button>

            <button class="a11y-action" type="button" [class.active]="state().images"
                    [attr.aria-pressed]="state().images" (click)="toggle('images')">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2"/>
                <circle cx="8" cy="10" r="1.5"/>
                <path d="m4 17 5-4 3 2 3-3 5 5"/>
              </svg>
              <span>{{ metin('Görselleri gizle', 'Hide images') }}</span>
            </button>

            <button class="a11y-action reset" type="button" (click)="reset()">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7v5h-5M19 12a7 7 0 1 0-2 5"/></svg>
              <span>{{ metin('Ayarları sıfırla', 'Reset settings') }}</span>
            </button>
          </div>

          <footer>
            {{ metin('Tercihler yalnızca bu tarayıcıda saklanır.', 'Preferences are stored only in this browser.') }}
          </footer>
        </section>
      }

      <div class="a11y-reading-guide" aria-hidden="true"
           [style.--a11y-guide-y.px]="guideY()"></div>
    </aside>
  `
})
export class AccessibilityMenuComponent implements OnInit, OnDestroy {
  @Input({ required: true }) language!: Language;
  @ViewChild('widget') private widget?: ElementRef<HTMLElement>;
  @ViewChild('trigger') private trigger?: ElementRef<HTMLButtonElement>;
  @ViewChild('panel') private panel?: ElementRef<HTMLElement>;

  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private browser = isPlatformBrowser(this.platformId);
  private startPointerY = 0;
  private startWidgetY = 0;
  private dragged = false;

  protected state = signal<AccessibilityState>({ ...DEFAULT_STATE });
  protected panelOpen = signal(false);
  protected speaking = signal(false);
  protected dragging = signal(false);
  protected widgetY = signal(0);
  protected guideY = signal(0);
  protected panelTop = signal(12);

  ngOnInit(): void {
    if (!this.browser) return;
    this.state.set(this.load());
    this.apply();
  }

  ngOnDestroy(): void {
    if (!this.browser) return;
    window.speechSynthesis?.cancel();
    this.document.documentElement.classList.remove(...ROOT_CLASSES);
  }

  protected metin(tr: string, en: string): string {
    return this.language === 'en' ? en : tr;
  }

  protected fontLabel(): string {
    const labels = this.language === 'en'
      ? ['Standard', 'Large', 'Larger']
      : ['Standart', 'Büyük', 'Daha büyük'];
    return labels[this.state().font] ?? labels[0];
  }

  protected cycleFont(): void {
    this.update({ font: (this.state().font + 1) % 3 });
  }

  protected toggle(name: TogglePreference): void {
    this.update({ [name]: !this.state()[name] });
  }

  protected toggleCompact(): void {
    this.update({ compact: !this.state().compact });
    setTimeout(() => this.positionPanel());
  }

  protected reset(): void {
    if (this.browser) window.speechSynthesis?.cancel();
    this.speaking.set(false);
    this.state.set({ ...DEFAULT_STATE });
    this.save();
    this.apply();
    setTimeout(() => this.positionPanel());
  }

  protected togglePanel(event: MouseEvent): void {
    if (this.dragged) {
      event.preventDefault();
      this.dragged = false;
      return;
    }
    if (this.panelOpen()) {
      this.closePanel();
      return;
    }
    this.panelOpen.set(true);
    setTimeout(() => {
      this.positionPanel();
      this.panel?.nativeElement.querySelector<HTMLButtonElement>('button')?.focus();
    });
  }

  protected closePanel(): void {
    this.panelOpen.set(false);
    setTimeout(() => this.trigger?.nativeElement.focus());
  }

  protected speak(): void {
    if (!this.browser || !('speechSynthesis' in window)) return;
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      this.speaking.set(false);
      return;
    }

    const selection = String(window.getSelection() ?? '').trim();
    const main = this.document.querySelector<HTMLElement>('main');
    const content = selection || main?.innerText || this.document.body.innerText;
    const utterance = new SpeechSynthesisUtterance(content.slice(0, 14_000));
    utterance.lang = this.language === 'en' ? 'en-US' : 'tr-TR';
    utterance.rate = 0.92;
    utterance.onend = utterance.onerror = () => this.speaking.set(false);
    this.speaking.set(true);
    window.speechSynthesis.speak(utterance);
  }

  protected dragStart(event: PointerEvent): void {
    if (event.button !== undefined && event.button !== 0) return;
    this.startPointerY = event.clientY;
    this.startWidgetY = this.widgetY();
    this.dragged = false;
    this.dragging.set(true);
    this.trigger?.nativeElement.setPointerCapture(event.pointerId);
  }

  protected dragMove(event: PointerEvent): void {
    const trigger = this.trigger?.nativeElement;
    if (!trigger?.hasPointerCapture(event.pointerId)) return;
    const distance = event.clientY - this.startPointerY;
    if (Math.abs(distance) < 4 && !this.dragged) return;
    event.preventDefault();
    this.dragged = true;
    const y = Math.max(34, Math.min(window.innerHeight - 34, this.startWidgetY + distance));
    this.widgetY.set(y);
    const state = { ...this.state(), positionY: y / window.innerHeight };
    this.state.set(state);
    if (this.panelOpen()) this.positionPanel();
  }

  protected dragEnd(event: PointerEvent): void {
    const trigger = this.trigger?.nativeElement;
    if (trigger?.hasPointerCapture(event.pointerId)) trigger.releasePointerCapture(event.pointerId);
    this.dragging.set(false);
    if (this.dragged) this.save();
  }

  @HostListener('document:keydown.escape')
  protected escape(): void {
    if (this.panelOpen()) this.closePanel();
  }

  @HostListener('document:pointerdown', ['$event'])
  protected outside(event: PointerEvent): void {
    if (!this.panelOpen()) return;
    const target = event.target as Node | null;
    if (target && !this.widget?.nativeElement.contains(target)) this.closePanel();
  }

  @HostListener('document:pointermove', ['$event'])
  protected readingGuide(event: PointerEvent): void {
    if (this.state().guide) this.guideY.set(event.clientY);
  }

  @HostListener('window:resize')
  protected resize(): void {
    if (!this.browser) return;
    this.apply();
    if (this.panelOpen()) setTimeout(() => this.positionPanel());
  }

  private update(patch: Partial<AccessibilityState>): void {
    this.state.set({ ...this.state(), ...patch });
    this.save();
    this.apply();
  }

  private apply(): void {
    if (!this.browser) return;
    const state = this.state();
    const safePosition = Math.min(0.9, Math.max(0.16, Number(state.positionY) || DEFAULT_STATE.positionY));
    if (safePosition !== state.positionY) this.state.set({ ...state, positionY: safePosition });
    this.widgetY.set(safePosition * window.innerHeight);
    const root = this.document.documentElement;
    root.classList.remove('a11y-font-1', 'a11y-font-2');
    if (state.font) root.classList.add(`a11y-font-${state.font}`);
    (['contrast', 'links', 'cursor', 'guide', 'images'] as TogglePreference[])
      .forEach((name) => root.classList.toggle(`a11y-${name}`, state[name]));
  }

  private positionPanel(): void {
    if (!this.browser || window.innerWidth <= 620) return;
    const triggerRect = this.trigger?.nativeElement.getBoundingClientRect();
    const panelHeight = this.panel?.nativeElement.offsetHeight ?? 440;
    if (!triggerRect) return;
    const centered = triggerRect.top + triggerRect.height / 2 - panelHeight / 2;
    this.panelTop.set(Math.max(12, Math.min(window.innerHeight - panelHeight - 12, centered)));
  }

  private load(): AccessibilityState {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<AccessibilityState>;
      if (saved.version !== DEFAULT_STATE.version) return { ...DEFAULT_STATE };
      return { ...DEFAULT_STATE, ...saved };
    } catch {
      return { ...DEFAULT_STATE };
    }
  }

  private save(): void {
    if (!this.browser) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state()));
    } catch {
      // Depolama kapalıysa araçlar oturum boyunca sinyaller üzerinden çalışır.
    }
  }
}
