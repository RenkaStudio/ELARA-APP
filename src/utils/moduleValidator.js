/**
 * Module Validation Utility
 * Ensures every uploaded module and generated quiz meets quality standards
 *
 * @file src/utils/moduleValidator.js
 */

/**
 * Validate extracted text content
 * @param {string} text - The extracted text to validate
 * @returns {Object} - { isValid: boolean, errors: string[], warnings: string[] }
 */
export const validateTextContent = (text) => {
  const errors = [];
  const warnings = [];

  // Check if text exists
  if (!text) {
    errors.push("Teks kosong. File mungkin kosong atau gagal diekstrak.");
    return { isValid: false, errors, warnings };
  }

  // Check if text is only whitespace
  if (text.trim() === "") {
    errors.push("Teks hanya mengandung spasi atau karakter kosong.");
    return { isValid: false, errors, warnings };
  }

  // Warning if text is very short
  const trimmedLength = text.trim().length;
  if (trimmedLength < 100) {
    warnings.push(
      `Teks sangat singkat (${trimmedLength} karakter). Kualitas kuis mungkin berkurang.`
    );
  }

  // Check for minimum word count
  const words = text.trim().split(/\s+/).length;
  if (words < 20) {
    warnings.push(
      `Teks hanya mengandung ${words} kata. Minimal 20 kata diperlukan untuk kuis yang baik.`
    );
  }

  // Check for special patterns that indicate image-only PDF
  const textContent = text.toLowerCase();
  if (
    textContent.includes("scanned") ||
    textContent.includes("[image]") ||
    (text.split("\n").length > 100 && words < 50)
  ) {
    warnings.push(
      "File mungkin adalah PDF berbasis gambar. Hasil ekstraksi mungkin tidak akurat."
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    metrics: {
      characters: trimmedLength,
      words: words,
      sentences: text.split(/[.!?]+/).length,
      lines: text.split("\n").length,
    },
  };
};

/**
 * Validate generated quiz questions
 * @param {Array} questions - Array of quiz questions
 * @returns {Object} - { isValid: boolean, errors: string[], warnings: string[], score: number }
 */
export const validateQuizQuestions = (questions) => {
  const errors = [];
  const warnings = [];
  let score = 0; // Quality score (0-100)

  // Check if questions array exists and is not empty
  if (!questions || !Array.isArray(questions)) {
    errors.push("Kuis harus berupa array pertanyaan.");
    return { isValid: false, errors, warnings, score: 0 };
  }

  if (questions.length === 0) {
    errors.push("Tidak ada pertanyaan kuis yang dihasilkan.");
    return { isValid: false, errors, warnings, score: 0 };
  }

  // Check minimum number of questions
  if (questions.length < 5) {
    warnings.push(
      `Hanya ${questions.length} pertanyaan dihasilkan. Minimal 5 disarankan.`
    );
  } else if (questions.length >= 5 && questions.length <= 10) {
    score += 20;
  } else if (questions.length > 10) {
    score += 25;
  }

  // Validate each question
  let validQuestionCount = 0;
  questions.forEach((q, index) => {
    const questionErrors = [];

    // Check question text
    if (!q.question || typeof q.question !== "string") {
      questionErrors.push(
        `Pertanyaan ${index + 1}: tidak memiliki teks pertanyaan`
      );
    } else if (q.question.trim().length < 10) {
      questionErrors.push(
        `Pertanyaan ${index + 1}: teks pertanyaan terlalu singkat`
      );
    }

    // Check options
    if (!q.options || !Array.isArray(q.options)) {
      questionErrors.push(`Pertanyaan ${index + 1}: opsi harus berupa array`);
    } else if (q.options.length !== 4) {
      questionErrors.push(
        `Pertanyaan ${index + 1}: harus memiliki 4 opsi (memiliki ${
          q.options.length
        })`
      );
    } else {
      // Check if all options are strings and not empty
      const invalidOptions = q.options.filter(
        (opt) => !opt || typeof opt !== "string" || opt.trim() === ""
      );
      if (invalidOptions.length > 0) {
        questionErrors.push(
          `Pertanyaan ${index + 1}: beberapa opsi kosong atau tidak valid`
        );
      }

      // Check for duplicate options
      const uniqueOptions = new Set(q.options.map((opt) => opt.toLowerCase()));
      if (uniqueOptions.size < q.options.length) {
        warnings.push(`Pertanyaan ${index + 1}: ada opsi yang duplikat`);
      }
    }

    // Check answer
    if (!q.answer || typeof q.answer !== "string") {
      questionErrors.push(
        `Pertanyaan ${index + 1}: tidak memiliki jawaban yang valid`
      );
    } else if (!q.options || !q.options.includes(q.answer)) {
      questionErrors.push(
        `Pertanyaan ${index + 1}: jawaban tidak ada dalam opsi`
      );
    }

    // Check correctAnswer index (if present)
    if (q.correctAnswer !== undefined) {
      if (
        typeof q.correctAnswer !== "number" ||
        q.correctAnswer < 0 ||
        q.correctAnswer > 3
      ) {
        questionErrors.push(
          `Pertanyaan ${index + 1}: indeks jawaban benar tidak valid`
        );
      }
    }

    // Check explanation (optional but nice to have)
    if (!q.explanation || typeof q.explanation !== "string") {
      warnings.push(`Pertanyaan ${index + 1}: tidak memiliki penjelasan`);
    } else if (q.explanation.trim().length < 10) {
      warnings.push(`Pertanyaan ${index + 1}: penjelasan terlalu singkat`);
    }

    if (questionErrors.length === 0) {
      validQuestionCount++;
      score += 80 / questions.length; // Distribute quality points
    } else {
      errors.push(...questionErrors);
    }
  });

  // Validate diversity - check if questions are not too similar
  if (questions.length >= 2) {
    const questionTexts = questions.map((q) => q.question.toLowerCase());
    const uniqueQuestions = new Set(questionTexts);
    if (uniqueQuestions.size < questions.length * 0.8) {
      warnings.push(
        "Beberapa pertanyaan tampak sangat mirip. Coba tingkatkan keragaman pertanyaan."
      );
    }
  }

  // Round score
  score = Math.min(100, Math.round(score));

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score,
    validQuestionCount,
    totalQuestions: questions.length,
    qualityPercentage: (validQuestionCount / questions.length) * 100,
  };
};

/**
 * Validate module information
 * @param {Object} moduleInfo - Module information object
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validateModuleInfo = (moduleInfo) => {
  const errors = [];

  if (!moduleInfo) {
    errors.push("Module info tidak ada.");
    return { isValid: false, errors };
  }

  // Check required fields
  if (!moduleInfo.id) {
    errors.push("Module ID tidak ada.");
  }

  if (
    !moduleInfo.title ||
    typeof moduleInfo.title !== "string" ||
    moduleInfo.title.trim() === ""
  ) {
    errors.push("Judul modul tidak valid.");
  }

  if (!moduleInfo.uploadDate) {
    errors.push("Tanggal upload tidak ada.");
  } else {
    try {
      new Date(moduleInfo.uploadDate);
    } catch {
      errors.push("Format tanggal upload tidak valid.");
    }
  }

  if (
    moduleInfo.questionCount &&
    typeof moduleInfo.questionCount !== "number"
  ) {
    errors.push("Jumlah pertanyaan harus berupa angka.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Comprehensive module validation (combines all validators)
 * @param {Object} validationData - { textContent, quiz, moduleInfo }
 * @returns {Object} - Complete validation result
 */
export const validateCompleteModule = (validationData) => {
  const { textContent, quiz, moduleInfo } = validationData;

  const textValidation = validateTextContent(textContent);
  const quizValidation = validateQuizQuestions(quiz);
  const infoValidation = validateModuleInfo(moduleInfo);

  const allErrors = [
    ...textValidation.errors,
    ...quizValidation.errors,
    ...infoValidation.errors,
  ];

  const allWarnings = [...textValidation.warnings, ...quizValidation.warnings];

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    validation: {
      text: textValidation,
      quiz: quizValidation,
      info: infoValidation,
    },
    overallQuality: quizValidation.score,
    readyForUpload: allErrors.length === 0,
  };
};

/**
 * Get quality assessment message for user
 * @param {Object} validationResult - Result from validateQuizQuestions or validateCompleteModule
 * @returns {string} - User-friendly message
 */
export const getQualityMessage = (validationResult) => {
  if (!validationResult.isValid) {
    const errorCount = validationResult.errors.length;
    return `❌ Validasi gagal: ${errorCount} error ditemukan.`;
  }

  if (validationResult.warnings && validationResult.warnings.length > 0) {
    return `⚠️ Modul valid tetapi ada ${validationResult.warnings.length} peringatan.`;
  }

  const score =
    validationResult.validation?.quiz?.score || validationResult.score;

  if (score >= 90) {
    return `✅ Kualitas Excellent! Skor: ${score}/100`;
  } else if (score >= 75) {
    return `✅ Kualitas Good! Skor: ${score}/100`;
  } else if (score >= 60) {
    return `⚠️ Kualitas Fair! Skor: ${score}/100. Coba gunakan file dengan konten lebih lengkap.`;
  } else {
    return `⚠️ Kualitas Poor! Skor: ${score}/100. Disarankan menggunakan file dengan konten lebih terstruktur.`;
  }
};

/**
 * Suggest improvements for quiz
 * @param {Object} validationResult - Result from validateQuizQuestions
 * @returns {Array<string>} - List of improvement suggestions
 */
export const suggestImprovements = (validationResult) => {
  const suggestions = [];

  if (validationResult.errors.length > 0) {
    suggestions.push("Perbaiki error yang tercantum sebelum upload.");
  }

  if (validationResult.warnings && validationResult.warnings.length > 0) {
    suggestions.push(
      `Ada ${validationResult.warnings.length} peringatan. Pertimbangkan untuk perbaiki.`
    );
  }

  if (validationResult.totalQuestions && validationResult.totalQuestions < 5) {
    suggestions.push(
      "Tambahkan minimal 5 pertanyaan untuk kuis yang komprehensif."
    );
  }

  if (validationResult.totalQuestions && validationResult.totalQuestions > 20) {
    suggestions.push(
      "Pertanyaan lebih dari 20 mungkin membuat kuis terlalu panjang."
    );
  }

  return suggestions;
};

export default {
  validateTextContent,
  validateQuizQuestions,
  validateModuleInfo,
  validateCompleteModule,
  getQualityMessage,
  suggestImprovements,
};
