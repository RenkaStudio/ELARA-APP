import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterForm = ({ onSwitchToLogin }) => {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    if (!nim.trim()) {
      setError('NIM harus diisi');
      return false;
    }

    if (nim.length < 6) {
      setError('NIM harus terdiri dari minimal 6 karakter');
      return false;
    }

    if (!password) {
      setError('Password harus diisi');
      return false;
    }

    if (password.length < 6) {
      setError('Password harus terdiri dari minimal 6 karakter');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Menyimpan user baru ke localStorage
      const newUser = {
        nim: nim.trim(),
        password: password,
        createdAt: new Date().toISOString()
      };

      // Ambil daftar user yang sudah ada
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Cek apakah NIM sudah terdaftar
      const userExists = existingUsers.some(user => user.nim === nim.trim());
      
      if (userExists) {
        setError('NIM sudah terdaftar. Silakan gunakan NIM lain.');
        setLoading(false);
        return;
      }

      // Tambahkan user baru ke daftar
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Simulasikan proses registrasi
      setTimeout(() => {
        setLoading(false);
        alert('Akun berhasil dibuat! Silakan login dengan NIM dan password yang baru.');
        onSwitchToLogin();
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError('Terjadi kesalahan saat membuat akun. Silakan coba lagi.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Buat Akun Baru</h2>
          <p className="text-gray-600 mt-2">Masukkan NIM dan password untuk membuat akun ELARA</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nim" className="block text-sm font-medium text-gray-700 mb-1">
              NIM (Nomor Induk Mahasiswa)
            </label>
            <input
              id="nim"
              type="text"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Masukkan NIM Anda"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Buat password"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Konfirmasi Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Ulangi password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg font-medium text-white transition ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </span>
            ) : (
              'Buat Akun'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Sudah punya akun? Masuk di sini
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;