import { Component, inject } from '@angular/core';
import { DynamicConfigurationService } from '../../../core/services/dynamic-configuration.service';

@Component({
  selector: 'app-logo',
  imports: [],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss'
})
export class LogoComponent {
  public readonly dynamicConfigurationService: DynamicConfigurationService = inject(DynamicConfigurationService);
}
