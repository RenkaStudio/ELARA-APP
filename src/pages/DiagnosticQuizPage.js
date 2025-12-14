import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

const DiagnosticQuizPage = () => {
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

  // Kuis diagnostik berdasarkan model VARK (Visual, Aural, Read/Write, Kinesthetic)
  const diagnosticQuiz = [
    {
      id: 1,
      question: "Saat belajar, saya lebih suka menggunakan?",
      options: [
        "Gambar, diagram, bagan, dan peta konsep",
        "Mendengarkan penjelasan atau diskusi",
        "Membaca teks dan mengambil catatan tertulis",
        "Langsung mencoba atau mempraktikkan konsep yang dipelajari"
      ],
      type: "vark"
    },
    {
      id: 2,
      question: "Untuk memahami informasi baru, saya sering?",
      options: [
        "Membuat atau menggunakan visual seperti sketsa atau diagram",
        "Mendiskusikan topik dengan orang lain atau menjelaskan dengan kata-kata",
        "Menulis ulang atau membuat catatan terperinci",
        "Mengerjakan latihan langsung atau menangani contoh nyata"
      ],
      type: "vark"
    },
    {
      id: 3,
      question: "Saat memecahkan masalah, saya cenderung?",
      options: [
        "Membayangkan atau menggambarkan situasi dalam bentuk visual",
        "Berbicara pada diri sendiri atau membicarakan langkah-langkah dengan orang lain",
        "Membaca instruksi secara rinci dan menuliskan langkah-langkah",
        "Mencoba secara langsung dan belajar sambil praktik"
      ],
      type: "vark"
    },
    {
      id: 4,
      question: "Dalam lingkungan belajar, saya paling produktif saat?",
      options: [
        "Ada elemen visual yang jelas seperti grafik, video, atau demonstrasi",
        "Ada diskusi, ceramah, atau penjelasan lisan",
        "Saya bisa membaca materi secara tertulis atau mencatat",
        "Saya bisa terlibat dalam aktivitas fisik atau praktik"
      ],
      type: "vark"
    },
    {
      id: 5,
      question: "Ketika harus mengingat sesuatu, saya biasanya?",
      options: [
        "Mengingatnya dalam bentuk gambar atau visual",
        "Mengingatnya dalam bentuk suara atau pembicaraan",
        "Mengingatnya dalam bentuk teks tertulis",
        "Mengingatnya melalui gerakan atau pengalaman fisik"
      ],
      type: "vark"
    },
    {
      id: 6,
      question: "Saya lebih baik dalam memahami instruksi jika?",
      options: [
        "Disertai dengan gambar atau demonstrasi visual",
        "Dijelaskan secara lisan atau didiskusikan",
        "Ditulis secara rinci dan langkah-demi-langkah",
        "Saya bisa mencoba langsung atau melihat contoh nyata"
      ],
      type: "vark"
    },
    {
      id: 7,
      question: "Dalam proyek kelompok, saya biasanya berkontribusi dengan?",
      options: [
        "Membuat presentasi visual atau bagan",
        "Menjadi pembicara atau fasilitator diskusi",
        "Menulis laporan atau dokumentasi",
        "Melakukan aktivitas praktis atau eksperimen"
      ],
      type: "vark"
    },
    {
      id: 8,
      question: "Seberapa baik kamu mengenal konsep dasar pada mata kuliah ini?",
      options: [
        "Sangat tidak tahu",
        "Kurang tahu",
        "Cukup tahu",
        "Sangat tahu"
      ],
      type: "ability"
    },
    {
      id: 9,
      question: "Berapa lama kamu biasanya bisa fokus belajar dalam satu sesi?",
      options: [
        "Kurang dari 15 menit",
        "15-30 menit",
        "30-45 menit",
        "Lebih dari 45 menit"
      ],
      type: "focus"
    },
    {
      id: 10,
      question: "Metode evaluasi yang paling kamu sukai?",
      options: [
        "Ujian tertulis/essay",
        "Presentasi lisan",
        "Ujian objektif/pilihan ganda",
        "Proyek praktik/penilaian kinerja"
      ],
      type: "assessment"
    },
    {
      id: 11,
      question: "Seberapa cepat kamu biasanya memahami konsep baru?",
      options: [
        "Sangat cepat",
        "Cepat",
        "Agak lambat",
        "Sangat lambat"
      ],
      type: "pace"
    },
    {
      id: 12,
      question: "Kamu lebih suka belajar dalam?",
      options: [
        "Sesi singkat tapi sering",
        "Sesi panjang seminggu sekali",
        "Sesi sedang dengan frekuensi sedang",
        "Tergantung suasana hati"
      ],
      type: "frequency"
    },
    {
      id: 13,
      question: "Ketika menghadapi konsep yang sulit, kamu cenderung?",
      options: [
        "Mencari ilustrasi atau gambar terkait",
        "Mendiskusikan dengan teman atau dosen",
        "Membaca ulang dan mencari penjelasan tertulis",
        "Mencoba langsung dengan contoh atau latihan"
      ],
      type: "problemSolving"
    },
    {
      id: 14,
      question: "Seberapa penting kamu merasa perlu memahami dasar-dasar sebelum ke topik lanjutan?",
      options: [
        "Sangat penting",
        "Cukup penting",
        "Agak penting",
        "Tidak terlalu penting"
      ],
      type: "foundational"
    },
    {
      id: 15,
      question: "Kamu lebih suka belajar dengan?",
      options: [
        "Menonton video pembelajaran",
        "Mendengarkan podcast atau rekaman kuliah",
        "Membaca buku teks atau modul",
        "Melakukan eksperimen atau simulasi"
      ],
      type: "preference"
    }
  ];

  const handleAnswer = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = {
      questionId: currentQuestion + 1,
      answerIndex: optionIndex,
      answer: diagnosticQuiz[currentQuestion].options[optionIndex]
    };
    
    setAnswers(newAnswers);

    if (currentQuestion < diagnosticQuiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Proses hasil kuis dan simpan data profil pembelajaran
      processDiagnosticResults(newAnswers);
      setShowResult(true);
    }
  };

  const processDiagnosticResults = (answers) => {
    // Inisialisasi skor untuk gaya belajar VARK
    const scores = {
      visual: 0,
      aural: 0,
      readWrite: 0,
      kinesthetic: 0
    };

    // Analisis jawaban untuk menentukan profil belajar
    const learningProfile = {
      learningStyle: "",
      learningStyleDetail: {},
      ability: 0,
      focusTime: "",
      problemSolving: "",
      learningPace: "",
      frequency: "",
      assessment: "",
      foundational: "",
      preference: ""
    };

    // Mapping jawaban ke profil belajar berdasarkan VARK model
    answers.forEach((answer, index) => {
      const question = diagnosticQuiz[index];
      const answerText = answer.answer;
      
      if (question.type === "vark") {
        // Menambahkan skor berdasarkan jawaban VARK
        if (index === 0 || index === 1 || index === 2 || index === 3 || index === 4 || index === 5 || index === 6) {
          const visualAnswers = [
            "Gambar, diagram, bagan, dan peta konsep",
            "Membuat atau menggunakan visual seperti sketsa atau diagram", 
            "Membayangkan atau menggambarkan situasi dalam bentuk visual",
            "Ada elemen visual yang jelas seperti grafik, video, atau demonstrasi",
            "Mengingatnya dalam bentuk gambar atau visual",
            "Disertai dengan gambar atau demonstrasi visual",
            "Membuat presentasi visual atau bagan"
          ];
          
          const auralAnswers = [
            "Mendengarkan penjelasan atau diskusi",
            "Mendiskusikan topik dengan orang lain atau menjelaskan dengan kata-kata",
            "Berbicara pada diri sendiri atau membicarakan langkah-langkah dengan orang lain",
            "Ada diskusi, ceramah, atau penjelasan lisan",
            "Mengingatnya dalam bentuk suara atau pembicaraan",
            "Dijelaskan secara lisan atau didiskusikan",
            "Menjadi pembicara atau fasilitator diskusi"
          ];
          
          const readWriteAnswers = [
            "Membaca teks dan mengambil catatan tertulis",
            "Menulis ulang atau membuat catatan terperinci",
            "Membaca instruksi secara rinci dan menuliskan langkah-langkah",
            "Saya bisa membaca materi secara tertulis atau mencatat",
            "Mengingatnya dalam bentuk teks tertulis",
            "Ditulis secara rinci dan langkah-demi-langkah",
            "Menulis laporan atau dokumentasi"
          ];
          
          const kinestheticAnswers = [
            "Langsung mencoba atau mempraktikkan konsep yang dipelajari",
            "Mengerjakan latihan langsung atau menangani contoh nyata",
            "Mencoba secara langsung dan belajar sambil praktik",
            "Saya bisa terlibat dalam aktivitas fisik atau praktik",
            "Mengingatnya melalui gerakan atau pengalaman fisik",
            "Saya bisa mencoba langsung atau melihat contoh nyata",
            "Melakukan aktivitas praktis atau eksperimen"
          ];
          
          if (visualAnswers.includes(answerText)) {
            scores.visual++;
          } else if (auralAnswers.includes(answerText)) {
            scores.aural++;
          } else if (readWriteAnswers.includes(answerText)) {
            scores.readWrite++;
          } else if (kinestheticAnswers.includes(answerText)) {
            scores.kinesthetic++;
          }
        }
      } else {
        // Mapping jawaban non-VARK
        switch (question.type) {
          case "ability":
            const abilityMap = {
              "Sangat tidak tahu": 0,
              "Kurang tahu": 1,
              "Cukup tahu": 2,
              "Sangat tahu": 3
            };
            learningProfile.ability = abilityMap[answerText] || 0;
            break;
            
          case "focus":
            learningProfile.focusTime = answerText;
            break;
            
          case "problemSolving":
            const problemMap = {
              "Mencari ilustrasi atau gambar terkait": "visual",
              "Mendiskusikan dengan teman atau dosen": "aural", 
              "Membaca ulang dan mencari penjelasan tertulis": "readWrite",
              "Mencoba langsung dengan contoh atau latihan": "kinesthetic"
            };
            learningProfile.problemSolving = problemMap[answerText] || "mixed";
            break;
            
          case "pace":
            learningProfile.learningPace = answerText;
            break;
            
          case "frequency":
            learningProfile.frequency = answerText;
            break;
            
          case "assessment":
            learningProfile.assessment = answerText;
            break;
            
          case "foundational":
            learningProfile.foundational = answerText;
            break;
            
          case "preference":
            const prefMap = {
              "Menonton video pembelajaran": "visual",
              "Mendengarkan podcast atau rekaman kuliah": "aural",
              "Membaca buku teks atau modul": "readWrite",
              "Melakukan eksperimen atau simulasi": "kinesthetic"
            };
            learningProfile.preference = prefMap[answerText] || "mixed";
            break;
            
          default:
            // Handle any unknown question types
            break;
        }
      }
    });

    // Menentukan gaya belajar utama berdasarkan skor tertinggi
    const maxScore = Math.max(scores.visual, scores.aural, scores.readWrite, scores.kinesthetic);
    
    // Menyimpan detail skor
    learningProfile.learningStyleDetail = {
      visual: scores.visual,
      aural: scores.aural,
      readWrite: scores.readWrite,
      kinesthetic: scores.kinesthetic
    };

    // Menentukan gaya belajar utama
    if (scores.visual === maxScore && scores.visual > 0) {
      learningProfile.learningStyle = "visual";
    } else if (scores.aural === maxScore && scores.aural > 0) {
      learningProfile.learningStyle = "aural";
    } else if (scores.readWrite === maxScore && scores.readWrite > 0) {
      learningProfile.learningStyle = "readWrite";
    } else if (scores.kinesthetic === maxScore && scores.kinesthetic > 0) {
      learningProfile.learningStyle = "kinesthetic";
    } else {
      // Jika skor sama atau terlalu rendah, tetapkan default
      learningProfile.learningStyle = "mixed";
    }

    // Simpan profil belajar ke localStorage
    localStorage.setItem('learningProfile', JSON.stringify(learningProfile));
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  };

  const finishDiagnostic = () => {
    // Hentikan TTS jika sedang berjalan
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    navigate('/upload');
  };

  const goBackToDashboard = () => {
    // Hentikan TTS jika sedang berjalan
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    navigate('/dashboard');
  };

  return (
    <div className="bg-bg-light min-h-screen font-poppins">
      <header className="bg-bg-card shadow-sm border-b border-border-color">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Kuis Diagnostik ELARA</h1>
          <button 
            onClick={goBackToDashboard} 
            className="text-primary hover:text-accent transition-colors flex items-center gap-2"
          >
            <FaArrowLeft style={{ width: 20, height: 20 }} />
            <span>Kembali ke Dashboard</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto p-6 flex justify-center">
        <div className="w-full max-w-3xl">
          {!showResult ? (
            <div className="bg-bg-card p-8 rounded-xl shadow-soft border border-border-color">
              <div className="mb-6">
                <p className="text-text-light">Pertanyaan {currentQuestion + 1} dari {diagnosticQuiz.length}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${((currentQuestion + 1) / diagnosticQuiz.length) * 100}%` }} 
                  ></div>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-text-dark mb-6 min-h-[6rem]">
                {diagnosticQuiz[currentQuestion].question}
              </h2>
              
              <div className="space-y-4">
                {diagnosticQuiz[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors duration-300 ${answers[currentQuestion]?.answerIndex === index ? 'bg-blue-100 border-primary' : 'bg-bg-card hover:bg-blue-50 border-border-color'}`}
                  >
                    <span className="font-semibold">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-bg-card p-8 rounded-xl shadow-soft border border-border-color text-center">
              <div className="flex justify-center mb-6">
                <FaCheckCircle className="text-success" style={{ width: 64, height: 64 }} />
              </div>
              
              <h2 className="text-3xl font-bold text-text-dark mb-4">Kuis Diagnostik Selesai!</h2>
              <p className="text-text-light mb-8">
                Terima kasih telah menyelesaikan kuis diagnostik ELARA. 
                Profil gaya belajar kamu telah kami simpan dan akan digunakan untuk menyesuaikan pengalaman belajar kamu.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={restartQuiz}
                  className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Ulangi Kuis
                </button>
                <button 
                  onClick={finishDiagnostic}
                  className="bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Lanjut ke Upload Modul
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DiagnosticQuizPage;