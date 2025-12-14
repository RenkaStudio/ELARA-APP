import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaLightbulb, FaCogs, FaChartLine, FaLock, FaClock, FaComments, FaBrain, FaBookOpen, FaGraduationCap, FaChartBar } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div className="bg-white min-h-screen font-poppins">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 border-b border-gray-200">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-primary">ELARA</h1>
            <p className="text-xs text-gray-600">E-Learning Adaptive Recommendation Assistant</p>
          </div>
          
          {/* Menu navigasi */}
          <nav className="hidden md:flex space-x-6">
            <a href="#home" className="text-primary font-medium hover:text-blue-700 transition-colors flex items-center text-sm">
              <FaHome className="mr-1" /> Beranda
            </a>
            <a href="#about" className="text-gray-600 font-medium hover:text-primary transition-colors flex items-center text-sm">
              <FaLightbulb className="mr-1" /> Tentang
            </a>
            <a href="#features" className="text-gray-600 font-medium hover:text-primary transition-colors flex items-center text-sm">
              <FaCogs className="mr-1" /> Fitur
            </a>
            <a href="#benefits" className="text-gray-600 font-medium hover:text-primary transition-colors flex items-center text-sm">
              <FaChartLine className="mr-1" /> Manfaat
            </a>
          </nav>
          
          <Link to="/login" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md text-sm">
            Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Belajar Lebih Cerdas, Sesuai Gaya Kamu
            </h1>
            <p className="text-xl md:text-2xl mt-4 max-w-2xl opacity-90 font-light">
              Platform pembelajaran adaptif berbasis AI
            </p>
            <p className="text-base md:text-lg mt-6 max-w-2xl opacity-80">
              ELARA membantu mahasiswa Universitas Terbuka belajar dengan cara yang paling sesuai dengan dirinya.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link 
                to="/login" 
                className="bg-white text-blue-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all transform hover:-translate-y-1 text-base shadow-lg"
              >
                <FaLock className="mr-2 inline" /> Masuk ke ELARA
              </Link>
              <a 
                href="#features" 
                className="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white hover:text-blue-600 transition-all transform hover:-translate-y-1 text-base"
              >
                <FaLightbulb className="mr-2 inline" /> Pelajari Cara Kerjanya
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Tentang ELARA */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Tentang ELARA
            </h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Platform pembelajaran adaptif berbasis AI yang dikembangkan untuk meningkatkan 
              pengalaman belajar mahasiswa Universitas Terbuka.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Personalisasi</h3>
              <p className="text-gray-600">
                Menyesuaikan materi dengan gaya belajar unik setiap mahasiswa.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Peningkatan Hasil</h3>
              <p className="text-gray-600">
                Membantu meningkatkan hasil kuis dan pemahaman materi.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Belajar Mandiri</h3>
              <p className="text-gray-600">
                Memberikan rekomendasi untuk mendukung belajar mandiri.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur Utama */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Fitur Utama ELARA</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="text-blue-600 text-3xl mb-4 flex justify-center">
                <FaLightbulb />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-3">Kuis Diagnostik</h3>
              <p className="text-gray-600 text-center">
                Mengetahui gaya dan kemampuan belajarmu sejak awal.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="text-blue-600 text-3xl mb-4 flex justify-center">
                <FaBookOpen />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-3">Materi Adaptif</h3>
              <p className="text-gray-600 text-center">
                Sistem menyesuaikan konten sesuai kemampuanmu.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="text-blue-600 text-3xl mb-4 flex justify-center">
                <FaChartBar />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-3">Analisis Pola Belajar</h3>
              <p className="text-gray-600 text-center">
                Memahami kekuatan dan tantangan belajarmu.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="text-blue-600 text-3xl mb-4 flex justify-center">
                <FaBrain />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-3">Rekomendasi Belajar</h3>
              <p className="text-gray-600 text-center">
                Saran konten dan strategi belajar yang spesifik.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="text-blue-600 text-3xl mb-4 flex justify-center">
                <FaComments />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-3">Umpan Balik Real-Time</h3>
              <p className="text-gray-600 text-center">
                Evaluasi otomatis setiap kali kamu belajar.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="text-blue-600 text-3xl mb-4 flex justify-center">
                <FaGraduationCap />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-3">Profil Mahasiswa</h3>
              <p className="text-gray-600 text-center">
                Lacak kemajuan dan statistik pengembangan diri.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Manfaat untuk Mahasiswa UT */}
      <section id="benefits" className="py-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Manfaat untuk Mahasiswa UT</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-6"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-xl text-center shadow-sm border border-gray-200 hover:shadow-md transition-all">
              <div className="text-4xl font-bold text-blue-600 mb-3">+20%</div>
              <h3 className="font-bold text-lg text-gray-800">Meningkatkan Hasil Kuis</h3>
              <p className="text-sm mt-2 text-gray-600">Peningkatan rata-rata skor kuis mahasiswa</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl text-center shadow-sm border border-gray-200 hover:shadow-md transition-all">
              <div className="text-3xl mb-3 flex items-center justify-center text-blue-600">
                <FaClock />
              </div>
              <h3 className="font-bold text-lg text-gray-800">Efisiensi Waktu</h3>
              <p className="text-sm mt-2 text-gray-600">Belajar lebih efisien sesuai waktu pribadi</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl text-center shadow-sm border border-gray-200 hover:shadow-md transition-all">
              <div className="text-4xl font-bold text-blue-600 mb-3">+15%</div>
              <h3 className="font-bold text-lg text-gray-800">Motivasi Belajar</h3>
              <p className="text-sm mt-2 text-gray-600">Meningkatkan partisipasi belajar daring</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl text-center shadow-sm border border-gray-200 hover:shadow-md transition-all">
              <div className="text-3xl mb-3 flex items-center justify-center text-blue-600">
                <FaGraduationCap />
              </div>
              <h3 className="font-bold text-lg text-gray-800">Pemahaman Gaya Belajar</h3>
              <p className="text-sm mt-2 text-gray-600">Memahami gaya belajar unik diri sendiri</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Siap Meningkatkan Pengalaman Belajarmu?</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan platform pembelajaran adaptif ELARA yang dirancang khusus untuk mahasiswa Universitas Terbuka
          </p>
          <Link 
            to="/login" 
            className="bg-white text-blue-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all text-lg inline-flex items-center shadow-lg transform hover:-translate-y-1"
          >
            <FaLock className="mr-2" /> Mulai Belajar Sekarang
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-6">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-white text-sm">Capstone Project - Universitas Terbuka © 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;