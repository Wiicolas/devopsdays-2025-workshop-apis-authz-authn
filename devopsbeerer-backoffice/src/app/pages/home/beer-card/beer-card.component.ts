import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IBeer } from '../../../core/models/internal/beer.model';

@Component({
  selector: 'app-beer-card',
  imports: [],
  templateUrl: './beer-card.component.html',
  styleUrl: './beer-card.component.scss'
})
export class BeerCardComponent {
  @Input() beer!: IBeer;

  @Output()
  deleteBeer: EventEmitter<string> = new EventEmitter<string>();

  onDeleteBeer(): void {
    this.deleteBeer.emit(this.beer.id);
  }
}
