import { Component, Input, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Api } from '../core/api.service';
import { Language } from '../core/models';

/** Sol menü. Bölümler API'den gelir; açılır-kapanır çalışır. */
@Component({
  selector: 'bidb-side-menu',
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  template: `
    <nav class="sol-menu" [attr.aria-label]="language === 'en' ? 'Section menu' : 'Bölüm menüsü'">
      <a class="sol-menu-ana" [routerLink]="['/', language]">
        {{ language === 'en' ? 'Home Page' : 'Ana Page' }}
      </a>

      @for (m of menus$ | async; track m.title) {
        <details class="sol-bolum" open>
          <summary>{{ m.title }}</summary>
          <ul>
            @for (o of m.items; track o.url) {
              <li>
                @if (o.newTab) {
                  <a [href]="o.url" target="_blank" rel="noopener">{{ o.label }}</a>
                } @else {
                  <a [routerLink]="o.url" routerLinkActive="etkin">{{ o.label }}</a>
                }
              </li>
            }
          </ul>
        </details>
      }
    </nav>
  `
})
export class SideMenuComponent {
  @Input({ required: true }) set dilDegeri(d: Language) {
    this.language = d;
    this.menus$ = this.api.menu(d);
  }
  protected language: Language = 'tr';
  private api = inject(Api);
  protected menus$ = this.api.menu('tr');
}
