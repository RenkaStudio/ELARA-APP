import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useLearningAnalytics } from '../context/LearningAnalyticsContext';
import { TrendingUp, Target, Award, BarChart3, RotateCcw } from 'lucide-react';

const EffectivenessMetrics = () => {
  const { userProgress } = useUser();
  const { learningData, analyzeLearningPatterns, identifyLearningPatterns } = useLearningAnalytics();
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateMetrics();
  }, [userProgress, learningData]);

  const calculateMetrics = () => {
    // Hitung peningkatan skor kuis
    const quizScores = userProgress.scores;
    const quizIds = Object.keys(quizScores);
    
    let avgScore = 0;
    let improvementPercentage = 0;
    let participationIncrease = 0;
    
    if (quizIds.length > 0) {
      const totalScore = Object.values(quizScores).reduce((sum, score) => sum + score, 0);
      avgScore = (totalScore / (quizIds.length * 5)) * 100; // 5 adalah jumlah soal per kuis
      
      // Dalam sistem nyata, kita akan membandingkan dengan data sebelum menggunakan sistem adaptif
      // Untuk simulasi, kita asumsikan baseline
      const baselineScore = 60; // skor dasar
      improvementPercentage = Math.max(0, avgScore - baselineScore);
    }
    
    // Hitung peningkatan partisipasi (simulasi berdasarkan jumlah modul yang diselesaikan)
    const moduleCompletionRate = (userProgress.modulesCompleted.length / 3) * 100; // 3 adalah total jumlah modul dasar
    participationIncrease = moduleCompletionRate; // Ini adalah simulasi
    
    // Identifikasi pola belajar
    const patterns = identifyLearningPatterns();
    
    setMetrics({
      avgScore,
      improvementPercentage,
      participationIncrease,
      moduleCompletionRate: (userProgress.modulesCompleted.length / 3) * 100,
      modulesCompleted: userProgress.modulesCompleted.length,
      quizzesTaken: userProgress.quizzesTaken.length,
      learningPatterns: patterns
    });
    
    setLoading(false);
  };

  const getPerformanceIcon = (score) => {
    if (score >= 80) return <Target className="text-primary" size={20} />;
    if (score >= 60) return <Target className="text-secondary" size={20} />;
    return <Target className="text-text-light" size={20} />;
  };

  const refreshMetrics = () => {
    setLoading(true);
    setTimeout(() => {
      calculateMetrics();
    }, 500);
  };

  if (loading) {
    return (
      <div className="bg-bg-card p-6 rounded-xl shadow-soft">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="ml-3 text-text-light">Menghitung metrik efektivitas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-card p-6 rounded-xl shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-primary/10 p-2 rounded-lg mr-3">
            <BarChart3 size={20} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold text-text-dark">Metrik Efektivitas Sistem</h2>
        </div>
        <button 
          onClick={refreshMetrics}
          className="p-1.5 text-text-light hover:text-primary"
          title="Perbarui metrik"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg border border-primary/30">
          <div className="flex items-center">
            <div className="bg-primary/20 p-2 rounded-lg mr-3">
              <TrendingUp className="text-primary" size={16} />
            </div>
            <h3 className="font-semibold text-text-dark">Peningkatan Skor</h3>
          </div>
          <p className="text-2xl font-bold text-primary mt-2">{metrics.improvementPercentage ? metrics.improvementPercentage.toFixed(1) : 0}%</p>
          <p className="text-text-light text-sm">Dibandingkan baseline</p>
          <div className="w-full bg-primary/20 rounded-full h-2 mt-2">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${Math.min(100, metrics.improvementPercentage)}%` }}
            ></div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg border border-primary/30">
          <div className="flex items-center">
            <div className="bg-primary/20 p-2 rounded-lg mr-3">
              <Award className="text-primary" size={16} />
            </div>
            <h3 className="font-semibold text-text-dark">Rata-rata Skor</h3>
          </div>
          <p className="text-2xl font-bold text-primary mt-2">{metrics.avgScore ? metrics.avgScore.toFixed(1) : 0}%</p>
          <p className="text-text-light text-sm">Dari semua kuis</p>
          <div className="flex items-center mt-2">
            {getPerformanceIcon(metrics.avgScore)}
            <span className="ml-2 text-sm">
              {metrics.avgScore >= 80 ? 'Sangat Baik' : 
               metrics.avgScore >= 60 ? 'Cukup' : 'Perlu Perbaikan'}
            </span>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg border border-primary/30">
          <div className="flex items-center">
            <div className="bg-primary/20 p-2 rounded-lg mr-3">
              <TrendingUp className="text-primary" size={16} />
            </div>
            <h3 className="font-semibold text-text-dark">Partisipasi</h3>
          </div>
          <p className="text-2xl font-bold text-primary mt-2">{metrics.participationIncrease ? metrics.participationIncrease.toFixed(1) : 0}%</p>
          <p className="text-text-light text-sm">Kenaikan partisipasi</p>
          <div className="w-full bg-primary/20 rounded-full h-2 mt-2">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${metrics.participationIncrease}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-bg-card rounded-lg border border-border-color">
          <h3 className="font-semibold text-text-dark mb-2">Progress Modul</h3>
          <p className="text-lg font-bold text-text-dark mb-3">{metrics.modulesCompleted} dari 3</p>
          <div className="w-full bg-primary/20 rounded-full h-3">
            <div 
              className="bg-primary h-3 rounded-full" 
              style={{ width: `${metrics.moduleCompletionRate}%` }}
            ></div>
          </div>
          <p className="text-text-light text-sm mt-2">{metrics.moduleCompletionRate ? metrics.moduleCompletionRate.toFixed(1) : 0}% selesai</p>
        </div>

        <div className="p-4 bg-bg-card rounded-lg border border-border-color">
          <h3 className="font-semibold text-text-dark mb-2">Kuis yang Diambil</h3>
          <p className="text-lg font-bold text-text-dark mb-3">{metrics.quizzesTaken}</p>
          <div className="flex items-center text-sm">
            <TrendingUp className="text-primary mr-1" size={16} />
            <span className="text-text-light">Jumlah kuis yang dikerjakan</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border-color">
        <h3 className="font-bold text-text-dark mb-3">Pola Belajar Teridentifikasi</h3>
        {metrics.learningPatterns && metrics.learningPatterns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {metrics.learningPatterns.map((pattern) => (
              <div key={pattern.id} className={`p-3 rounded-lg border ${pattern.color.replace('text', 'border-')} bg-opacity-50`}>
                <h4 className={`font-semibold ${pattern.color.split(' ')[2]}`}>{pattern.name}</h4>
                <p className="text-sm text-text-light">{pattern.count} modul</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text-light text-sm">Belum ada cukup data untuk mengidentifikasi pola belajar.</p>
        )}
      </div>

      <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
        <h4 className="font-bold text-primary mb-2">Catatan Sistem Adaptif</h4>
        <p className="text-primary text-sm">
          Sistem ini menyesuaikan pengalaman belajar berdasarkan profil belajar dan pola interaksi Anda.
          Semakin banyak aktivitas yang Anda lakukan, semakin akurat rekomendasi yang dapat diberikan sistem.
        </p>
      </div>
    </div>
  );
};

export default EffectivenessMetrics;