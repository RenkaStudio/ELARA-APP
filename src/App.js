import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { LearningAnalyticsProvider } from './context/LearningAnalyticsContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DiagnosticQuizPage from './pages/DiagnosticQuizPage';
import ModuleUploadPage from './pages/ModuleUploadPage';

import ModuleDetailPage from './pages/ModuleDetailPage';
import DashboardPage from './pages/DashboardPage';
import QuizPage from './pages/QuizPage';
import AdaptiveQuizPage from './pages/AdaptiveQuizPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardSummary from './components/dashboard/DashboardSummary';
import LearningProfilePage from './components/dashboard/LearningProfilePage';
import RecommendationsPage from './components/dashboard/RecommendationsPage';
import ModuleManagementPage from './components/dashboard/ModuleManagementPage';
import TodoPage from './components/dashboard/TodoPage';
import './App.css';

function App() {
  return (
    <UserProvider>
      <LearningAnalyticsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/diagnostic-quiz" element={<DiagnosticQuizPage />} />
            <Route path="/upload" element={<ModuleUploadPage />} />
            <Route path="/modules" element={<Navigate to="/dashboard/modules" replace />} />
            <Route path="/module-detail/:moduleId" element={<ModuleDetailPage />} />
            <Route path="/quiz/:moduleId" element={<QuizPage />} />
            <Route path="/adaptive-quiz/:moduleId" element={<AdaptiveQuizPage />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardSummary />} />
              <Route path="profile" element={<LearningProfilePage />} />
              <Route path="recommendations" element={<RecommendationsPage />} />
              <Route path="modules" element={<ModuleManagementPage />} />
              <Route path="todo" element={<TodoPage />} />
            </Route>
          </Routes>
        </Router>
      </LearningAnalyticsProvider>
    </UserProvider>
  );
}

export default App;