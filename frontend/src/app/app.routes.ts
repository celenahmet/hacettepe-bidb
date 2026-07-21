import { Routes } from '@angular/router';
import { AnaSayfa } from './sayfalar/ana-sayfa';
import { IcerikSayfasi } from './sayfalar/icerik-sayfasi';
import { YonetimPanel } from './yonetim/panel';

/** Adres yapısı: /tr, /tr/<slug>, /en, /en/<slug> */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/tr' },
  { path: 'yonetim', component: YonetimPanel },
  { path: ':dil', pathMatch: 'full', component: AnaSayfa },
  { path: ':dil/:slug', component: IcerikSayfasi },
  { path: '**', redirectTo: '/tr' }
];
