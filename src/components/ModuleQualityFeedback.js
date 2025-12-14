/**
 * Module Quality Feedback Component
 * Displays validation results and quality metrics to the user
 *
 * @file src/components/ModuleQualityFeedback.js
 */

import React from "react";
import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  TrendingUp,
} from "lucide-react";

const ModuleQualityFeedback = ({ validationResult, showDetails = false }) => {
  if (!validationResult) {
    return null;
  }

  const { isValid, errors, warnings, validation } = validationResult;

  // Determine feedback type and styling
  const getStatus = () => {
    if (!isValid) {
      return {
        type: "error",
        icon: AlertCircle,
        bgColor: "bg-danger/10",
        borderColor: "border-danger/30",
        textColor: "text-danger",
        title: "Validasi Gagal",
      };
    }

    if (warnings && warnings.length > 0) {
      return {
        type: "warning",
        icon: AlertTriangle,
        bgColor: "bg-warning/10",
        borderColor: "border-warning/30",
        textColor: "text-warning",
        title: "Ada Peringatan",
      };
    }

    const quizScore = validation?.quiz?.score || 0;
    if (quizScore >= 90) {
      return {
        type: "excellent",
        icon: CheckCircle,
        bgColor: "bg-success/10",
        borderColor: "border-success/30",
        textColor: "text-success",
        title: "Kualitas Excellent",
      };
    } else if (quizScore >= 75) {
      return {
        type: "good",
        icon: CheckCircle,
        bgColor: "bg-primary/10",
        borderColor: "border-primary/30",
        textColor: "text-primary",
        title: "Kualitas Good",
      };
    }

    return {
      type: "fair",
      icon: AlertTriangle,
      bgColor: "bg-warning/10",
      borderColor: "border-warning/30",
      textColor: "text-warning",
      title: "Kualitas Fair",
    };
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  return (
    <div
      className={`${status.bgColor} border ${status.borderColor} rounded-lg p-4 mb-4`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <StatusIcon
          className={`${status.textColor} flex-shrink-0 mt-0.5`}
          size={20}
        />
        <div className="flex-1">
          <h3 className={`font-semibold ${status.textColor}`}>
            {status.title}
          </h3>
        </div>
      </div>

      {/* Error Messages */}
      {errors && errors.length > 0 && (
        <div className="mb-3 bg-white/50 p-3 rounded border border-danger/20">
          <p className="text-sm font-medium text-danger mb-2">❌ Error:</p>
          <ul className="space-y-1">
            {errors.map((error, idx) => (
              <li
                key={idx}
                className="text-sm text-danger flex items-start gap-2"
              >
                <span className="text-danger/60 mt-1">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warning Messages */}
      {warnings && warnings.length > 0 && (
        <div className="mb-3 bg-white/50 p-3 rounded border border-warning/20">
          <p className="text-sm font-medium text-warning mb-2">
            ⚠️ Peringatan:
          </p>
          <ul className="space-y-1">
            {warnings.map((warning, idx) => (
              <li
                key={idx}
                className="text-sm text-warning flex items-start gap-2"
              >
                <span className="text-warning/60 mt-1">•</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Detailed Metrics (if showDetails is true) */}
      {showDetails && validation && (
        <div className="mt-4 space-y-3">
          {/* Text Metrics */}
          {validation.text && (
            <div className="bg-white/50 p-3 rounded">
              <p className="text-xs font-semibold text-text-dark mb-2 flex items-center gap-1">
                <Info size={14} /> Metrik Teks
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-text-lighter">Karakter:</span>
                  <p className="font-medium text-text-dark">
                    {validation.text.metrics?.characters || 0}
                  </p>
                </div>
                <div>
                  <span className="text-text-lighter">Kata:</span>
                  <p className="font-medium text-text-dark">
                    {validation.text.metrics?.words || 0}
                  </p>
                </div>
                <div>
                  <span className="text-text-lighter">Kalimat:</span>
                  <p className="font-medium text-text-dark">
                    {validation.text.metrics?.sentences || 0}
                  </p>
                </div>
                <div>
                  <span className="text-text-lighter">Baris:</span>
                  <p className="font-medium text-text-dark">
                    {validation.text.metrics?.lines || 0}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quiz Metrics */}
          {validation.quiz && (
            <div className="bg-white/50 p-3 rounded">
              <p className="text-xs font-semibold text-text-dark mb-2 flex items-center gap-1">
                <TrendingUp size={14} /> Metrik Kuis
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-text-lighter text-xs">
                    Jumlah Pertanyaan:
                  </span>
                  <span className="font-medium text-text-dark text-sm">
                    {validation.quiz.totalQuestions}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-lighter text-xs">
                    Pertanyaan Valid:
                  </span>
                  <span className="font-medium text-text-dark text-sm">
                    {validation.quiz.validQuestionCount}/
                    {validation.quiz.totalQuestions}
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-text-lighter text-xs">
                      Skor Kualitas:
                    </span>
                    <span
                      className={`font-bold text-sm ${
                        validation.quiz.score >= 90
                          ? "text-success"
                          : validation.quiz.score >= 75
                          ? "text-primary"
                          : validation.quiz.score >= 60
                          ? "text-warning"
                          : "text-danger"
                      }`}
                    >
                      {validation.quiz.score}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        validation.quiz.score >= 90
                          ? "bg-success"
                          : validation.quiz.score >= 75
                          ? "bg-primary"
                          : validation.quiz.score >= 60
                          ? "bg-warning"
                          : "bg-danger"
                      }`}
                      style={{ width: `${validation.quiz.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      {!isValid && (
        <div className="mt-3 p-3 bg-white/70 rounded border border-danger/20">
          <p className="text-xs text-danger font-medium">
            💡 Tip: Perbaiki error di atas sebelum melanjutkan upload.
          </p>
        </div>
      )}

      {isValid && validation?.quiz?.score < 60 && (
        <div className="mt-3 p-3 bg-white/70 rounded border border-warning/20">
          <p className="text-xs text-warning font-medium">
            💡 Tip: Coba gunakan file dengan konten lebih lengkap dan
            terstruktur untuk kualitas kuis yang lebih baik.
          </p>
        </div>
      )}
    </div>
  );
};

export default ModuleQualityFeedback;
