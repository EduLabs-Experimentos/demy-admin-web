import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { iamInterceptor } from './iam/infrastructure/iam.interceptor';
import { providePrimeNG } from 'primeng/config';
import { appPreset } from './app.preset';

const interceptors = [iamInterceptor];

/**
 * Application configuration for dependency injection and providers in the infrastructure layer.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch(), withInterceptors(interceptors)),
    provideRouter(routes),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: appPreset,
        options: {
          prefix: 'p',
          darkModeSelector: '.app-dark',
          cssLayer: false,
        },
      },
    }),
    provideTranslateService({
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: './i18n/',
        suffix: '.json',
      }),
    }),
  ],
};