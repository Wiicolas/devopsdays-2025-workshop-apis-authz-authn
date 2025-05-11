import { Component, computed, input } from '@angular/core';
import { IApiResponse } from '../../../core/models/internal/api-response.model';

@Component({
  selector: 'app-error-box',
  imports: [],
  templateUrl: './error-box.component.html',
  styleUrl: './error-box.component.scss'
})
export class ErrorBoxComponent {
  apiError = input.required<IApiResponse<any>>();

  apiErrorTitle = computed<string>(() => {
    const code: number = this.apiError().code;
    switch (code) {
      case 401:
        return "Unauthorized"
      case 403:
        return "Forbidden"
    }

    return "NaN"
  });
}
