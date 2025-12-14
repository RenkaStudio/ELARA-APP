// utils/fileExtractor.js
import { aiConfig } from '../config/aiConfig';
import { initializePDFJS, handlePDFError } from '../config/pdfConfig';

// Initialize PDF.js configuration when module loads
initializePDFJS();

// Note: In a React app, we'll need to install these libraries first:
// npm install pdfjs-dist mammoth
//
// For PDF extraction: pdfjs-dist
// For DOCX extraction: mammoth

/**
 * Extracts text from a TXT file
 * @param {File} file - The TXT file to extract text from
 * @returns {Promise<string>} - The extracted text
 */
export const extractTextFromTXT = async (file) => {
  const text = await file.text();
  return text;
};

/**
 * Extracts text from a PDF file using pdfjs-dist
 * @param {File} file - The PDF file to extract text from
 * @returns {Promise<string>} - The extracted text
 */
export const extractTextFromPDF = async (file) => {
  // Using the statically imported aiConfig
  if (!aiConfig.apiService.apiKey) {
    throw new Error('API Key Gemini tidak ditemukan. Silakan konfigurasi REACT_APP_GEMINI_API_KEY di environment Anda.');
  }
  
  // Convert file to base64 for Gemini API
  const reader = new FileReader();
  const fileAsBase64 = await new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result.split(',')[1]); // Get base64 part
    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsDataURL(file);
  });
  
  // Call Gemini API to extract text from PDF using the vision model URL
  try {
    // Create AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, aiConfig.apiService.timeout || 30000);
    
    const response = await fetch(`${aiConfig.gemini.visionUrl}?key=${aiConfig.apiService.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: "Extract all text content from this PDF document. Return only the text content without any additional commentary. If there are diagrams or images, describe them briefly. Focus on extracting all written content."
            },
            {
              inline_data: {
                mime_type: "application/pdf", 
                data: fileAsBase64
              }
            }
          ]
        }]
      }),
      signal: controller.signal
    });
    
    // Clear timeout
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      // Check if it's a 404 or model not found error
      if (response.status === 404) {
        console.warn('Vision model not available, falling back to local processing');
        return `File PDF tidak dapat diproses. Model vision tidak tersedia. Silakan coba format file lain (DOCX, TXT).`;
      }
      throw new Error(`Gemini API request failed with status ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error('Gemini API response:', data);
      throw new Error('Tidak ada teks yang diekstrak dari PDF. Mungkin konten tidak didukung atau terlalu kompleks.');
    }
  } catch (error) {
    console.error('Error extracting text from PDF using Gemini:', error);
    // Handle timeout specifically
    if (error.name === 'AbortError') {
      throw new Error('Permintaan ke API Gemini timeout. File PDF mungkin terlalu besar atau koneksi internet terlalu lambat.');
    }
    // Provide a more user-friendly message when vision model is not available
    if (error.message.includes('404') || error.message.includes('NOT_FOUND')) {
      return `File PDF tidak dapat diproses melalui API vision. Silakan coba format file lain (DOCX, TXT), atau hubungi administrator sistem.`;
    }
    throw new Error(`Ekstraksi PDF gagal: ${error.message}`);
  }
};

/**
 * Extracts text from a DOCX file using mammoth
 * @param {File} file - The DOCX file to extract text from
 * @returns {Promise<string>} - The extracted text
 */
export const extractTextFromDOCX = async (file) => {
  try {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error(`DOCX processing failed: ${error.message}`);
  }
};

/**
 * Generic function to extract text based on file type using external API or local libraries
 * @param {File} file - The file to extract text from
 * @returns {Promise<string>} - The extracted text
 */
export const extractTextFromFile = async (file) => {
  try {
    // Check file size against limit
    if (file.size > aiConfig.fileProcessing.maxFileSize) {
      throw new Error(`File size exceeds limit of ${aiConfig.fileProcessing.maxFileSize} bytes (${(aiConfig.fileProcessing.maxFileSize / (1024*1024)).toFixed(2)} MB)`);
    }
    
    const extension = file.name.split('.').pop().toLowerCase();
    
    // Check if file type is allowed
    if (!aiConfig.fileProcessing.allowedExtensions.includes(`.${extension}`)) {
      throw new Error(`File type .${extension} is not supported. Please upload one of: ${aiConfig.fileProcessing.allowedExtensions.join(', ')}`);
    }
    
    // Special handling for PDF files with Gemini API
    if (extension === 'pdf' && aiConfig.apiService.provider === 'gemini' && aiConfig.apiService.apiKey) {
      try {
        return await extractTextFromPDF(file);
      } catch (error) {
        console.error('PDF extraction with Gemini API failed, falling back to local processing:', error);
        // Fallback to local processing
        return await extractTextLocally(file, extension);
      }
    }
    
    // If using external API for file processing (non-PDF files or when not using gemini for PDF)
    if (aiConfig.apiService.provider !== 'local' && aiConfig.apiService.apiKey && extension !== 'pdf') {
      try {
        return await extractTextFromExternalAPI(file, extension);
      } catch (error) {
        console.error('External API extraction failed, falling back to local processing:', error);
        // Fallback to local processing
        return await extractTextLocally(file, extension);
      }
    } else {
      // Fallback to local processing
      return await extractTextLocally(file, extension);
    }
  } catch (error) {
    console.error('Error in extractTextFromFile:', error);
    throw error;
  }
};

/**
 * Extracts text using external API
 * @param {File} file - The file to extract text from
 * @param {string} extension - The file extension
 * @returns {Promise<string>} - The extracted text
 */
const extractTextFromExternalAPI = async (file, extension) => {
  const maxRetries = aiConfig.localService.summary.maxRetries;
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('extension', extension);

      // Create AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), aiConfig.apiService.timeout || 30000);

      const response = await fetch(`${aiConfig.apiService.baseURL}/extract-text`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${aiConfig.apiService.apiKey}`,
        },
        body: formData,
        signal: controller.signal
      });

      // Clear timeout
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.text || data.content || "";
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed to call external API:`, error);
      lastError = error;
      
      // If the error is due to abort (timeout), throw immediately
      if (error.name === 'AbortError') {
        throw new Error('Permintaan ke API eksternal timeout. File mungkin terlalu besar atau koneksi internet terlalu lambat.');
      }
      
      // Wait before retrying
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }

  console.warn(`All ${maxRetries} attempts to call external API failed. Falling back to local extraction.`);
  return await extractTextLocally(file, extension);
};

/**
 * Extracts text using local libraries (fallback)
 * @param {File} file - The file to extract text from
 * @param {string} extension - The file extension
 * @returns {Promise<string>} - The extracted text
 */
const extractTextLocally = async (file, extension) => {
  if (extension === 'txt') {
    return await extractTextFromTXT(file);
  } else if (extension === 'pdf') {
    try {
      // Use PDF.js with error handling for font warnings
      const pdfjsLib = await import('pdfjs-dist');
      
      // Create typed array from file
      const typedarray = new Uint8Array(await file.arrayBuffer());
      
      // Load PDF document with specific configuration to handle font warnings
      const loadingTask = pdfjsLib.getDocument({
        data: typedarray,
        useWorkerFetch: false,
        isEvalSupported: false,
        disableFontFace: false, // Keep font rendering enabled
        verbosity: pdfjsLib.VerbosityLevel.ERRORS, // Only log errors, not warnings
      });
      
      // Handle progress if needed
      loadingTask.onProgress = (progressData) => {
        // Progress handling can be implemented here if needed
      };
      
      const pdf = await loadingTask.promise;
      
      // Extract text from all pages
      let fullText = '';
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + ' ';
      }
      
      return fullText.trim();
    } catch (error) {
      // Handle PDF.js specific errors, especially font warnings
      try {
        handlePDFError(error);
        console.warn('Handling PDF font warning and falling back to Gemini API for PDF extraction');
        // If local processing failed due to PDF issues, fall back to Gemini API
        return await extractTextFromPDF(file);
      } catch (handlingError) {
        console.error('Local PDF extraction failed:', handlingError);
        return `File PDF tidak dapat diproses secara lokal. Error: ${handlingError.message}`;
      }
    }
  } else if (extension === 'doc' || extension === 'docx') {
    try {
      return await extractTextFromDOCX(file);
    } catch (error) {
      console.error('DOC/DOCX extraction failed:', error);
      return `File DOC/DOCX tidak dapat diproses secara lokal. Error: ${error.message}`;
    }
  } else {
    throw new Error('Unsupported file type. Please upload TXT, PDF, DOC, or DOCX files.');
  }
};