import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map, tap } from 'rxjs/operators';
import { Api } from '../core/api.service';
import { Seo } from '../core/seo.service';
import { baglantiDizinleriniIsaretle } from '../core/icerik-bicim';
import { Language, Page } from '../core/models';
import { SideMenuComponent } from '../layout/side-menu.component';

/** /tr/<slug> ve /en/<slug> adreslerindeki içerik sayfası. */
@Component({
  selector: 'bidb-content-page',
  imports: [SideMenuComponent],
  template: `
    <div class="kap sayfa-duzen">
      <aside class="yan">
        <bidb-side-menu [dilDegeri]="language()"></bidb-side-menu>
      </aside>

      <main id="ana-icerik" class="icerik-alani">
        @if (sayfa(); as s) {
          <h1 class="sayfa-baslik">{{ s.title }}</h1>
          <div class="icerik" [innerHTML]="govde()"></div>

          @if (s.documents.length) {
            <section class="belgeler">
              <h2>{{ language() === 'en' ? 'Documents' : 'Belgeler' }}</h2>
              <ul>
                @for (b of s.documents; track b.url) {
                  <li>
                    <a [href]="b.url" target="_blank" rel="noopener">
                      <span class="belge-tur">{{ b.fileType }}</span>{{ b.name }}
                    </a>
                  </li>
                }
              </ul>
            </section>
          }
        } @else {
          <h1 class="sayfa-baslik">{{ language() === 'en' ? 'Page not found' : 'Sayfa bulunamadı' }}</h1>
          <p>{{ language() === 'en' ? 'The address may have changed or the page may have been removed.' : 'Adres değişmiş veya sayfa kaldırılmış olabilir.' }}</p>
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

  protected language = signal<Language>('tr');
  protected govde = signal<SafeHtml>('');

  protected sayfa = toSignal(
    this.rota.paramMap.pipe(
      switchMap((p) => {
        const language = (p.get('language') as Language) ?? 'tr';
        const slug = p.get('slug') ?? 'home';
        this.language.set(language);
        return this.api.sayfa(language, slug).pipe(
          tap((s) => {
            this.seo.uygula(s, language, `/${language}/${slug}`);
            // İçerik kaynaktan birebir alındığı ve kurum tarafından yönetildiği için
            // olduğu gibi basılır.
            this.govde.set(this.temizleyici.bypassSecurityTrustHtml(baglantiDizinleriniIsaretle(s?.contentHtml ?? '')));
          }),
          map((s) => s as Page | null)
        );
      })
    ),
    { initialValue: null }
  );
}
