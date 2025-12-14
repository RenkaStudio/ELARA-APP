import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useLearningAnalytics } from '../context/LearningAnalyticsContext';
import { loadQuiz } from '../utils/quizStorage';
import { generatePersonalizedQuiz } from '../utils/geminiAI';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import QualityIndicator from '../components/QualityIndicator';
import { CheckCircle, XCircle, ArrowLeft, Trophy, AlertTriangle, Brain, RotateCcw, BarChart3, AlertCircle } from 'lucide-react';

const AdaptiveQuizPage = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { completeQuiz, completeModule } = useUser();
  const { recordQuizPerformance, learningData } = useLearningAnalytics();
  
  // Get module from localStorage 
  const getModuleById = useCallback(() => {
    try {
      const modules = JSON.parse(localStorage.getItem('modules') || '[]');
      return modules.find(m => m.id === moduleId);
    } catch (e) {
      console.error('Error loading module:', e);
      return null;
    }
  }, [moduleId]);
  
  const module = getModuleById();
  const baseQuiz = null; // We'll generate quiz on the fly using AI

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [adaptiveQuiz, setAdaptiveQuiz] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]); // Track user's answers for review
  const [difficulty, setDifficulty] = useState('easy'); // easy, medium, hard
  const [isLoading, setIsLoading] = useState(true);
  const [quizError, setQuizError] = useState(null);
  const [pageError, setPageError] = useState(null);

  // Ambil profil belajar pengguna
  const getLearningProfile = useCallback(() => {
    try {
      const profileStr = localStorage.getItem('learningProfile');
      if (profileStr) {
        return JSON.parse(profileStr);
      }
    } catch (e) {
      console.error('Error parsing learning profile:', e);
    }
    return null;
  }, []);

  // Fungsi untuk menyesuaikan tingkat kesulitan soal
  const adjustDifficulty = useCallback((currentScore, totalQuestions) => {
    if (totalQuestions === 0) {
      const profile = getLearningProfile();
      // Gunakan profil belajar untuk menentukan kesulitan awal
      if (profile && profile.ability !== undefined) {
        if (profile.ability <= 1) return 'easy';
        if (profile.ability === 2) return 'medium';
        if (profile.ability >= 3) return 'hard';
      }
      return 'medium';
    }
    
    const avgScore = (currentScore / totalQuestions) * 100;
    if (avgScore >= 80) return 'hard';
    if (avgScore >= 60) return 'medium';
    return 'easy';
  }, [getLearningProfile]);

  // Memoize the createAdaptiveQuiz function to prevent recreation on every render
  const createAdaptiveQuiz = useCallback(async () => {
    if (!module) {
      setIsLoading(false);
      setPageError("Modul tidak ditemukan");
      return;
    }
    
    // Prevent multiple calls if already initialized
    if (adaptiveQuiz.length > 0) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setQuizError(null);

    try {
      const learningProfile = getLearningProfile();
      
      // Ambil performa sebelumnya untuk modul ini
      const previousPerformance = learningData.quizPerformance[moduleId];
      
      // Tentukan tingkat kesulitan berdasarkan performa sebelumnya
      const newDifficulty = adjustDifficulty(
        previousPerformance ? (previousPerformance.scores.reduce((a, b) => a + b, 0) || 0) : 0,
        previousPerformance ? previousPerformance.scores.length || 0 : 0
      );
      
      // Only update difficulty if it actually changed
      if (difficulty !== newDifficulty) {
        setDifficulty(newDifficulty);
      }
      
      // Jika ada profil belajar, coba generate soal dari Gemini
      if (learningProfile && module) {
        // Use ORIGINAL module content for the AI to generate questions based on it
        let moduleContent = module.originalContent || module.summary || module.learningStyleSummary || "Konten modul tidak tersedia. Gunakan soal standar.";
        
        // Generate personalized quiz using Gemini
        const generatedQuiz = await generatePersonalizedQuiz(
          moduleContent, 
          learningProfile, 
          "adaptive"
        );
        
        // Format the generated quiz to match our expected format
        const formattedQuiz = generatedQuiz.map(q => ({
          question: q.question,
          options: q.options,
          answer: q.options[q.correctAnswer],
          explanation: q.explanation
        }));
        
        setAdaptiveQuiz(formattedQuiz);
      } else if (module) {
        // If module exists but no learning profile, create fallback
        const fallbackQuiz = [
          {
            question: "Apa yang telah Anda pelajari dari modul ini?",
            options: ["Sedikit", "Cukup", "Banyak", "Sangat Banyak"],
            answer: "Cukup",
            explanation: "Penjelasan tidak tersedia"
          }
        ];
        setAdaptiveQuiz(fallbackQuiz);
      } else {
        setPageError("Modul tidak ditemukan");
      }
    } catch (error) {
      console.error("Error generating adaptive quiz:", error);
      setQuizError("Terjadi kesalahan dalam menghasilkan kuis adaptif. Menggunakan kuis standar.");
      
      // Show user-friendly error message
      alert(`❌ Terjadi kesalahan dalam menghasilkan kuis adaptif: ${error.message}\n\nSistem akan menggunakan kuis standar sebagai gantinya.`);
      
      // Fallback if AI fails - create a simple quiz
      const fallbackQuiz = [
        {
          question: "Apa yang telah Anda pelajari dari modul ini?",
          options: ["Sedikit", "Cukup", "Banyak", "Sangat Banyak"],
          answer: "Cukup",
          explanation: "Penjelasan tidak tersedia"
        }
      ];
      setAdaptiveQuiz(fallbackQuiz);
    } finally {
      setIsLoading(false);
    }
  }, [module, adaptiveQuiz.length, difficulty, learningData, moduleId, adjustDifficulty, getLearningProfile]);

  useEffect(() => {
    const module = getModuleById();
    if (module) {
      createAdaptiveQuiz();
    } else {
      setIsLoading(false);
      setPageError("Modul tidak ditemukan");
    }
  }, [getModuleById, createAdaptiveQuiz]);

  const handleAnswer = (option) => {
    setSelectedOption(option);
    const currentQ = adaptiveQuiz[currentQuestion];
    const isCurrentCorrect = option === currentQ.answer;
    
    if (isCurrentCorrect) {
      setScore(score + 1);
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }

    // Save user's answer for review
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[currentQuestion] = {
      question: currentQ.question,
      userAnswer: option,
      correctAnswer: currentQ.answer,
      isCorrect: isCurrentCorrect,
      explanation: currentQ.explanation
    };
    setUserAnswers(updatedUserAnswers);

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < adaptiveQuiz.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        const finalScore = score + (isCurrentCorrect ? 1 : 0);
        setShowScore(true);
        
        // Save quiz results to user context
        // For uploaded modules, we need to use the moduleId as a number if it's a numeric string
        const numericModuleId = isNaN(moduleId) ? moduleId : parseInt(moduleId);
        completeQuiz(numericModuleId, finalScore);
        
        // Record quiz performance in analytics
        recordQuizPerformance(numericModuleId, finalScore, adaptiveQuiz.length);
        
        // Mark module as completed if not already done
        completeModule(numericModuleId);
      }
    }, 1500);
  };

  const getButtonClass = (option) => {
    if (selectedOption === null) {
      return 'bg-bg-card hover:bg-primary/10 border-border-color hover:border-primary transition-colors';
    }
    if (option === adaptiveQuiz[currentQuestion].answer) {
      return 'bg-success/80 text-white border-success';
    }
    if (option === selectedOption && option !== adaptiveQuiz[currentQuestion].answer) {
      return 'bg-danger/80 text-white border-danger';
    }
    return 'bg-bg-card border-border-color';
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedOption(null);
    setIsCorrect(null);
    // Clear the existing quiz to allow regeneration
    setAdaptiveQuiz([]);
    // Re-create adaptive quiz
    setTimeout(() => createAdaptiveQuiz(), 0);
  };

  const retryQuiz = () => {
    setPageError(null);
    navigate('/modules');
  };

  if (pageError) {
    return (
      <div className="bg-bg-light min-h-screen font-poppins">
        <div className="container mx-auto p-6">
          <ErrorDisplay 
            message={pageError}
            onRetry={retryQuiz}
            title="Kesalahan Modul"
          />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-bg-light min-h-screen font-poppins">
        <div className="container mx-auto p-6">
          <LoadingSpinner message="AI sedang menyiapkan kuis personal untuk Anda..." />
        </div>
      </div>
    );
  }

  if (!module && !pageError) {
    return (
      <div className="bg-bg-light min-h-screen font-poppins">
        <div className="container mx-auto p-6">
          <ErrorDisplay 
            message="Modul tidak ditemukan"
            onRetry={() => navigate('/modules')}
            title="Modul Tidak Ditemukan"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-light min-h-screen font-poppins">
      <header className="bg-bg-card shadow-sm border-b border-border-color">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/modules" className="text-primary hover:text-accent flex items-center gap-2">
              <ArrowLeft size={20} />
              <span>Kembali</span>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-text-dark">Kuis Adaptif: {moduleId}</h1>
              <p className="text-sm text-text-light">Disesuaikan dengan gaya belajar Anda</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="text-primary" size={20} />
            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
              AI Adaptif
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 flex justify-center">
        <div className="w-full max-w-3xl">
          {quizError && (
            <div className="bg-warning/10 text-warning p-3 rounded-lg mb-4 flex items-center">
              <AlertTriangle className="mr-2" size={18} />
              <span>{quizError}</span>
            </div>
          )}
          
          {showScore ? (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl shadow-soft text-center border border-border-color">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-4 rounded-full">
                  <Trophy className="text-white" size={48} />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-text-dark mb-2">Kuis Selesai!</h2>
              <div className="flex justify-center items-center mb-2">
                <AlertCircle className="text-yellow-500 mr-2" size={24} />
                <span className="text-yellow-600 font-bold px-3 py-1 bg-yellow-100 rounded-full text-sm">
                  Tingkat Kesulitan: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </span>
              </div>
              <p className="text-6xl font-bold text-primary my-6">{score} / {adaptiveQuiz.length}</p>
              <p className="text-text-light text-lg mb-8">Kuis telah disesuaikan berdasarkan profil belajar dan performa Anda sebelumnya.</p>
              
              {/* Kualitas Kuis */}
              <div className="mb-8">
                <QualityIndicator 
                  type="kuis adaptif" 
                  score={Math.round((score / adaptiveQuiz.length) * 100)} 
                  message={
                    score === adaptiveQuiz.length 
                      ? "Anda lulus kuis dengan sempurna! Semua pertanyaan dijawab dengan benar."
                      : score >= adaptiveQuiz.length * 0.8
                      ? "Nilai Anda sangat baik! Anda memahami sebagian besar konsep dalam modul ini."
                      : score >= adaptiveQuiz.length * 0.6
                      ? "Nilai Anda cukup baik, tetapi masih ada ruang untuk perbaikan."
                      : "Nilai Anda di bawah standar. Disarankan untuk mempelajari kembali modul ini."
                  }
                  details={[
                    `Jumlah Soal: ${adaptiveQuiz.length}`,
                    `Jawaban Benar: ${score}`,
                    `Jawaban Salah: ${adaptiveQuiz.length - score}`,
                    `Nilai Persentase: ${Math.round((score / adaptiveQuiz.length) * 100)}%`,
                    `Tingkat Kesulitan: ${difficulty}`
                  ]}
                />
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                <h3 className="font-bold text-text-dark mb-4 flex items-center justify-center">
                  <BarChart3 className="mr-2 text-primary" size={20} />
                  Statistik Kuis Adaptif
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{score}</p>
                    <p className="text-sm text-text-light">Benar</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{adaptiveQuiz.length - score}</p>
                    <p className="text-sm text-text-light">Salah</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{Math.round((score / adaptiveQuiz.length) * 100)}%</p>
                    <p className="text-sm text-text-light">Nilai</p>
                  </div>
                </div>
              </div>
              
              {/* Pembahasan Kuis */}
              <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                <h3 className="font-bold text-text-dark mb-4 flex items-center justify-center">
                  <Brain className="mr-2 text-primary" size={20} />
                  Pembahasan Kuis
                </h3>
                <div className="text-left">
                  <p className="text-text-dark mb-4">
                    Berikut adalah pembahasan dari soal-soal yang telah Anda jawab:
                  </p>
                  <div className="space-y-4">
                    {userAnswers.map((answer, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${answer.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-start">
                          <span className="font-bold text-text-dark mr-2">{index + 1}.</span>
                          <div className="flex-1">
                            <p className="font-medium text-text-dark mb-2">{answer.question}</p>
                            <div className="text-sm">
                              <p className={answer.isCorrect ? 'text-green-700' : 'text-red-700'}>
                                <span className="font-semibold">{answer.isCorrect ? 'Jawaban Benar!' : 'Jawaban Salah!'}</span>
                                {answer.isCorrect ? ' ✓' : ' ✗'}
                              </p>
                              <p className="text-text-dark mt-1">
                                <span className="font-semibold">Jawaban Anda:</span> {answer.userAnswer}
                              </p>
                              <p className="text-text-dark mt-1">
                                <span className="font-semibold">Jawaban yang benar:</span> {answer.correctAnswer}
                              </p>
                              {answer.explanation && (
                                <p className="text-text-light mt-1">
                                  <span className="font-semibold">Penjelasan:</span> {answer.explanation}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={restartQuiz}
                  className="flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <RotateCcw size={18} />
                  Ulang Kuis
                </button>
                <Link to="/modules" className="bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors">
                  Kembali ke Daftar Modul
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-bg-card p-8 rounded-2xl shadow-soft border border-border-color">
              <div className="flex justify-between items-center mb-8">
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-text-light mb-2">
                    <span>Pertanyaan {currentQuestion + 1} dari {adaptiveQuiz.length}</span>
                    <span>Nilai: {score}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${((currentQuestion + 1) / adaptiveQuiz.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 flex items-center">
                  <Brain className="text-primary mr-2" size={20} />
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    AI Adaptif
                  </span>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-text-dark mb-8 min-h-[6rem]">
                {adaptiveQuiz[currentQuestion]?.question}
              </h2>
              
              <div className="space-y-4 mb-8">
                {adaptiveQuiz[currentQuestion]?.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedOption !== null}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300 flex items-center justify-between ${getButtonClass(option)} ${selectedOption === null ? 'hover:shadow-md' : ''}`}
                  >
                    <span className="font-medium">{option}</span>
                    {selectedOption === option && isCorrect === true && <CheckCircle className="text-white" size={24} />}
                    {selectedOption === option && isCorrect === false && <XCircle className="text-white" size={24} />}
                  </button>
                ))}
              </div>
              
              {selectedOption !== null && isCorrect !== null && (
                <div className={`p-4 rounded-xl ${isCorrect ? 'bg-success/10 text-success border border-success/30' : 'bg-danger/10 text-danger border border-danger/30'}`}>
                  <div className="font-semibold text-lg mb-1">
                    {isCorrect ? "Benar! ✓" : "Kurang tepat ✗"}
                  </div>
                  <p className="text-base">
                    {isCorrect ? 
                      (adaptiveQuiz[currentQuestion]?.explanation || "Jawaban Anda tepat.") :
                      (adaptiveQuiz[currentQuestion]?.explanation || "Silakan pelajari kembali materi ini.")
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdaptiveQuizPage;