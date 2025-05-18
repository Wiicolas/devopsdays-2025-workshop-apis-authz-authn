import { Component, inject, OnDestroy } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-menu',
  imports: [],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent implements OnDestroy {
  private readonly securitService: OidcSecurityService = inject(OidcSecurityService);

  email: string = this.securitService.userData().userData?.email;

  logoutSubscription: Subscription | null = null;

  ngOnDestroy(): void {
    if (this.logoutSubscription) {
      this.logoutSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.logoutSubscription = this.securitService.logoff().subscribe(_ => {
      console.debug('Logged out successfully');
    });
  }
}
