import React, { useState, useEffect } from 'react';
import { useLearningAnalytics } from '../context/LearningAnalyticsContext';
import { useUser } from '../context/UserContext';
import { analyzeSmartSchedule } from '../utils/smartScheduleAnalyzer';
import { FaClock, FaCalendarAlt, FaChartLine, FaFire } from 'react-icons/fa';

const SmartScheduleRecommendation = () => {
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { learningData } = useLearningAnalytics();
  const { profile } = useUser();
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchScheduleData = async () => {
      setLoading(true);
      try {
        // Tambahkan penundaan kecil untuk memberi kesan analisis AI
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const data = analyzeSmartSchedule(learningData, profile);
        setScheduleData(data);
      } catch (error) {
        console.error('Error analyzing smart schedule:', error);
        // Gunakan data default jika terjadi error
        setScheduleData({
          optimalTimes: ['09:00-11:00', '14:00-16:00'],
          personalizedSchedule: [
            { day: 'Senin', time: '09:00-11:00', activity: 'Belajar Modul Baru', duration: 45, priority: 1 },
            { day: 'Rabu', time: '14:00-16:00', activity: 'Review Materi', duration: 45, priority: 2 }
          ],
          bestStudyDays: ['Senin', 'Rabu', 'Jumat'],
          studyStreak: 0,
          recommendedSessionDuration: 45
        });
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, [learningData, profile]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!scheduleData) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-500 text-center">Data tidak tersedia</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Rekomendasi Waktu Belajar</h2>
        <div className="flex items-center text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
          <FaFire className="text-blue-500 mr-2" />
          <span>Streak: {scheduleData.studyStreak} hari</span>
        </div>
      </div>

      {/* Informasi Waktu Belajar Optimal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-5 text-white">
          <div className="flex items-start">
            <div className="bg-white/20 p-2 rounded-lg mr-3">
              <FaClock style={{ width: 20, height: 20 }} />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Waktu Belajar Optimal</h3>
              <div className="space-y-2">
                {scheduleData.optimalTimes.map((time, index) => (
                  <div key={index} className="bg-white/20 rounded-lg p-3">
                    <p className="font-semibold">{time}</p>
                    <p className="text-sm text-blue-100">
                      {index === 0 ? 'Waktu paling produktif untuk Anda' : 
                       index === 1 ? 'Waktu alternatif terbaik' : 
                       'Waktu tambahan yang disarankan'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Jadwal Personalisasi */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <FaCalendarAlt className="text-green-600" style={{ width: 18, height: 18 }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Jadwal Personalisasi</h3>
          </div>

          <div className="space-y-3">
            {scheduleData.personalizedSchedule.map((schedule, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-800">{schedule.day}</h4>
                  <p className="text-sm text-gray-600">{schedule.time} • {schedule.duration} menit</p>
                  <p className="text-xs text-gray-500">{schedule.activity}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  schedule.priority === 1 ? 'bg-red-100 text-red-800' :
                  schedule.priority === 2 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {schedule.priority === 1 ? 'Tinggi' : 
                   schedule.priority === 2 ? 'Sedang' : 'Rendah'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hari Terbaik dan Durasi Rekomendasi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <FaCalendarAlt className="text-purple-600" style={{ width: 18, height: 18 }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Hari Terbaik untuk Belajar</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {scheduleData.bestStudyDays.map((day, index) => (
              <div key={index} className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium">
                {day}
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Catatan:</strong> Hari-hari ini didasarkan pada performa belajar Anda sebelumnya. 
              Cobalah untuk menjadwalkan kegiatan belajar Anda pada hari-hari ini.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center mb-4">
            <div className="bg-indigo-100 p-2 rounded-lg mr-3">
              <FaChartLine className="text-indigo-600" style={{ width: 18, height: 18 }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Durasi Sesi Optimal</h3>
          </div>

          <div className="text-center py-4">
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {scheduleData.recommendedSessionDuration} <span className="text-lg">menit</span>
            </div>
            <p className="text-gray-600 mb-4">
              Durasi optimal berdasarkan gaya belajar dan konsentrasi Anda
            </p>
            
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Sesi terlalu pendek</span>
                <span>Sesi terlalu panjang</span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(100, Math.max(0, (scheduleData.recommendedSessionDuration / 120) * 100))}%` }}
                ></div>
              </div>
              <div className="flex justify-center mt-1">
                <div 
                  className="w-3 h-3 bg-blue-600 rounded-full -mt-1" 
                  style={{ marginLeft: `${Math.min(95, Math.max(5, (scheduleData.recommendedSessionDuration / 120) * 100))}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips untuk Meningkatkan Konsentrasi */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tips Meningkatkan Konsentrasi</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Lingkungan Belajar</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Gunakan ruang yang tenang dan minim gangguan</li>
              <li>• Pastikan pencahayaan cukup dan nyaman</li>
              <li>• Sediakan minum dan cemilan sehat</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Teknik Belajar</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Gunakan teknik Pomodoro (25-30 menit belajar)</li>
              <li>• Buat catatan atau ringkasan</li>
              <li>• Lakukan sesi tanya jawab</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Kesehatan</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Cukup tidur sebelum belajar</li>
              <li>• Lakukan peregangan sesekali</li>
              <li>• Jaga asupan nutrisi</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartScheduleRecommendation;