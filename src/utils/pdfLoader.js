// utils/pdfLoader.js
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

// Set up the worker for processing PDFs
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.mjs', import.meta.url).toString();

export const extractTextFromPDF = async (file) => {
  try {
    // Validate file first
    if (!file) {
      throw new Error('File tidak ditemukan');
    }
    
    if (file.type !== 'application/pdf') {
      throw new Error('File harus berupa PDF');
    }
    
    // Read the file as an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Check if file is empty
    if (arrayBuffer.byteLength === 0) {
      throw new Error('File PDF kosong');
    }
    
    // Load the PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    // Check if PDF has pages
    if (pdf.numPages === 0) {
      throw new Error('PDF tidak memiliki halaman');
    }
    
    // Extract text from all pages
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Combine the text items
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + ' ';
    }
    
    // Trim and validate extracted text
    const trimmedText = fullText.trim();
    
    // Check if text is completely empty (likely image-only PDF)
    if (!trimmedText) {
      // For image-only PDFs, return appropriate information without trying to process images
      console.log('PDF hanya berisi gambar, tidak dapat mengekstrak teks secara langsung.');
      return {
        content: '',
        isEmpty: true,
        isImageOnly: true,
        isImageProcessed: false,
        message: 'PDF ini hanya berisi gambar dan tidak memiliki teks yang dapat diekstrak secara langsung. Anda masih dapat mengupload file ini dan menambahkan deskripsi manual tentang isi dokumen untuk membuat ringkasan dan kuis yang sesuai.'
      };
    }
    
    // Check if text is very short (might be problematic)
    if (trimmedText.length < 50) {
      console.warn('PDF text is very short, might be incomplete');
    }
    
    return {
      content: trimmedText,
      isEmpty: false,
      isImageOnly: false,
      isImageProcessed: false,
      message: null
    };
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    // Provide more specific error message
    if (error.message.includes('File tidak ditemukan')) {
      throw new Error('File tidak ditemukan. Silakan pilih file PDF yang valid.');
    } else if (error.message.includes('File harus berupa PDF')) {
      throw new Error('Format file tidak didukung. Harap pilih file PDF.');
    } else if (error.message.includes('PDF kosong')) {
      throw new Error('File PDF kosong. Pastikan file PDF Anda memiliki konten.');
    } else if (error.message.includes('tidak memiliki halaman')) {
      throw new Error('PDF tidak valid atau rusak. Silakan coba file PDF lain.');
    } else {
      // For image-only PDFs or other extraction issues, don't throw error but return info
      return {
        content: '',
        isEmpty: true,
        isImageOnly: true,
        isImageProcessed: false,
        message: 'PDF ini hanya berisi gambar dan tidak memiliki teks yang dapat diekstrak. Anda masih dapat mengupload file ini dan menambahkan deskripsi manual.',
        error: error.message
      };
    }
  }
};