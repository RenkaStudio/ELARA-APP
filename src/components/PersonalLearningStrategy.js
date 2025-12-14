import React from 'react';
import { BookOpen, Eye, Wrench, Target, Users, Clock } from 'lucide-react';

const PersonalLearningStrategy = () => {
  // Ambil profil belajar dari localStorage
  let learningProfile = null;
  try {
    const profileStr = localStorage.getItem('learningProfile');
    if (profileStr) {
      learningProfile = JSON.parse(profileStr);
    }
  } catch (e) {
    console.error('Error parsing learning profile:', e);
  }

  // Fungsi untuk mendapatkan label yang lebih deskriptif
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

  const getAbilityLabel = (level) => {
    const labels = {
      0: 'Pemula (Sangat Tidak Tahu)',
      1: 'Pemula (Kurang Tahu)',
      2: 'Menengah (Cukup Tahu)',
      3: 'Mahir (Sangat Tahu)'
    };
    return labels[level] || 'Tidak Diketahui';
  };

  // Rekomendasi berdasarkan profil belajar
  const generateRecommendations = () => {
    if (!learningProfile) {
      return [
        {
          title: "Lengkapi Profil Belajar",
          description: "Silakan lengkapi kuis diagnostik awal untuk mendapatkan rekomendasi strategi belajar personal.",
          icon: <Target className="text-warning" size={20} />,
          color: "bg-warning/10 text-warning"
        }
      ];
    }

    const recommendations = [];

    // Rekomendasi berdasarkan gaya belajar
    switch (learningProfile.learningStyle) {
      case 'reading':
        recommendations.push({
          title: "Strategi Belajar Reading/Write",
          description: "Gunakan metode membaca aktif dan membuat catatan tertulis. Buat ringkasan setiap modul dalam bentuk tertulis dan jelaskan konsep dengan kata-kata Anda sendiri.",
          icon: <BookOpen className="text-primary" size={20} />,
          color: "bg-primary/10 text-primary"
        });
        break;
      case 'visual':
        recommendations.push({
          title: "Strategi Belajar Visual",
          description: "Buat diagram, peta konsep, dan bagan saat belajar. Gunakan warna berbeda untuk konsep berbeda dan cari video penjelasan tambahan untuk konsep-konsep yang sulit.",
          icon: <Eye className="text-success" size={20} />,
          color: "bg-success/10 text-success"
        });
        break;
      case 'kinesthetic':
        recommendations.push({
          title: "Strategi Belajar Kinesthetic",
          description: "Terapkan langsung konsep-konsep yang dipelajari melalui praktik. Buat simulasi atau prototipe sederhana untuk memperkuat pemahaman.",
          icon: <Wrench className="text-accent" size={20} />,
          color: "bg-accent/10 text-accent"
        });
        break;
      case 'auditory':
        recommendations.push({
          title: "Strategi Belajar Auditory",
          description: "Jelaskan konsep-konsep yang dipelajari dengan suara Anda sendiri. Diskusikan materi dengan teman sekelas atau rekam penjelasan Anda sendiri.",
          icon: <Users className="text-purple" size={20} />,
          color: "bg-purple/10 text-purple"
        });
        break;
      default:
        recommendations.push({
          title: "Strategi Belajar Campuran",
          description: "Coba berbagai pendekatan untuk menemukan kombinasi yang paling efektif bagi Anda. Jangan takut untuk beralih metode jika satu metode tidak bekerja.",
          icon: <Target className="text-gray-600" size={20} />,
          color: "bg-gray-100 text-gray-600"
        });
    }

    // Rekomendasi berdasarkan kemampuan awal
    if (learningProfile.ability <= 1) {
      recommendations.push({
        title: "Bangun Fondasi Kuat",
        description: `Berdasarkan tingkat kemampuan awal Anda (${getAbilityLabel(learningProfile.ability)}), sangat penting untuk fokus pada konsep-konsep dasar sebelum melanjut ke topik yang lebih kompleks.`,
        icon: <BookOpen className="text-blue-600" size={20} />,
        color: "bg-blue-100 text-blue-600"
      });
    } else {
      recommendations.push({
        title: "Perkuat Pemahaman",
        description: `Karena Anda memiliki tingkat kemampuan ${getAbilityLabel(learningProfile.ability)}, fokuslah pada aplikasi praktis dari konsep yang dipelajari untuk memperdalam pemahaman.`,
        icon: <Target className="text-green-600" size={20} />,
        color: "bg-green-100 text-green-600"
      });
    }

    // Rekomendasi berdasarkan durasi fokus
    if (learningProfile.focusTime && learningProfile.focusTime.includes("kurang dari 15 menit")) {
      recommendations.push({
        title: "Belajar dalam Sesi Pendek",
        description: `Karena Anda memiliki durasi fokus yang pendek, disarankan untuk belajar dalam sesi 10-15 menit dengan istirahat di antaranya. Ini akan membantu menjaga konsentrasi.`,
        icon: <Clock className="text-yellow-600" size={20} />,
        color: "bg-yellow-100 text-yellow-600"
      });
    } else if (learningProfile.focusTime && learningProfile.focusTime.includes("lebih dari 45 menit")) {
      recommendations.push({
        title: "Manfaatkan Durasi Fokus Anda",
        description: `Anda memiliki durasi fokus yang panjang, jadi manfaatkan untuk belajar dalam sesi yang lebih panjang. Namun tetap penting untuk mengambil jeda sesekali.`,
        icon: <Clock className="text-green-600" size={20} />,
        color: "bg-green-100 text-green-600"
      });
    }

    return recommendations;
  };

  const recommendations = generateRecommendations();

  return (
    <div className="bg-bg-card p-6 rounded-xl shadow-soft">
      <div className="flex items-center mb-4">
        <div className="bg-accent/10 p-2 rounded-lg mr-3">
          <Target size={20} className="text-accent" />
        </div>
        <h2 className="text-xl font-bold text-text-dark">Strategi Belajar Personal</h2>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg border flex items-start ${rec.color.replace('text', 'border-')} bg-opacity-50`}
          >
            <div className={`p-2 rounded-lg mr-3 ${rec.color.replace('text', 'bg-')} bg-opacity-20`}>
              {rec.icon}
            </div>
            <div>
              <h3 className={`font-bold ${rec.color.split(' ')[2]}`}>{rec.title}</h3>
              <p className="text-text-light text-sm mt-1">{rec.description}</p>
            </div>
          </div>
        ))}
      </div>

      {learningProfile && (
        <div className="mt-4 pt-4 border-t border-border-color">
          <p className="text-text-light text-sm">
            Strategi ini dibuat berdasarkan profil belajar Anda. Anda dapat mengedit profil belajar 
            Anda kapan saja melalui kuis diagnostik.
          </p>
        </div>
      )}
    </div>
  );
};

export default PersonalLearningStrategy;