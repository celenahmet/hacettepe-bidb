import { mergeApplicationConfig, ApplicationConfig, inject, REQUEST } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { HTTP_TRANSFER_CACHE_ORIGIN_MAP } from '@angular/common/http';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    {
      provide: HTTP_TRANSFER_CACHE_ORIGIN_MAP,
      useFactory: () => {
        const request = inject(REQUEST);
        const internalOrigin = new URL(
          process.env['BIDB_API'] ?? 'http://localhost:8081'
        ).origin;
        const publicOrigin = request ? new URL(request.url).origin : 'http://localhost:4000';
        return { [internalOrigin]: publicOrigin };
      }
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
