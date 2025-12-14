// utils/aiSummaryGenerator.js
import { analyzePDFContent } from './geminiAI';

/**
 * Generates a summary of the given text using the configured AI provider.
 * @param {string} text - The text to summarize.
 * @param {Object} learningProfile - Optional learning profile to customize summary
 * @returns {Promise<Object>} - The generated summary object with additional metadata
 */
export const generateSummaryFromText = async (text, learningProfile = null) => {
  try {
    // Use the new Gemini utility for PDF content analysis
    const analysis = await analyzePDFContent(text, learningProfile);

    // Extract only the required elements: short summary and 3 learning objectives
    const shortSummary = analysis.summary || analysis.learningStyleSummary || "Ringkasan tidak tersedia.";

    // Ensure we only return 3 learning objectives, or create them if not available
    let learningObjectives = analysis.learningObjectives || [];

    // Filter out empty or null objectives and ensure we have exactly 3
    learningObjectives = learningObjectives.filter(obj => obj && obj.trim() !== '').slice(0, 3);

    // If we don't have 3 objectives, add default ones
    if (learningObjectives.length < 3) {
      const defaultObjectives = [
        "Memahami konsep utama dari modul",
        "Mengidentifikasi informasi penting dalam materi",
        "Mengaplikasikan pengetahuan dalam konteks nyata"
      ];

      // Add from defaults until we have 3
      while (learningObjectives.length < 3) {
        learningObjectives.push(defaultObjectives[learningObjectives.length]);
      }
    }

    // Return a summary object with only short summary and 3 learning objectives
    return {
      summary: shortSummary,
      learningObjectives: learningObjectives
    };
  } catch (error) {
    console.error('Error in generateSummaryFromText:', error);

    // Create a more meaningful fallback summary from the text itself
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    let basicSummary = '';

    if (paragraphs.length > 0) {
      // Take the first paragraph or first 200 characters if single paragraph
      basicSummary = paragraphs[0].substring(0, 200);
      if (paragraphs[0].length > 200) basicSummary += '...';
    } else {
      basicSummary = text.substring(0, 200) + (text.length > 200 ? '...' : '');
    }

    return {
      summary: `Ringkasan: ${basicSummary}`,
      learningObjectives: ["Memahami konsep utama dari modul", "Mengidentifikasi informasi penting dalam materi", "Mengaplikasikan pengetahuan dalam konteks nyata"]
    };
  }
};

/**
 * Saves the summary to local storage.
 * @param {string} moduleId - The module ID.
 * @param {Object} summary - The summary object.
 */
export const saveSummary = (moduleId, summary) => {
  try {
    const summaries = JSON.parse(localStorage.getItem('summaries') || '{}');
    summaries[moduleId] = summary;
    localStorage.setItem('summaries', JSON.stringify(summaries));
  } catch (error) {
    console.error("Failed to save summary to localStorage:", error);
  }
};

/**
 * Loads the summary for a module.
 * @param {string} moduleId - The module ID.
 * @returns {Object | string | null} - The summary object or string, or null if not found.
 */
export const loadSummary = (moduleId) => {
  try {
    const summaries = JSON.parse(localStorage.getItem('summaries') || '{}');
    return summaries[moduleId] || null;
  } catch (error) {
    console.error("Failed to load summary from localStorage:", error);
    return null;
  }
};