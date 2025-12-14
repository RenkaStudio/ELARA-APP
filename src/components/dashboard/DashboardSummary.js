import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaChartLine, 
  FaBullseye, 
  FaAward, 
  FaUpload, 
  FaFileAlt, 
  FaBrain, 
  FaUser
} from 'react-icons/fa';

const DashboardSummary = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [learningProfile, setLearningProfile] = useState({});
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    // Load user data
    const savedModules = JSON.parse(localStorage.getItem('modules') || '[]');
    const savedProfile = JSON.parse(localStorage.getItem('learningProfile') || '{}');
    const savedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    
    setModules(savedModules);
    setLearningProfile(savedProfile);
    setTodos(savedTodos);
  }, []);

  // Calculate basic stats
  const modulesCount = modules.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const totalTodos = todos.length;
  
  // Stats data based on real user progress
  const stats = [
    { title: 'Modul', value: modulesCount, icon: FaFileAlt },
    { title: 'To-Do', value: `${completedTodos}/${totalTodos}`, icon: FaAward },
    { title: 'Gaya Belajar', value: learningProfile.learningStyle || 'Belum', icon: FaUser },
    { title: 'Kemampuan', value: learningProfile.ability !== undefined ? 
      (learningProfile.ability === 0 ? 'Sangat' : 
       learningProfile.ability === 1 ? 'Kurang' : 
       learningProfile.ability === 2 ? 'Cukup' : 'Sangat') : 'Belum', 
      icon: FaBrain },
  ];

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      const newTodoItem = {
        id: Date.now(),
        text: newTodo,
        completed: false,
        createdAt: new Date().toISOString().split('T')[0]
      };
      const updatedTodos = [...todos, newTodoItem];
      setTodos(updatedTodos);
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
      setNewTodo('');
    }
  };

  const toggleTodo = (todoId) => {
    const updatedTodos = todos.map(todo => 
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Selamat Datang di ELARA</h2>
            <p className="text-blue-100 mt-1 text-sm">Sistem pembelajaran adaptif yang menyesuaikan materi dengan gaya belajar Anda</p>
          </div>
          <Link
            to="/diagnostic-quiz"
            className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors text-center text-sm whitespace-nowrap"
          >
            Sesuaikan Gaya Belajar
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs">{stat.title}</p>
                <p className="text-lg font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                <stat.icon style={{ width: 16, height: 16 }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ringkasan Progres & Profil Belajar */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-5 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Profil Belajar</h3>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <FaBrain className="text-blue-600" style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Gaya Belajar</p>
                  <p className="text-gray-600">{learningProfile.learningStyle || 'Belum diidentifikasi'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <FaChartLine className="text-green-600" style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Kemampuan Awal</p>
                  <p className="text-gray-600">
                    {learningProfile.ability === 0 && 'Sangat Tahu'}
                    {learningProfile.ability === 1 && 'Kurang Tahu'}
                    {learningProfile.ability === 2 && 'Cukup Tahu'}
                    {learningProfile.ability === 3 && 'Sangat Tahu'}
                    {!learningProfile.ability && 'Belum diuji'}
                  </p>
                </div>
              </div>
            </div>
            <Link 
              to="/diagnostic-quiz" 
              className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Edit Profil
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Rekomendasi AI */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <FaBullseye style={{ width: 18, height: 18 }} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Rekomendasi AI</h3>
            </div>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              <p className="text-gray-600 text-sm">
                Berdasarkan profil belajar Anda sebagai <span className="font-medium">{learningProfile.learningStyle || 'pengguna baru'}</span>, 
                disarankan untuk fokus pada modul yang sesuai dengan gaya belajar Anda.
              </p>
              <p className="text-gray-600 text-sm">
                Waktu belajar optimal Anda adalah <span className="font-medium">{learningProfile.focusTime || 'belum ditentukan'}</span>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modul Saya dan To-Do List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Modul Saya */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">Modul Saya</h2>
            <Link 
              to="/dashboard/modules" 
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Lihat Semua
            </Link>
          </div>
          <div className="p-4">
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {modules.length > 0 ? (
                modules.slice(0, 3).map((module) => (
                  <Link 
                    key={module.id} 
                    to={`/module-detail/${module.id}`}
                    className="block p-2 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 text-sm truncate">{module.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{module.uploadDate}</div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-3">Belum ada modul</p>
              )}
            </div>
            <Link
              to="/dashboard/modules"
              className="mt-3 block w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 text-center text-sm"
            >
              Upload Modul
            </Link>
          </div>
        </div>

        {/* To-Do List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">To-Do List</h2>
            <Link 
              to="/dashboard/todo" 
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Lihat Semua
            </Link>
          </div>
          <div className="p-4">
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tambah kegiatan..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={addTodo}
                className="bg-blue-600 text-white px-3 rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                +
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {todos.length > 0 ? (
                todos.slice(0, 3).map((todo) => (
                  <div key={todo.id} className="flex items-center justify-between p-2 border border-gray-200 rounded-lg">
                    <div className="flex items-center flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className={`text-sm truncate ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {todo.text}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-3">Belum ada kegiatan</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;