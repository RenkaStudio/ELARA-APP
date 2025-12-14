import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import { deleteModule } from '../utils/quizStorage';
import { FileText, File } from 'lucide-react';

const ModulePage = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(''); // idle, uploading, success, error
  const [moduleName, setModuleName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  // Load modules from localStorage
  useEffect(() => {
    try {
      // Load modules from localStorage - this was saved from ModuleUploadPage
      const savedModules = JSON.parse(localStorage.getItem('modules') || '[]');
      setModules(savedModules);
    } catch (error) {
      console.error('Error loading modules:', error);
      setPageError('Gagal memuat daftar modul');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startQuiz = (moduleId) => {
    // Cek apakah pengguna memiliki profil belajar
    let hasLearningProfile = false;
    try {
      const profileStr = localStorage.getItem('learningProfile');
      if (profileStr) {
        const profile = JSON.parse(profileStr);
        hasLearningProfile = true;
      }
    } catch (e) {
      console.error('Error checking learning profile:', e);
    }
    
    // Gunakan kuis adaptif jika pengguna memiliki profil belajar
    if (hasLearningProfile) {
      navigate(`/adaptive-quiz/${moduleId}`);
    } else {
      navigate(`/quiz/${moduleId}`);
    }
  };

  const handleDeleteModule = (moduleId, moduleName) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus modul "${moduleName}"? Tindakan ini tidak dapat dibatalkan.`)) {
      try {
        // Remove from localStorage
        const savedModules = JSON.parse(localStorage.getItem('modules') || '[]');
        const updatedModules = savedModules.filter(mod => mod.id !== moduleId);
        localStorage.setItem('modules', JSON.stringify(updatedModules));
        
        // Update the local state to reflect the deletion
        setModules(updatedModules);
      } catch (error) {
        console.error('Error deleting module:', error);
        alert('Gagal menghapus modul');
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        setModuleName(file.name.replace(/\.[^/.]+$/, "")); // Remove file extension
        setUploadStatus('');
      } else {
        setUploadStatus('error');
        alert('Hanya file PDF yang diperbolehkan!');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Silakan pilih file PDF terlebih dahulu!');
      return;
    }

    if (!moduleName.trim()) {
      alert('Silakan masukkan nama modul!');
      return;
    }

    setUploadStatus('uploading');

    try {
      // Dalam implementasi asli, di sini akan ada pemrosesan file PDF
      // dan mungkin pengiriman ke AI untuk analisis konten
      const newModule = {
        id: `upload-${Date.now()}`,
        name: selectedFile.name,
        title: moduleName.trim(),
        description: "Modul yang diupload oleh dosen",
        summary: "Modul yang diupload, ringkasan akan dibuat setelah analisis AI", // Akan diupdate setelah AI memproses
        file: selectedFile.name, // Dalam implementasi asli ini akan menjadi path file
        uploadDate: new Date().toISOString().split('T')[0]
      };

      // Simpan modul ke localStorage
      const savedModules = JSON.parse(localStorage.getItem('modules') || '[]');
      savedModules.push(newModule);
      localStorage.setItem('modules', JSON.stringify(savedModules));

      // Update state untuk menampilkan modul baru
      setModules(prev => [...prev, newModule]);
      
      setUploadStatus('success');
      setModuleName('');
      setSelectedFile(null);
      
      // Reset form setelah 2 detik
      setTimeout(() => {
        setUploadStatus('');
      }, 2000);
    } catch (error) {
      console.error('Error uploading module:', error);
      setUploadStatus('error');
      alert('Gagal mengupload modul: ' + error.message);
    }
  };

  if (pageError) {
    return (
      <div className="bg-bg-light min-h-screen font-poppins">
        <div className="container mx-auto p-6">
          <ErrorDisplay 
            message={pageError}
            onRetry={() => window.location.reload()}
            title="Kesalahan Memuat Modul"
          />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-bg-light min-h-screen font-poppins">
        <div className="container mx-auto p-6">
          <LoadingSpinner message="Memuat daftar modul..." />
        </div>
      </div>
    );
  }

  // Use only the modules loaded from localStorage
  const allModules = modules.map(mod => ({
    id: mod.id,
    title: mod.title || mod.name.replace(/\.[^/.]+$/, ""), // Use title if available, otherwise remove file extension
    description: mod.description || "Modul yang diupload oleh dosen",
    summary: mod.learningStyleSummary || mod.summary, // Use learning style adapted summary if available
    uploadDate: mod.uploadDate,
    keyTopics: mod.keyTopics,
    difficulty: mod.difficulty,
    estimatedTime: mod.estimatedTime
  }));

  return (
    <div className="bg-bg-light min-h-screen font-poppins">
      <header className="bg-bg-card shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-text-dark">Daftar Modul Saya</h1>
          <Link to="/dashboard" className="text-primary hover:underline">
            Kembali ke Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {/* Modules List */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-text-dark">Modul Saya</h2>
            <Link 
              to="/upload" 
              className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upload Modul Baru
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allModules.length > 0 ? allModules.map((module) => {
            // Ambil data user progress dari localStorage
            const userProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
            const isCompleted = userProgress.modulesCompleted?.includes(module.id) || false;
            const hasTakenQuiz = userProgress.quizzesTaken?.includes(module.id) || false;
            const moduleSummary = module.learningStyleSummary || module.summary;
            
            return (
              <div 
                key={module.id} 
                id={`module-${module.id}`} 
                className={`bg-bg-card rounded-xl shadow-soft overflow-hidden flex flex-col border ${isCompleted ? 'border-success' : 'border-border-color'}`}
              >
                <div className="p-6 flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-full ${isCompleted ? 'bg-success/10' : 'bg-primary/10'}`}>
                      <File className="text-primary" size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-text-dark">{module.title}</h2>
                  </div>
                  <p className="text-text-light flex-grow">{module.description}</p>
                  
                  {/* Show summary adapted to learning style if available */}
                  {moduleSummary && (
                    <div className="mt-4 pt-4 border-t border-border-color">
                      <div className="flex items-start gap-2">
                        <FileText className="text-primary mt-1 flex-shrink-0" size={16} />
                        <div className="text-sm text-text-dark">
                          <p className="font-semibold mb-1">Ringkasan AI:</p>
                          <p className="text-text-light max-h-20 overflow-y-auto">{moduleSummary}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Show key topics and difficulty if available */}
                  {(module.keyTopics || module.difficulty) && (
                    <div className="mt-4 pt-4 border-t border-border-color">
                      {module.keyTopics && (
                        <div className="mb-2">
                          <p className="text-xs font-semibold text-text-light mb-1">Topik Utama:</p>
                          <div className="flex flex-wrap gap-1">
                            {module.keyTopics.slice(0, 5).map((topic, idx) => (
                              <span key={idx} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                                {topic}
                              </span>
                            ))}
                            {module.keyTopics.length > 5 && (
                              <span className="text-xs text-text-light">+{module.keyTopics.length - 5} lainnya</span>
                            )}
                          </div>
                        </div>
                      )}
                      {module.difficulty && (
                        <div className="mt-2">
                          <p className="text-xs font-semibold text-text-light">Tingkat Kesulitan: 
                            <span className="ml-1 font-medium text-text-dark">{module.difficulty}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Show quiz score if available */}
                  {hasTakenQuiz && (
                    <div className="mt-4 pt-4 border-t border-border-color">
                      <p className="text-sm font-semibold text-text-dark">
                        Nilai Kuis: {userProgress.scores?.[module.id] || 0}
                      </p>
                    </div>
                  )}
                  
                  {/* Show upload date */}
                  {module.uploadDate && (
                    <div className="mt-2 text-xs text-text-lighter">
                      Diupload: {module.uploadDate}
                    </div>
                  )}
                </div>
                <div className="p-6 bg-gray-50">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => startQuiz(module.id)}
                      className="flex-1 bg-primary text-white font-bold py-2 px-3 rounded-lg hover:bg-primary-dark transition-colors text-sm">
                      {hasTakenQuiz ? 'Ulang Kuis' : 'Mulai Kuis'}
                    </button>
                    <button 
                      onClick={() => navigate(`/module-detail/${module.id}`)} // Navigate to detailed view of the module
                      className="flex-1 bg-gray-200 text-text-dark font-bold py-2 px-3 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                      Lihat Ringkasan
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 border-t border-border-color">
                  <button 
                    onClick={() => handleDeleteModule(module.id, module.title)}
                    className="flex items-center gap-2 text-danger hover:text-danger-dark text-sm font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Hapus Modul
                  </button>
                </div>
              </div>
            );
          }) : (
            <div className="col-span-full text-center py-12">
              <FileText className="text-gray-400 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Belum Ada Modul</h3>
              <p className="text-gray-500 mb-6">Upload modul pertama Anda untuk mulai belajar</p>
              <Link
                to="/upload"
                className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors inline-block"
              >
                Upload Modul
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ModulePage;