import React from 'react';

// Component ini tidak lagi digunakan karena fungsionalitasnya 
// telah digabungkan ke dalam ModuleManagementPage
const UploadPage = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Modul</h2>
        <p className="text-gray-600 mb-6">
          Fitur upload telah digabungkan dengan manajemen modul.
        </p>
        <a 
          href="/dashboard/modules" 
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Buka manajemen modul di sini
        </a>
      </div>
    </div>
  );
};

export default UploadPage;