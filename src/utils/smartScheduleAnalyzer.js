import { analyzeLearningPatterns } from './learningPatternAnalyzer';

/**
 * Fungsi untuk menganalisis dan merekomendasikan waktu belajar yang optimal
 * @param {Object} learningData - Data analitik pembelajaran pengguna
 * @param {Object} learningProfile - Profil belajar pengguna
 * @returns {Object} Rekomendasi waktu belajar optimal
 */
export const analyzeSmartSchedule = (learningData = {}, learningProfile = {}) => {
  // Jika tidak ada profil belajar, gunakan nilai default
  if (!learningProfile.focusTime) {
    learningProfile.focusTime = '09:00 - 11:00';
  }
  if (!learningProfile.learningPace) {
    learningProfile.learningPace = 'moderate';
  }
  if (!learningProfile.sessionDuration) {
    learningProfile.sessionDuration = 45;
  }

  // Ambil pola pembelajaran dari data analitik
  const patterns = analyzeLearningPatterns(learningData, learningProfile);
  
  // Analisis waktu paling produktif berdasarkan data historis
  const optimalTimes = analyzeOptimalStudyTimes(learningData, learningProfile);
  
  // Buat jadwal personalisasi
  const personalizedSchedule = createPersonalizedSchedule(optimalTimes, learningProfile);
  
  // Rekomendasi hari terbaik untuk belajar
  const bestStudyDays = analyzeBestStudyDays(learningData);

  return {
    optimalTimes,
    personalizedSchedule,
    bestStudyDays,
    studyStreak: calculateStudyStreak(learningData),
    recommendedSessionDuration: learningProfile.sessionDuration,
    ...patterns
  };
};

/**
 * Analisis waktu belajar paling optimal
 */
const analyzeOptimalStudyTimes = (learningData, learningProfile) => {
  // Jika tidak ada data historis, gunakan waktu umum
  if (!learningData || !learningData.sessions || learningData.sessions.length === 0) {
    // Kembalikan waktu optimal berdasarkan gaya belajar
    const timeRecommendations = {
      visual: ['09:00-11:00', '14:00-16:00'],
      aural: ['10:00-12:00', '15:00-17:00'],
      readWrite: ['08:00-10:00', '19:00-21:00'],
      kinesthetic: ['13:00-15:00', '16:00-18:00'],
      mixed: ['09:00-11:00', '14:00-16:00']
    };

    const style = (learningProfile.learningStyle || 'mixed').toLowerCase().trim();
    return timeRecommendations[style] || timeRecommendations.mixed;
  }

  // Analisis data historis jika tersedia
  const sessionTimes = learningData.sessions.map(session => {
    const date = new Date(session.timestamp || session.startTime);
    return {
      hour: date.getHours(),
      dayOfWeek: date.getDay(),
      score: session.score || 0,
      duration: session.duration || 0
    };
  });

  // Temukan waktu dengan kinerja terbaik
  const timePerformance = {};
  sessionTimes.forEach(session => {
    const hour = session.hour;
    const key = `${hour}:00-${hour + 1}:00`;
    if (!timePerformance[key]) {
      timePerformance[key] = { totalScore: 0, count: 0, avgScore: 0 };
    }
    timePerformance[key].totalScore += session.score;
    timePerformance[key].count += 1;
    timePerformance[key].avgScore = timePerformance[key].totalScore / timePerformance[key].count;
  });

  // Urutkan berdasarkan skor rata-rata
  const sortedTimes = Object.entries(timePerformance)
    .sort((a, b) => b[1].avgScore - a[1].avgScore)
    .slice(0, 3) // Ambil 3 waktu terbaik
    .map(entry => entry[0]);

  return sortedTimes.length > 0 ? sortedTimes : analyzeTimeByLearningStyle(learningProfile);
};

/**
 * Analisis waktu berdasarkan gaya belajar
 */
const analyzeTimeByLearningStyle = (learningProfile) => {
  const style = (learningProfile.learningStyle || 'mixed').toLowerCase().trim();
  const timeRecommendations = {
    visual: ['09:00-11:00', '14:00-16:00'],
    aural: ['10:00-12:00', '15:00-17:00'],
    readWrite: ['08:00-10:00', '19:00-21:00'],
    kinesthetic: ['13:00-15:00', '16:00-18:00'],
    mixed: ['09:00-11:00', '14:00-16:00']
  };

  return timeRecommendations[style] || timeRecommendations.mixed;
};

/**
 * Buat jadwal personalisasi berdasarkan optimal times
 */
const createPersonalizedSchedule = (optimalTimes, learningProfile) => {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const schedule = [];

  // Buat rekomendasi jadwal berdasarkan waktu optimal
  optimalTimes.forEach((time, index) => {
    const dayIndex = (index % 5) + 1; // Senin ke Jumat
    schedule.push({
      day: days[dayIndex],
      time: time,
      activity: 'Belajar Modul Baru',
      duration: learningProfile.sessionDuration || 45,
      priority: 1 // 1 = tinggi, 2 = sedang, 3 = rendah
    });
  });

  return schedule;
};

/**
 * Analisis hari terbaik untuk belajar
 */
const analyzeBestStudyDays = (learningData) => {
  if (!learningData || !learningData.sessions || learningData.sessions.length === 0) {
    return ['Senin', 'Rabu', 'Jumat']; // Default jika tidak ada data
  }

  const dayScores = {};
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  learningData.sessions.forEach(session => {
    const date = new Date(session.timestamp || session.startTime);
    const day = days[date.getDay()];
    if (!dayScores[day]) {
      dayScores[day] = { totalScore: 0, count: 0, avgScore: 0 };
    }
    dayScores[day].totalScore += session.score || 0;
    dayScores[day].count += 1;
    dayScores[day].avgScore = dayScores[day].totalScore / dayScores[day].count;
  });

  // Urutkan berdasarkan skor rata-rata
  return Object.entries(dayScores)
    .sort((a, b) => b[1].avgScore - a[1].avgScore)
    .slice(0, 3)
    .map(entry => entry[0]);
};

/**
 * Hitung streak belajar
 */
const calculateStudyStreak = (learningData) => {
  if (!learningData || !learningData.sessions || learningData.sessions.length === 0) {
    return 0;
  }

  // Ambil tanggal terbaru dari sesi
  const sortedSessions = learningData.sessions
    .map(session => new Date(session.timestamp || session.startTime))
    .sort((a, b) => b - a);
  
  if (sortedSessions.length === 0) return 0;

  const today = new Date();
  const lastSessionDate = sortedSessions[0];
  
  // Cek apakah pengguna belajar hari ini
  const isToday = lastSessionDate.toDateString() === today.toDateString();
  
  // Sederhanakan perhitungan streak - hanya mengembalikan jumlah sesi terakhir
  return sortedSessions.length;
};