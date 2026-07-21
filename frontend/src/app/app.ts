import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UstSerit } from './duzen/ust-serit';
import { AltBilgi } from './duzen/alt-bilgi';
import { Dil } from './cekirdek/modeller';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UstSerit, AltBilgi],
  template: `
    <bidb-ust-serit [dil]="dil()"></bidb-ust-serit>
    <router-outlet></router-outlet>
    <bidb-alt-bilgi [dil]="dil()"></bidb-alt-bilgi>
  `
})
export class App {
  private router = inject(Router);
  protected dil = signal<Dil>('tr');

  constructor() {
    this.dilAyarla(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.dilAyarla(e.urlAfterRedirects));
  }

  private dilAyarla(url: string): void {
    this.dil.set(url.startsWith('/en') ? 'en' : 'tr');
  }
}
