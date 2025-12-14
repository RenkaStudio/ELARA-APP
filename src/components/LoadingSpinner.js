import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner = ({ message = "Memuat...", size = "md", variant = "primary" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  const colorClasses = {
    primary: "text-primary",
    accent: "text-accent",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger"
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`${colorClasses[variant]} animate-spin`}>
        <Loader className={`${sizeClasses[size]} ${sizeClasses[size] === "h-4 w-4" ? "animate-spin" : "animate-spin"}`} />
      </div>
      {message && (
        <p className="mt-4 text-text-light text-sm">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;