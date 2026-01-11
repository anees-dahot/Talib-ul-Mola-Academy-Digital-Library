"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect, useCallback, useRef } from "react";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// 🔥 Use MJS worker (required for Next 15)
pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Highlight {
  id: string;
  page: number;
  text: string;
}

interface Comment {
  id: string;
  page: number;
  textSelection: string; // The text the comment is attached to
  commentText: string;
}

interface PdfViewerInnerProps {
  pdfUrl: string;
  bookId: string;
}

export default function PdfViewerInner({ pdfUrl, bookId }: PdfViewerInnerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [comments, setComments] = useState<Comment[]>([]); // New state for comments
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  const localStorageProgressKey = `pdf_progress_${bookId}`;
  const localStorageHighlightsKey = `pdf_highlights_${bookId}`;
  const localStorageCommentsKey = `pdf_comments_${bookId}`; // New key for comments

  // --- Resume Reading Logic & Initial Data Load ---
  useEffect(() => {
    if (typeof window !== "undefined" && bookId) {
      const savedPage = localStorage.getItem(localStorageProgressKey);
      if (savedPage) {
        setPageNumber(parseInt(savedPage, 10));
      }
      const savedHighlights = localStorage.getItem(localStorageHighlightsKey);
      if (savedHighlights) {
        setHighlights(JSON.parse(savedHighlights));
      }
      const savedComments = localStorage.getItem(localStorageCommentsKey); // Load comments
      if (savedComments) {
        setComments(JSON.parse(savedComments));
      }
    }
  }, [bookId, localStorageProgressKey, localStorageHighlightsKey, localStorageCommentsKey]);

  useEffect(() => {
    if (typeof window !== "undefined" && bookId && pageNumber) {
      localStorage.setItem(localStorageProgressKey, pageNumber.toString());
    }
  }, [pageNumber, bookId, localStorageProgressKey]);
  // --- End Resume Reading Logic ---

  // --- Highlighting Logic ---
  const handleHighlightSelection = useCallback(() => {
    if (typeof window === "undefined") return;

    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (selectedText && selectedText.length > 0) {
      const newHighlight: Highlight = {
        id: crypto.randomUUID(),
        page: pageNumber,
        text: selectedText,
      };
      setHighlights((prev) => {
        const updatedHighlights = [...prev, newHighlight];
        localStorage.setItem(localStorageHighlightsKey, JSON.stringify(updatedHighlights));
        return updatedHighlights;
      });
      selection?.removeAllRanges();
    }
  }, [pageNumber, localStorageHighlightsKey]);
  // --- End Highlighting Logic ---

  // --- Commenting Logic ---
  const handleAddComment = useCallback(() => {
    if (typeof window === "undefined") return;

    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (selectedText && selectedText.length > 0) {
      const commentInput = prompt(`Enter your comment for: "${selectedText.substring(0, 50)}..."`);
      if (commentInput !== null && commentInput.trim().length > 0) {
        const newComment: Comment = {
          id: crypto.randomUUID(),
          page: pageNumber,
          textSelection: selectedText,
          commentText: commentInput.trim(),
        };
        setComments((prev) => {
          const updatedComments = [...prev, newComment];
          localStorage.setItem(localStorageCommentsKey, JSON.stringify(updatedComments));
          return updatedComments;
        });
        selection?.removeAllRanges();
      }
    } else {
      alert("Please select some text to add a comment.");
    }
  }, [pageNumber, localStorageCommentsKey]);
  // --- End Commenting Logic ---


  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setPageNumber((prevPage) => Math.min(prevPage, numPages));
  }, []);

  const onDocumentLoadError = useCallback((err: Error) => {
    console.error("Failed to load PDF", err);
    setError("Failed to load PDF. Please try again.");
    setLoading(false);
  }, []);

  const goToPrevPage = useCallback(() => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages || 1));
  }, [numPages]);

  if (!pdfUrl) {
    return <p className="text-red-500 text-center py-8">PDF not available</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center py-8">{error}</p>;
  }

  return (
    <div className="flex flex-col items-center p-4">
      {loading && <p className="text-gray-600">Loading PDF...</p>}

      <div className="flex items-center justify-center space-x-4 mb-4">
        <button
          onClick={goToPrevPage}
          disabled={pageNumber <= 1}
          className="btn-secondary px-4 py-2"
        >
          Previous
        </button>
        <p className="text-lg font-medium text-brand-900">
          Page {pageNumber} of {numPages || "--"}
        </p>
        <button
          onClick={goToNextPage}
          disabled={pageNumber >= (numPages || 1)}
          className="btn-secondary px-4 py-2"
        >
          Next
        </button>
        <button
          onClick={handleHighlightSelection}
          className="btn-primary px-4 py-2 ml-4"
        >
          Highlight Selection
        </button>
        <button
          onClick={handleAddComment}
          className="btn-primary px-4 py-2 ml-2"
        >
          Add Comment
        </button>
      </div>

      <div ref={pdfContainerRef} className="w-full max-w-4xl border border-gray-300 shadow-lg rounded-lg overflow-hidden relative">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          className="flex justify-center"
          loading=""
        >
          <Page
            pageNumber={pageNumber}
            width={Math.min(window.innerWidth * 0.9, 800)}
            onRenderSuccess={() => setLoading(false)}
          />
        </Document>

        {/* Display highlights in a simple list for now */}
        {(highlights.filter(h => h.page === pageNumber).length > 0 || comments.filter(c => c.page === pageNumber).length > 0) && (
          <div className="absolute top-0 right-0 p-2 bg-white bg-opacity-80 border-l border-b border-gray-200 z-10 max-h-48 overflow-y-auto w-64">
            <h3 className="font-semibold mb-1">Annotations on this page:</h3>
            {highlights.filter(h => h.page === pageNumber).length > 0 && (
              <>
                <h4 className="text-sm font-medium mt-2">Highlights:</h4>
                <ul className="text-sm list-disc pl-4">
                  {highlights.filter(h => h.page === pageNumber).map(h => (
                    <li key={h.id} className="mb-1 p-1 bg-yellow-100 rounded">
                      "{h.text.substring(0, Math.min(h.text.length, 50))}..."
                    </li>
                  ))}
                </ul>
              </>
            )}
            {comments.filter(c => c.page === pageNumber).length > 0 && (
              <>
                <h4 className="text-sm font-medium mt-2">Comments:</h4>
                <ul className="text-sm list-disc pl-4">
                  {comments.filter(c => c.page === pageNumber).map(c => (
                    <li key={c.id} className="mb-1 p-1 bg-blue-100 rounded">
                      <p className="font-semibold">"{c.textSelection.substring(0, Math.min(c.textSelection.length, 30))}..."</p>
                      <p className="text-xs">{c.commentText.substring(0, Math.min(c.commentText.length, 50))}...</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
