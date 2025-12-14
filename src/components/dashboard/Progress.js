import React from 'react';
import { TrendingUp } from 'lucide-react';

const Progress = ({ userProgress }) => {
  // Calculate progress based on user data
  const totalModules = 3; // Total number of modules
  const completedModules = userProgress ? userProgress.modulesCompleted.length : 0;
  const progressPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <div className="bg-bg-card p-6 rounded-xl shadow-soft">
      <div className="flex items-center mb-4">
        <div className="bg-primary/10 p-2 rounded-lg mr-3">
          <TrendingUp className="text-primary" size={20} />
        </div>
        <h2 className="text-lg font-bold text-text-dark">Progres Belajar</h2>
      </div>
      <p className="text-3xl font-bold text-text-dark mb-3">{progressPercentage}%</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
      </div>
      <div className="text-sm text-text-light">
        <p className="flex justify-between">
          <span>{completedModules} dari {totalModules} modul</span>
          <span>
            {progressPercentage === 0 ? 'Pemula' : 
             progressPercentage < 30 ? 'Pemula' : 
             progressPercentage < 60 ? 'Menengah' : 
             progressPercentage < 90 ? 'Mahir' : 'Ahli'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Progress;