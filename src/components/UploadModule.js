import React, { useState } from 'react';
import { FileText, X } from 'lucide-react';
import { extractTextFromFile } from '../utils/fileExtractor';
import { generateQuizFromText } from '../utils/textAnalyzer';
import { saveQuiz, saveModuleInfo, generateModuleId } from '../utils/quizStorage';
import { generateSummaryFromText, saveSummary } from '../utils/aiSummaryGenerator';

const UploadModule = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle', 'uploading', 'success', 'error'
  const [progress, setProgress] = useState(0);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];
    
    const fileExtension = '.' + selectedFile.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(selectedFile.type) && !allowedExtensions.includes(fileExtension)) {
      setUploadStatus('error');
      return;
    }
    
    setFile(selectedFile);
    setUploadStatus('idle');
  };

  const removeFile = () => {
    setFile(null);
    setUploadStatus('idle');
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploadStatus('uploading');
    setProgress(10);

    try {
      // Extract text from the uploaded file
      setProgress(20);
      const textContent = await extractTextFromFile(file);
      setProgress(40);

      // Check if text content is valid
      if (!textContent || textContent.trim() === '') {
        throw new Error('Tidak dapat mengekstrak teks dari file. File mungkin kosong atau tidak didukung.');
      }

      // Generate quiz from the extracted text
      let quizQuestions = [];
      try {
        quizQuestions = await generateQuizFromText(textContent);
        setProgress(60);

        // Validate quiz questions
        if (!quizQuestions || quizQuestions.length === 0) {
          console.warn('Tidak dapat membuat kuis dari file. Konten mungkin terlalu sedikit atau tidak sesuai.');
        }
      } catch (quizError) {
        console.warn('Gagal membuat kuis dari file, melanjutkan tanpa kuis:', quizError.message);
        // Tetap melanjutkan proses upload meskipun kuis gagal dibuat
      }

      // Generate a unique module ID
      const moduleId = generateModuleId();

      // Save the quiz questions if they were generated successfully
      if (quizQuestions && quizQuestions.length > 0) {
        saveQuiz(quizQuestions, moduleId);
      }

      // Generate and save summary from the extracted text
      setProgress(70);
      const learningProfile = JSON.parse(localStorage.getItem('learningProfile') || '{}');
      const summaryData = await generateSummaryFromText(textContent, learningProfile);
      saveSummary(moduleId, summaryData);
      setProgress(80);

      // Save module information
      const moduleInfo = {
        id: moduleId,
        title: file.name, // Change 'name' to 'title' to match ModulesPage expectation
        uploadDate: new Date().toISOString(),
        questionCount: quizQuestions.length,
        summary: summaryData.summary,
        learningObjectives: summaryData.learningObjectives
      };
      saveModuleInfo(moduleInfo);

      setProgress(100);
      setUploadStatus('success');

      // Reset after success
      setTimeout(() => {
        setFile(null);
        setUploadStatus('idle');
        setProgress(0);

        if (onUpload) {
          onUpload(moduleInfo);
        }
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);

      // Provide more specific error messages
      if (error.message.includes('timeout')) {
        setUploadStatus('error');
        setProgress(0);
        alert('Upload timeout. File mungkin terlalu besar atau koneksi internet lambat. Silakan coba lagi dengan file yang lebih kecil.');
      } else {
        setUploadStatus('error');
        setProgress(0);
        alert(`Gagal mengupload modul: ${error.message}`);
      }
    }
  };

  const getFileIcon = () => {
    if (!file) return <FileText size={48} className="text-text-light" />;
    
    const extension = file.name.split('.').pop().toLowerCase();
    let iconColor = "text-text-light";
    
    switch (extension) {
      case 'pdf':
        iconColor = "text-red-500";
        break;
      case 'doc':
      case 'docx':
        iconColor = "text-blue-600";
        break;
      case 'txt':
        iconColor = "text-gray-700";
        break;
      default:
        iconColor = "text-gray-500";
    }
    
    return <FileText size={48} className={iconColor} />;
  };

  return (
    <>
      <h3 className="text-lg font-bold text-text-dark mb-2">Upload Modul</h3>
      <p className="text-text-light mb-4 text-sm">Format: PDF, DOCX, DOC, atau TXT</p>

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-primary bg-primary/10' : 'border-border-color hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center justify-center">
          {getFileIcon()}
          <p className="mt-3 text-text-dark font-semibold text-sm">
            {file ? file.name : 'Klik atau seret file ke sini'}
          </p>
          <p className="text-text-light text-xs mt-1">
            {file ? `Ukuran: ${(file.size / 1024 / 1024).toFixed(2)} MB` : 'PDF, DOCX, DOC, TXT'}
          </p>
        </div>
      </div>
      
      {file && (
        <div className="mt-3 flex items-center justify-between bg-bg-light p-2 rounded-lg">
          <div className="flex items-center">
            <FileText size={16} className="mr-2 text-text-light" />
            <span className="text-text-dark truncate max-w-[120px] text-sm">{file.name}</span>
          </div>
          <button 
            onClick={removeFile}
            className="text-danger hover:text-danger-dark"
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      {uploadStatus === 'uploading' && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-text-light text-xs mt-1 text-center">
            Memproses... {progress}%
          </p>
        </div>
      )}
      
      <div className="mt-4">
        <button
          onClick={handleUpload}
          disabled={!file || uploadStatus === 'uploading'}
          className={`w-full py-2 px-4 rounded-lg font-bold transition-colors text-sm ${
            !file || uploadStatus === 'uploading'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary-dark'
          }`}
        >
          {uploadStatus === 'uploading' ? 'Mengupload...' : 'Upload & Buat Quiz'}
        </button>
        
        {uploadStatus === 'success' && (
          <div className="mt-2 bg-success/10 text-success p-2 rounded-lg flex items-center text-xs">
            Modul berhasil diupload!
          </div>
        )}
        
        {uploadStatus === 'error' && (
          <div className="mt-2 bg-danger/10 text-danger p-2 rounded-lg flex items-center text-xs">
            Gagal memproses modul.
          </div>
        )}
      </div>
    </>
  );
};

export default UploadModule;