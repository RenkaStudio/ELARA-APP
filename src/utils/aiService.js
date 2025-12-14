// utils/aiService.js
// Service layer to handle all AI-related API communications
import { aiConfig } from '../config/aiConfig';

/**
 * Base class for AI service communication
 */
class AIService {
  constructor() {
    this.baseURL = aiConfig.apiService.baseURL;
    this.apiKey = aiConfig.apiService.apiKey;
    this.provider = aiConfig.apiService.provider;
  }

  /**
   * Make an API request to the AI service
   * @param {string} endpoint - The API endpoint
   * @param {Object} data - The data to send
   * @param {string} method - The HTTP method
   * @returns {Promise<any>} - The API response
   */
  async makeAPIRequest(endpoint, data = null, method = 'POST') {
    if (!this.apiKey) {
      throw new Error('API key not configured. Please set REACT_APP_AI_API_KEY environment variable.');
    }

    const url = `${this.baseURL}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    // Set timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), aiConfig.apiService.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. The API took too long to respond.');
      }
      throw error;
    }
  }

  /**
   * Check if the AI service is available
   * @returns {Promise<boolean>} - True if service is available
   */
  async isServiceAvailable() {
    try {
      await this.makeAPIRequest('/health', null, 'GET');
      return true;
    } catch (error) {
      console.warn('AI service not available:', error.message);
      return false;
    }
  }

  /**
   * Get the current service configuration
   * @returns {Object} - The service configuration
   */
  getConfig() {
    return {
      baseURL: this.baseURL,
      provider: this.provider,
      hasApiKey: !!this.apiKey,
    };
  }
}

// Create singleton instance
const aiService = new AIService();

export default aiService;