import { Component, Input, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Api } from '../cekirdek/api';
import { Dil } from '../cekirdek/modeller';

/** Sol menü. Bölümler API'den gelir; açılır-kapanır çalışır. */
@Component({
  selector: 'bidb-sol-menu',
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  template: `
    <nav class="sol-menu" [attr.aria-label]="dil === 'en' ? 'Section menu' : 'Bölüm menüsü'">
      <a class="sol-menu-ana" [routerLink]="['/', dil]">
        {{ dil === 'en' ? 'Home Page' : 'Ana Sayfa' }}
      </a>

      @for (m of menuler$ | async; track m.baslik) {
        <details class="sol-bolum" open>
          <summary>{{ m.baslik }}</summary>
          <ul>
            @for (o of m.ogeler; track o.adres) {
              <li>
                @if (o.yeniSekme) {
                  <a [href]="o.adres" target="_blank" rel="noopener">{{ o.etiket }}</a>
                } @else {
                  <a [routerLink]="o.adres" routerLinkActive="etkin">{{ o.etiket }}</a>
                }
              </li>
            }
          </ul>
        </details>
      }
    </nav>
  `
})
export class SolMenu {
  @Input({ required: true }) set dilDegeri(d: Dil) {
    this.dil = d;
    this.menuler$ = this.api.menu(d);
  }
  protected dil: Dil = 'tr';
  private api = inject(Api);
  protected menuler$ = this.api.menu('tr');
}
