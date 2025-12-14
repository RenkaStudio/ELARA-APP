import React, { useContext, createContext, useState, useEffect } from 'react';

const LearningAnalyticsContext = createContext();

export const useLearningAnalytics = () => {
  return useContext(LearningAnalyticsContext);
};

export const LearningAnalyticsProvider = ({ children }) => {
  const [learningData, setLearningData] = useState({
    sessions: [], // Array of study sessions with timestamps, duration, scores
    timeSpent: {}, // {moduleId: totalSeconds}
    accessFrequency: {}, // {moduleId: count}
    quizPerformance: {}, // {moduleId: {attempts, scores, average}}
    learningPatterns: {}, // Pola belajar teridentifikasi
    statistics: {
      totalStudyTime: 0,
      completedQuizzes: 0,
      totalModules: 0,
      studyDays: 0
    }
  });

  // Load data dari localStorage saat inisialisasi
  useEffect(() => {
    const savedData = localStorage.getItem('learningAnalytics');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setLearningData(parsedData);
      } catch (e) {
        console.error('Error parsing learning analytics data:', e);
      }
    }
  }, []);

  // Simpan data ke localStorage saat ada perubahan
  useEffect(() => {
    try {
      localStorage.setItem('learningAnalytics', JSON.stringify(learningData));
    } catch (e) {
      console.error('Error saving learning analytics data:', e);
    }
  }, [learningData]);

  // Fungsi untuk mencatat sesi belajar
  const recordStudySession = (sessionData) => {
    const newSession = {
      id: Date.now(),
      timestamp: sessionData.timestamp || new Date().toISOString(),
      duration: sessionData.duration || 0,
      subject: sessionData.subject,
      score: sessionData.score,
      notes: sessionData.notes,
      startTime: sessionData.startTime || new Date().toISOString()
    };

    setLearningData(prev => ({
      ...prev,
      sessions: [...prev.sessions, newSession],
      statistics: {
        ...prev.statistics,
        totalStudyTime: prev.statistics.totalStudyTime + (sessionData.duration || 0),
        studyDays: prev.statistics.studyDays + 1
      }
    }));
  };

  // Fungsi untuk mencatat waktu belajar
  const recordTimeSpent = (moduleId, seconds) => {
    // Pastikan moduleId adalah string untuk konsistensi
    const moduleIdStr = typeof moduleId === 'number' ? moduleId.toString() : moduleId;

    setLearningData(prev => ({
      ...prev,
      timeSpent: {
        ...prev.timeSpent,
        [moduleIdStr]: (prev.timeSpent[moduleIdStr] || 0) + seconds
      }
    }));
  };

  // Fungsi untuk mencatat frekuensi akses
  const recordAccess = (moduleId) => {
    // Pastikan moduleId adalah string untuk konsistensi
    const moduleIdStr = typeof moduleId === 'number' ? moduleId.toString() : moduleId;

    setLearningData(prev => ({
      ...prev,
      accessFrequency: {
        ...prev.accessFrequency,
        [moduleIdStr]: (prev.accessFrequency[moduleIdStr] || 0) + 1
      }
    }));
  };

  // Fungsi untuk mencatat kinerja kuis
  const recordQuizPerformance = (moduleId, score, maxScore = 5) => {
    // Pastikan moduleId adalah string untuk konsistensi
    const moduleIdStr = typeof moduleId === 'number' ? moduleId.toString() : moduleId;

    setLearningData(prev => {
      const currentPerformance = prev.quizPerformance[moduleIdStr] || { attempts: 0, scores: [], average: 0 };
      const newAttempts = currentPerformance.attempts + 1;
      const newScores = [...currentPerformance.scores, score];
      const newAverage = newScores.reduce((a, b) => a + b, 0) / newScores.length;

      return {
        ...prev,
        quizPerformance: {
          ...prev.quizPerformance,
          [moduleIdStr]: {
            attempts: newAttempts,
            scores: newScores,
            average: newAverage
          }
        }
      };
    });
  };

  // Fungsi untuk menganalisis pola belajar (sederhana untuk sekarang)
  const analyzeLearningPatterns = () => {
    const patterns = {};

    // Analisis berdasarkan waktu belajar
    for (const [moduleId, time] of Object.entries(learningData.timeSpent)) {
      if (time > 3600) { // Lebih dari 1 jam
        patterns[moduleId] = patterns[moduleId] || {};
        patterns[moduleId].timeSpent = 'high';
      } else if (time > 1800) { // Lebih dari 30 menit
        patterns[moduleId] = patterns[moduleId] || {};
        patterns[moduleId].timeSpent = 'medium';
      } else {
        patterns[moduleId] = patterns[moduleId] || {};
        patterns[moduleId].timeSpent = 'low';
      }
    }

    // Analisis berdasarkan frekuensi akses
    for (const [moduleId, count] of Object.entries(learningData.accessFrequency)) {
      if (count > 5) {
        patterns[moduleId] = patterns[moduleId] || {};
        patterns[moduleId].accessFrequency = 'high';
      } else if (count > 2) {
        patterns[moduleId] = patterns[moduleId] || {};
        patterns[moduleId].accessFrequency = 'medium';
      } else {
        patterns[moduleId] = patterns[moduleId] || {};
        patterns[moduleId].accessFrequency = 'low';
      }
    }

    // Analisis berdasarkan kinerja kuis
    for (const [moduleId, perf] of Object.entries(learningData.quizPerformance)) {
      const avg = perf.average || 0;
      if (avg >= 4) {
        patterns[moduleId] = patterns[moduleId] || {};
        patterns[moduleId].performance = 'high';
      } else if (avg >= 3) {
        patterns[moduleId] = patterns[moduleId] || {};
        patterns[moduleId].performance = 'medium';
      } else {
        patterns[moduleId] = patterns[moduleId] || {};
        patterns[moduleId].performance = 'low';
      }
    }

    setLearningData(prev => ({
      ...prev,
      learningPatterns: patterns
    }));

    return patterns;
  };

  // Identifikasi 3 pola belajar utama berdasarkan data
  const identifyLearningPatterns = () => {
    const patterns = [];

    // Pattern 1: Intensive Learner - Sering akses, waktu lama, nilai bagus
    let intensiveCount = 0;
    for (const [moduleId, pattern] of Object.entries(learningData.learningPatterns)) {
      if (pattern.accessFrequency === 'high' &&
          pattern.timeSpent === 'high' &&
          pattern.performance === 'high') {
        intensiveCount++;
      }
    }

    if (intensiveCount > 0) {
      patterns.push({
        id: 1,
        name: 'Intensive Learner',
        description: 'Mahasiswa yang belajar intensif dengan frekuensi tinggi, waktu lama, dan performa baik',
        count: intensiveCount,
        color: 'bg-blue-100 text-blue-800'
      });
    }

    // Pattern 2: Consistent Learner - Akses sedang, waktu sedang, nilai sedang
    let consistentCount = 0;
    for (const [moduleId, pattern] of Object.entries(learningData.learningPatterns)) {
      if (pattern.accessFrequency === 'medium' &&
          pattern.timeSpent === 'medium' &&
          pattern.performance === 'medium') {
        consistentCount++;
      }
    }

    if (consistentCount > 0) {
      patterns.push({
        id: 2,
        name: 'Consistent Learner',
        description: 'Mahasiswa yang belajar secara konsisten dengan intensitas sedang',
        count: consistentCount,
        color: 'bg-green-100 text-green-800'
      });
    }

    // Pattern 3: Struggling Learner - Akses tinggi atau rendah, tetapi performa rendah
    let strugglingCount = 0;
    for (const [moduleId, pattern] of Object.entries(learningData.learningPatterns)) {
      if ((pattern.accessFrequency === 'high' || pattern.accessFrequency === 'low') &&
          pattern.performance === 'low') {
        strugglingCount++;
      }
    }

    if (strugglingCount > 0) {
      patterns.push({
        id: 3,
        name: 'Struggling Learner',
        description: 'Mahasiswa yang mengalami kesulitan dalam proses belajar',
        count: strugglingCount,
        color: 'bg-yellow-100 text-yellow-800'
      });
    }

    // Jika tidak ada pola yang teridentifikasi, buat default
    if (patterns.length === 0) {
      patterns.push({
        id: 4,
        name: 'Emerging Pattern',
        description: 'Pola belajar masih dalam tahap terbentuk, perlu lebih banyak data',
        count: Object.keys(learningData.learningPatterns).length,
        color: 'bg-gray-100 text-gray-800'
      });
    }

    return patterns;
  };

  const value = {
    learningData,
    recordStudySession,
    recordTimeSpent,
    recordAccess,
    recordQuizPerformance,
    analyzeLearningPatterns,
    identifyLearningPatterns
  };

  return (
    <LearningAnalyticsContext.Provider value={value}>
      {children}
    </LearningAnalyticsContext.Provider>
  );
};