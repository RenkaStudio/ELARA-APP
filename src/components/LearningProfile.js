import React, { useState, useEffect } from 'react';
import { BookOpen, Eye, Users, Wrench, Clock, Target, Award, Brain } from 'lucide-react';

const LearningProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedProfile = localStorage.getItem('learningProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="bg-bg-card p-6 rounded-xl shadow-soft">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-text-light">Memuat profil belajar...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-bg-card p-6 rounded-xl shadow-soft">
        <div className="text-center py-8">
          <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <Brain className="text-primary" size={24} />
          </div>
          <h3 className="text-lg font-bold text-text-dark mb-2">Profil Belajar Belum Ditentukan</h3>
          <p className="text-text-light mb-4">Silakan lengkapi kuis diagnostik awal untuk menentukan profil belajar kamu.</p>
          <button 
            onClick={() => window.location.href = '/diagnostic-quiz'}
            className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Mulai Kuis Diagnostik
          </button>
        </div>
      </div>
    );
  }

  // Mapping profil belajar ke label yang lebih deskriptif
  const getAbilityLabel = (level) => {
    const labels = {
      0: 'Pemula (Sangat Tidak Tahu)',
      1: 'Pemula (Kurang Tahu)',
      2: 'Menengah (Cukup Tahu)',
      3: 'Mahir (Sangat Tahu)'
    };
    return labels[level] || 'Tidak Diketahui';
  };

  const getLearningStyleLabel = (style) => {
    const labels = {
      'reading': 'Reading/Write (Membaca-Menulis)',
      'visual': 'Visual (Melihat-Demonstrasi)',
      'kinesthetic': 'Kinesthetic (Praktik)',
      'auditory': 'Auditory (Mendengarkan-Diskusi)',
      'mixed': 'Campuran'
    };
    return labels[style] || 'Tidak Diketahui';
  };

  return (
    <div className="bg-bg-card p-6 rounded-xl shadow-soft">
      <div className="flex items-center mb-4">
        <div className="bg-primary/10 p-2 rounded-lg mr-3">
          <Brain size={20} className="text-primary" />
        </div>
        <h2 className="text-xl font-bold text-text-dark">Profil Belajar Kamu</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <BookOpen className="text-primary mr-2" size={16} />
            <h3 className="font-semibold text-text-dark">Kemampuan Awal</h3>
          </div>
          <p className="text-text-light text-sm">{getAbilityLabel(profile.ability)}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Eye className="text-primary mr-2" size={16} />
            <h3 className="font-semibold text-text-dark">Gaya Belajar</h3>
          </div>
          <p className="text-text-light text-sm">{getLearningStyleLabel(profile.learningStyle)}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Clock className="text-primary mr-2" size={16} />
            <h3 className="font-semibold text-text-dark">Durasi Fokus</h3>
          </div>
          <p className="text-text-light text-sm">{profile.focusTime}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Wrench className="text-primary mr-2" size={16} />
            <h3 className="font-semibold text-text-dark">Penyelesaian Masalah</h3>
          </div>
          <p className="text-text-light text-sm">{getLearningStyleLabel(profile.problemSolving)}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Target className="text-primary mr-2" size={16} />
            <h3 className="font-semibold text-text-dark">Kecepatan Belajar</h3>
          </div>
          <p className="text-text-light text-sm">{profile.learningPace}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Users className="text-primary mr-2" size={16} />
            <h3 className="font-semibold text-text-dark">Frekuensi Belajar</h3>
          </div>
          <p className="text-text-light text-sm">{profile.frequency}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
          <div className="flex items-center mb-2">
            <Award className="text-primary mr-2" size={16} />
            <h3 className="font-semibold text-text-dark">Metode Evaluasi</h3>
          </div>
          <p className="text-text-light text-sm">{profile.assessment}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border-color">
        <p className="text-text-light text-sm">
          Profil ini digunakan untuk menyesuaikan materi, tingkat kesulitan, dan metode penyajian sesuai dengan kebutuhan dan gaya belajar kamu.
        </p>
      </div>
    </div>
  );
};

export default LearningProfile;