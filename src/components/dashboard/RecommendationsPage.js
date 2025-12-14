import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBullseye, FaLightbulb } from 'react-icons/fa';
import SmartScheduleRecommendation from '../SmartScheduleRecommendation';

const RecommendationsPage = () => {
  const [learningProfile, setLearningProfile] = useState({});
  const [modules, setModules] = useState([]);
  const [activeTab, setActiveTab] = useState('general'); // 'general' or 'schedule'

  useEffect(() => {
    // Load user data
    const savedProfile = JSON.parse(localStorage.getItem('learningProfile') || '{}');
    const savedModules = JSON.parse(localStorage.getItem('modules') || '[]');

    setLearningProfile(savedProfile);
    setModules(savedModules);
  }, []);

  // Helper function to normalize learning style name
  const getNormalizedLearningStyle = (style) => {
    if (!style) return null;
    // Normalize the style name for display
    const normalized = style.toLowerCase().trim();
    switch (normalized) {
      case 'visual':
      case 'auditori':
      case 'auditory':
      case 'aural':
      case 'kinestetik':
      case 'kinesthetic':
      case 'reading':
      case 'writing':
      case 'reading/writing':
        return normalized.charAt(0).toUpperCase() + normalized.slice(1);
      default:
        return style; // If it doesn't match known styles, return as is
    }
  };

  // Generate personalized recommendations based on user profile
  const generateRecommendations = () => {
    const recommendations = [];

    if (learningProfile.learningStyle) {
      recommendations.push({
        id: 1,
        title: 'Konten Belajar',
        description: `Fokus pada modul yang sesuai dengan gaya belajar Anda sebagai ${getNormalizedLearningStyle(learningProfile.learningStyle)}.`
      });
    }

    if (learningProfile.focusTime) {
      recommendations.push({
        id: 2,
        title: 'Waktu Belajar',
        description: `Belajarlah pada waktu optimal Anda: ${learningProfile.focusTime}.`
      });
    }

    return recommendations;
  };

  const recommendations = generateRecommendations();

  // Generate learning tips based on learning style
  const getLearningTips = (style) => {
    if (!style) return [
      'Lengkapi profil belajar untuk mendapatkan tips personal.',
      'Ikuti kuis gaya belajar untuk rekomendasi yang lebih akurat.'
    ];

    // Normalisasi gaya belajar untuk menangani berbagai kemungkinan penamaan
    const normalizedStyle = style.toLowerCase().trim();

    switch (normalizedStyle) {
      case 'visual':
        return [
          'Gunakan diagram dan peta konsep',
          'Buat catatan dengan warna-warna berbeda',
          'Gunakan teknik visualisasi dan simbol'
        ];
      case 'auditori':
      case 'auditory':
      case 'aural':
        return [
          'Bacakan materi dengan suara keras',
          'Diskusikan materi dengan teman',
          'Gunakan musik atau ritme untuk belajar'
        ];
      case 'kinestetik':
      case 'kinesthetic':
        return [
          'Terapkan konsep dalam praktik langsung',
          'Gunakan peraga atau model fisik',
          'Belajar sambil bergerak atau berjalan'
        ];
      case 'reading/writing':
      case 'reading':
      case 'writing':
        return [
          'Buat ringkasan tertulis secara teratur',
          'Gunakan teknik highlight dan catatan sisi',
          'Tulis ulang konsep penting dalam bentuk esai'
        ];
      default:
        return [
          'Lengkapi profil belajar untuk mendapatkan tips personal.',
          'Ikuti kuis gaya belajar untuk rekomendasi yang lebih akurat.'
        ];
    }
  };

  const learningTips = getLearningTips(learningProfile.learningStyle);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Rekomendasi AI untuk Anda</h2>
        <Link
          to="/diagnostic-quiz"
          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
        >
          Perbarui Profil
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'general'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('general')}
          >
            Rekomendasi Umum
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'schedule'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('schedule')}
          >
            Jadwal Belajar
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Personalized Insights */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-5 text-white">
                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-lg mr-3">
                    <FaLightbulb style={{ width: 20, height: 20 }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">Wawasan Personalisasi</h3>
                    <p className="text-blue-100 text-sm">
                      Berdasarkan profil belajar Anda sebagai <span className="font-semibold">{learningProfile.learningStyle && learningProfile.learningStyle.charAt(0).toUpperCase() + learningProfile.learningStyle.slice(1) || 'pengguna baru'}</span>,
                      sistem merekomendasikan pendekatan belajar yang disesuaikan.
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommendations List */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <FaBullseye className="text-blue-600" style={{ width: 16, height: 16 }} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Rekomendasi Utama</h3>
                </div>

                {recommendations.length > 0 ? (
                  <div className="space-y-3">
                    {recommendations.map((rec) => (
                      <div key={rec.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex flex-col md:flex-row md:items-center">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800 text-sm">{rec.title}</h4>
                            <p className="text-gray-600 text-xs mt-1">{rec.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Belum ada rekomendasi. Lengkapi profil belajar Anda untuk mendapatkan rekomendasi personal.</p>
                )}
              </div>

              {/* Learning Tips */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Tips Belajar</h3>

                <div className="space-y-2">
                  {learningTips.map((tip, index) => (
                    <div key={index} className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Module Recommendations */}
              {modules.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Modul Rekomendasi</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {modules.slice(0, 2).map((module) => (
                      <div key={module.id} className="border border-gray-200 rounded-lg p-3">
                        <h4 className="font-medium text-gray-800 text-sm mb-1">{module.title}</h4>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{module.uploadDate}</span>
                          <Link
                            to={`/module-detail/${module.id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Lihat →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'schedule' && (
            <div>
              <SmartScheduleRecommendation />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;