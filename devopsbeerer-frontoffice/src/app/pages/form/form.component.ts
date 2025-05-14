import { Component, inject, OnDestroy } from '@angular/core';
import { LayoutComponent } from "../../layout/layout/layout.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IBeerCreate } from '../../core/models/internal/beer-create.model';
import { BeerApiService } from '../../core/services/beer-api.service';
import { Subscription } from 'rxjs';
import { ErrorBoxComponent } from "../../shared/components/error-box/error-box.component";
import { IApiResponse } from '../../core/models/internal/api-response.model';
import { IBeer } from '../../core/models/internal/beer.model';

@Component({
  selector: 'app-form',
  imports: [LayoutComponent, FormsModule, ReactiveFormsModule, ErrorBoxComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnDestroy {
  private fb: FormBuilder = inject(FormBuilder);
  private beerApiService: BeerApiService = inject(BeerApiService);

  private subscription: Subscription | null = null;

  error: IApiResponse<IBeer | null> | null = null;

  form: FormGroup = this.fb.group({
    name: this.fb.control(""),
    style: this.fb.control(""),
    abv: this.fb.control(0),
    ibu: this.fb.control(0),
    quantity: this.fb.control(1),
  })

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSubmit(event: any) {
    const value: IBeer = this.form.value;
    this.subscription = this.beerApiService.create(value).subscribe((data) => {
      this.error = data;
    });
  }
}
