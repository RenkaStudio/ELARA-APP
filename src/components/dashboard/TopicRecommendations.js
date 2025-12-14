import React from 'react';
import { Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopicRecommendations = ({ userProgress }) => {
  const navigate = useNavigate();

  // Determine recommendations based on user progress
  const allModules = [
    { id: 1, topic: 'Pengantar Sistem Informasi', priority: 'Wajib', level: 'Dasar', difficulty: 'Mudah' },
    { id: 2, topic: 'Analisis dan Desain Sistem', priority: 'Wajib', level: 'Menengah', difficulty: 'Sedang' },
    { id: 3, topic: 'Basis Data dan SQL', priority: 'Wajib', level: 'Menengah', difficulty: 'Sedang' },
    { id: 4, topic: 'Sistem Informasi Manajemen', priority: 'Pilihan', level: 'Lanjutan', difficulty: 'Sulit' },
    { id: 5, topic: 'Aplikasi Web untuk Sistem Informasi', priority: 'Pilihan', level: 'Lanjutan', difficulty: 'Sulit' },
    { id: 6, topic: 'Keamanan Sistem Informasi', priority: 'Pilihan', level: 'Lanjutan', difficulty: 'Sulit' },
  ];

  // Filter out completed modules and get recommendations
  const incompleteModules = allModules.filter(module => 
    !userProgress.modulesCompleted.includes(module.id)
  );

  // Sort by priority and then by ID
  const sortedRecommendations = [...incompleteModules].sort((a, b) => {
    if (a.priority === 'Wajib' && b.priority !== 'Wajib') return -1;
    if (b.priority === 'Wajib' && a.priority !== 'Wajib') return 1;
    return a.id - b.id;
  });

  // Get top 3 recommendations
  const recommendations = sortedRecommendations.slice(0, 3);

  const handleStartModule = (moduleId) => {
    navigate('/modules');
    // Scroll to the specific module after navigation
    setTimeout(() => {
      const element = document.getElementById(`module-${moduleId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="bg-bg-card p-6 rounded-xl shadow-soft">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Zap className="text-primary" size={24} />
        </div>
        <h2 className="text-xl font-bold text-text-dark">Rekomendasi Modul Untuk Anda</h2>
      </div>
      {recommendations.length > 0 ? (
        <ul className="space-y-4">
          {recommendations.map((item, index) => (
            <li key={item.id} className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary transition-colors">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">{index + 1}</div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-semibold text-text-dark">{item.topic}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.priority === 'Wajib' ? 'bg-danger/20 text-danger' :
                    item.priority === 'Pilihan' ? 'bg-accent/20 text-accent' :
                    'bg-warning/20 text-warning'
                  }`}>
                    {item.priority}
                  </span>
                </div>
                <div className="flex text-sm text-text-light mt-1">
                  <span className="mr-4">{item.level}</span>
                  <span>{item.difficulty}</span>
                </div>
              </div>
              <button 
                onClick={() => handleStartModule(item.id)}
                className="bg-primary text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Mulai
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8">
          <p className="text-text-light">Selamat! Anda telah menyelesaikan semua modul yang tersedia.</p>
          <p className="text-text-light mt-2">Teruskan pembelajaran Anda dengan mereview modul yang telah diselesaikan.</p>
        </div>
      )}
    </div>
  );
};

export default TopicRecommendations;