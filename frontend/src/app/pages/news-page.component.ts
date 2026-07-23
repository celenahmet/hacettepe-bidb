import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { catchError, of, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { SideMenuComponent } from '../layout/side-menu.component';
import { Language } from '../core/models';
import { Seo } from '../core/seo.service';
import { icerigiHazirla } from '../core/icerik-bicim';

interface Haber {
  id: number;
  slug: string;
  title: string;
  summary: string | null;
  date: string;
  imageUrl: string | null;
  imageAlt: string | null;
  contentHtml: string | null;
  externalUrl: string | null;
  viewCount: number;
}

/** Görselli haber sayfası: /tr/newsItem/<slug> */
@Component({
  selector: 'bidb-news-page',
  imports: [SideMenuComponent, RouterLink],
  template: `
    <div class="kap sayfa-duzen">
      <bidb-side-menu [dilDegeri]="language()" />

      <div class="icerik-alani">
        @if (haber(); as h) {
          <article class="haber">
            <h1 class="sayfa-baslik">{{ h.title }}</h1>
            <p class="haber-tarih">
              <time [attr.datetime]="h.date">{{ tarihBicimi(h.date) }}</time>
              <span aria-hidden="true">·</span>
              <span class="haber-goruntulenme">
                <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"
                     fill="none" stroke="currentColor" stroke-width="1.6">
                  <path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6z"/>
                  <circle cx="12" cy="12" r="2.6"/>
                </svg>
                {{ h.viewCount }} {{ language() === 'en' ? 'views' : 'görüntülenme' }}
              </span>
            </p>

            @if (h.imageUrl) {
              <img class="haber-gorsel" [src]="h.imageUrl" [alt]="h.imageAlt || h.title">
            }

            @if (h.summary) { <p class="haber-ozet">{{ h.summary }}</p> }

            @if (govde(); as g) { <div class="icerik" [innerHTML]="g"></div> }

            @if (h.externalUrl) {
              <p class="haber-ek">
                <a [href]="h.externalUrl" target="_blank" rel="noopener">
                  {{ language() === 'en' ? 'Related document' : 'İlgili belge' }}
                </a>
              </p>
            }
          </article>
        } @else {
          <h1 class="sayfa-baslik">{{ language() === 'en' ? 'Page not found' : 'Sayfa bulunamadı' }}</h1>
          <p><a [routerLink]="['/', language()]">{{ language() === 'en' ? 'Home page' : 'Ana sayfa' }}</a></p>
        }
      </div>
    </div>
  `,
  styles: [`
    .haber-tarih {
      display: flex;
      align-items: center;
      gap: .55rem;
      color: var(--metin-acik);
      font-size: .9rem;
      margin: -8px 0 16px;
    }
    .haber-goruntulenme { display: inline-flex; align-items: center; gap: .35rem; }
    /* Görsel doğal boyutundan büyütülmez; küçük bir dosya gerilip bozulmaz. */
    .haber-gorsel { display: block; max-width: min(100%, 760px); height: auto; margin: 0 0 20px; border-radius: 4px; }
    .haber-ozet { font-size: 1.05rem; color: #3c4652; margin-bottom: 18px; }
    .haber-ek { margin-top: 24px; padding-top: 14px; border-top: 1px solid var(--cizgi); }
  `]
})
export class NewsPageComponent {
  private rota = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private seo = inject(Seo);
  private temizleyici = inject(DomSanitizer);

  protected language = signal<Language>('tr');
  protected govde = signal<SafeHtml | null>(null);

  protected haber = toSignal(
    this.rota.paramMap.pipe(
      switchMap((p) => {
        const language = (p.get('language') as Language) ?? 'tr';
        const slug = p.get('slug') ?? '';
        this.language.set(language);
        return this.http.get<Haber>(`/api/${language}/newsItem/${slug}`).pipe(
          tap((h) => {
            this.seo.uygula(
              { title: h.title, seoTitle: null, seoDescription: h.summary, seoKeywords: null } as never,
              language,
              `/${language}/newsItem/${slug}`
            );
            this.govde.set(h.contentHtml ? this.temizleyici.bypassSecurityTrustHtml(icerigiHazirla(h.contentHtml)) : null);
          }),
          catchError((error: HttpErrorResponse) => {
            const status = error.status >= 400 && error.status <= 599 ? error.status : 503;
            void this.router.navigate(['/error', status], { replaceUrl: true });
            return of(null);
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
