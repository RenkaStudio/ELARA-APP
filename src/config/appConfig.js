// config/appConfig.js
// Configuration for UT Learn app

export const appConfig = {
  appName: 'UT Learn',
  appDescription: 'Platform Pembelajaran Adaptif Universitas Terbuka',
  version: '1.0.0',
  api: {
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
  },
  colors: {
    primary: '#0056A3', // UT Primary Blue
    secondary: '#007BCE', // UT Secondary Blue
    light: '#E6F0FA', // UT Light Blue
    darkText: '#222222',
    lightText: '#666666',
  },
  features: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    supportedFileTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ],
    quizQuestionsPerModule: 5,
  }
};

export const getAppConfig = () => {
  return appConfig;
};