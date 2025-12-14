import React from 'react';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

const QualityIndicator = ({ type, score, message, details = [] }) => {
  // Determine icon and color based on score
  let icon, color, bgColor, textColor;
  
  if (score >= 80) {
    icon = <CheckCircle className="text-green-500" size={16} />;
    color = 'text-green-500';
    bgColor = 'bg-green-50';
    textColor = 'text-green-700';
  } else if (score >= 60) {
    icon = <AlertTriangle className="text-yellow-500" size={16} />;
    color = 'text-yellow-500';
    bgColor = 'bg-yellow-50';
    textColor = 'text-yellow-700';
  } else {
    icon = <AlertTriangle className="text-red-500" size={16} />;
    color = 'text-red-500';
    bgColor = 'bg-red-50';
    textColor = 'text-red-700';
  }
  
  return (
    <div className={`${bgColor} p-4 rounded-lg border ${color.replace('text', 'border-')} border-opacity-30`}>
      <div className="flex items-start gap-3">
        <div className={color}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className={`font-semibold ${textColor} capitalize`}>
              {type} Kualitas {score >= 80 ? 'Tinggi' : score >= 60 ? 'Sedang' : 'Rendah'}
            </h4>
            <span className={`font-bold ${textColor}`}>
              {score}%
            </span>
          </div>
          <p className="text-sm mt-1 text-text-dark">{message}</p>
          {details.length > 0 && (
            <ul className="mt-2 space-y-1">
              {details.map((detail, index) => (
                <li key={index} className="text-xs text-text-lighter flex items-start">
                  <span className="mr-2">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default QualityIndicator;