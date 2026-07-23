import { CanMatchFn, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page.component';
import { ContentPageComponent } from './pages/content-page.component';
import { NewsPageComponent } from './pages/news-page.component';
import { NewsListPageComponent } from './pages/news-list-page.component';
import { AdminPanelComponent } from './admin/admin-panel.component';

/** Adres yapısı: /tr, /tr/<slug>, /en, /en/<slug> */
const desteklenenDil: CanMatchFn = (_route, segments) =>
  segments.length > 0 && (segments[0].path === 'tr' || segments[0].path === 'en');

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/tr' },
  { path: 'yonetim', component: AdminPanelComponent },
  // Bütün HTTP hata durumları aynı bileşende, yalnızca kod parametresi
  // değiştirilerek sunulur. Her kod için ayrı sayfa ya da klasör tutulmaz.
  {
    path: 'error/:code',
    loadComponent: () =>
      import('./pages/errors/error-page.component').then((module) => module.ErrorPageComponent)
  },
  { path: ':language', pathMatch: 'full', component: HomePageComponent, canMatch: [desteklenenDil] },
  { path: ':language/newsItem/:slug', component: NewsPageComponent, canMatch: [desteklenenDil] },
  // Duyuru listesi, :slug kuralından ÖNCE gelmeli; sonra gelseydi
  // 'news' bir sayfa adı sanılıp aranır ve bulunamazdı.
  { path: ':language/news', component: NewsListPageComponent, canMatch: [desteklenenDil] },
  { path: ':language/:slug', component: ContentPageComponent, canMatch: [desteklenenDil] },
  { path: '**', redirectTo: '/error/404' }
];
