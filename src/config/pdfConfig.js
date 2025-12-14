// config/pdfConfig.js
import * as pdfjsLib from 'pdfjs-dist';

// Konfigurasi untuk mengatasi error PDF.js
const pdfConfig = {
  // Base worker URL untuk PDF.js
  workerSrc: '/pdf.worker.mjs',
  
  // Konfigurasi untuk mengurangi warning
  verbosity: pdfjsLib.VerbosityLevel.ERRORS,
  
  // Opsi untuk menangani error font
  disableFontFace: false,
  
  // Opsi untuk kanvas rendering
  disableRange: false,
  disableStream: false,
  disableAutoFetch: false,
  
  // Opsi keamanan
  isEvalSupported: false,
  
  // Penanganan error
  stopAtErrors: false,
  
  // Konfigurasi max keamanan dan kinerja
  maxImageSize: -1, // unlimited
  cMapUrl: '/cmaps/',
  cMapPacked: true
};

// Fungsi untuk inisialisasi PDF.js dengan konfigurasi error handling
export const initializePDFJS = () => {
  // Set verbosity level untuk mengurangi log warning
  pdfjsLib.GlobalWorkerOptions.verbosity = pdfjsLib.VerbosityLevel.ERRORS;
  
  // Atur worker source
  if (process.env.NODE_ENV === 'production') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  } else {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.mjs',
      import.meta.url
    ).toString();
  }
  
  // Tambahkan error handling untuk PDF.js
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && 
        (event.reason.message.includes('TT: undefined function') || 
         event.reason.message.includes('TT: invalid function id'))) {
      // Jangan munculkan error untuk TT font functions
      event.preventDefault();
    }
  });
  
  return pdfConfig;
};

// Fungsi untuk menangani error PDF secara khusus
export const handlePDFError = (error) => {
  if (error.message) {
    if (error.message.includes('TT: undefined function') || 
        error.message.includes('TT: invalid function id')) {
      console.warn('PDF.js font warning occurred (safe to ignore):', error.message);
      return; // Tidak perlu throw error untuk font warnings ini
    }
  }
  console.error('PDF Processing Error:', error);
  throw error;
};

export default pdfConfig;