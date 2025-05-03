import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-menu',
  imports: [],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent implements OnDestroy {
  //private readonly securitService: OidcSecurityService = inject(OidcSecurityService);

  email: string = "no.connected" //this.securitService.userData().userData.email;

  logoutSubscription: Subscription | null = null;

  ngOnDestroy(): void {
    if (this.logoutSubscription) {
      this.logoutSubscription.unsubscribe();
    }
  }

  logout(): void {
    /*this.logoutSubscription = this.securitService.logoff().subscribe(_ => {
      console.debug('Logged out successfully');
    });*/
  }
}
