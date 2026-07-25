import { Component, afterNextRender, inject, signal } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

/**
 * Sayfa üstünde ince bir yükleme şeridi (rota geçişi sırasında).
 *
 * Yalnızca tarayıcıda çalışır (afterNextRender) — SSR sırasında rota her
 * zaman "tamamlanmış" sayılır, zamanlayıcı kurmanın bir anlamı yok.
 */
@Component({
  selector: 'bidb-route-progress',
  template: `<div class="rota-ilerleme" [class.etkin]="etkin()" [style.width.%]="genislik()" aria-hidden="true"></div>`
})
export class RouteProgressComponent {
  private router = inject(Router);
  protected etkin = signal(false);
  protected genislik = signal(0);

  private gecikmeZamanlayici: ReturnType<typeof setTimeout> | null = null;
  private tamamlamaZamanlayici: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    afterNextRender(() => {
      this.router.events.subscribe((olay) => {
        if (olay instanceof NavigationStart) this.basla();
        else if (olay instanceof NavigationEnd || olay instanceof NavigationCancel || olay instanceof NavigationError) {
          this.bitir();
        }
      });
    });
  }

  private basla(): void {
    this.temizle();
    // Hızlı, veri beklemeyen geçişlerde göz kırpmasın diye kısa bir
    // gecikmeden sonra görünür olur — her rota tıklamasında yanıp
    // sönmesi "yükleniyor" hissini gerçekte olduğundan ağır gösterirdi.
    this.gecikmeZamanlayici = setTimeout(() => {
      this.genislik.set(0);
      this.etkin.set(true);
      requestAnimationFrame(() => this.genislik.set(78));
    }, 120);
  }

  private bitir(): void {
    this.temizle();
    if (!this.etkin()) return;
    this.genislik.set(100);
    this.tamamlamaZamanlayici = setTimeout(() => {
      this.etkin.set(false);
      this.genislik.set(0);
    }, 200);
  }

  private temizle(): void {
    if (this.gecikmeZamanlayici) { clearTimeout(this.gecikmeZamanlayici); this.gecikmeZamanlayici = null; }
    if (this.tamamlamaZamanlayici) { clearTimeout(this.tamamlamaZamanlayici); this.tamamlamaZamanlayici = null; }
  }
}
