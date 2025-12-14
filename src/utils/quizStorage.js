// utils/quizStorage.js

/**
 * Save quiz to local storage or file system
 * @param {Object} quizData - The quiz data to save
 * @param {string} moduleId - The module ID
 */
export const saveQuiz = (quizData, moduleId) => {
  try {
    // In a real application, this might save to a database
    // For now, we'll store in localStorage
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '{}');
    quizzes[moduleId] = quizData;
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
  } catch (error) {
    console.error('Error saving quiz to localStorage:', error);
  }
};

/**
 * Load quiz by module ID
 * @param {string} moduleId - The module ID
 * @returns {Array} - The quiz data
 */
export const loadQuiz = (moduleId) => {
  try {
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '{}');
    return quizzes[moduleId] || [];
  } catch (error) {
    console.error('Error loading quiz from localStorage:', error);
    return [];
  }
};

/**
 * Generate a new module ID
 * @returns {string} - A unique module ID
 */
export const generateModuleId = () => {
  return Date.now().toString();
};

/**
 * Save module information
 * @param {Object} moduleInfo - Information about the uploaded module
 */
export const saveModuleInfo = (moduleInfo) => {
  try {
    const modules = JSON.parse(localStorage.getItem('modules') || '[]');
    modules.push(moduleInfo);
    localStorage.setItem('modules', JSON.stringify(modules));
  } catch (error) {
    console.error('Error saving module info to localStorage:', error);
  }
};

/**
 * Load all modules
 * @returns {Array} - Array of module information
 */
export const loadAllModules = () => {
  try {
    const modules = JSON.parse(localStorage.getItem('modules') || '[]');
    const summaries = JSON.parse(localStorage.getItem('summaries') || '{}');
    
    // Combine module info with summaries if they exist separately
    return modules.map(module => {
      // If module already has detailed summary data, use it
      if (module.summary && typeof module.summary === 'object') {
        return {
          ...module,
          ...module.summary // Spread the summary object properties into the module
        };
      }
      
      // If the module doesn't have summary properties, check if there's a summary in localStorage
      const storedSummary = summaries[module.id];
      if (storedSummary && typeof storedSummary === 'object') {
        return {
          ...module,
          ...storedSummary // Spread the stored summary object properties into the module
        };
      }
      
      // Otherwise, just return the module as is
      return module;
    });
  } catch (error) {
    console.error('Error loading modules from localStorage:', error);
    return [];
  }
};

/**
 * Delete a module and its quiz
 * @param {string} moduleId - The module ID to delete
 */
export const deleteModule = (moduleId) => {
  try {
    // Remove quiz
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '{}');
    delete quizzes[moduleId];
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    
    // Remove module info
    const modules = JSON.parse(localStorage.getItem('modules') || '[]');
    const filteredModules = modules.filter(module => module.id !== moduleId);
    localStorage.setItem('modules', JSON.stringify(filteredModules));
    
    // Remove summary if it exists
    const summaries = JSON.parse(localStorage.getItem('summaries') || '{}');
    delete summaries[moduleId];
    localStorage.setItem('summaries', JSON.stringify(summaries));
  } catch (error) {
    console.error('Error deleting module from localStorage:', error);
  }
};