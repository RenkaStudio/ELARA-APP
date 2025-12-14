import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaBrain, FaChartLine } from 'react-icons/fa';

const LearningProfilePage = () => {
  const [learningProfile, setLearningProfile] = useState({});

  useEffect(() => {
    // Load user data
    const savedProfile = JSON.parse(localStorage.getItem('learningProfile') || '{}');
    setLearningProfile(savedProfile);
  }, []);

  const getAbilityText = (ability) => {
    if (ability === 0) return 'Sangat Tahu';
    if (ability === 1) return 'Kurang Tahu';
    if (ability === 2) return 'Cukup Tahu';
    if (ability === 3) return 'Sangat Tahu';
    return 'Belum diuji';
  };

  const getLearningStyleDescription = (style) => {
    if (!style) return 'Deskripsi gaya belajar tidak tersedia. Silakan lengkapi kuis gaya belajar terlebih dahulu.';

    // Normalisasi gaya belajar untuk menangani berbagai kemungkinan penamaan
    const normalizedStyle = style.toLowerCase().trim();

    switch (normalizedStyle) {
      case 'visual':
        return 'Anda belajar lebih baik dengan bantuan gambar, diagram, dan representasi visual lainnya. Gaya belajar ini cocok dengan penggunaan peta konsep, grafik, dan penggunaan warna dalam catatan.';
      case 'auditori':
      case 'auditory':
      case 'aural':
        return 'Anda belajar lebih baik melalui pendengaran dan suara. Anda lebih mudah memahami informasi ketika dibacakan atau didiskusikan, serta bisa belajar melalui musik dan suara.';
      case 'kinestetik':
      case 'kinesthetic':
        return 'Anda belajar lebih baik dengan pengalaman langsung dan aktivitas fisik. Anda perlu terlibat langsung dalam proses belajar dan sering menggunakan gerakan tubuh untuk memperkuat memori.';
      case 'reading/writing':
      case 'reading':
      case 'writing':
        return 'Anda belajar lebih baik melalui membaca dan menulis. Anda merasa nyaman dengan catatan tertulis, membaca ulang materi, dan mengorganisir informasi dalam bentuk teks.';
      default:
        // Jika gaya belajar tidak dikenal, tetapi ada nilai, mungkin itu adalah nama yang berbeda
        // Kembalikan pesan umum berdasarkan nilai yang ditemukan
        return `Deskripsi untuk gaya belajar "${style}" tidak dikenal. Silakan lakukan kuis gaya belajar untuk identifikasi yang lebih akurat.`;
    }
  };

  const getLearningStyleStrategies = (style) => {
    if (!style) return [];

    // Normalisasi gaya belajar untuk menangani berbagai kemungkinan penamaan
    const normalizedStyle = style.toLowerCase().trim();

    switch (normalizedStyle) {
      case 'visual':
        return [
          'Gunakan diagram dan peta konsep',
          'Buat catatan dengan warna-warna berbeda',
          'Gunakan teknik visualisasi dan simbol',
          'Gunakan grafik dan bagan untuk belajar'
        ];
      case 'auditori':
      case 'auditory':
      case 'aural':
        return [
          'Bacakan materi dengan suara keras',
          'Diskusikan materi dengan teman',
          'Gunakan musik atau ritme untuk belajar',
          'Rekam dan dengarkan pembelajaran'
        ];
      case 'kinestetik':
      case 'kinesthetic':
        return [
          'Terapkan konsep dalam praktik',
          'Gunakan peraga atau model',
          'Belajar sambil bergerak atau berjalan',
          'Gunakan metode berbasis proyek'
        ];
      case 'reading/writing':
      case 'reading':
      case 'writing':
        return [
          'Buat ringkasan tertulis',
          'Gunakan teknik highlight dan catatan sisi',
          'Tulis ulang konsep penting',
          'Gunakan teknik membuat catatan sistematis'
        ];
      default:
        return [
          'Lengkapi profil belajar untuk strategi yang lebih spesifik.',
          'Ikuti kuis gaya belajar untuk rekomendasi yang lebih akurat.'
        ];
    }
  };

  const learningStyleStrategies = getLearningStyleStrategies(learningProfile.learningStyle);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Profil Belajar Saya</h2>
        <Link
          to="/diagnostic-quiz"
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center"
        >
          Sesuaikan Gaya Belajar
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </Link>
      </div>

      {/* Informasi Dasar */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            <FaUser className="text-blue-600" style={{ width: 18, height: 18 }} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Informasi Dasar</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-gray-600 text-xs uppercase tracking-wide">Gaya Belajar</p>
                <p className="font-medium text-gray-800">{learningProfile.learningStyle || 'Belum diidentifikasi'}</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-600 text-xs uppercase tracking-wide">Kemampuan Awal</p>
                <p className="font-medium text-gray-800">{getAbilityText(learningProfile.ability)}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 10-1.414 1.415L11 9.586V12a1 1 0 102 0v-2a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-gray-600 text-xs uppercase tracking-wide">Waktu Fokus</p>
                <p className="font-medium text-gray-800">{learningProfile.focusTime || 'Belum ditentukan'}</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 10-1.414 1.415L11 9.586V12a1 1 0 102 0v-2a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-gray-600 text-xs uppercase tracking-wide">Durasi Sesi</p>
                <p className="font-medium text-gray-800">{learningProfile.sessionDuration || 'Tidak ditentukan'} menit</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Gaya Belajar */}
      {learningProfile.learningStyle && (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <FaBrain className="text-green-600" style={{ width: 18, height: 18 }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Gaya Belajar: {learningProfile.learningStyle}</h3>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-2 text-sm">Deskripsi</h4>
              <p className="text-gray-600 text-sm">
                {getLearningStyleDescription(learningProfile.learningStyle)}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-2 text-sm">Strategi Belajar</h4>
              <ul className="space-y-2">
                {learningStyleStrategies.map((strategy, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-600 text-sm">{strategy}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LearningProfilePage;