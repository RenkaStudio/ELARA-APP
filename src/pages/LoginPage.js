import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GiGraduateCap } from 'react-icons/gi';
import RegisterForm from '../components/RegisterForm';

const LoginPage = () => {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Cek apakah user terdaftar di localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some(user => user.nim === nim && user.password === password);

    if (nim && password && (userExists || (nim === password))) {
      // Store user data in localStorage
      localStorage.setItem('currentUser', JSON.stringify({ nim }));

      // Check if user has completed diagnostic quiz
      const hasLearningProfile = localStorage.getItem('learningProfile');
      if (!hasLearningProfile) {
        // Redirect to diagnostic quiz if not completed
        navigate('/diagnostic-quiz');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('NIM atau Password salah. Silakan cek kembali.');
    }
  };

  if (showRegister) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary to-secondary font-poppins py-8">
        <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary to-secondary font-poppins py-8">
      <div className="bg-bg-card rounded-2xl shadow-soft w-full max-w-md mx-4 border border-border-color my-8">
        <div className="p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <GiGraduateCap className="text-primary mx-auto" style={{ width: 48, height: 48 }} />
            </Link>
            <div className="flex flex-col mt-4">
              <h2 className="text-2xl font-bold text-text-dark">Login Mahasiswa</h2>
              <p className="text-text-light text-sm">Masuk untuk melanjutkan ke dasbor ELARA Anda</p>
            </div>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="nim" className="block text-text-dark font-semibold mb-2 text-sm">NIM</label>
              <input
                type="text"
                id="nim"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                className="w-full px-4 py-3 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                placeholder="Contoh: 12345678"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-text-dark font-semibold mb-2 text-sm">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                placeholder="Masukkan password"
              />
            </div>
            {error && (
              <div className="bg-danger/10 text-danger text-center p-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors shadow-soft text-sm"
            >
              Login
            </button>
          </form>
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setShowRegister(true)}
              className="text-primary hover:text-accent transition-colors text-sm font-medium"
            >
              Belum punya akun? Buat akun baru
            </button>
          </div>
          <div className="text-center mt-4">
            <Link to="/" className="text-primary hover:text-accent transition-colors text-sm">Kembali ke Halaman Utama</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;