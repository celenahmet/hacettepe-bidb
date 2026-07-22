import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page.component';
import { ContentPageComponent } from './pages/content-page.component';
import { NewsPageComponent } from './pages/news-page.component';
import { NewsListPageComponent } from './pages/news-list-page.component';
import { AdminPanelComponent } from './admin/admin-panel.component';

/** Adres yapısı: /tr, /tr/<slug>, /en, /en/<slug> */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/tr' },
  { path: 'yonetim', component: AdminPanelComponent },
  { path: ':language', pathMatch: 'full', component: HomePageComponent },
  { path: ':language/newsItem/:slug', component: NewsPageComponent },
  // Duyuru listesi, :slug kuralından ÖNCE gelmeli; sonra gelseydi
  // 'news' bir sayfa adı sanılıp aranır ve bulunamazdı.
  { path: ':language/news', component: NewsListPageComponent },
  { path: ':language/:slug', component: ContentPageComponent },
  { path: '**', redirectTo: '/tr' }
];
