import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  template: `<router-outlet></router-outlet>`,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  //private readonly oidcSecurityService = inject(OidcSecurityService);

  logout(): void {
    //this.oidcSecurityService.logoff().subscribe();
  }
}
