import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  FaChartLine, 
  FaBullseye, 
  FaUpload, 
  FaFileAlt, 
  FaBrain, 
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import CustomModal from '../CustomModal';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const logout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    // Hentikan TTS jika sedang berjalan
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const menuItems = [
    {
      title: 'Ringkasan',
      path: '/dashboard',
      icon: <FaChartLine className="text-blue-600" style={{ width: 16, height: 16 }} />,
    },
    {
      title: 'Profil Saya',
      path: '/dashboard/profile',
      icon: <FaUser className="text-blue-600" style={{ width: 16, height: 16 }} />,
    },
    {
      title: 'Rekomendasi',
      path: '/dashboard/recommendations',
      icon: <FaBullseye className="text-blue-600" style={{ width: 16, height: 16 }} />,
    },
    {
      title: 'Modul Saya',
      path: '/dashboard/modules',
      icon: <FaFileAlt className="text-blue-600" style={{ width: 16, height: 16 }} />,
    },
    {
      title: 'To-Do',
      path: '/dashboard/todo',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>,
    },
  ];

  const handleMenuClick = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="bg-bg-light min-h-screen font-poppins flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-3 text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100 md:hidden"
              >
                {sidebarOpen ? <FaTimes style={{ width: 16, height: 16 }} /> : <FaBars style={{ width: 16, height: 16 }} />}
              </button>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-primary">ELARA</h1>
                <p className="text-xs text-gray-600">E-Learning Adaptive Recommendation Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-xs text-gray-600 hidden sm:block">
                {JSON.parse(localStorage.getItem('modules') || '[]').length} modul
              </div>
              <button 
                onClick={logout} 
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                title="Keluar"
              >
                <FaSignOutAlt style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside 
          className={`bg-white border-r border-gray-200 w-56 fixed h-full z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:static md:translate-x-0`}
        >
          <div className="p-3 border-b border-gray-200">
            <h2 className="text-base font-bold text-gray-800">Menu</h2>
          </div>
          <nav className="p-2">
            <ul className="space-y-0.5">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleMenuClick(item.path)}
                    className="w-full flex items-center space-x-2 p-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors text-sm"
                  >
                    <span>{item.icon}</span>
                    <span>{item.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Overlay untuk mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 md:ml-0 transition-all duration-300">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Modal Konfirmasi Logout */}
      <CustomModal
        isOpen={showLogoutModal}
        onClose={cancelLogout}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar dari aplikasi?"
        onConfirm={confirmLogout}
        confirmText="Ya, Keluar"
        cancelText="Batal"
      />

      {/* Footer */}
      <footer className="bg-primary text-white py-4">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-white text-xs">Capstone Project - Universitas Terbuka © 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;