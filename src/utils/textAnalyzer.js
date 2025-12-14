// utils/textAnalyzer.js
import { aiConfig } from '../config/aiConfig';
import { generatePersonalizedQuiz } from './geminiAI';

/**
 * Analyzes text and generates quiz questions using only Gemini API
 * @param {string} text - The text to analyze
 * @returns {Promise<Array>} - Array of quiz questions with options and answers
 */
export const generateQuizFromText = async (text) => {
  try {
    // Always use Gemini API when configured
    if (aiConfig.apiService.provider === 'gemini' && aiConfig.apiService.apiKey) {
      // Use the Gemini API function directly
      const quiz = await generatePersonalizedQuiz(text, null, "review");
      if (quiz && quiz.length > 0) {
        // Ensure quiz questions have the correct format with correctAnswer index
        return quiz.map(q => ({
          ...q,
          // If correctAnswer is not set but answer is, find the index in options
          correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer :
                        q.options ? q.options.indexOf(q.answer) : 0
        }));
      }
    }

    // If Gemini API is not configured or fails, return an error message
    throw new Error("Gemini API tidak tersedia atau konfigurasi tidak valid. Silakan periksa API key Anda.");
  } catch (error) {
    console.error('Error in generateQuizFromText:', error);
    // Do not fallback to local generation - require Gemini to function
    throw error;
  }
};

