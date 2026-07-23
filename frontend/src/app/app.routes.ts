import { CanMatchFn, Routes } from '@angular/router';

/** Adres yapısı: /tr, /tr/<slug>, /en, /en/<slug> */
const desteklenenDil: CanMatchFn = (_route, segments) =>
  segments.length > 0 && (segments[0].path === 'tr' || segments[0].path === 'en');

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/tr' },
  // Yönetim kodu ziyaretçilerin hiçbir zaman kullanmadığı büyük editör ve form
  // bağımlılıkları taşır; ana sayfa paketine katılmaz, yalnızca istenince yüklenir.
  {
    path: 'yonetim',
    loadComponent: () =>
      import('./admin/admin-panel.component').then((module) => module.AdminPanelComponent)
  },
  // Bütün HTTP hata durumları aynı bileşende, yalnızca kod parametresi
  // değiştirilerek sunulur. Her kod için ayrı sayfa ya da klasör tutulmaz.
  {
    path: 'error/:code',
    loadComponent: () =>
      import('./pages/errors/error-page.component').then((module) => module.ErrorPageComponent)
  },
  {
    path: ':language',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/home-page.component').then((module) => module.HomePageComponent),
    canMatch: [desteklenenDil]
  },
  {
    path: ':language/newsItem/:slug',
    loadComponent: () =>
      import('./pages/news-page.component').then((module) => module.NewsPageComponent),
    canMatch: [desteklenenDil]
  },
  // Duyuru listesi, :slug kuralından ÖNCE gelmeli; sonra gelseydi
  // 'news' bir sayfa adı sanılıp aranır ve bulunamazdı.
  {
    path: ':language/news',
    loadComponent: () =>
      import('./pages/news-list-page.component').then((module) => module.NewsListPageComponent),
    canMatch: [desteklenenDil]
  },
  {
    path: ':language/cookies',
    loadComponent: () =>
      import('./pages/cookies/cookie-policy.component').then((module) => module.CookiePolicyComponent),
    canMatch: [desteklenenDil]
  },
  {
    path: ':language/:slug',
    loadComponent: () =>
      import('./pages/content-page.component').then((module) => module.ContentPageComponent),
    canMatch: [desteklenenDil]
  },
  { path: '**', redirectTo: '/error/404' }
];
