import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { SideMenuComponent } from '../layout/side-menu.component';
import { Language } from '../core/models';
import { Seo } from '../core/seo.service';

interface Haber {
  id: number;
  slug: string;
  baslik: string;
  ozet: string | null;
  tarih: string;
  gorselUrl: string | null;
  gorselAlt: string | null;
  icerikHtml: string | null;
  disAdres: string | null;
}

/** Görselli haber sayfası: /tr/duyuru/<slug> */
@Component({
  selector: 'bidb-news-page',
  imports: [SideMenuComponent, RouterLink],
  template: `
    <div class="kap sayfa-duzen">
      <bidb-side-menu [dilDegeri]="dil()" />

      <div class="icerik-alani">
        @if (haber(); as h) {
          <article class="haber">
            <h1 class="sayfa-baslik">{{ h.baslik }}</h1>
            <p class="haber-tarih">
              <time [attr.datetime]="h.tarih">{{ tarihBicimi(h.tarih) }}</time>
            </p>

            @if (h.gorselUrl) {
              <img class="haber-gorsel" [src]="h.gorselUrl" [alt]="h.gorselAlt || h.baslik">
            }

            @if (h.ozet) { <p class="haber-ozet">{{ h.ozet }}</p> }

            @if (govde(); as g) { <div class="icerik" [innerHTML]="g"></div> }

            @if (h.disAdres) {
              <p class="haber-ek">
                <a [href]="h.disAdres" target="_blank" rel="noopener">
                  {{ dil() === 'en' ? 'Related document' : 'İlgili belge' }}
                </a>
              </p>
            }
          </article>
        } @else {
          <h1 class="sayfa-baslik">{{ dil() === 'en' ? 'Page not found' : 'Page bulunamadı' }}</h1>
          <p><a [routerLink]="['/', dil()]">{{ dil() === 'en' ? 'Home page' : 'Ana sayfa' }}</a></p>
        }
      </div>
    </div>
  `,
  styles: [`
    .haber-tarih { color: var(--metin-acik); font-size: .9rem; margin: -8px 0 16px; }
    /* Görsel doğal boyutundan büyütülmez; küçük bir dosya gerilip bozulmaz. */
    .haber-gorsel { display: block; max-width: min(100%, 760px); height: auto; margin: 0 0 20px; border-radius: 4px; }
    .haber-ozet { font-size: 1.05rem; color: #3c4652; margin-bottom: 18px; }
    .haber-ek { margin-top: 24px; padding-top: 14px; border-top: 1px solid var(--cizgi); }
  `]
})
export class NewsPageComponent {
  private rota = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private seo = inject(Seo);
  private temizleyici = inject(DomSanitizer);

  protected dil = signal<Language>('tr');
  protected govde = signal<SafeHtml | null>(null);

  protected haber = toSignal(
    this.rota.paramMap.pipe(
      switchMap((p) => {
        const dil = (p.get('dil') as Language) ?? 'tr';
        const slug = p.get('slug') ?? '';
        this.dil.set(dil);
        return this.http.get<Haber>(`/api/${dil}/duyuru/${slug}`).pipe(
          tap((h) => {
            this.seo.uygula(
              { baslik: h.baslik, seoTitle: null, seoDescription: h.ozet, seoKeywords: null } as never,
              dil,
              `/${dil}/duyuru/${slug}`
            );
            this.govde.set(h.icerikHtml ? this.temizleyici.bypassSecurityTrustHtml(h.icerikHtml) : null);
          })
        );
      })
    ),
    { initialValue: null }
  );

  /** 2026-07-22 -> 22.07.2026 */
  protected tarihBicimi(t: string): string {
    const p = String(t).match(/^(\d{4})-(\d{2})-(\d{2})/);
    return p ? `${p[3]}.${p[2]}.${p[1]}` : t;
  }
}
