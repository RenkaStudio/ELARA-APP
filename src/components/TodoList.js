import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Plus, Edit3, Check, X, Calendar, CheckCircle, Circle } from 'lucide-react';

const TodoList = () => {
  const { todos, addTodo, toggleTodo, deleteTodo, updateTodo } = useUser();
  const [newTodo, setNewTodo] = useState('');
  const [newTodoDate, setNewTodoDate] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingDate, setEditingDate] = useState('');

  const handleAddTodo = () => {
    if (newTodo.trim() === '') return;
    
    addTodo(newTodo, newTodoDate);
    setNewTodo('');
    setNewTodoDate('');
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
    setEditingDate(todo.date);
  };

  const saveEdit = () => {
    if (editingText.trim() === '') return;
    
    updateTodo(editingId, editingText, editingDate);
    setEditingId(null);
    setEditingText('');
    setEditingDate('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
    setEditingDate('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getDaysLeft = (dateString) => {
    if (!dateString) return '';
    const today = new Date();
    const dueDate = new Date(dateString);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} hari yang lalu`;
    } else if (diffDays === 0) {
      return 'Hari ini';
    } else if (diffDays === 1) {
      return 'Besok';
    } else {
      return `${diffDays} hari lagi`;
    }
  };

  return (
    <>
      {/* Add new todo form */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Tambahkan tugas baru..."
          className="flex-1 px-3 py-2 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
        />
        <input
          type="date"
          value={newTodoDate}
          onChange={(e) => setNewTodoDate(e.target.value)}
          className="px-2 py-2 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
        />
        <button
          onClick={handleAddTodo}
          className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Todo list */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
        {todos.length === 0 ? (
          <div className="text-center py-6">
            <div className="mx-auto bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-2">
              <CheckCircle size={20} className="text-primary" />
            </div>
            <p className="text-text-light text-sm">Belum ada tugas. Tambahkan tugas baru!</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div 
              key={todo.id} 
              className={`p-3 rounded-lg border flex items-start transition-all ${
                todo.completed 
                  ? 'bg-primary/5 border-primary/30' 
                  : 'bg-bg-light border-border-color hover:border-primary/50'
              }`}
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`p-0.5 mr-2 mt-0.5 rounded-full ${
                  todo.completed 
                    ? 'bg-primary text-white' 
                    : 'border border-border-color'
                }`}
              >
                {todo.completed ? <Check size={12} /> : <Circle size={12} />}
              </button>
              
              {editingId === todo.id ? (
                <div className="flex-1">
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="w-full mb-1 px-2 py-0.5 border border-border-color rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    autoFocus
                  />
                  <input
                    type="date"
                    value={editingDate}
                    onChange={(e) => setEditingDate(e.target.value)}
                    className="w-full mb-1 px-2 py-0.5 border border-border-color rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={saveEdit}
                      className="text-primary hover:text-primary-dark flex items-center gap-0.5 text-xs"
                    >
                      <Check size={12} /> Simpan
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-text-light hover:text-primary flex items-center gap-0.5 text-xs"
                    >
                      <X size={12} /> Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <p className={`text-sm ${todo.completed ? 'line-through text-text-light' : 'text-text-dark'}`}>
                    {todo.text}
                  </p>
                  {todo.date && (
                    <div className="flex items-center text-xs text-text-light mt-0.5">
                      <Calendar size={10} className="mr-0.5" />
                      <span>{formatDate(todo.date)}</span>
                      {getDaysLeft(todo.date) && (
                        <span className={`ml-1.5 px-1 py-0.5 rounded text-xs ${
                          getDaysLeft(todo.date) === 'Hari ini' || getDaysLeft(todo.date).includes('yang lalu')
                            ? 'bg-primary/20 text-primary'
                            : 'bg-secondary/20 text-secondary'
                        }`}>
                          {getDaysLeft(todo.date)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {editingId !== todo.id && (
                <div className="flex gap-1">
                  <button
                    onClick={() => startEditing(todo)}
                    className="text-text-light hover:text-primary p-0.5"
                  >
                    <Edit3 size={12} />
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-text-light hover:text-primary p-0.5"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default TodoList;