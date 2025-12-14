import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaFile, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { analyzePDFContent } from '../utils/geminiAI';
import { extractTextFromPDF } from '../utils/pdfLoader';

// Fungsi utilitas untuk menampilkan pesan notifikasi
const showMessage = (message, type = 'info') => {
  // Untuk saat ini gunakan alert sederhana dengan emoji yang sesuai, nanti bisa diganti dengan toast notification
  const emojis = {
    error: '❌',
    success: '✅',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  const titles = {
    error: 'Kesalahan',
    success: 'Berhasil',
    warning: 'Peringatan',
    info: 'Informasi'
  };
  
  alert(`${emojis[type]} ${titles[type]}\n\n${message}`);
};

const ModuleUploadPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(''); // idle, uploading, success, error
  const [moduleName, setModuleName] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [learningStyleSummary, setLearningStyleSummary] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        setModuleName(file.name.replace(/\.[^/.]+$/, "")); // Remove file extension
        setUploadStatus('');
      } else {
        setUploadStatus('error');
        showMessage('Hanya file PDF yang diperbolehkan!', 'error');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showMessage('Harap pilih file PDF terlebih dahulu', 'error');
      return;
    }

    if (!moduleName.trim()) {
      showMessage('Harap masukkan nama modul', 'error');
      return;
    }

    setUploadStatus('uploading');

    try {
      // Extract text from the PDF
      const pdfExtractionResult = await extractTextFromPDF(selectedFile);
      
      // Handle both old and new extraction result formats
      let pdfText = '';
      let extractionInfo = null;
      
      if (typeof pdfExtractionResult === 'string') {
        // Old format - string only
        pdfText = pdfExtractionResult;
      } else if (typeof pdfExtractionResult === 'object' && pdfExtractionResult !== null) {
        // New format - object with content and metadata
        pdfText = pdfExtractionResult.content || '';
        extractionInfo = pdfExtractionResult;
      }
      
      // Validate PDF content with more descriptive error messages
      if (!pdfText && (!extractionInfo || !extractionInfo.isImageOnly)) {
        throw new Error('File PDF tampaknya kosong atau tidak dapat diproses. Pastikan file PDF Anda memiliki konten teks yang dapat dibaca.');
      }
      
      if (!pdfText && extractionInfo) {
        if (extractionInfo.isImageProcessed && extractionInfo.message) {
          // For successfully processed image PDFs, show success message
          showMessage(`Sukses: ${extractionInfo.message}\n\nTeks berhasil diekstrak dari gambar dalam PDF.`, 'success');
        } else if (extractionInfo.isImageOnly && extractionInfo.message) {
          // For image-only PDFs, show a warning but allow processing
          showMessage(`Informasi: ${extractionInfo.message}\n\nAnda masih dapat mengupload file ini, namun sistem akan memerlukan deskripsi manual untuk membuat ringkasan dan kuis.`, 'warning');
        } else if (extractionInfo.error) {
          console.warn('PDF processing warning:', extractionInfo.error);
        }
      } else if (pdfText && pdfText.trim().length === 0 && (!extractionInfo || (!extractionInfo.isImageOnly && !extractionInfo.isImageProcessed))) {
        throw new Error('File PDF tidak mengandung teks yang dapat diekstrak. Pastikan PDF berisi teks, bukan hanya gambar atau dokumen yang dipindai.');
      }
      
      // Get user's learning profile from localStorage
      const learningProfile = JSON.parse(localStorage.getItem('learningProfile') || '{}');
      
      // Analyze the PDF content using Gemini AI with learning profile
      // For image-only PDFs, we'll pass a special flag
      const analysis = await analyzePDFContent(pdfText, learningProfile, extractionInfo?.isImageOnly);
      
      // Simpan informasi modul dan analisis ke localStorage
      const modules = JSON.parse(localStorage.getItem('modules') || '[]');
      const newModule = {
        id: `module-${Date.now()}`,
        name: selectedFile.name,
        title: moduleName.trim(),
        description: "Modul yang diupload oleh dosen",
        originalContent: pdfText.substring(0, 3000), // Store sufficient original PDF content for quiz generation
        summary: analysis.summary,
        learningStyleSummary: analysis.learningStyleSummary, // Additional summary adapted to learning style
        keyTopics: analysis.keyTopics,
        difficulty: analysis.difficulty,
        estimatedTime: analysis.estimatedTime,
        learningObjectives: analysis.learningObjectives || [], // Include learning objectives if available
        isImageOnly: extractionInfo?.isImageOnly || false, // Flag if this is an image-only PDF
        isImageProcessed: extractionInfo?.isImageProcessed || false, // Flag if image was processed by AI
        imageDescriptions: extractionInfo?.imageDescriptions || [], // Image descriptions if available
        overallDescription: extractionInfo?.overallDescription || '', // Overall description if available
        uploadDate: new Date().toISOString().split('T')[0]
      };
      
      modules.push(newModule);
      localStorage.setItem('modules', JSON.stringify(modules));

      // Store analysis result to display on the page
      setAnalysisResult(analysis);
      setLearningStyleSummary(analysis.learningStyleSummary || analysis.summary);
      setUploadStatus('success');
      
    } catch (error) {
      console.error('Error uploading module:', error);
      setUploadStatus('error');
      setErrorMessage(error.message);
      // Show more detailed alert for better user feedback
      showMessage(`Gagal mengupload modul:\n${error.message}\n\nPastikan file PDF Anda:\n• Bukan file gambar yang disimpan sebagai PDF\n• Mengandung teks yang dapat diekstrak\n• Tidak rusak atau korup\n• Berukuran tidak terlalu besar`, 'error');
    }
  };



  return (
    <div className="bg-bg-light min-h-screen font-poppins">
      <header className="bg-bg-card shadow-sm border-b border-border-color">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Upload Modul - ELARA</h1>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="text-primary hover:text-accent transition-colors"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="max-w-3xl mx-auto bg-bg-card p-8 rounded-xl shadow-soft border border-border-color">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-dark mb-4">Unggah Modul Pembelajaran</h2>
            <p className="text-text-light">
              Upload modul dalam format PDF untuk dianalisis oleh sistem AI ELARA dan menyesuaikan materi pembelajaran.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-text-dark font-semibold mb-2">File PDF</label>
            <div className="flex items-center gap-4">
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-center w-full h-40 border-2 border-dashed border-border-color rounded-lg hover:border-primary transition-colors">
                  {selectedFile ? (
                    <div className="flex items-center gap-3 text-text-dark">
                      <FaFile className="text-primary" style={{ width: 32, height: 32 }} />
                      <div className="text-left">
                        <div className="font-semibold truncate max-w-xs">{selectedFile.name}</div>
                        <div className="text-sm text-text-light">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-text-light">
                      <FaUpload style={{ width: 32, height: 32 }} />
                      <span className="mt-2">Klik untuk memilih file PDF</span>
                      <span className="text-sm mt-1">Maksimal 10MB</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          
          <div className="mb-8">
            <label htmlFor="moduleName" className="block text-text-dark font-semibold mb-2">Nama Modul</label>
            <input
              type="text"
              id="moduleName"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              className="w-full px-4 py-3 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Masukkan nama modul"
              disabled={uploadStatus === 'uploading'}
            />
          </div>
          
          <div className="flex justify-end gap-3">
            {uploadStatus === 'uploading' && (
              <div className="flex items-center text-primary font-medium">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mr-2"></div>
                Mengupload...
              </div>
            )}
            {uploadStatus === 'success' && (
              <div className="flex items-center text-success font-medium">
                <FaCheckCircle className="mr-2" style={{ width: 20, height: 20 }} />
                Upload berhasil!
              </div>
            )}
            {uploadStatus === 'error' && (
              <div className="flex items-center text-error font-medium">
                <FaExclamationTriangle className="mr-2" style={{ width: 20, height: 20 }} />
                Gagal upload!
              </div>
            )}
            
            <button
              onClick={handleUpload}
              disabled={!selectedFile || !moduleName.trim() || uploadStatus === 'uploading'}
              className={`py-3 px-6 rounded-lg font-bold ${
                !selectedFile || !moduleName.trim() || uploadStatus === 'uploading'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-blue-800 transition-colors'
              }`}
            >
              Upload Modul
            </button>
          </div>
          
          {/* Display error message if there's an error */}
          {uploadStatus === 'error' && errorMessage && (
            <div className="mt-4 p-4 bg-error/10 border border-error/30 rounded-lg text-error">
              <div className="flex items-start">
                <FaExclamationTriangle className="mr-2 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Gagal Mengupload Modul</p>
                  <p className="mt-1 text-sm">{errorMessage}</p>
                  <div className="mt-3 text-sm">
                    <p className="font-medium">Tips untuk mengatasi masalah:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>Pastikan file PDF Anda bukan file gambar yang disimpan sebagai PDF</li>
                      <li>File harus mengandung teks yang dapat diekstrak (bukan hanya gambar)</li>
                      <li>Periksa apakah file PDF tidak rusak atau korup</li>
                      <li>Cobalah dengan file PDF yang berbeda</li>
                      <li>Pastikan ukuran file tidak terlalu besar (maksimal 10MB)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Tampilkan ringkasan setelah upload berhasil */}
        {uploadStatus === 'success' && analysisResult && (
          <div className="max-w-3xl mx-auto bg-bg-card p-6 rounded-xl shadow-soft border border-border-color mt-6">
            <h3 className="text-xl font-bold text-text-dark mb-4">Ringkasan Modul</h3>
            
            <div className="prose max-w-none">
              <h4 className="font-bold text-text-dark mb-2">Ringkasan Disesuaikan dengan Gaya Belajar Anda:</h4>
              <p className="text-text-light mb-4">{learningStyleSummary}</p>
              
              {analysisResult.learningObjectives && Array.isArray(analysisResult.learningObjectives) && analysisResult.learningObjectives.length > 0 && (
                <>
                  <h4 className="font-bold text-text-dark mb-2">Tujuan Pembelajaran:</h4>
                  <ul className="list-disc pl-5 text-text-light mb-4">
                    {analysisResult.learningObjectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </>
              )}
              
              <h4 className="font-bold text-text-dark mb-2">Topik Utama:</h4>
              <ul className="list-disc pl-5 text-text-light mb-4">
                {analysisResult.keyTopics && Array.isArray(analysisResult.keyTopics) && analysisResult.keyTopics.map((topic, index) => (
                  <li key={index}>{topic}</li>
                ))}
              </ul>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-text-dark mb-1">Tingkat Kesulitan:</h4>
                  <p className="text-text-light">{analysisResult.difficulty || "Tidak tersedia"}</p>
                </div>
                <div>
                  <h4 className="font-bold text-text-dark mb-1">Perkiraan Waktu Belajar:</h4>
                  <p className="text-text-light">{analysisResult.estimatedTime || "Tidak tersedia"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 max-w-3xl mx-auto bg-bg-card p-6 rounded-xl shadow-soft">
          <h3 className="text-xl font-bold text-text-dark mb-4">Cara Kerja Upload Modul</h3>
          <ul className="space-y-3 text-text-light">
            <li className="flex items-start">
              <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-1">1</div>
              <span>Pilih file PDF dari perangkat Anda</span>
            </li>
            <li className="flex items-start">
              <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-1">2</div>
              <span>Beri nama modul untuk identifikasi</span>
            </li>
            <li className="flex items-start">
              <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-1">3</div>
              <span>Klik tombol "Upload Modul"</span>
            </li>
            <li className="flex items-start">
              <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-1">4</div>
              <span>Sistem akan menganalisis konten PDF</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default ModuleUploadPage;