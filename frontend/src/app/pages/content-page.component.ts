import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map, tap } from 'rxjs/operators';
import { Api } from '../core/api.service';
import { Seo } from '../core/seo.service';
import { Language, Page } from '../core/models';
import { SideMenuComponent } from '../layout/side-menu.component';

/** /tr/<slug> ve /en/<slug> adreslerindeki içerik sayfası. */
@Component({
  selector: 'bidb-content-page',
  imports: [SideMenuComponent],
  template: `
    <div class="kap sayfa-duzen">
      <aside class="yan">
        <bidb-side-menu [dilDegeri]="dil()"></bidb-side-menu>
      </aside>

      <main id="ana-icerik" class="icerik-alani">
        @if (sayfa(); as s) {
          <h1 class="sayfa-baslik">{{ s.baslik }}</h1>
          <div class="icerik" [innerHTML]="govde()"></div>

          @if (s.belgeler.length) {
            <section class="belgeler">
              <h2>{{ dil() === 'en' ? 'Documents' : 'Belgeler' }}</h2>
              <ul>
                @for (b of s.belgeler; track b.adres) {
                  <li>
                    <a [href]="b.adres" target="_blank" rel="noopener">
                      <span class="belge-tur">{{ b.tur }}</span>{{ b.ad }}
                    </a>
                  </li>
                }
              </ul>
            </section>
          }
        } @else {
          <h1 class="sayfa-baslik">{{ dil() === 'en' ? 'Page not found' : 'Page bulunamadı' }}</h1>
          <p>{{ dil() === 'en' ? 'The address may have changed or the page may have been removed.' : 'Adres değişmiş veya sayfa kaldırılmış olabilir.' }}</p>
        }
      </main>
    </div>
  `
})
export class ContentPageComponent {
  private rota = inject(ActivatedRoute);
  private api = inject(Api);
  private seo = inject(Seo);
  private temizleyici = inject(DomSanitizer);

  protected dil = signal<Language>('tr');
  protected govde = signal<SafeHtml>('');

  protected sayfa = toSignal(
    this.rota.paramMap.pipe(
      switchMap((p) => {
        const dil = (p.get('dil') as Language) ?? 'tr';
        const slug = p.get('slug') ?? 'home';
        this.dil.set(dil);
        return this.api.sayfa(dil, slug).pipe(
          tap((s) => {
            this.seo.uygula(s, dil, `/${dil}/${slug}`);
            // İçerik kaynaktan birebir alındığı ve kurum tarafından yönetildiği için
            // olduğu gibi basılır.
            this.govde.set(this.temizleyici.bypassSecurityTrustHtml(s?.icerikHtml ?? ''));
          }),
          map((s) => s as Page | null)
        );
      })
    ),
    { initialValue: null }
  );
}
