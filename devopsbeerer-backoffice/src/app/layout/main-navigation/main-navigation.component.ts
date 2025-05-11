import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-main-navigation',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './main-navigation.component.html',
  styleUrl: './main-navigation.component.scss'
})
export class MainNavigationComponent {

}
