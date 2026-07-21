import { Routes } from '@angular/router';
import { AnaSayfa } from './sayfalar/ana-sayfa';
import { IcerikSayfasi } from './sayfalar/icerik-sayfasi';

/** Adres yapısı: /tr, /tr/<slug>, /en, /en/<slug> */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/tr' },
  { path: ':dil', pathMatch: 'full', component: AnaSayfa },
  { path: ':dil/:slug', component: IcerikSayfasi },
  { path: '**', redirectTo: '/tr' }
];
