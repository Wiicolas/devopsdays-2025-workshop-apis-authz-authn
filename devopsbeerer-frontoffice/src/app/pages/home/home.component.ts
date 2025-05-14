import { AsyncPipe } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
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
export class HomeComponent implements OnDestroy {
  private beerApi: BeerApiService = inject(BeerApiService);

  private subscription: Subscription | null = null;

  beers$: Observable<IApiResponse<IResponseArray<IBeer>>> = this.beerApi.list();
  error: IApiResponse<{}> | null = null;

  ngOnDestroy(): void {
    this._clear();
  }

  deleteBeer(beerId: string): void {
    this._clear();
    this.beerApi.delete(beerId).subscribe((data) => {
      this.error = data;
    });
  }

  private _clear(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
