import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  apiUrl: 'https://staging-api.documentmanager.com/api',
  appName: 'HR Manager (Staging)',
  version: '1.0.0-staging',
  enableDevTools: true,
  logLevel: 'info',
  features: {
    fileUpload: true,
    documentSharing: true,
    advancedSearch: true,
    documentVersioning: true,
    realTimeSync: true
  },
  storage: {
    maxFileSize: 25 * 1024 * 1024, // 25MB in bytes
    allowedFileTypes: ['txt', 'json', 'markdown', 'pdf', 'doc', 'docx', 'xls', 'xlsx'],
    storageQuota: 500 * 1024 * 1024 // 500MB in bytes
  },
  ui: {
    theme: 'light',
    animationsEnabled: true,
    compactMode: false
  },
  api: {
    timeout: 45000, // 45 seconds
    retryAttempts: 4,
    retryDelay: 1500 // 1.5 seconds
  },
  analytics: {
    enabled: true,
    trackingId: 'GA-STAGING-XXX', // Staging analytics ID
    trackErrors: true,
    trackPerformance: true
  },
  security: {
    enableCSP: true,
    requireHttps: true,
    sessionTimeout: 60 * 60 * 1000, // 60 minutes for testing
    maxLoginAttempts: 10
  },
  debugging: {
    enableConsoleLogging: true,
    enableNetworkLogging: true,
    enableStateLogging: true
  }
};
