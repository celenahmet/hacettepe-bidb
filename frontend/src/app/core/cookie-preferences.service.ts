import { Injectable, afterNextRender, computed, signal } from '@angular/core';

export interface CookiePreferenceRecord {
  version: 1;
  mode: 'necessary';
  savedAt: string;
}

const STORAGE_KEY = 'bidb-cookie-preferences';
const VALIDITY_MS = 365 * 24 * 60 * 60 * 1000;

/**
 * Sitenin çerez/depolama kararının tek kaynağı.
 *
 * Genel ziyaretçi yüzünde analiz veya pazarlama aracı bulunmadığı için
 * kullanıcının vermediği bir rıza varmış gibi davranılmaz. Yalnızca
 * "gerekli teknolojilerle devam et" kararı, bildirimi her sayfada tekrar
 * göstermemek amacıyla tarayıcının yerel deposunda bir yıl saklanır.
 */
@Injectable({ providedIn: 'root' })
export class CookiePreferencesService {
  private initialized = signal(false);
  private record = signal<CookiePreferenceRecord | null>(null);

  readonly panelOpen = signal(false);
  readonly bannerVisible = computed(
    () => this.initialized() && !this.record() && !this.panelOpen()
  );
  readonly savedAt = computed(() => this.record()?.savedAt ?? null);

  constructor() {
    // SSR ile ilk tarayıcı çizimi aynı kalır; depolama ancak hydration
    // tamamlandıktan sonra okunur.
    afterNextRender(() => {
      this.load();
      this.initialized.set(true);
    });
  }

  openPanel(): void {
    this.panelOpen.set(true);
  }

  closePanel(): void {
    this.panelOpen.set(false);
  }

  acceptNecessary(): void {
    const value: CookiePreferenceRecord = {
      version: 1,
      mode: 'necessary',
      savedAt: new Date().toISOString()
    };
    this.record.set(value);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // Depolama engelliyse tercih bu oturum için bellekte kalır.
    }
    this.closePanel();
  }

  /** Tercihi silmek bildirimi yeniden gösterir; başka site verisine dokunmaz. */
  reset(): void {
    this.record.set(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Tarayıcı depolamayı engelliyorsa silinecek kalıcı kayıt da yoktur.
    }
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<CookiePreferenceRecord>;
      const savedAt = Date.parse(parsed.savedAt ?? '');
      const valid =
        parsed.version === 1 &&
        parsed.mode === 'necessary' &&
        Number.isFinite(savedAt) &&
        Date.now() - savedAt < VALIDITY_MS;

      if (valid) {
        this.record.set(parsed as CookiePreferenceRecord);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}
