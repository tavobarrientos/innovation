import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'HR Manager',
  version: '1.0.0',
  enableDevTools: true,
  logLevel: 'debug',
  features: {
    fileUpload: true,
    documentSharing: true,
    advancedSearch: true,
    documentVersioning: true,
    realTimeSync: false
  },
  storage: {
    maxFileSize: 10 * 1024 * 1024, // 10MB in bytes
    allowedFileTypes: ['txt', 'json', 'markdown', 'pdf', 'doc', 'docx'],
    storageQuota: 100 * 1024 * 1024 // 100MB in bytes
  },
  ui: {
    theme: 'light',
    animationsEnabled: true,
    compactMode: false
  },
  api: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000 // 1 second
  }
};
