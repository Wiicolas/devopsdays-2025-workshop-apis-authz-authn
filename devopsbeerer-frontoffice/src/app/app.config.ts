import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor, provideAuth, StsConfigHttpLoader, StsConfigLoader, withAppInitializerAuthCheck } from 'angular-auth-oidc-client';
import { map } from 'rxjs';
import { routes } from './app.routes';
import { DynamicConfigurationService } from './core/services/dynamic-configuration.service';

/**
 * Factory function for loading configuration during app initialization
 */
async function initializeAppConfig() {
  console.debug('Loading application configuration...');
  const configService: DynamicConfigurationService = inject(DynamicConfigurationService);
  return await configService.loadConfig();
}

function initializeAuthentication(httpClient: HttpClient) {
  console.debug('Loading application authentication config...');

  return new StsConfigHttpLoader([
    httpClient.get<any>("/auth.json").pipe(
      map((customConfig: any) => {
        return {
          authority: customConfig.authority,
          redirectUrl: customConfig.redirectUrl,
          postLogoutRedirectUri: customConfig.postLogoutRedirectUri,
          clientId: customConfig.clientId,
          secureRoutes: customConfig.secureRoutes,
          scope: "openid profile email",
          responseType: "code",
          silentRenew: true,
          useRefreshToken: true,
          renewTimeBeforeTokenExpiresInSeconds: 30,
          autoCleanStateAfterAuthentication: false,
          postLoginRoute: "/",
          historyCleanupOff: true,
          unauthorizedRoute: "/unauthorized"
        };
      })
    )
  ]);
};

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
  provideAppInitializer(initializeAppConfig),
  provideHttpClient(withInterceptorsFromDi()),
  provideAuth({
    loader: {
      provide: StsConfigLoader,
      useFactory: initializeAuthentication,
      deps: [HttpClient],
    }
  },
    withAppInitializerAuthCheck()),
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },]

};
