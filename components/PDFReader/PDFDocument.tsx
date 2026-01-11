"use client";

import { useEffect, useState } from "react";

interface PDFDocumentProps {
  file: string;
  onLoadSuccess: (data: { numPages: number }) => void;
  onLoadError: (error: Error) => void;
  currentPage: number;
  scale: number;
  children?: React.ReactNode;
}

export default function PDFDocument({
  file,
  onLoadSuccess,
  onLoadError,
  currentPage,
  scale,
  children,
}: PDFDocumentProps) {
  const [PdfComponents, setPdfComponents] = useState<{
    Document: React.ComponentType<any>;
    Page: React.ComponentType<any>;
  } | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadPdfLibrary = async () => {
      try {
        // Dynamically import react-pdf
        const pdfModule = await import("react-pdf");

        // Set up the worker
        pdfModule.pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url
        ).toString();

        // Import styles
        await import("react-pdf/dist/Page/AnnotationLayer.css");
        await import("react-pdf/dist/Page/TextLayer.css");

        if (mounted) {
          setPdfComponents({
            Document: pdfModule.Document,
            Page: pdfModule.Page,
          });
          setIsReady(true);
        }
      } catch (error) {
        console.error("Failed to load PDF library:", error);
        if (mounted) {
          onLoadError(error as Error);
        }
      }
    };

    loadPdfLibrary();

    return () => {
      mounted = false;
    };
  }, [onLoadError]);

  if (!isReady || !PdfComponents) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">Loading PDF viewer...</p>
        </div>
      </div>
    );
  }

  const { Document, Page } = PdfComponents;

  return (
    <Document
      file={file}
      onLoadSuccess={onLoadSuccess}
      onLoadError={onLoadError}
      loading=""
    >
      <Page
        pageNumber={currentPage}
        scale={scale}
        renderTextLayer={true}
        renderAnnotationLayer={true}
      />
      {children}
    </Document>
  );
}
