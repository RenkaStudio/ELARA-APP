# ELARA (E-Learning Adaptive Recommendation Assistant)

ELARA adalah platform pembelajaran adaptif berbasis kecerdasan buatan yang dirancang untuk mahasiswa Universitas Terbuka. Aplikasi ini menyesuaikan materi dan pengalaman belajar dengan gaya belajar unik setiap pengguna.

## Teknologi

- **Frontend:** React (v19.2.0) dengan Tailwind CSS
- **Routing:** React Router DOM
- **AI Integration:** Google Generative AI SDK
- **File Processing:** pdfjs-dist, mammoth
- **Icons:** Lucide React

## Fitur Utama

- Dashboard terorganisir dengan menu terpisah
- Personalisasi pembelajaran berdasarkan gaya belajar
- Upload modul (PDF, DOCX, DOC, TXT)
- Kuis diagnostik untuk identifikasi gaya belajar
- Rekomendasi AI berdasarkan profil pengguna
- Manajemen modul pembelajaran
- To-Do List harian
- Statistik progres belajar

## Instalasi

1. Clone atau buka direktori proyek
2. Install dependensi:
   ```bash
   npm install
   ```
3. Buat file `.env` dengan API key:
   ```
   REACT_APP_GEMINI_API_KEY=your_api_key_here
   ```
4. Jalankan aplikasi:
   ```bash
   npm start
   ```

Aplikasi akan terbuka di [http://localhost:3000](http://localhost:3000)

## Penggunaan

1. Buka aplikasi dan klik tombol **"Masuk ke ELARA"**
2. Gunakan kredensial default:
   - **NIM:** `123456789`
   - **Password:** `123456789`
3. Setelah login, Anda akan diarahkan ke dasbor
4. Gunakan menu sidebar untuk mengakses berbagai fitur:
   - Ringkasan progres
   - Profil belajar
   - Rekomendasi AI
   - Upload modul
   - To-Do list

## Struktur Proyek

```
src/
├── components/          # Komponen UI
├── config/              # Konfigurasi aplikasi
├── context/             # Context API
├── pages/               # Halaman aplikasi
└── utils/               # Fungsi utilitas
```

## Konfigurasi

- **API Key:** Tambahkan `REACT_APP_GEMINI_API_KEY` di file `.env`
- **Error Handling PDF:** Termasuk konfigurasi khusus untuk menangani error font PDF

## Kepanjangan

**ELARA** = **E-Learning Adaptive Recommendation Assistant**

## Lisensi

Capstone Project - Universitas Terbuka © 2025