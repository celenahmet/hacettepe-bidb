import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';

import { routes } from './app.routes';

// Türkçe tarih biçimlemesi (DatePipe "d MMMM yyyy") için yerel veri kaydı.
// Kaydedilmezse DatePipe 'tr-TR' isteğinde hata atıyor ve haber kartının
// gövdesi hiç çizilmiyordu.
registerLocaleData(localeTr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideHttpClient(withFetch()),
    // SSR ile gelen içerik arama motorları ve ilk boyama için eksiksiz kalır.
    // Ekranın altındaki @defer blokları ise ancak görünür olduklarında hydrate
    // edilir; böylece mobil cihazın ilk açılış işlem bütçesi boşa harcanmaz.
    provideClientHydration(withIncrementalHydration())
  ]
};
