import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { IApiResponse } from '../models/internal/api-response.model';
import { IBeer } from '../models/internal/beer.model';
import { IResponseArray } from '../models/internal/response-array.model';
import { DynamicConfigurationService } from './dynamic-configuration.service';
import { IBeerCreate } from '../models/internal/beer-create.model';

@Injectable({
  providedIn: 'root'
})
export class BeerApiService {

  private http: HttpClient = inject(HttpClient);
  private config: DynamicConfigurationService = inject(DynamicConfigurationService);

  list(): Observable<IApiResponse<IResponseArray<IBeer>>> {
    return this.http.get<IResponseArray<IBeer>>(`${this.config.apiUrl()}/beers`).pipe(
      map(beers => { return { code: 200, data: beers } }),
      catchError(err => {
        console.error(err);

        return of({
          code: err.error.code,
          message: err.error.message,
          data: {
            data: [],
            total: 0
          }
        })
      })
    );
  }

  create(beer: IBeerCreate): Observable<IApiResponse<IBeer | null>> {
    return this.http.post<IBeer>(`${this.config.apiUrl()}/beers`, beer).pipe(
      map(beers => { return { code: 200, data: beers, message: "Beer created successfully" } }),
      catchError(err => {
        console.error(err);

        return of({
          code: err.error.code,
          message: err.error.message,
          data: null
        })
      })
    );
  }

  delete(beerId: string): Observable<IApiResponse<{}>> {
    return this.http.delete<IBeer>(`${this.config.apiUrl()}/beers/${beerId}`).pipe(
      map(beers => { return { code: 204, data: beers, message: "Beer deleted successfully successfully" } }),
      catchError(err => {
        console.error(err);

        return of({
          code: err.error.code,
          message: err.error.message,
          data: {}
        })
      })
    );
  }
}
