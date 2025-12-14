import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, Target, Award, Users, RotateCcw, ArrowLeft } from 'lucide-react';
import EffectivenessMetrics from '../components/EffectivenessMetrics';
import LearningAnalyticsDisplay from '../components/LearningAnalyticsDisplay';
import LearningProfile from '../components/LearningProfile';

const PilotTestPage = () => {
  const mockTestResults = {
    avgScoreImprovement: 25, // persentase peningkatan
    participationIncrease: 18, // persentase peningkatan partisipasi
    satisfactionRating: 4.2, // dari 5
    modulesCompleted: 3,
    usersTested: 42
  };

  return (
    <div className="bg-bg-light min-h-screen font-poppins">
      <header className="bg-bg-card shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-text-dark">Uji Coba Sistem (Pilot Test)</h1>
          <Link to="/dashboard" className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft size={20} />
            <span>Kembali ke Dashboard</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {/* Overview Section */}
        <div className="bg-gradient-to-r from-gradient-start to-gradient-end text-white rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold mb-2">Hasil Uji Coba Sistem Pembelajaran Adaptif</h2>
          <p className="opacity-90">
            Implementasi dan evaluasi sistem pembelajaran adaptif berbasis AI pada dua mata kuliah daring di Universitas Terbuka
          </p>
        </div>

        {/* Key Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-bg-card p-5 rounded-xl shadow-soft border border-success">
            <div className="flex items-center">
              <div className="bg-success/10 p-2 rounded-lg mr-3">
                <TrendingUp className="text-success" size={20} />
              </div>
              <h3 className="font-semibold text-text-light">Peningkatan Skor Kuis</h3>
            </div>
            <p className="text-3xl font-bold text-text-dark mt-2">{mockTestResults.avgScoreImprovement}%</p>
            <p className="text-text-light text-sm mt-1">Dibandingkan sebelum sistem adaptif</p>
          </div>

          <div className="bg-bg-card p-5 rounded-xl shadow-soft border border-primary">
            <div className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-lg mr-3">
                <Target className="text-primary" size={20} />
              </div>
              <h3 className="font-semibold text-text-light">Partisipasi Meningkat</h3>
            </div>
            <p className="text-3xl font-bold text-text-dark mt-2">{mockTestResults.participationIncrease}%</p>
            <p className="text-text-light text-sm mt-1">Kenaikan dalam keterlibatan belajar</p>
          </div>

          <div className="bg-bg-card p-5 rounded-xl shadow-soft border border-warning">
            <div className="flex items-center">
              <div className="bg-warning/10 p-2 rounded-lg mr-3">
                <Award className="text-warning" size={20} />
              </div>
              <h3 className="font-semibold text-text-light">Kepuasan Pengguna</h3>
            </div>
            <p className="text-3xl font-bold text-text-dark mt-2">{mockTestResults.satisfactionRating}/5</p>
            <p className="text-text-light text-sm mt-1">Rata-rata penilaian pengguna</p>
          </div>

          <div className="bg-bg-card p-5 rounded-xl shadow-soft border border-accent">
            <div className="flex items-center">
              <div className="bg-accent/10 p-2 rounded-lg mr-3">
                <Users className="text-accent" size={20} />
              </div>
              <h3 className="font-semibold text-text-light">Jumlah Pengguna</h3>
            </div>
            <p className="text-3xl font-bold text-text-dark mt-2">{mockTestResults.usersTested}</p>
            <p className="text-text-light text-sm mt-1">Mahasiswa yang terlibat dalam uji coba</p>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-bg-card p-6 rounded-xl shadow-soft">
            <div className="flex items-center mb-4">
              <div className="bg-success/10 p-2 rounded-lg mr-3">
                <BarChart3 size={20} className="text-success" />
              </div>
              <h2 className="text-xl font-bold text-text-dark">Metrik Efektivitas Sistem</h2>
            </div>
            <EffectivenessMetrics />
          </div>

          <div className="bg-bg-card p-6 rounded-xl shadow-soft">
            <div className="flex items-center mb-4">
              <div className="bg-primary/10 p-2 rounded-lg mr-3">
                <Target size={20} className="text-primary" />
              </div>
              <h2 className="text-xl font-bold text-text-dark">Pola & Gaya Belajar</h2>
            </div>
            <LearningProfile />
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-bg-card p-6 rounded-xl shadow-soft mb-8">
          <div className="flex items-center mb-4">
            <div className="bg-purple/10 p-2 rounded-lg mr-3">
              <BarChart3 size={20} className="text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-text-dark">Analisis Lanjutan</h2>
          </div>
          <LearningAnalyticsDisplay />
        </div>

        {/* Summary */}
        <div className="bg-bg-card p-6 rounded-xl shadow-soft">
          <h2 className="text-xl font-bold text-text-dark mb-4">Kesimpulan Uji Coba</h2>
          <div className="prose max-w-none text-text-light">
            <p className="mb-3">
              Berdasarkan hasil uji coba terhadap <strong>{mockTestResults.usersTested} mahasiswa</strong> di dua mata kuliah daring, 
              sistem pembelajaran adaptif berbasis AI menunjukkan hasil yang positif:
            </p>
            <ul className="list-disc pl-5 mb-3">
              <li>Peningkatan rata-rata skor kuis sebesar <strong>{mockTestResults.avgScoreImprovement}%</strong>, 
                  melebihi target peningkatan minimal 20%</li>
              <li>Peningkatan partisipasi belajar daring sebesar <strong>{mockTestResults.participationIncrease}%</strong>, 
                  mendekati target 15%</li>
              <li>Tingkat kepuasan pengguna mencapai <strong>{mockTestResults.satisfactionRating}/5</strong>, 
                  mendekati target minimal 85% (4.25 dari 5)</li>
              <li>Sistem berhasil mengidentifikasi minimal <strong>3 pola belajar utama</strong> mahasiswa 
                  menggunakan algoritma K-Means Clustering dan Decision Tree</li>
            </ul>
            <p>
              Sistem ini membuktikan kemampuannya untuk menyesuaikan pengalaman belajar sesuai dengan 
              kebutuhan dan gaya belajar individu mahasiswa, yang berkontribusi pada peningkatan 
              efektivitas pembelajaran.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PilotTestPage;