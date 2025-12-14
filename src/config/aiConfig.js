// config/aiConfig.js
// Configuration for AI integration in the UT Learn app

// Default configuration for AI services
export const aiConfig = {
  // API service configuration
  apiService: {
    // You can switch between different AI services
    provider: process.env.REACT_APP_AI_PROVIDER || 'gemini', // Always use gemini
    apiKey: process.env.REACT_APP_GEMINI_API_KEY || null,
    baseURL: '', // Not needed for Gemini
    timeout: 60000, // Increase timeout to 60 seconds for better reliability
  },
  
  // Configuration for Gemini
  gemini: {
    url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    model: 'gemini-2.5-flash',
    visionUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    visionModel: 'gemini-2.5-flash',
  },
  
  // Configuration for local AI simulators (fallback)
  localService: {
    summary: {
      maxRetries: 3,
      delay: 1000, // 1 second delay for simulating API call
      maxLength: 500, // Maximum length of summary
    },
    quiz: {
      maxRetries: 3,
      delay: 1500, // 1.5 second delay for simulating API call
      numQuestions: 5, // Default number of questions to generate
    },
  },
  
  // Configuration for file processing
  fileProcessing: {
    maxFileSize: 10 * 1024 * 1024, // 10MB in bytes
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ],
    allowedExtensions: ['.pdf', '.doc', '.docx', '.txt'],
  },
  
  // Configuration for AI model parameters
  modelParameters: {
    temperature: 0.7, // Creativity parameter for text generation
    maxTokens: 1000, // Maximum tokens for generation
    topP: 0.9, // Alternative to temperature sampling
  },
};

// Function to get the current configuration
export const getAIConfig = () => {
  return aiConfig;
};

// Function to update configuration (useful for runtime changes)
export const updateAIConfig = (newConfig) => {
  Object.assign(aiConfig, newConfig);
  return aiConfig;
};