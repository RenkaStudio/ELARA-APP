import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, BookOpen, Clock, BarChart3, AlertTriangle } from 'lucide-react';

const ModuleDetailPage = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Load all modules from localStorage
      const savedModules = JSON.parse(localStorage.getItem('modules') || '[]');
      // Find the specific module by ID
      const foundModule = savedModules.find(m => m.id === moduleId);
      
      if (foundModule) {
        setModule(foundModule);
      } else {
        setError('Modul tidak ditemukan');
      }
    } catch (err) {
      console.error('Error loading module:', err);
      setError('Gagal memuat modul');
    } finally {
      setLoading(false);
    }
  }, [moduleId]);

  if (loading) {
    return (
      <div className="bg-bg-light min-h-screen font-poppins">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <span className="ml-3 text-text-light">Memuat detail modul...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="bg-bg-light min-h-screen font-poppins">
        <div className="container mx-auto p-6">
          <div className="max-w-3xl mx-auto bg-bg-card p-6 rounded-xl shadow-soft border border-border-color">
            <h2 className="text-xl font-bold text-text-dark mb-4">Error</h2>
            <p className="text-text-light">{error || 'Modul tidak ditemukan'}</p>
            <button 
              onClick={() => navigate('/modules')}
              className="mt-4 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Kembali ke Daftar Modul
            </button>
          </div>
        </div>
      </div>
    );
  }

  const learningProfile = JSON.parse(localStorage.getItem('learningProfile') || '{}');
  const userProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
  const hasTakenQuiz = userProgress.quizzesTaken?.includes(module.id) || false;
  const quizScore = userProgress.scores?.[module.id] || null;

  return (
    <div className="bg-bg-light min-h-screen font-poppins">
      <header className="bg-bg-card shadow-sm border-b border-border-color sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/modules')}
              className="flex items-center text-primary hover:text-accent transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              Kembali ke Daftar Modul
            </button>
            <h1 className="text-xl font-bold text-text-dark">Detail Modul</h1>
            <div className="w-24"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Module Header */}
          <div className="bg-bg-card rounded-xl shadow-soft border border-border-color p-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-text-dark mb-2">{module.title}</h2>
                <p className="text-text-light mb-4">{module.description}</p>
                <div className="flex items-center gap-4 text-sm text-text-lighter">
                  <span>Diupload: {module.uploadDate}</span>
                  <span className="flex items-center gap-1">
                    <BookOpen size={14} />
                    {module.keyTopics ? module.keyTopics.length : 0} topik
                  </span>
                </div>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <FileText className="text-primary" size={32} />
              </div>
            </div>
          </div>

          {/* Module Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-border-color">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-2 rounded-full text-yellow-600 mr-3">
                  <BarChart3 size={16} />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Nilai Kuis</p>
                  <p className="text-lg font-bold text-gray-800">{quizScore !== null ? quizScore : '-'}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-border-color">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600 mr-3">
                  <BookOpen size={16} />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Jumlah Topik</p>
                  <p className="text-lg font-bold text-gray-800">{module.keyTopics ? module.keyTopics.length : 0} topik</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Summary Section */}
          <div className="bg-bg-card rounded-xl shadow-soft border border-border-color p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="bg-primary/10 p-2 rounded-lg mr-3">
                <FileText className="text-primary" size={18} />
              </div>
              <h3 className="text-xl font-bold text-text-dark">Ringkasan Modul</h3>
            </div>
            <div className="prose max-w-none mb-4">
              <p className="text-text-dark leading-relaxed">
                {module.summary || 'Belum ada ringkasan yang dibuat. Upload modul lagi untuk menghasilkan ringkasan.'}
              </p>
            </div>

            {/* Learning Objectives */}
            {module.learningObjectives && module.learningObjectives.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border-color">
                <h4 className="font-semibold text-text-dark mb-3 flex items-center">
                  <FileText className="text-green-600 mr-2" size={16} />
                  Tujuan Pembelajaran
                </h4>
                <ul className="space-y-1">
                  {module.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2 mt-1">•</span>
                      <span className="text-text-dark">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
          </div>



          {/* Actions */}
          <div className="bg-bg-card rounded-xl shadow-soft border border-border-color p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(`/quiz/${module.id}`)}
                className={`flex-1 py-3 px-6 rounded-lg font-bold text-center ${
                  hasTakenQuiz 
                    ? 'bg-accent text-white hover:bg-blue-700' 
                    : 'bg-primary text-white hover:bg-blue-700'
                } transition-colors`}
              >
                {hasTakenQuiz ? 'Ulang Kuis' : 'Kerjakan Kuis'}
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-3 px-6 rounded-lg font-bold bg-gray-200 text-text-dark hover:bg-gray-300 transition-colors"
              >
                Kembali ke Dashboard
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModuleDetailPage;