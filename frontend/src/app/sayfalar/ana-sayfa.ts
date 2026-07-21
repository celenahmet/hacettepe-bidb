import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs/operators';
import { Api } from '../cekirdek/api';
import { Seo } from '../cekirdek/seo';
import { Dil } from '../cekirdek/modeller';
import { SolMenu } from '../duzen/sol-menu';

/** Ana sayfa: slider, kısayollar ve duyurular. */
@Component({
  selector: 'bidb-ana-sayfa',
  imports: [SolMenu, RouterLink, AsyncPipe],
  template: `
    <section class="slider" [attr.aria-label]="dil() === 'en' ? 'Featured' : 'Öne çıkanlar'">
      @for (s of slider$ | async; track s.gorselUrl; let sira = $index) {
        @if (sira === 0) {
          <div class="slayt" [style.background-image]="'url(' + s.gorselUrl + ')'"
               role="img" [attr.aria-label]="s.gorselAlt">
            <div class="kap">
              <div class="slayt-yazi">
                <div class="slayt-baslik">{{ s.baslik }}</div>
                @if (s.altBaslik) { <div class="slayt-ozet">{{ s.altBaslik }}</div> }
              </div>
            </div>
          </div>
        }
      }
    </section>

    <div class="kap sayfa-duzen">
      <aside class="yan">
        <bidb-sol-menu [dilDegeri]="dil()"></bidb-sol-menu>
      </aside>

      <main id="ana-icerik" class="icerik-alani">
        <h1 class="sr-only">
          {{ dil() === 'en' ? 'Department of Information Technology' : 'Bilgi İşlem Daire Başkanlığı' }}
        </h1>
        <p class="giris-yazi">
          {{ dil() === 'en'
            ? 'Information technology services of Hacettepe University.'
            : 'Hacettepe Üniversitesi bilişim hizmetleri.' }}
        </p>
      </main>
    </div>
  `
})
export class AnaSayfa {
  private rota = inject(ActivatedRoute);
  private api = inject(Api);
  private seo = inject(Seo);

  protected dil = signal<Dil>('tr');
  protected slider$ = this.api.slider('tr');

  protected baslangic = toSignal(
    this.rota.paramMap.pipe(
      tap((p) => {
        const dil = (p.get('dil') as Dil) ?? 'tr';
        this.dil.set(dil);
        this.slider$ = this.api.slider(dil);
        this.seo.uygula(null, dil, `/${dil}`);
      }),
      map(() => true)
    ),
    { initialValue: false }
  );
}
