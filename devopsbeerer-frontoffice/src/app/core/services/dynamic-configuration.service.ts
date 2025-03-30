import { Injectable } from '@angular/core';
import { IAppConfig } from '../models/internal/app-config';


@Injectable({
  providedIn: 'root'
})
export class DynamicConfigurationService {
  private static config: IAppConfig | null = null;
  private static isLoaded = false;
  private readonly configUrl = 'config.json';

  /**
  * Gets the ConfigService instance
  * This is used to access the service before Angular's DI is fully initialized
  */
  public static getConfig(): IAppConfig {
    return DynamicConfigurationService.config!;
  }

  /**
   * Loads the configuration file
   * This should ONLY be called during app initialization
   */
  public async loadConfig(): Promise<void> {
    if (DynamicConfigurationService.isLoaded) {
      console.debug('Configuration already loaded, skipping');
      return;
    }

    try {
      // Load the configuration file
      const config = await this.loadConfigFromJson();

      // Store configuration in static variable
      DynamicConfigurationService.config = config;
      DynamicConfigurationService.isLoaded = true;
      console.debug('Configuration loaded successfully');
    } catch (error) {
      console.error('Failed to load configuration', error);
      throw new Error('Failed to load application configuration');
    }
  }

  /**
   * Gets the configuration
   * @returns The configuration object
   * @throws Error if configuration hasn't been loaded
   */
  public getConfig(): Readonly<IAppConfig> {
    this.checkConfigLoaded();
    return DynamicConfigurationService.config!;
  }

  /**
   * Gets a specific configuration value by key
   * @param key The configuration key
   * @returns The configuration value
   * @throws Error if configuration hasn't been loaded
   */
  public getValue<T extends keyof IAppConfig>(key: T): IAppConfig[T] {
    this.checkConfigLoaded();
    return DynamicConfigurationService.config![key];
  }

  /**
   * Checks if the configuration has been loaded
   * @returns true if loaded, false otherwise
   */
  public isLoaded(): boolean {
    return DynamicConfigurationService.isLoaded;
  }

  /**
   * Return the whole API url with version
   */
  public apiUrl(): string {
    const config: IAppConfig = this.getConfig();
    return `${config.devopsbeerUrl}/${config.version}`;
  }

  /**
   * Checks if configuration is loaded and throws an error if not
   * @private
   */
  private checkConfigLoaded(): void {
    if (!DynamicConfigurationService.isLoaded) {
      throw new Error('Configuration not loaded. Ensure loadConfig() is called during application initialization.');
    }
  }

  /**
   * Load the configuration file from assets
   * @returns 
   */
  private loadConfigFromJson(): Promise<any> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch (e) {
            reject(new Error('Invalid JSON'));
          }
        } else {
          reject(new Error(`Failed to load file: ${xhr.status}`));
        }
      };
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.open('GET', this.configUrl);
      xhr.send();
    });
  }
}
