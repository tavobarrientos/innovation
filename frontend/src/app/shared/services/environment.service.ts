import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Environment } from '../../../environments/environment.interface';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private readonly env: Environment = environment;

  get production(): boolean {
    return this.env.production;
  }

  get apiUrl(): string {
    return this.env.apiUrl;
  }

  get appName(): string {
    return this.env.appName;
  }

  get version(): string {
    return this.env.version;
  }

  get enableDevTools(): boolean {
    return this.env.enableDevTools;
  }

  get logLevel(): string {
    return this.env.logLevel;
  }

  get features() {
    return this.env.features;
  }

  get storage() {
    return this.env.storage;
  }

  get ui() {
    return this.env.ui;
  }

  get api() {
    return this.env.api;
  }

  get analytics() {
    return this.env.analytics;
  }

  get security() {
    return this.env.security;
  }

  get debugging() {
    return this.env.debugging;
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(feature: keyof Environment['features']): boolean {
    return this.env.features[feature];
  }

  /**
   * Check if file type is allowed for upload
   */
  isFileTypeAllowed(fileType: string): boolean {
    return this.env.storage.allowedFileTypes.includes(fileType.toLowerCase());
  }

  /**
   * Check if file size is within allowed limit
   */
  isFileSizeAllowed(sizeInBytes: number): boolean {
    return sizeInBytes <= this.env.storage.maxFileSize;
  }

  /**
   * Get human-readable file size limit
   */
  getMaxFileSizeFormatted(): string {
    const bytes = this.env.storage.maxFileSize;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Get environment-specific configuration
   */
  getConfig() {
    return {
      ...this.env,
      isDevelopment: !this.env.production,
      isStaging: this.env.appName.includes('Staging'),
      isProduction: this.env.production
    };
  }
}