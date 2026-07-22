import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './layout/header.component';
import { FooterComponent } from './layout/footer.component';
import { Language } from './core/models';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <bidb-header [language]="language()"></bidb-header>
    <router-outlet></router-outlet>
    <bidb-footer [language]="language()"></bidb-footer>
  `
})
export class App {
  private router = inject(Router);
  protected language = signal<Language>('tr');

  constructor() {
    this.dilAyarla(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.dilAyarla(e.urlAfterRedirects));
  }

  private dilAyarla(url: string): void {
    this.language.set(url.startsWith('/en') ? 'en' : 'tr');
  }
}
