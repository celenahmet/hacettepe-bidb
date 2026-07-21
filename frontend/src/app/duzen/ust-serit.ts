import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Api } from '../cekirdek/api';
import { Dil } from '../cekirdek/modeller';

/** Logo, sosyal medya bağlantıları ve dil değiştirici. */
@Component({
  selector: 'bidb-ust-serit',
  imports: [RouterLink, AsyncPipe],
  template: `
    <a class="atla" href="#ana-icerik">{{ dil === 'en' ? 'Skip to content' : 'İçeriğe atla' }}</a>

    <header class="ust">
      <div class="kap ust-ic">
        <a class="logo" [routerLink]="['/', dil]">
          <img src="/hu-logo.svg" alt="" aria-hidden="true" width="46" height="52">
          <span class="logo-yazi">
            <strong>{{ dil === 'en' ? 'Hacettepe University' : 'Hacettepe Üniversitesi' }}</strong>
            <small>{{ dil === 'en' ? 'Department of Information Technology' : 'Bilgi İşlem Daire Başkanlığı' }}</small>
          </span>
        </a>

        <nav class="ust-menu" [attr.aria-label]="dil === 'en' ? 'Main menu' : 'Ana menü'">
          <a [routerLink]="['/', dil]">{{ dil === 'en' ? 'HOME PAGE' : 'ANA SAYFA' }}</a>
          <a [routerLink]="['/', dil, 'contact']">{{ dil === 'en' ? 'CONTACT' : 'İLETİŞİM' }}</a>

          <span class="dil-secim">
            <a [routerLink]="['/tr']" [class.etkin]="dil === 'tr'">TR</a>
            <a [routerLink]="['/en']" [class.etkin]="dil === 'en'">EN</a>
          </span>

          <span class="sosyal">
            @for (h of sosyal$ | async; track h.ag) {
              <a [href]="h.adres" target="_blank" rel="noopener" [attr.aria-label]="h.ag">
                {{ h.ag }}
              </a>
            }
          </span>
        </nav>
      </div>
    </header>
  `
})
export class UstSerit {
  @Input({ required: true }) dil!: Dil;
  private api = inject(Api);
  protected sosyal$ = this.api.sosyal('tr');
}
