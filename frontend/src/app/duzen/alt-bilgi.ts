import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Dil } from '../cekirdek/modeller';

/** Sayfa altı: adres, telefon ve yasal bağlantılar. */
@Component({
  selector: 'bidb-alt-bilgi',
  imports: [RouterLink],
  template: `
    <footer class="alt">
      <div class="kap alt-ic">
        <p class="alt-adres">
          Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı 06800 Beytepe / ANKARA
        </p>
        <dl class="alt-iletisim">
          <dt>{{ dil === 'en' ? 'Contact us' : 'Bize Ulaşın' }}</dt>
          <dd><a href="tel:+903122976262">+90 312 297 62 62</a></dd>
          <dt>{{ dil === 'en' ? 'Head of Department' : 'Daire Başkanlığı' }}</dt>
          <dd><a href="tel:+903122976200">+90 312 297 62 00</a> · Faks: +90 312 299 20 88</dd>
          <dt>{{ dil === 'en' ? 'Web Unit' : 'BİDB Web Birimi' }}</dt>
          <dd><a href="mailto:bidb@hacettepe.edu.tr">bidb&#64;hacettepe.edu.tr</a></dd>
        </dl>
        <p class="alt-baglantilar">
          <a [routerLink]="['/', dil, 'sorumluluksiniri']">{{ dil === 'en' ? 'Disclaimer' : 'Sorumluluk Sınırı' }}</a>
          <a [routerLink]="['/', dil, 'erisilebilirlik']">{{ dil === 'en' ? 'Accessibility Statement' : 'Erişilebilirlik Bildirimi' }}</a>
        </p>
      </div>
    </footer>
  `
})
export class AltBilgi {
  @Input({ required: true }) dil!: Dil;
}
