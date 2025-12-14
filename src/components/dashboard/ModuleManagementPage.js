import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFileAlt, FaSearch, FaUpload, FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import UploadModule from '../UploadModule';
import CustomModal from '../CustomModal';

const ModuleManagementPage = () => {
  const [modules, setModules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleToDelete, setModuleToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('list'); // 'list' atau 'upload'

  useEffect(() => {
    // Load user data
    const savedModules = JSON.parse(localStorage.getItem('modules') || '[]');
    // Ensure savedModules is an array and filter out any undefined/null values
    // Also normalize module data to use 'title' property
    const validModules = Array.isArray(savedModules)
      ? savedModules
          .filter(module => module)
          .map(module => ({
            ...module,
            title: module.title || module.name // Normalize to use 'title'
          }))
      : [];
    setModules(validModules);
  }, []);

  const filteredModules = modules.filter(module =>
    module && (module.title || module.name) && (module.title || module.name).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteModule = (moduleId) => {
    setModuleToDelete(moduleId);
  };

  const confirmDeleteModule = () => {
    if (moduleToDelete) {
      const updatedModules = modules.filter(module => module && module.id !== moduleToDelete);
      setModules(updatedModules);
      // Update localStorage with normalized modules
      localStorage.setItem('modules', JSON.stringify(updatedModules));
      setModuleToDelete(null);
    }
  };

  const cancelDeleteModule = () => {
    setModuleToDelete(null);
  };

  const handleUploadSuccess = (moduleInfo) => {
    // Refresh the modules list when a new module is uploaded
    const savedModules = JSON.parse(localStorage.getItem('modules') || '[]');
    const validModules = Array.isArray(savedModules)
      ? savedModules
          .filter(module => module)
          .map(module => ({
            ...module,
            title: module.title || module.name
          }))
      : [];
    setModules(validModules);
    
    // Switch to list view after successful upload
    setActiveTab('list');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Modul Pembelajaran</h2>
        
        {/* Tab Navigation */}
        <div className="flex border border-gray-300 rounded-lg bg-white">
          <button
            className={`px-4 py-2 rounded-l-lg text-sm font-medium ${
              activeTab === 'list' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('list')}
          >
            Daftar Modul
          </button>
          <button
            className={`px-4 py-2 rounded-r-lg text-sm font-medium ${
              activeTab === 'upload' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('upload')}
          >
            Upload Modul
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'list' ? (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600 mr-3">
                  <FaFileAlt style={{ width: 16, height: 16 }} />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Total Modul</p>
                  <p className="text-lg font-bold text-gray-800">{modules.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full text-green-600 mr-3">
                  <FaFileAlt style={{ width: 16, height: 16 }} className="text-green-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Soal Terbuat</p>
                  <p className="text-lg font-bold text-gray-800">
                    {modules.length > 0
                      ? modules.reduce((sum, m) => sum + (m.questionCount || 0), 0)
                      : 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full text-purple-600 mr-3">
                  <FaFileAlt style={{ width: 16, height: 16 }} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Rata-rata Per Modul</p>
                  <p className="text-lg font-bold text-gray-800">
                    {modules.length > 0
                      ? Math.round(modules.reduce((sum, m) => sum + (m.questionCount || 0), 0) / modules.length)
                      : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" style={{ width: 14, height: 14 }} />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari modul berdasarkan judul..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>

          {/* Modules List */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-800 text-sm">Daftar Modul</h3>
            </div>

            {filteredModules.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredModules.map((module) => (
                  <div key={module.id} className="p-3 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <FaFileAlt className="text-blue-600" style={{ width: 16, height: 16 }} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-medium text-gray-800 text-sm truncate">{module.title || module.name}</h4>
                          <div className="text-xs text-gray-500 mt-1">
                            {module.uploadDate || 'Tanggal tidak tersedia'} • {module.questionCount || 0} soal
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/module-detail/${module.id}`}
                        className="text-blue-600 hover:text-blue-800 p-2"
                        title="Lihat Detail"
                      >
                        <FaEdit style={{ width: 14, height: 14 }} />
                      </Link>
                      <button
                        onClick={() => deleteModule(module.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                        title="Hapus Modul"
                      >
                        <FaTrash style={{ width: 14, height: 14 }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto bg-gray-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                  <FaFileAlt className="text-gray-400" style={{ width: 24, height: 24 }} />
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-1">Belum ada modul</h3>
                <p className="text-gray-500 text-sm">
                  {searchTerm ? 'Tidak ada modul yang cocok.' : 'Upload modul pertama Anda.'}
                </p>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="inline-flex items-center bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm mt-3"
                >
                  <FaUpload className="mr-2" style={{ width: 12, height: 12 }} />
                  Upload Modul
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <FaUpload className="text-blue-600" style={{ width: 18, height: 18 }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Upload Modul Baru</h3>
          </div>
          
          <UploadModule onUpload={handleUploadSuccess} />
          
          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">Format</h3>
                  <p className="text-gray-600 text-xs">
                    PDF, DOCX, DOC, dan TXT.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">Waktu</h3>
                  <p className="text-gray-600 text-xs">
                    1-3 menit per file.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">Proses</h3>
                  <p className="text-gray-600 text-xs">
                    Membuat kuis adaptif dan ringkasan AI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Modul */}
      <CustomModal
        isOpen={!!moduleToDelete}
        onClose={cancelDeleteModule}
        title="Hapus Modul"
        message="Apakah Anda yakin ingin menghapus modul ini?"
        onConfirm={confirmDeleteModule}
        confirmText="Ya, Hapus"
        cancelText="Batal"
      />
    </div>
  );
};

export default ModuleManagementPage;