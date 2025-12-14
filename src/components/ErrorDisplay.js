import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

const ErrorDisplay = ({ 
  message = "Terjadi kesalahan yang tidak terduga", 
  onRetry = null, 
  showRetry = true,
  title = "Kesalahan Terjadi"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-primary/10 p-4 rounded-full mb-4">
        <AlertCircle className="text-primary" size={32} />
      </div>
      <h3 className="text-xl font-bold text-text-dark mb-2">{title}</h3>
      <p className="text-text-light text-center mb-6 max-w-md">{message}</p>
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <RotateCcw size={16} />
          Coba Lagi
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;