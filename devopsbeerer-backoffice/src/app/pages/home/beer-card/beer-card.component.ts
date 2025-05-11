import { Component, Input } from '@angular/core';
import { IBeer } from '../../../core/models/internal/beer.model';

@Component({
  selector: 'app-beer-card',
  imports: [],
  templateUrl: './beer-card.component.html',
  styleUrl: './beer-card.component.scss'
})
export class BeerCardComponent {
  @Input() beer!: IBeer;
}
