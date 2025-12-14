// components/PDFViewer.js
import React, { useState, useEffect, useRef } from 'react';
import { handlePDFError, initializePDFJS } from '../config/pdfConfig';

const PDFViewer = ({ file, onPageChange = null, className = '' }) => {
  const canvasRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfDocument, setPdfDocument] = useState(null);

  // Inisialisasi PDF.js
  useEffect(() => {
    initializePDFJS();
  }, []);

  // Load PDF
  useEffect(() => {
    let isCancelled = false;

    const loadPDF = async () => {
      if (!file) return;

      setIsLoading(true);
      setError(null);

      try {
        const { getDocument } = await import('pdfjs-dist');
        const typedarray = await file.arrayBuffer();

        // Load PDF document
        const loadingTask = getDocument({
          data: typedarray,
          useWorkerFetch: false,
          isEvalSupported: false,
          disableFontFace: false, // Tetap aktif untuk rendering teks yang lebih baik
        });

        loadingTask.onProgress = (progressData) => {
          // Update progress jika diperlukan
        };

        const pdf = await loadingTask.promise;

        if (!isCancelled) {
          setPdfDocument(pdf);
          setTotalPages(pdf.numPages);
        }
      } catch (err) {
        if (!isCancelled) {
          try {
            handlePDFError(err);
            setError('Gagal memuat PDF: ' + err.message);
          } catch (handlingError) {
            // Jika error handling gagal, tampilkan error asli
            setError('Gagal memuat PDF: ' + err.message);
          }
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadPDF();

    // Cleanup
    return () => {
      isCancelled = true;
      if (pdfDocument) {
        pdfDocument.destroy();
      }
    };
  }, [file]);

  // Render page
  useEffect(() => {
    let isCancelled = false;

    const renderPage = async () => {
      if (!pdfDocument || !canvasRef.current || isCancelled) return;

      try {
        const page = await pdfDocument.getPage(currentPage);
        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch (err) {
        if (!isCancelled) {
          try {
            handlePDFError(err);
            setError('Gagal merender halaman: ' + err.message);
          } catch (handlingError) {
            setError('Gagal merender halaman: ' + err.message);
          }
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
    };
  }, [pdfDocument, currentPage]);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      if (onPageChange) onPageChange(newPage);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      if (onPageChange) onPageChange(newPage);
    }
  };

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="text-red-700 font-medium">Error PDF:</div>
        <div className="text-red-600 text-sm mt-1">{error}</div>
        <div className="text-red-600 text-xs mt-2">
          Coba file PDF lain atau konversi ke format teks (TXT) untuk kompatibilitas lebih baik.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3"></div>
        <p className="text-gray-600">Memuat PDF...</p>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Halaman {currentPage} dari {totalPages}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage <= 1}
            className={`px-3 py-1 text-sm rounded ${
              currentPage <= 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            Sebelumnya
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage >= totalPages}
            className={`px-3 py-1 text-sm rounded ${
              currentPage >= totalPages
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            Berikutnya
          </button>
        </div>
      </div>
      <div className="p-4 flex justify-center bg-gray-50">
        <canvas ref={canvasRef} className="max-w-full h-auto" />
      </div>
    </div>
  );
};

export default PDFViewer;