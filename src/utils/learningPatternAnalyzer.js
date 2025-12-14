// utils/learningPatternAnalyzer.js
// Sederhana implementasi K-Means Clustering dan Decision Tree untuk analisis pola belajar

/**
 * K-Means Clustering sederhana untuk mengelompokkan pola belajar
 * @param {Array} data - Array objek dengan properti numerik untuk dianalisis
 * @param {number} k - Jumlah cluster
 * @returns {Array} - Array cluster dengan data yang dikelompokkan
 */
export const kMeansClustering = (data, k = 3) => {
  if (data.length < k) return data.map(item => ({ cluster: 0, data: item }));
  
  // Inisialisasi centroid secara acak
  let centroids = [];
  for (let i = 0; i < k; i++) {
    centroids.push(getRandomDataPoint(data));
  }
  
  let clusters = [];
  let iterations = 0;
  const maxIterations = 100;
  
  while (iterations < maxIterations) {
    // Assign data points to closest centroids
    clusters = assignToClusters(data, centroids);
    
    // Update centroids
    const newCentroids = updateCentroids(data, clusters, k);
    
    // Check for convergence
    if (centroidsMatch(centroids, newCentroids)) {
      break;
    }
    
    centroids = newCentroids;
    iterations++;
  }
  
  return clusters;
};

// Fungsi bantu untuk K-Means
const getRandomDataPoint = (data) => {
  const randomIndex = Math.floor(Math.random() * data.length);
  return { ...data[randomIndex] };
};

const euclideanDistance = (point1, point2) => {
  let sum = 0;
  for (const key in point1) {
    if (typeof point1[key] === 'number' && typeof point2[key] === 'number') {
      sum += Math.pow(point1[key] - point2[key], 2);
    }
  }
  return Math.sqrt(sum);
};

const assignToClusters = (data, centroids) => {
  return data.map(dataPoint => {
    let minDistance = Infinity;
    let cluster = 0;
    
    for (let i = 0; i < centroids.length; i++) {
      const distance = euclideanDistance(dataPoint, centroids[i]);
      if (distance < minDistance) {
        minDistance = distance;
        cluster = i;
      }
    }
    
    return { cluster, data: dataPoint };
  });
};

const updateCentroids = (data, clusters, k) => {
  const newCentroids = [];
  
  for (let i = 0; i < k; i++) {
    const clusterPoints = data.filter((_, index) => clusters[index].cluster === i);
    
    if (clusterPoints.length === 0) {
      newCentroids.push(getRandomDataPoint(data));
      continue;
    }
    
    const centroid = {};
    const keys = Object.keys(clusterPoints[0]);
    
    keys.forEach(key => {
      if (typeof clusterPoints[0][key] === 'number') {
        const sum = clusterPoints.reduce((acc, point) => acc + point[key], 0);
        centroid[key] = sum / clusterPoints.length;
      } else {
        // For non-numeric values, just take the first one
        centroid[key] = clusterPoints[0][key];
      }
    });
    
    newCentroids.push(centroid);
  }
  
  return newCentroids;
};

const centroidsMatch = (centroids1, centroids2) => {
  if (centroids1.length !== centroids2.length) return false;
  
  for (let i = 0; i < centroids1.length; i++) {
    for (const key in centroids1[i]) {
      if (typeof centroids1[i][key] === 'number') {
        if (Math.abs(centroids1[i][key] - centroids2[i][key]) > 0.001) {
          return false;
        }
      } else if (centroids1[i][key] !== centroids2[i][key]) {
        return false;
      }
    }
  }
  
  return true;
};

/**
 * Sederhana implementasi Decision Tree untuk menentukan rekomendasi berdasarkan profil belajar
 * @param {Object} profile - Objek profil belajar pengguna
 * @returns {Object} - Rekomendasi berdasarkan Decision Tree
 */
export const decisionTreeRecommendation = (profile) => {
  // Decision tree berdasarkan profil belajar
  let recommendation = {
    type: '',
    title: '',
    description: '',
    priority: 'normal'
  };
  
  // Analisis berdasarkan kemampuan awal
  if (profile.ability <= 1) {
    // Jika kemampuan rendah
    if (profile.learningStyle === 'visual') {
      recommendation = {
        type: 'foundational-visual',
        title: 'Perkuat Dasar dengan Representasi Visual',
        description: 'Gunakan diagram, peta konsep, dan video untuk membangun pemahaman dasar secara visual.',
        priority: 'high'
      };
    } else if (profile.learningStyle === 'reading') {
      recommendation = {
        type: 'foundational-reading',
        title: 'Fokus pada Membaca dan Mencatat',
        description: 'Gunakan sumber bacaan tambahan dan buat catatan terperinci untuk memperkuat konsep dasar.',
        priority: 'high'
      };
    } else {
      recommendation = {
        type: 'foundational-general',
        title: 'Bangun Fondasi Kuat',
        description: 'Fokuskan belajar pada konsep-konsep dasar sebelum melanjut ke topik lanjutan.',
        priority: 'high'
      };
    }
  } else {
    // Jika kemampuan cukup/tinggi
    if (profile.problemSolving === 'kinesthetic') {
      recommendation = {
        type: 'advanced-practical',
        title: 'Aplikasi Praktis Konsep',
        description: 'Terapkan langsung konsep-konsep yang dipelajari dalam proyek atau latihan praktis.',
        priority: 'normal'
      };
    } else if (profile.problemSolving === 'auditory') {
      recommendation = {
        type: 'advanced-discussion',
        title: 'Diskusi dan Penjelasan Lisan',
        description: 'Berdiskusi dengan sesama mahasiswa atau jelaskan konsep dengan suara Anda sendiri.',
        priority: 'normal'
      };
    } else {
      recommendation = {
        type: 'advanced-general',
        title: 'Pendalaman Konsep',
        description: 'Perdalam pemahaman dengan pendekatan yang sesuai dengan gaya belajar Anda.',
        priority: 'normal'
      };
    }
  }
  
  // Penyesuaian berdasarkan durasi fokus
  if (profile.focusTime && profile.focusTime.includes('kurang dari')) {
    recommendation.description += ' Belajar dalam sesi pendek namun sering untuk menjaga fokus.';
  } else if (profile.focusTime && profile.focusTime.includes('lebih dari 45')) {
    recommendation.description += ' Anda memiliki durasi fokus yang baik, gunakan untuk belajar dalam sesi yang lebih panjang.';
  }
  
  return recommendation;
};

/**
 * Analisis pola belajar lanjutan dari data pengguna
 * @param {Object} analyticsData - Data analitik belajar pengguna
 * @param {Object} learningProfile - Profil belajar pengguna
 * @returns {Array} - Array dengan 3 pola belajar utama
 */
export const analyzeLearningPatterns = (analyticsData, learningProfile) => {
  // Kumpulkan data pengguna untuk analisis
  const userFeatures = [];
  
  // Ambil data performa kuis
  for (const [moduleId, perf] of Object.entries(analyticsData.quizPerformance)) {
    // Ambil durasi belajar jika tersedia
    const timeSpent = analyticsData.timeSpent[moduleId] || 0;
    const accessCount = analyticsData.accessFrequency[moduleId] || 0;
    const avgScore = perf.average || 0;
    
    userFeatures.push({
      moduleId,
      timeSpent: timeSpent,
      accessCount: accessCount,
      avgScore: avgScore,
      efficiency: avgScore > 0 ? (avgScore / (timeSpent > 0 ? timeSpent / 60 : 1)) : 0 // efisiensi: skor per menit
    });
  }
  
  // Jika tidak cukup data, gunakan profil belajar
  if (userFeatures.length === 0) {
    userFeatures.push({
      moduleId: 'profile-based',
      timeSpent: learningProfile ? (learningProfile.focusTime.includes('kurang') ? 15 : 45) * 60 : 1800,
      accessCount: learningProfile ? (learningProfile.frequency.includes('sesi singkat') ? 5 : 3) : 3,
      avgScore: learningProfile ? (learningProfile.ability * 1.5) : 2.5,
      efficiency: learningProfile ? (learningProfile.ability * 0.02) : 0.01
    });
  }
  
  // Gunakan K-Means untuk mengelompokkan pola
  const clusters = kMeansClustering(userFeatures, 3);
  
  // Identifikasi 3 pola belajar utama
  const pattern1 = {
    id: 1,
    name: 'Efficient Learner',
    description: 'Mahasiswa yang belajar secara efisien - menghasilkan skor tinggi dengan waktu belajar yang relatif singkat',
    color: 'bg-green-100 text-green-800',
    members: clusters.filter(c => c.cluster === 0).length,
    characteristics: 'Skor tinggi, waktu belajar efisien'
  };
  
  const pattern2 = {
    id: 2,
    name: 'Intensive Learner',
    description: 'Mahasiswa yang belajar intensif - menghabiskan banyak waktu belajar untuk mencapai pemahaman',
    color: 'bg-blue-100 text-blue-800',
    members: clusters.filter(c => c.cluster === 1).length,
    characteristics: 'Waktu belajar lama, frekuensi akses tinggi'
  };
  
  const pattern3 = {
    id: 3,
    name: 'Struggling Learner',
    description: 'Mahasiswa yang mengalami kesulitan - menghabiskan banyak waktu tetapi skor tetap rendah',
    color: 'bg-yellow-100 text-yellow-800',
    members: clusters.filter(c => c.cluster === 2).length,
    characteristics: 'Waktu belajar lama, skor rendah'
  };
  
  // Urutkan pola berdasarkan jumlah anggota (jumlah modul yang cocok)
  return [pattern1, pattern2, pattern3].sort((a, b) => b.members - a.members);
};