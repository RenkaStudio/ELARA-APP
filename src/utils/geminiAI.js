import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API client
const initializeGemini = () => {
  // Get API key from both environment variable and localStorage for flexibility
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY || localStorage.getItem('gemini_api_key');

  // Only check for the default placeholder from the .env file
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn("Gemini API key not configured. Using fallback functionality.");
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI;
  } catch (error) {
    console.error("Error initializing Gemini AI:", error);
    return null;
  }
};

// Function to analyze learning style based on quiz responses
export const analyzeLearningStyle = async (quizResponses, learningProfile) => {
  const genAI = initializeGemini();
  
  if (!genAI) {
    // Return mock response for development
    return {
      recommendations: [
        "Berdasarkan profil belajar Anda, Anda memiliki gaya belajar visual. Coba gunakan diagram, grafik, dan visualisasi untuk memahami konsep-konsep kompleks.",
        "Karena Anda memiliki tingkat fokus sedang, usahakan belajar dalam sesi 30-45 menit dengan istirahat 5 menit di antaranya.",
        "Metode evaluasi yang cocok untuk Anda adalah ujian tertulis. Ini sesuai dengan preferensi belajar Anda."
      ],
      adaptiveContent: "Konten akan disesuaikan dengan gaya belajar visual dan tingkat pemahaman awal Anda.",
      strategy: "Kami akan menyediakan lebih banyak konten berbasis visual dan mengurangi penjelasan lisan untuk Anda."
    };
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  const prompt = `Berdasarkan profil gaya belajar siswa berikut, berikan rekomendasi pembelajaran personal:
  
  Profil Belajar:
  - Gaya Belajar: ${learningProfile.learningStyle}
  - Kemampuan Awal: ${learningProfile.ability}/3
  - Waktu Fokus: ${learningProfile.focusTime}
  - Penyelesaian Masalah: ${learningProfile.problemSolving}
  - Kecepatan Belajar: ${learningProfile.learningPace}
  - Preferensi: ${learningProfile.preference}
  
  Berikan jawaban dalam format JSON:
  {
    "recommendations": ["rekomendasi 1", "rekomendasi 2", "rekomendasi 3"],
    "adaptiveContent": "deskripsi konten adaptif",
    "strategy": "strategi pengajaran personal"
  }`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonString = text.substring(jsonStart, jsonEnd);
    
    if (jsonString) {
      return JSON.parse(jsonString);
    } else {
      throw new Error("Could not parse JSON from Gemini response");
    }
  } catch (error) {
    console.error("Error analyzing learning style with Gemini:", error);
    // Return mock response on error
    return {
      recommendations: [
        "Berdasarkan profil belajar Anda, Anda memiliki gaya belajar visual. Coba gunakan diagram, grafik, dan visualisasi untuk memahami konsep-konsep kompleks.",
        "Karena Anda memiliki tingkat fokus sedang, usahakan belajar dalam sesi 30-45 menit dengan istirahat 5 menit di antaranya.",
        "Metode evaluasi yang cocok untuk Anda adalah ujian tertulis. Ini sesuai dengan preferensi belajar Anda."
      ],
      adaptiveContent: "Konten akan disesuaikan dengan gaya belajar visual dan tingkat pemahaman awal Anda.",
      strategy: "Kami akan menyediakan lebih banyak konten berbasis visual dan mengurangi penjelasan lisan untuk Anda."
    };
  }
};

// Function to analyze PDF content and generate summary adapted to learning style
export const analyzePDFContent = async (pdfText, learningProfile = null, isImageOnlyPDF = false) => {
  const genAI = initializeGemini();
  
  if (!genAI) {
    // Return mock response for development
    return {
      summary: isImageOnlyPDF ? 
        "PDF ini hanya berisi gambar. Silakan tambahkan deskripsi manual tentang isi dokumen ini untuk membuat ringkasan dan kuis yang sesuai." : 
        "Ringkasan dari konten PDF akan disediakan setelah analisis oleh AI.",
      keyTopics: isImageOnlyPDF ? 
        ["Dokumen Gambar - Perlu Deskripsi Manual"] : 
        ["Topik 1", "Topik 2", "Topik 3"],
      difficulty: "tidak dapat ditentukan",
      estimatedTime: "tidak dapat ditentukan",
      learningStyleSummary: isImageOnlyPDF ? 
        "PDF ini hanya berisi gambar. Silakan tambahkan deskripsi manual tentang isi dokumen ini untuk membuat ringkasan yang disesuaikan dengan gaya belajar Anda." : 
        "Ringkasan dari konten PDF disesuaikan dengan gaya belajar Anda.",
      learningObjectives: isImageOnlyPDF ? 
        ["Menambahkan deskripsi manual untuk konten gambar", "Mengidentifikasi topik utama dari gambar"] : 
        ["Tujuan 1", "Tujuan 2", "Tujuan 3"]
    };
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  // Prepare prompt based on learning profile if available
  let learningStylePrompt = "";
  if (learningProfile) {
    const learningStyle = learningProfile.learningStyle || "mixed";
    const learningStyleDetail = learningProfile.learningStyleDetail || {};
    
    learningStylePrompt = `Profil Gaya Belajar Siswa:
- Gaya Belajar Utama: ${learningStyle}
- Skor Visual: ${learningStyleDetail.visual || 0}
- Skor Aural: ${learningStyleDetail.aural || 0}
- Skor Read/Write: ${learningStyleDetail.readWrite || 0}
- Skor Kinesthetic: ${learningStyleDetail.kinesthetic || 0}
- Kemampuan Awal: ${learningProfile.ability}/3
- Waktu Fokus: ${learningProfile.focusTime}

Mohon buatkan ringkasan dan kuis yang disesuaikan dengan gaya belajar ini.`;
  } else {
    learningStylePrompt = "Mohon buatkan ringkasan dan kuis umum karena tidak ada profil gaya belajar.";
  }
  
  // More structured and specific prompt for better summaries
  const prompt = `Sebagai asisten pembelajaran AI untuk platform ELARA, analisis KONTEN BERIKUT INI dan buatkan ringkasan serta elemen pembelajaran yang AKURAT:

${learningStylePrompt}

${isImageOnlyPDF ? 
  `KONTEN PDF INI HANYA BERISI GAMBAR DAN TIDAK MEMILIKI TEKS YANG DAPAT DIEKSTRAK SECARA LANGSUNG. 
SILAKAN BERIKAN DESKRIPSI MANUAL TENTANG ISI DOKUMEN INI UNTUK MEMBUAT RINGKASAN DAN KUIS YANG SESUAI.

PETUNJUK KHUSUS UNTUK PDF BERISI GAMBAR:
1. INFORMASIKAN KEPADA PENGGUNA BAHWA MEREKA PERLU MENAMBAHKAN DESKRIPSI MANUAL
2. SARANKAN FORMAT DESKRIPSI YANG BAIK UNTUK PEMBELAJARAN
3. BERIKAN TEMPLATE DESKRIPSI YANG DAPAT DIGUNAKAN PENGGUNA
4. JANGAN BUAT ATAU MENAMBAHKAN INFORMASI YANG TIDAK ADA DALAM DOKUMEN` : 
  `KONTEN DOKUMEN YANG HARUS DIANALISIS (JANGAN BUAT INFORMASI TAMBAHAN):
${pdfText.substring(0, 3000) || "[DOKUMEN KOSONG - MOHON PERIKSA FILE PDF]"}

PETUNJUK PENTING UNTUK ANALISIS:
1. JIKA DOKUMEN KOSONG ATAU TIDAK ADA ISI, BERITAHU SECARA JUJUR "Tidak dapat menganalisis dokumen karena isi dokumen kosong atau tidak dapat diekstrak"
2. JANGAN BUAT ATAU MENAMBAHKAN INFORMASI YANG TIDAK ADA DALAM DOKUMEN
3. SEMUA INFORMASI YANG ANDA BERIKAN HARUS DITEMUKAN DALAM TEKS DOKUMEN DI ATAS
4. JIKA DOKUMEN BERISI TEKS, EKSTRAK INFORMASI NYATA DARI ISI DOKUMEN
5. RINGKASAN HARUS MENCERMINKAN KONSEP UTAMA DOKUMEN SECARA LENGKAP
6. GUNAKAN BAHASA YANG JELAS DAN SEDERHANA
7. FOKUS PADA INFORMASI YANG PENTING UNTUK PEMBELAJARAN`}

BERIKAN OUTPUT YANG SANGAT TERSTRUKTUR DALAM FORMAT JSON SEBAGAI BERIKUT:
{
  "summary": "${isImageOnlyPDF ? 
    "PDF ini hanya berisi gambar. Silakan tambahkan deskripsi manual tentang isi dokumen ini untuk membuat ringkasan dan kuis yang sesuai." : 
    "ringkasan komprehensif dari konten utama BERDASARKAN ISI DOKUMEN, maksimal 100 kata yang mencakup poin-poin utama. JIKA DOKUMEN KOSONG, TULIS 'Dokumen kosong atau tidak dapat diekstrak'"}",
  "learningStyleSummary": "${isImageOnlyPDF ? 
    "PDF ini hanya berisi gambar. Silakan tambahkan deskripsi manual tentang isi dokumen ini untuk membuat ringkasan yang disesuaikan dengan gaya belajar Anda." : 
    "ringkasan yang disesuaikan dengan gaya belajar siswa BERDASARKAN ISI DOKUMEN. SESUAIKAN DENGAN GAYA BELAJAR YANG DIBERIKAN DI ATAS. JIKA DOKUMEN KOSONG, TULIS 'Dokumen kosong atau tidak dapat diekstrak'"}",
  "keyTopics": ["${isImageOnlyPDF ? 
    "Dokumen Gambar - Perlu Deskripsi Manual" : 
    "topik utama 1 BERDASARKAN ISI DOKUMEN"}", "${isImageOnlyPDF ? 
    "" : 
    "topik utama 2 BERDASARKAN ISI DOKUMEN"}", "${isImageOnlyPDF ? 
    "" : 
    "topik utama 3 BERDASARKAN ISI DOKUMEN"}"]. ${isImageOnlyPDF ? 
    "JIKA DOKUMEN KOSONG BERI ARRAY KOSONG []" : 
    "JIKA DOKUMEN KOSONG BERI ARRAY KOSONG []"},
  "difficulty": "${isImageOnlyPDF ? 
    "tidak dapat ditentukan" : 
    "tentukan berdasarkan kompleksitas isi dokumen: mudah/sedang/sulit. JIKA DOKUMEN KOSONG TULIS 'tidak dapat ditentukan'"}",
  "estimatedTime": "${isImageOnlyPDF ? 
    "tidak dapat ditentukan" : 
    "tentukan berdasarkan panjang dan kesulitan dokumen: 'X-Y menit'. JIKA DOKUMEN KOSONG TULIS 'tidak dapat ditentukan'"}",
  "learningObjectives": ["${isImageOnlyPDF ? 
    "Menambahkan deskripsi manual untuk konten gambar" : 
    "tujuan pembelajaran 1 BERDASARKAN ISI DOKUMEN"}", "${isImageOnlyPDF ? 
    "Mengidentifikasi topik utama dari gambar" : 
    "tujuan pembelajaran 2 BERDASARKAN ISI DOKUMEN"}"]. ${isImageOnlyPDF ? 
    "JIKA DOKUMEN KOSONG BERI ARRAY KOSONG []" : 
    "JIKA DOKUMEN KOSONG BERI ARRAY KOSONG []"}
}

PENTING: HASILKAN OUTPUT JSON YANG LENGKAP DAN VALID. HANYA BERIKAN OUTPUT JSON TANPA KATA PENGANTAR TAMBAHAN.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Raw Gemini response:", text.substring(0, 500) + "..."); // Log for debugging
    
    // Check if response contains error indicators
    if (text.includes("DOKUMEN KOSONG") || text.includes("Tidak dapat menganalisis dokumen")) {
      throw new Error("PDF content is empty or unavailable");
    }
    
    // Extract JSON from the response
    let jsonStart = text.indexOf('{');
    let jsonEnd = text.lastIndexOf('}') + 1;
    
    // If the response doesn't start with JSON, try to find the JSON part
    if (jsonStart === -1 || jsonEnd === 0) {
      // Try to find JSON within triple backticks if it exists
      const jsonMatch = text.match(/```json\n?({[\s\S]*?})\n?```/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (parseError) {
          console.error("Could not parse JSON from markdown block:", parseError);
        }
      }
      
      // If we can't find JSON format, try to extract it differently
      const firstCurly = text.indexOf('{');
      const lastCurly = text.lastIndexOf('}');
      if (firstCurly !== -1 && lastCurly !== -1 && lastCurly > firstCurly) {
        jsonStart = firstCurly;
        jsonEnd = lastCurly + 1;
      }
    }
    
    let jsonString = text.substring(jsonStart, jsonEnd);
    
    if (jsonString) {
      // Clean up any potential issues with the JSON string
      jsonString = jsonString.trim();
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.substring(7);
      }
      if (jsonString.endsWith('```')) {
        jsonString = jsonString.substring(0, jsonString.length - 3);
      }
      jsonString = jsonString.trim();
      
      return JSON.parse(jsonString);
    } else {
      throw new Error("Could not parse JSON from Gemini response");
    }
  } catch (error) {
    console.error("Error analyzing PDF content with Gemini:", error);
    
    // Handle 503 Service Unavailable error with retry mechanism
    if (error.message.includes("503") || error.message.includes("Service Unavailable") || error.message.includes("overloaded")) {
      console.warn("Gemini service is temporarily unavailable. Retrying in 2 seconds...");
      
      // Retry once after 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Extract JSON from the response
        let jsonStart = text.indexOf('{');
        let jsonEnd = text.lastIndexOf('}') + 1;
        
        // If the response doesn't start with JSON, try to find the JSON part
        if (jsonStart === -1 || jsonEnd === 0) {
          // Try to find JSON within triple backticks if it exists
          const jsonMatch = text.match(/```json\n?({[\s\S]*?})\n?```/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[1]);
          }
          
          // If we can't find JSON format, try to extract it differently
          const firstCurly = text.indexOf('{');
          const lastCurly = text.lastIndexOf('}');
          if (firstCurly !== -1 && lastCurly !== -1 && lastCurly > firstCurly) {
            jsonStart = firstCurly;
            jsonEnd = lastCurly + 1;
          }
        }
        
        let jsonString = text.substring(jsonStart, jsonEnd);
        
        if (jsonString) {
          // Clean up any potential issues with the JSON string
          jsonString = jsonString.trim();
          if (jsonString.startsWith('```json')) {
            jsonString = jsonString.substring(7);
          }
          if (jsonString.endsWith('```')) {
            jsonString = jsonString.substring(0, jsonString.length - 3);
          }
          jsonString = jsonString.trim();
          
          return JSON.parse(jsonString);
        } else {
          throw new Error("Could not parse JSON from Gemini response");
        }
      } catch (retryError) {
        console.error("Retry failed:", retryError);
        // Fall through to mock response
      }
    }
    
    // Try to generate basic content from text if Gemini is not available
    const sentences = pdfText.substring(0, 1000).split(/[.!?]+/).filter(s => s.trim().length > 10);
    const keyTopics = sentences.slice(0, 3).map(s => s.trim().substring(0, 50) + '...');

    // Return mock response on error but with more useful content
    return {
      summary: isImageOnlyPDF ?
        "PDF ini hanya berisi gambar. Silakan tambahkan deskripsi manual tentang isi dokumen ini untuk membuat ringkasan dan kuis yang sesuai." :
        `Ringkasan: ${sentences[0] || "Konten tidak dapat diekstrak secara lengkap."} ${sentences[1] ? sentences[1] : ""}`,
      keyTopics: isImageOnlyPDF ?
        ["Dokumen Gambar - Perlu Deskripsi Manual"] :
        keyTopics.length > 0 ? keyTopics : ["Tidak dapat mengekstrak topik dari dokumen"],
      difficulty: "menengah",
      estimatedTime: "30-45 menit",
      learningStyleSummary: isImageOnlyPDF ?
        "PDF ini hanya berisi gambar. Silakan tambahkan deskripsi manual tentang isi dokumen ini untuk membuat ringkasan yang disesuaikan dengan gaya belajar Anda." :
        "Ringkasan dari konten PDF disesuaikan berdasarkan isi dokumen.",
      learningObjectives: isImageOnlyPDF ?
        ["Menambahkan deskripsi manual untuk konten gambar", "Mengidentifikasi topik utama dari gambar"] :
        ["Memahami konsep utama", "Mengidentifikasi informasi penting", "Mengaplikasikan pengetahuan"]
    };
  }
};

// Function to generate personalized quiz questions based on learning profile
export const generatePersonalizedQuiz = async (moduleContent, learningProfile, quizType = "review") => {
  const genAI = initializeGemini();
  
  if (!genAI) {
    // Return mock response for development
    return [
      {
        question: "Pertanyaan contoh berdasarkan gaya belajar Anda",
        options: ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
        correctAnswer: 0,
        explanation: "Penjelasan untuk jawaban benar"
      }
    ];
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  // Create a more detailed prompt based on learning profile
  const learningStyle = learningProfile?.learningStyle || "mixed";
  const learningAbility = learningProfile?.ability || 1;
  
  // Adjust question complexity based on learning ability
  let complexityModifier = "";
  if (learningAbility === 0) {
    complexityModifier = "Pertanyaan harus mudah dan langsung pada inti masalah.";
  } else if (learningAbility === 1) {
    complexityModifier = "Pertanyaan harus sedang dengan beberapa langkah berpikir.";
  } else if (learningAbility === 2) {
    complexityModifier = "Pertanyaan harus menengah hingga sulit dengan analisis sederhana.";
  } else if (learningAbility === 3) {
    complexityModifier = "Pertanyaan harus kompleks dengan analisis kritis.";
  }
  
  // Adjust question types based on learning style
  let styleModifier = "";
  switch(learningStyle) {
    case 'visual':
      styleModifier = "Sertakan deskripsi yang membantu membayangkan konsep, gunakan istilah yang mudah divisualisasikan.";
      break;
    case 'aural':
      styleModifier = "Gunakan istilah dan analogi yang mudah diingat dan dipahami secara lisan.";
      break;
    case 'readWrite':
      styleModifier = "Fokus pada istilah kunci dan konsep tertulis, pastikan pertanyaan dan opsi jelas dan terstruktur.";
      break;
    case 'kinesthetic':
      styleModifier = "Gunakan contoh praktis dan skenario aplikatif, hubungkan dengan pengalaman atau tindakan nyata.";
      break;
    default:
      styleModifier = "Gunakan pendekatan seimbang untuk berbagai gaya belajar.";
  }
  
  const prompt = `Sebagai asisten kuis AI untuk platform ELARA, buatkan 5 pertanyaan pilihan ganda yang SESUAI PERSIS dengan KONTEN ASLI MODUL BERIKUT INI:

${styleModifier}

${complexityModifier}

KONTEN ASLI MODUL PEMBELAJARAN (INFORMASI INTI YANG HARUS DIGUNAKAN UNTUK MEMBUAT SOAL):
${moduleContent.substring(0, 4000) || "[KONTEN MODUL KOSONG - TIDAK DAPAT MEMBUAT SOAL]"}

PROFIL BELAJAR SISWA:
- Gaya Belajar: ${learningStyle}
- Kemampuan Awal: ${learningProfile?.ability || 'Tidak dikenal'}/3
- Waktu Fokus: ${learningProfile?.focusTime || 'Tidak dikenal'}
- Tipe Kuis: ${quizType}

PETUNJUK PENTING - BUATLAH SOAL YANG BENAR-BENAR BERDASARKAN INFORMASI DALAM KONTEN MODUL:
1. Semua pertanyaan HARUS merujuk pada konsep, fakta, atau informasi yang secara eksplisit disebutkan dalam konten modul di atas
2. JANGAN membuat soal berdasarkan pengetahuan umum atau asumsi - hanya gunakan informasi dari konten modul
3. Pastikan setiap opsi jawaban (A, B, C, D) berhubungan langsung dengan isi modul
4. Jawaban benar HARUS dapat diverifikasi dari konten modul
5. Hindari soal yang memerlukan inferensi kompleks yang tidak didukung oleh teks modul
6. Buat soal dengan tingkat kesulitan yang bervariasi
7. Sertakan penjelasan yang jelas dan informatif yang mengacu pada isi modul
8. Pastikan pertanyaan menguji pemahaman konsep, bukan hanya hafalan

BERIKAN OUTPUT YANG SANGAT TERSTRUKTUR DALAM FORMAT JSON SEBAGAI BERIKUT:
[
  {
    "question": "pertanyaan yang jelas dan spesifik BERDASARKAN KONTEN MODUL",
    "options": ["Opsi A (harus relevan dengan isi modul)", "Opsi B (harus relevan dengan isi modul)", "Opsi C (harus relevan dengan isi modul)", "Opsi D (harus relevan dengan isi modul)"],
    "correctAnswer": 0-3 (indeks jawaban benar YANG BISA DITEMUKAN DALAM MODUL),
    "explanation": "penjelasan komprehensif BERDASARKAN ISI MODUL mengapa jawaban ini benar, dengan kutipan langsung jika memungkinkan"
  }
]

PENTING: HASILKAN OUTPUT JSON YANG LENGKAP DAN VALID. HANYA BERIKAN OUTPUT JSON TANPA KATA PENGANTAR TAMBAHAN.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Raw quiz response:", text.substring(0, 500) + "..."); // Log for debugging
    
    // Check if response contains error indicators
    if (text.includes("KONTEN MODUL KOSONG") || text.includes("Tidak dapat membuat soal")) {
      throw new Error("Modul content is empty or unavailable");
    }
    
    // Extract JSON from the response
    let jsonStart = text.indexOf('[');
    let jsonEnd = text.lastIndexOf(']') + 1;
    
    // If the response doesn't start with JSON array, try to find the JSON part
    if (jsonStart === -1 || jsonEnd === 0) {
      // Try to find JSON within triple backticks if it exists
      const jsonMatch = text.match(/```json\n?(\[[\s\S]*?\])\n?```/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (parseError) {
          console.error("Could not parse JSON from markdown block:", parseError);
        }
      }
      
      // If we can't find JSON format, try to extract it differently
      const firstBracket = text.indexOf('[');
      const lastBracket = text.lastIndexOf(']');
      if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
        jsonStart = firstBracket;
        jsonEnd = lastBracket + 1;
      }
    }
    
    let jsonString = text.substring(jsonStart, jsonEnd);
    
    if (jsonString) {
      // Clean up any potential issues with the JSON string
      jsonString = jsonString.trim();
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.substring(7);
      }
      if (jsonString.endsWith('```')) {
        jsonString = jsonString.substring(0, jsonString.length - 3);
      }
      jsonString = jsonString.trim();
      
      return JSON.parse(jsonString);
    } else {
      throw new Error("Could not parse JSON from Gemini response");
    }
  } catch (error) {
    console.error("Error generating personalized quiz with Gemini:", error);
    
    // Handle 503 Service Unavailable error with retry mechanism
    if (error.message.includes("503") || error.message.includes("Service Unavailable") || error.message.includes("overloaded")) {
      console.warn("Gemini service is temporarily unavailable. Retrying in 2 seconds...");
      
      // Retry once after 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Extract JSON from the response
        let jsonStart = text.indexOf('[');
        let jsonEnd = text.lastIndexOf(']') + 1;
        
        // If the response doesn't start with JSON array, try to find the JSON part
        if (jsonStart === -1 || jsonEnd === 0) {
          // Try to find JSON within triple backticks if it exists
          const jsonMatch = text.match(/```json\n?(\[[\s\S]*?\])\n?```/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[1]);
          }
          
          // If we can't find JSON format, try to extract it differently
          const firstBracket = text.indexOf('[');
          const lastBracket = text.lastIndexOf(']');
          if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
            jsonStart = firstBracket;
            jsonEnd = lastBracket + 1;
          }
        }
        
        let jsonString = text.substring(jsonStart, jsonEnd);
        
        if (jsonString) {
          // Clean up any potential issues with the JSON string
          jsonString = jsonString.trim();
          if (jsonString.startsWith('```json')) {
            jsonString = jsonString.substring(7);
          }
          if (jsonString.endsWith('```')) {
            jsonString = jsonString.substring(0, jsonString.length - 3);
          }
          jsonString = jsonString.trim();
          
          return JSON.parse(jsonString);
        } else {
          throw new Error("Could not parse JSON from Gemini response");
        }
      } catch (retryError) {
        console.error("Retry failed:", retryError);
        // Fall through to mock response
      }
    }
    
    // Generate more meaningful quiz questions based on module content as fallback
    const sentences = moduleContent.substring(0, 2000).split(/[.!?]+/).filter(s => s.trim().length > 15);
    const words = moduleContent.split(/\s+/).filter(word => word.length > 4);

    if (sentences.length === 0) {
      // If no sentences found, return basic example questions
      return [
        {
          question: "Apa topik utama dari modul ini?",
          options: ["Topik tidak dapat ditentukan", "Informasi tidak tersedia", "Perlu diupload ulang", "Konten tidak dapat diproses"],
          correctAnswer: 0,
          explanation: "Konten modul tidak dapat diproses untuk membuat kuis. Silakan coba upload ulang."
        }
      ];
    }

    // Generate quiz based on actual content
    const quizQuestions = [];
    const numQuestions = Math.min(5, sentences.length);

    for (let i = 0; i < numQuestions; i++) {
      const sentence = sentences[i];
      const sentenceWords = sentence.split(/\s+/).filter(word => word.length > 3);

      if (sentenceWords.length > 3) {
        // Select a random word to be the answer
        const answerIndex = Math.floor(Math.random() * Math.min(sentenceWords.length, 10));
        const answer = sentenceWords[answerIndex];

        // Create a question by replacing the answer word with blank
        const questionText = sentence.replace(new RegExp('\\b' + answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi'), '...');

        // Create options
        const options = [answer];

        // Add 3 distractor options from the same content
        while (options.length < 4 && words.length > options.length) {
          const randomWord = words[Math.floor(Math.random() * words.length)];
          if (!options.includes(randomWord) && randomWord !== answer) {
            options.push(randomWord);
          }
        }

        // Fill remaining options with generic options if needed
        const genericOptions = ["Opsi A", "Opsi B", "Opsi C", "Opsi D"];
        while (options.length < 4) {
          const randomGeneric = genericOptions[Math.floor(Math.random() * genericOptions.length)];
          if (!options.includes(randomGeneric)) {
            options.push(randomGeneric);
          }
        }

        // Shuffle options
        for (let j = options.length - 1; j > 0; j--) {
          const k = Math.floor(Math.random() * (j + 1));
          [options[j], options[k]] = [options[k], options[j]];
        }

        // Find the correct answer index after shuffling
        const correctAnswerIndex = options.indexOf(answer);

        quizQuestions.push({
          question: questionText + '?',
          options: options,
          correctAnswer: correctAnswerIndex,
          explanation: "Pertanyaan dibuat berdasarkan konten modul untuk menguji pemahaman Anda."
        });
      }
    }

    if (quizQuestions.length === 0) {
      // Fallback to example questions if content-based generation fails
      return [
        {
          question: "Pertanyaan contoh berdasarkan gaya belajar Anda",
          options: ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
          correctAnswer: 0,
          explanation: "Penjelasan untuk jawaban benar"
        }
      ];
    }

    return quizQuestions;
  }
};

// Function to provide real-time learning assistance
export const getLearningAssistance = async (question, context) => {
  const genAI = initializeGemini();

  if (!genAI) {
    // Return mock response for development
    return "Mohon maaf, layanan AI sedang tidak tersedia. Silakan coba lagi nanti.";
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Sebagai AI Tutor dalam sistem pembelajaran adaptif, jawab pertanyaan siswa berikut berdasarkan konteks yang tersedia:

  Pertanyaan Siswa: ${question}

  Konteks Pembelajaran: ${context}

  Jawab dengan bahasa yang mudah dimengerti dan sesuaikan dengan gaya belajar siswa. Berikan penjelasan yang mendalam namun ringkas.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error getting learning assistance with Gemini:", error);
    return "Mohon maaf, layanan AI sedang tidak tersedia. Silakan coba lagi nanti.";
  }
};

// Function to check if the API key is valid
export const checkGeminiAPIKey = async () => {
  const genAI = initializeGemini();

  if (!genAI) {
    return { success: false, message: "API key tidak ditemukan atau tidak valid" };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Send a simple test request
    const result = await model.generateContent("Hai, apakah API berfungsi? Jawab singkat saja.");
    const response = await result.response;
    const text = response.text();

    if (text && text.length > 0) {
      return { success: true, message: "API key valid dan berfungsi" };
    } else {
      return { success: false, message: "API key diterima tetapi tidak menghasilkan respon" };
    }
  } catch (error) {
    console.error("Error checking API key:", error);
    return { success: false, message: `API key bermasalah: ${error.message || 'Kesalahan tidak diketahui'}` };
  }
};

// Function to extract text from images in PDF using Gemini AI
export const extractTextFromImages = async (file) => {
  // Return mock response for development to prevent recursion
  console.warn('extractTextFromImages: Returning mock response to prevent recursion');
  return {
    extractedText: "",
    imageDescriptions: [],
    overallDescription: "Fitur ekstraksi teks dari gambar sedang dalam pengembangan.",
    message: "Sistem belum mendukung ekstraksi teks langsung dari gambar PDF. Silakan tambahkan deskripsi manual untuk isi dokumen ini."
  };
};