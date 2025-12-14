import React, { useState, useEffect, useRef } from 'react';
import { Bot, BookOpen, Target, TrendingUp, Award, RotateCcw, Clock, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react';
import { getLearningAssistance } from '../../utils/geminiAI';

const Chatbot = ({ userProgress }) => {
  const [messages, setMessages] = useState([
    { text: 'Halo! Saya adalah AI Tutor UT Learn. Pilih pertanyaan di bawah untuk mendapatkan rekomendasi belajar yang disesuaikan dengan progres Anda.', sender: 'bot' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const questionTemplates = [
    { id: 1, text: "Apa yang perlu saya pelajari lebih dalam?", icon: <BookOpen size={14} /> },
    { id: 2, text: "Modul mana yang sebaiknya saya pelajari selanjutnya?", icon: <TrendingUp size={14} /> },
    { id: 3, text: "Apa rekomendasi modul berdasarkan nilai saya?", icon: <Award size={14} /> },
    { id: 4, text: "Apa yang harus saya lakukan untuk meningkatkan nilai?", icon: <Target size={14} /> },
    { id: 5, text: "Modul mana yang paling sulit bagi saya?", icon: <AlertCircle size={14} /> },
    { id: 6, text: "Apa kekuatan saya dalam belajar?", icon: <CheckCircle size={14} /> },
    { id: 7, text: "Bagaimana progres belajar saya secara keseluruhan?", icon: <BarChart3 size={14} /> },
    { id: 8, text: "Apa yang sudah saya capai dalam pembelajaran?", icon: <Clock size={14} /> }
  ];

  const getAIResponse = async (templateText) => {
    // Get learning profile if available
    let learningProfile = null;
    try {
      const profileStr = localStorage.getItem('learningProfile');
      if (profileStr) {
        learningProfile = JSON.parse(profileStr);
      }
    } catch (e) {
      console.error('Error parsing learning profile:', e);
    }

    // Create context for the AI based on user progress
    const quizzesTaken = userProgress?.quizzesTaken?.length || 0;
    let avgScore = 0;
    if (quizzesTaken > 0) {
      const totalScore = Object.values(userProgress.scores || {}).reduce((sum, score) => sum + score, 0);
      const totalQuestions = quizzesTaken * 5; // Assuming 5 questions per quiz
      avgScore = Math.round((totalScore / totalQuestions) * 100);
    }

    // Find best/worst modules
    let bestModule = null, worstModule = null, bestScore = 0, worstScore = Infinity;
    for (const moduleId of userProgress?.quizzesTaken || []) {
      const score = userProgress?.scores?.[moduleId];
      if (score !== undefined) {
        if (score > bestScore) { 
          bestScore = score; 
          bestModule = `Modul ${moduleId}`; 
        }
        if (score < worstScore) { 
          worstScore = score; 
          worstModule = `Modul ${moduleId}`; 
        }
      }
    }

    const context = `
      Data Progres Belajar Siswa:
      - Modul Selesai: ${userProgress?.modulesCompleted?.length || 0} dari ${userProgress?.modulesCompleted ? 'total' : 'tidak diketahui'}
      - Kuis Dikerjakan: ${quizzesTaken}
      - Nilai Rata-rata: ${avgScore}%
      - Modul Terbaik: ${bestModule || 'Belum ada'} (Skor: ${bestScore || 0})
      - Modul Terlemah: ${worstModule || 'Belum ada'} (Skor: ${worstScore || 'N/A'})
      - Gaya Belajar: ${learningProfile?.learningStyle ? learningProfile.learningStyle : 'Belum ditentukan'}
      - Kekuatan Awal: ${learningProfile?.ability !== undefined ? learningProfile.ability : 'Belum diuji'}/3
    `;

    // Get response from Gemini AI
    const response = await getLearningAssistance(templateText, context);
    return response;
  };

  const handleTemplateSelect = async (templateId, templateText) => {
    const userMessage = { text: templateText, sender: 'user' };
    const thinkingMessage = { text: 'AI sedang berpikir...', sender: 'bot', isLoading: true };

    setMessages(prev => [...prev, userMessage, thinkingMessage]);
    setShowTemplates(false);
    setIsLoading(true);

    try {
      const botResponse = await getAIResponse(templateText);
      setMessages(prev => prev.map(msg => msg.isLoading ? { ...msg, text: botResponse, isLoading: false } : msg));
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage = "Maaf, terjadi kesalahan saat menghubungi AI. Mohon coba lagi.";
      setMessages(prev => prev.map(msg => msg.isLoading ? { ...msg, text: errorMessage, isLoading: false } : msg));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow bg-bg-light rounded-lg border border-border-color flex flex-col">
        <div className="flex-grow overflow-y-auto p-3 space-y-3">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'bot' && (
                <div className="mr-2 flex-shrink-0 self-start">
                  <Bot className="text-primary" size={20} />
                </div>
              )}
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                msg.sender === 'user' 
                  ? 'bg-primary text-white rounded-br-none' 
                  : 'bg-white text-text-dark rounded-bl-none shadow-sm'
              }`}>
                {msg.isLoading ? <div className="flex items-center"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary/50"></div><span className='ml-2 opacity-70'>AI berpikir...</span></div> : msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {showTemplates && (
          <div className="p-3 border-t border-border-color bg-gray-50/50">
            <div className="text-xs text-text-light mb-2 px-1">Pilih pertanyaan untuk AI Tutor:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {questionTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id, template.text)}
                  disabled={isLoading}
                  className="w-full text-left p-2 text-xs bg-white border border-border-color rounded-lg hover:bg-primary/10 hover:border-primary/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-primary/80">{template.icon}</span>
                  <span className="flex-1">{template.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {!showTemplates && !isLoading && (
          <div className="p-2 border-t border-border-color flex justify-center items-center">
            <button 
              onClick={() => setShowTemplates(true)}
              className="flex items-center gap-1.5 text-xs text-text-light hover:text-primary py-1 px-3 bg-white border rounded-full shadow-sm"
            >
              <RotateCcw size={12} />
              <span>Pilih Pertanyaan Lain</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
