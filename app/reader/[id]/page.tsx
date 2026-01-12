"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PdfViewerClient from "@/components/PdfViewerClient"; // Import PdfViewerClient directly
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Book data - In a real app, this would come from a database/API
// GitHub Raw URL Format: https://raw.githubusercontent.com/USERNAME/REPO/master/FILENAME.pdf
const bookData: Record<string, { title: string; pdfUrl: string; author: string }> = {
  "1": {
    title: "Anta Mahboobi",
    author: "Makhdoom Jameel Zaman",
    pdfUrl: "https://raw.githubusercontent.com/anees-dahot/talib-ul-mola-pdfs/d44c608d4919ac422a4304c8f3ce3f9e15d8589c/sample.pdf",
  },
  "2": {
    title: "The Genealogies (Al-Ansab)",
    author: "Makhdoom Jameel Zaman",
    pdfUrl: "https://raw.githubusercontent.com/anees-dahot/talib-ul-mola-pdfs/d44c608d4919ac422a4304c8f3ce3f9e15d8589c/sample.pdf",
  },
  "3": {
    title: "The Days & Dates",
    author: "Makhdoom Jamil Zaman",
    pdfUrl: "https://raw.githubusercontent.com/anees-dahot/talib-ul-mola-pdfs/d44c608d4919ac422a4304c8f3ce3f9e15d8589c/sample.pdf",
  },
  "4": {
    title: "Tazkirah Hazrat Abu Najeeb",
    author: "Moulana Hussain Miyan Sahib",
    pdfUrl: "https://raw.githubusercontent.com/anees-dahot/talib-ul-mola-pdfs/d44c608d4919ac422a4304c8f3ce3f9e15d8589c/sample.pdf",
  },
  "5": {
    title: "Hazar Siddiq Akbar",
    author: "Makhdoom Jameel Zaman",
    pdfUrl: "https://raw.githubusercontent.com/anees-dahot/talib-ul-mola-pdfs/d44c608d4919ac422a4304c8f3ce3f9e15d8589c/sample.pdf",
  },
  "6": {
    title: "Chaudahween Sadi Ja Barg Aalim",
    author: "Mufti Abdul Wahab Chachar",
    pdfUrl: "https://raw.githubusercontent.com/anees-dahot/talib-ul-mola-pdfs/d44c608d4919ac422a4304c8f3ce3f9e15d8589c/sample.pdf",
  },
};

export default function ReaderPage() {
  const router = useRouter();
  const params = useParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const bookId = params?.id as string;
  const book = bookData[bookId];

  // Check if book exists
  if (!book) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h1 className="text-xl font-semibold text-gray-800 mb-2">
              Book Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The book you're looking for doesn't exist in our library.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-600 transition-colors font-medium"
            >
              Back to Library
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-20">
        <h1 className="text-center text-3xl font-heading font-bold text-brand-900 my-8">
          {book.title}
        </h1>
        {mounted && (
          <PdfViewerClient
            pdfUrl={book.pdfUrl}
            bookId={bookId}
          />
        )}
        {!mounted && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto mb-2"></div>
              <p className="text-gray-500 text-sm">Initializing reader...</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
