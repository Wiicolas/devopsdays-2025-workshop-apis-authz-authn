import { Component } from '@angular/core';
import { LogoComponent } from '../../shared/components/logo/logo.component';
import { MainNavigationComponent } from '../main-navigation/main-navigation.component';
import { UserMenuComponent } from './user-menu/user-menu.component';

@Component({
  selector: 'app-header',
  imports: [LogoComponent, MainNavigationComponent, UserMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
