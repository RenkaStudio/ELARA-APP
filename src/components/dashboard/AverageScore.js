import React from 'react';
import { Star } from 'lucide-react';

const AverageScore = ({ userProgress }) => {
  // Calculate average score based on user data
  const quizzesTaken = userProgress ? userProgress.quizzesTaken.length : 0;
  let avgScore = 0;
  let avgScorePercentage = 0;
  let starRating = 0;

  if (quizzesTaken > 0) {
    const totalScore = Object.values(userProgress.scores).reduce((sum, score) => sum + score, 0);
    const totalQuestions = quizzesTaken * 5; // Each quiz has 5 questions
    avgScore = totalScore;
    avgScorePercentage = Math.round((totalScore / totalQuestions) * 100);
    starRating = Math.round(avgScorePercentage / 20); // Convert percentage to a 5-star rating
  }

  return (
    <div className="bg-bg-card p-6 rounded-xl shadow-soft">
      <div className="flex items-center mb-4">
        <div className="bg-warning/10 p-2 rounded-lg mr-3">
          <Star className="text-warning" size={20} />
        </div>
        <h2 className="text-lg font-bold text-text-dark">Nilai Rata-rata</h2>
      </div>
      <div className="text-center mb-3">
        <p className="text-3xl font-bold text-text-dark">{avgScorePercentage}%</p>
      </div>
      <div className="mt-2">
        <div className="flex items-center justify-center mb-2">
          <div className="flex mr-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={i < starRating ? "text-warning fill-warning" : "text-gray-300"} size={16} />
            ))}
          </div>
        </div>
        <p className="text-text-light text-sm text-center">
          {quizzesTaken > 0 
            ? `${avgScore} dari ${quizzesTaken * 5} jawaban benar` 
            : 'Kerjakan kuis pertama untuk mulai melihat statistik'}
        </p>
      </div>
    </div>
  );
};

export default AverageScore;