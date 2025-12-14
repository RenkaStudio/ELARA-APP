import React, { useEffect, useState } from 'react';
import { useLearningAnalytics } from '../context/LearningAnalyticsContext';
import { analyzeLearningPatterns as advancedPatternAnalyzer } from '../utils/learningPatternAnalyzer';
import { TrendingUp, Clock, Target, BarChart3, Users, Zap } from 'lucide-react';

const LearningAnalyticsDisplay = () => {
  const { learningData, analyzeLearningPatterns, identifyLearningPatterns } = useLearningAnalytics();
  const [advancedPatterns, setAdvancedPatterns] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ambil profil belajar pengguna
    let learningProfile = null;
    try {
      const profileStr = localStorage.getItem('learningProfile');
      if (profileStr) {
        learningProfile = JSON.parse(profileStr);
      }
    } catch (e) {
      console.error('Error parsing learning profile:', e);
    }
    
    // Analisis pola belajar lanjutan
    if (learningData && learningProfile) {
      setLoading(true);
      setTimeout(() => {
        const patterns = advancedPatternAnalyzer(learningData, learningProfile);
        setAdvancedPatterns(patterns);
        setLoading(false);
      }, 300); // Simulasi waktu pemrosesan
    }
  }, [learningData]);

  // Hitung statistik umum
  const totalLearningTime = Object.values(learningData.timeSpent).reduce((sum, time) => sum + time, 0);
  const totalAccesses = Object.values(learningData.accessFrequency).reduce((sum, count) => sum + count, 0);
  const avgQuizScore = Object.values(learningData.quizPerformance).length > 0 
    ? Object.values(learningData.quizPerformance).reduce((sum, perf) => sum + (perf.average || 0), 0) / Object.values(learningData.quizPerformance).length
    : 0;

  // Konversi detik ke jam dan menit
  const hours = Math.floor(totalLearningTime / 3600);
  const minutes = Math.floor((totalLearningTime % 3600) / 60);

  return (
    <div className="bg-bg-card p-6 rounded-xl shadow-soft">
      <div className="flex items-center mb-4">
        <div className="bg-primary/10 p-2 rounded-lg mr-3">
          <BarChart3 size={20} className="text-primary" />
        </div>
        <h2 className="text-xl font-bold text-text-dark">Analisis Pola Belajar</h2>
      </div>

      {/* Statistik Umum */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center">
            <Clock className="text-primary mr-2" size={16} />
            <h3 className="font-semibold text-text-dark">Waktu Belajar</h3>
          </div>
          <p className="text-2xl font-bold text-primary mt-2">{hours}h {minutes}m</p>
          <p className="text-text-light text-sm">Total waktu belajar</p>
        </div>

        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center">
            <TrendingUp className="text-primary mr-2" size={16} />
            <h3 className="font-semibold text-text-dark">Frekuensi Akses</h3>
          </div>
          <p className="text-2xl font-bold text-primary mt-2">{totalAccesses}</p>
          <p className="text-text-light text-sm">Total akses modul</p>
        </div>

        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center">
            <Target className="text-primary mr-2" size={16} />
            <h3 className="font-semibold text-text-dark">Nilai Rata-rata</h3>
          </div>
          <p className="text-2xl font-bold text-primary mt-2">{avgQuizScore ? avgQuizScore.toFixed(1) : 0}/5</p>
          <p className="text-text-light text-sm">Rata-rata kuis</p>
        </div>
      </div>

      {/* Pola Belajar Teridentifikasi (Algoritma Lanjutan) */}
      <div className="mb-4">
        <h3 className="font-bold text-text-dark mb-3">Pola Belajar Teridentifikasi (AI Analysis)</h3>
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mr-2"></div>
            <span className="text-text-light text-sm">Menganalisis pola belajar Anda...</span>
          </div>
        ) : advancedPatterns.length > 0 ? (
          <div className="space-y-3">
            {advancedPatterns.map((pattern) => (
              <div 
                key={pattern.id} 
                className={`p-4 rounded-lg border ${pattern.color} bg-opacity-50`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`font-bold ${pattern.color.split(' ')[2]}`}>{pattern.name}</h4>
                    <p className="text-text-light text-sm mt-1">{pattern.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{pattern.characteristics}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${pattern.color}`}>
                    {pattern.members} modul
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text-light text-sm">Belum ada cukup data untuk mengidentifikasi pola belajar menggunakan algoritma AI.</p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border-color">
        <div className="flex items-start">
          <Zap className="text-primary mr-2 mt-0.5 flex-shrink-0" size={16} />
          <p className="text-text-light text-sm">
            Sistem kami menggunakan algoritma K-Means Clustering dan Decision Tree untuk menganalisis 
            pola belajar Anda berdasarkan data interaksi seperti waktu belajar, frekuensi akses, dan hasil kuis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearningAnalyticsDisplay;