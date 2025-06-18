export interface Environment {
  production: boolean;
  apiUrl: string;
  appName: string;
  version: string;
  enableDevTools: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  
  features: {
    fileUpload: boolean;
    documentSharing: boolean;
    advancedSearch: boolean;
    documentVersioning: boolean;
    realTimeSync: boolean;
  };
  
  storage: {
    maxFileSize: number;
    allowedFileTypes: string[];
    storageQuota: number;
  };
  
  ui: {
    theme: 'light' | 'dark' | 'auto';
    animationsEnabled: boolean;
    compactMode: boolean;
  };
  
  api: {
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
  };
  
  analytics?: {
    enabled: boolean;
    trackingId: string;
    trackErrors: boolean;
    trackPerformance: boolean;
  };
  
  security?: {
    enableCSP: boolean;
    requireHttps: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
  };
  
  debugging?: {
    enableConsoleLogging: boolean;
    enableNetworkLogging: boolean;
    enableStateLogging: boolean;
  };
}
