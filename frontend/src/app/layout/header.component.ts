import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Api } from '../core/api.service';
import { Language } from '../core/models';

/** Logo, sosyal medya bağlantıları ve language değiştirici. */
@Component({
  selector: 'bidb-header',
  imports: [RouterLink, AsyncPipe],
  template: `
    <a class="atla" href="#ana-icerik">{{ language === 'en' ? 'Skip to content' : 'İçeriğe atla' }}</a>

    <header class="ust">
      <div class="kap ust-ic">
        <a class="logo" [routerLink]="['/', language]">
          <img src="/hu-logo.svg" alt="" aria-hidden="true" width="46" height="52">
          <span class="logo-yazi">
            <strong>{{ language === 'en' ? 'Hacettepe University' : 'Hacettepe Üniversitesi' }}</strong>
            <small>{{ language === 'en' ? 'Department of Information Technology' : 'Bilgi İşlem Daire Başkanlığı' }}</small>
          </span>
        </a>

        <nav class="ust-menu" [attr.aria-label]="language === 'en' ? 'Main menu' : 'Ana menü'">
          <a [routerLink]="['/', language]">{{ language === 'en' ? 'HOME PAGE' : 'ANA SAYFA' }}</a>
          <a [routerLink]="['/', language, 'contact']">{{ language === 'en' ? 'CONTACT' : 'İLETİŞİM' }}</a>

          <span class="dil-secim">
            <a [routerLink]="['/tr']" [class.etkin]="language === 'tr'">TR</a>
            <a [routerLink]="['/en']" [class.etkin]="language === 'en'">EN</a>
          </span>

          <span class="sosyal">
            @for (h of sosyal$ | async; track h.network) {
              <a [href]="h.url" target="_blank" rel="noopener" [attr.aria-label]="h.network">
                {{ h.network }}
              </a>
            }
          </span>
        </nav>
      </div>
    </header>
  `
})
export class HeaderComponent {
  @Input({ required: true }) language!: Language;
  private api = inject(Api);
  protected sosyal$ = this.api.sosyal('tr');
}
