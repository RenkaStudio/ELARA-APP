import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import CustomModal from '../CustomModal';

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [todoToDelete, setTodoToDelete] = useState(null);

  useEffect(() => {
    // Load user data
    const savedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    setTodos(savedTodos);
  }, []);

  // Calculate stats
  const completedTodos = todos.filter(todo => todo.completed).length;
  const totalTodos = todos.length;
  const pendingTodos = totalTodos - completedTodos;

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

  const deleteTodo = (todoId) => {
    setTodoToDelete(todoId);
  };

  const confirmDeleteTodo = () => {
    if (todoToDelete) {
      const updatedTodos = todos.filter(todo => todo.id !== todoToDelete);
      setTodos(updatedTodos);
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
      setTodoToDelete(null);
    }
  };

  const cancelDeleteTodo = () => {
    setTodoToDelete(null);
  };

  // Fungsi untuk menandai todo sebagai selesai
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">To-Do List Saya</h2>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full text-blue-600 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Total Tugas</p>
              <p className="text-lg font-bold text-gray-800">{totalTodos}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-full text-green-600 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Selesai</p>
              <p className="text-lg font-bold text-gray-800">{completedTodos}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-2 rounded-full text-yellow-600 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Belum Selesai</p>
              <p className="text-lg font-bold text-gray-800">{pendingTodos}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Todo */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tambahkan kegiatan baru..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button
            onClick={addTodo}
            className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
          >
            <FaPlus className="mr-1" size={14} />
            Tambah
          </button>
        </div>
      </div>

      {/* Todo List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-3 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-800 text-sm">Daftar Kegiatan</h3>
        </div>
        
        {todos.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {todos.map((todo) => (
              <div key={todo.id} className="p-3 flex items-center justify-between">
                <div className="flex items-center flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mr-3"
                  />
                  <span className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {todo.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Hapus kegiatan"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto bg-gray-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-1">Belum ada kegiatan</h3>
            <p className="text-gray-500 text-sm">Tambahkan kegiatan untuk mulai mengatur jadwal belajar.</p>
          </div>
        )}
      </div>

      {/* Modal Konfirmasi Hapus Todo */}
      <CustomModal
        isOpen={!!todoToDelete}
        onClose={cancelDeleteTodo}
        title="Hapus To-Do"
        message="Apakah Anda yakin ingin menghapus kegiatan ini?"
        onConfirm={confirmDeleteTodo}
        confirmText="Ya, Hapus"
        cancelText="Batal"
      />
    </div>
  );
};

export default TodoPage;