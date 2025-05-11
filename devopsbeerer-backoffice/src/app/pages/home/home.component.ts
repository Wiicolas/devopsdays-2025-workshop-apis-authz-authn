import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IApiResponse } from '../../core/models/internal/api-response.model';
import { IBeer } from '../../core/models/internal/beer.model';
import { IResponseArray } from '../../core/models/internal/response-array.model';
import { BeerApiService } from '../../core/services/beer-api.service';
import { LayoutComponent } from '../../layout/layout/layout.component';
import { ErrorBoxComponent } from '../../shared/components/error-box/error-box.component';
import { BeerCardComponent } from './beer-card/beer-card.component';

@Component({
  selector: 'app-home',
  imports: [LayoutComponent, BeerCardComponent, AsyncPipe, ErrorBoxComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private beerApi: BeerApiService = inject(BeerApiService);

  beers$: Observable<IApiResponse<IResponseArray<IBeer>>> = this.beerApi.list();
}
