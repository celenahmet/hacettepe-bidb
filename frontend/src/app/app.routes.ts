import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page.component';
import { ContentPageComponent } from './pages/content-page.component';
import { NewsPageComponent } from './pages/news-page.component';
import { AdminPanelComponent } from './admin/admin-panel.component';

/** Adres yapısı: /tr, /tr/<slug>, /en, /en/<slug> */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/tr' },
  { path: 'yonetim', component: AdminPanelComponent },
  { path: ':dil', pathMatch: 'full', component: HomePageComponent },
  { path: ':dil/duyuru/:slug', component: NewsPageComponent },
  { path: ':dil/:slug', component: ContentPageComponent },
  { path: '**', redirectTo: '/tr' }
];
