import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [userProgress, setUserProgress] = useState({
    modulesCompleted: [],
    quizzesTaken: [],
    scores: {},
    achievements: [],
    lastActivity: null
  });
  
  const [todos, setTodos] = useState([]);

  // Initialize from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('userProgress');
    if (savedProgress) {
      try {
        setUserProgress(JSON.parse(savedProgress));
      } catch (e) {
        console.error('Error parsing user progress from localStorage:', e);
      }
    }
    
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (e) {
        console.error('Error parsing todos from localStorage:', e);
      }
    }
  }, []);

  // Save to localStorage whenever progress changes
  useEffect(() => {
    try {
      localStorage.setItem('userProgress', JSON.stringify(userProgress));
      localStorage.setItem('todos', JSON.stringify(todos));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, [userProgress, todos]);

  const completeModule = (moduleId) => {
    setUserProgress(prev => {
      // Pastikan moduleId adalah string
      const moduleIdStr = typeof moduleId === 'number' ? moduleId.toString() : moduleId;
      
      const newModules = prev.modulesCompleted.includes(moduleIdStr)
        ? prev.modulesCompleted
        : [...prev.modulesCompleted, moduleIdStr];
      
      return {
        ...prev,
        modulesCompleted: newModules,
        lastActivity: new Date().toISOString()
      };
    });
  };

  const completeQuiz = (moduleId, score) => {
    setUserProgress(prev => {
      // Pastikan moduleId adalah string
      const moduleIdStr = typeof moduleId === 'number' ? moduleId.toString() : moduleId;
      
      // Add to quizzes taken if not already there
      const newQuizzesTaken = prev.quizzesTaken.includes(moduleIdStr)
        ? prev.quizzesTaken
        : [...prev.quizzesTaken, moduleIdStr];
      
      // Update scores
      const newScores = {
        ...prev.scores,
        [moduleIdStr]: score
      };

      return {
        ...prev,
        quizzesTaken: newQuizzesTaken,
        scores: newScores,
        lastActivity: new Date().toISOString()
      };
    });
  };

  const resetProgress = () => {
    setUserProgress({
      modulesCompleted: [],
      quizzesTaken: [],
      scores: {},
      achievements: [],
      lastActivity: null
    });
  };

  // Todo functions
  const addTodo = (text, date) => {
    const newTodo = {
      id: Date.now(),
      text,
      date,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const toggleTodo = (id) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const updateTodo = (id, text, date) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, text, date } : todo
      )
    );
  };

  const value = {
    userProgress,
    completeModule,
    completeQuiz,
    resetProgress,
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};