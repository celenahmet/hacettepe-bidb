import { Injectable, afterNextRender } from '@angular/core';

type MetricName = 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB';

/**
 * İlk sayfa yüklemesinin gerçek kullanıcı performansını anonim ölçer.
 *
 * Yalnızca rota ve beş sayısal performans değeri gönderilir. Çerez, kullanıcı
 * kimliği, referrer, user-agent veya ekran bilgisi toplanmaz. DNT tercihi
 * etkinse ölçüm başlatılmaz.
 */
@Injectable({ providedIn: 'root' })
export class QualityMetricsService {
  private values = new Map<MetricName, number>();
  private observers: PerformanceObserver[] = [];
  private sent = false;
  private path = '';
  private clsWindowValue = 0;
  private clsWindowStart = 0;
  private clsLastEntry = 0;
  private clsMax = 0;

  constructor() {
    afterNextRender(() => this.start());
  }

  private start(): void {
    if (navigator.doNotTrack === '1') return;
    this.path = window.location.pathname;
    if (!/^\/(tr|en)(\/|$)/.test(this.path) || this.path.startsWith('/error/')) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (navigation) this.values.set('TTFB', Math.max(0, navigation.responseStart - navigation.requestStart));

    this.observe('paint', (entries) => {
      const fcp = entries.find((entry) => entry.name === 'first-contentful-paint');
      if (fcp) this.values.set('FCP', fcp.startTime);
    });
    this.observe('largest-contentful-paint', (entries) => {
      const last = entries.at(-1);
      if (last) this.values.set('LCP', last.startTime);
    });
    this.observe('layout-shift', (entries) => this.collectCls(entries));
    this.observe('event', (entries) => {
      for (const entry of entries as Array<PerformanceEntry & { duration: number; interactionId?: number }>) {
        if ((entry.interactionId ?? 0) <= 0) continue;
        this.values.set('INP', Math.max(this.values.get('INP') ?? 0, entry.duration));
      }
    }, { durationThreshold: 40 } as PerformanceObserverInit);

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') this.flush();
    }, { once: true });
    window.addEventListener('pagehide', () => this.flush(), { once: true });
    window.setTimeout(() => this.flush(), 15_000);
  }

  private observe(
    type: string,
    callback: (entries: PerformanceEntry[]) => void,
    extra: PerformanceObserverInit = {}
  ): void {
    try {
      const observer = new PerformanceObserver((list) => callback(list.getEntries()));
      observer.observe({ type, buffered: true, ...extra });
      this.observers.push(observer);
    } catch {
      // Tarayıcı ilgili Performance API türünü desteklemiyorsa diğer metrikler sürer.
    }
  }

  /** CLS, Web Vitals'ın 1 saniye boşluk / 5 saniye pencere kuralıyla hesaplanır. */
  private collectCls(entries: PerformanceEntry[]): void {
    for (const entry of entries as Array<PerformanceEntry & { value: number; hadRecentInput: boolean }>) {
      if (entry.hadRecentInput) continue;
      const sameWindow =
        this.clsLastEntry > 0 &&
        entry.startTime - this.clsLastEntry < 1000 &&
        entry.startTime - this.clsWindowStart < 5000;
      if (sameWindow) {
        this.clsWindowValue += entry.value;
      } else {
        this.clsWindowValue = entry.value;
        this.clsWindowStart = entry.startTime;
      }
      this.clsLastEntry = entry.startTime;
      this.clsMax = Math.max(this.clsMax, this.clsWindowValue);
      this.values.set('CLS', this.clsMax);
    }
  }

  private flush(): void {
    if (this.sent || !this.values.size) return;
    this.sent = true;
    this.observers.forEach((observer) => observer.disconnect());

    const body = JSON.stringify({
      path: this.path,
      metrics: [...this.values].map(([name, value]) => ({ name, value }))
    });
    const blob = new Blob([body], { type: 'application/json' });
    if (!navigator.sendBeacon('/api/metrics/vitals', blob)) {
      void fetch('/api/metrics/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true
      }).catch(() => undefined);
    }
  }
}

