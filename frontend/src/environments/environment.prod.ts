import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  apiUrl: 'https://api.documentmanager.com/api',
  appName: 'HR Manager',
  version: '1.0.0',
  enableDevTools: false,
  logLevel: 'error',
  features: {
    fileUpload: true,
    documentSharing: true,
    advancedSearch: true,
    documentVersioning: true,
    realTimeSync: true
  },
  storage: {
    maxFileSize: 50 * 1024 * 1024, // 50MB in bytes
    allowedFileTypes: ['txt', 'json', 'markdown', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
    storageQuota: 1024 * 1024 * 1024 // 1GB in bytes
  },
  ui: {
    theme: 'light',
    animationsEnabled: true,
    compactMode: false
  },
  api: {
    timeout: 60000, // 60 seconds
    retryAttempts: 5,
    retryDelay: 2000 // 2 seconds
  },
  analytics: {
    enabled: true,
    trackingId: 'GA-XXXXXXXXX', // Replace with actual Google Analytics ID
    trackErrors: true,
    trackPerformance: true
  },
  security: {
    enableCSP: true,
    requireHttps: true,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    maxLoginAttempts: 5
  }
};
