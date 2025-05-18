import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { jwtDecode } from 'jwt-decode';
import { map, Observable } from 'rxjs';
import { LayoutComponent } from '../../layout/layout/layout.component';
import { JsonViewerComponent } from '../../shared/components/json-viewer/json-viewer.component';

@Component({
  selector: 'app-token-view',
  imports: [LayoutComponent, JsonViewerComponent, AsyncPipe],
  templateUrl: './token-view.component.html',
  styleUrl: './token-view.component.scss'
})
export class TokenViewComponent {
  private oidcSecurityService: OidcSecurityService = inject(OidcSecurityService);

  idToken$: Observable<string> = this.oidcSecurityService.getIdToken().pipe(map(token => { const decoded: any = jwtDecode(token); return JSON.stringify(decoded); }));
  accessToken$: Observable<string> = this.oidcSecurityService.getAccessToken().pipe(map(token => { const decoded: any = jwtDecode(token); return JSON.stringify(decoded); }));
}
