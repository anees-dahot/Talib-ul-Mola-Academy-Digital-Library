"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Use CDN worker for compatibility with external PDFs
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Store positions as percentage of page dimensions for zoom resistance
interface HighlightRect {
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width: number; // percentage (0-100)
  height: number; // percentage (0-100)
}

interface Highlight {
  id: string;
  page: number;
  text: string;
  color: string;
  rects: HighlightRect[]; // Store as percentages, not pixels
}

interface Comment {
  id: string;
  page: number;
  textSelection: string;
  commentText: string;
  position: { x: number; y: number }; // Percentage of page dimensions
}

interface PdfViewerInnerProps {
  pdfUrl: string;
  bookId: string;
}

const getWindowWidth = () => typeof window !== "undefined" ? window.innerWidth : 800;

export default function PdfViewerInner({ pdfUrl, bookId }: PdfViewerInnerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [retryKey, setRetryKey] = useState(0);
  const [scale, setScale] = useState(1.1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [highlightColor, setHighlightColor] = useState("#FFEB3B");
  const [showSidebar, setShowSidebar] = useState(false);
  const [pageDimensions, setPageDimensions] = useState<{ width: number; height: number } | null>(null);

  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  const localStorageProgressKey = `pdf_progress_${bookId}`;
  const localStorageHighlightsKey = `pdf_highlights_${bookId}`;
  const localStorageCommentsKey = `pdf_comments_${bookId}`;

  // Load saved data
  useEffect(() => {
    if (typeof window !== "undefined" && bookId) {
      const savedPage = localStorage.getItem(localStorageProgressKey);
      if (savedPage) setPageNumber(parseInt(savedPage, 10));

      const savedHighlights = localStorage.getItem(localStorageHighlightsKey);
      if (savedHighlights) setHighlights(JSON.parse(savedHighlights));

      const savedComments = localStorage.getItem(localStorageCommentsKey);
      if (savedComments) setComments(JSON.parse(savedComments));
    }
  }, [bookId, localStorageProgressKey, localStorageHighlightsKey, localStorageCommentsKey]);

  // Save page progress
  useEffect(() => {
    if (typeof window !== "undefined" && bookId && pageNumber) {
      localStorage.setItem(localStorageProgressKey, pageNumber.toString());
    }
  }, [pageNumber, bookId, localStorageProgressKey]);

  // Capture page dimensions when page renders - multiple triggers for reliability
  const updatePageDimensions = useCallback(() => {
    const pdfPage = document.querySelector('.react-pdf__Page') as HTMLElement;
    if (pdfPage) {
      const rect = pdfPage.getBoundingClientRect();
      setPageDimensions({ width: rect.width, height: rect.height });
    }
  }, []);

  useEffect(() => {
    // Update immediately
    updatePageDimensions();

    // Also update after a short delay for slower renders
    const timer = setTimeout(updatePageDimensions, 100);
    return () => clearTimeout(timer);
  }, [pageNumber, scale, updatePageDimensions]);

  // Handle window resize for responsive behavior
  useEffect(() => {
    window.addEventListener('resize', updatePageDimensions);
    return () => window.removeEventListener('resize', updatePageDimensions);
  }, [updatePageDimensions]);

  // Delete handlers
  const handleDeleteHighlight = useCallback((id: string) => {
    setHighlights((prev) => {
      const updated = prev.filter(h => h.id !== id);
      localStorage.setItem(localStorageHighlightsKey, JSON.stringify(updated));
      return updated;
    });
  }, [localStorageHighlightsKey]);

  const handleDeleteComment = useCallback((id: string) => {
    setComments((prev) => {
      const updated = prev.filter(c => c.id !== id);
      localStorage.setItem(localStorageCommentsKey, JSON.stringify(updated));
      return updated;
    });
  }, [localStorageCommentsKey]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setPageNumber((prev) => Math.max(prev - 1, 1));
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setPageNumber((prev) => Math.min(prev + 1, numPages || 1));
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        setScale((prev) => Math.min(prev + 0.2, 3.0));
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        setScale((prev) => Math.max(prev - 0.2, 0.5));
      } else if (e.key === "0") {
        e.preventDefault();
        setScale(1.1);
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        if (!document.fullscreenElement) {
          pdfContainerRef.current?.requestFullscreen();
          setIsFullscreen(true);
        } else {
          document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [numPages]);

  // Highlighting logic
  const handleHighlightSelection = useCallback(() => {
    if (typeof window === "undefined") return;

    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (selectedText && selectedText.length > 0 && selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rects = Array.from(range.getClientRects());

      // Get PDF page element for relative positioning
      const pdfPage = document.querySelector('.react-pdf__Page') as HTMLElement;
      if (!pdfPage) return;

      const pageRect = pdfPage.getBoundingClientRect();

      // Convert pixel rects to percentage-based rects
      const percentageRects: HighlightRect[] = rects.map(rect => ({
        x: ((rect.left - pageRect.left) / pageRect.width) * 100,
        y: ((rect.top - pageRect.top) / pageRect.height) * 100,
        width: (rect.width / pageRect.width) * 100,
        height: (rect.height / pageRect.height) * 100,
      }));

      const newHighlight: Highlight = {
        id: crypto.randomUUID(),
        page: pageNumber,
        text: selectedText,
        color: highlightColor,
        rects: percentageRects,
      };

      setHighlights((prev) => {
        const updatedHighlights = [...prev, newHighlight];
        localStorage.setItem(localStorageHighlightsKey, JSON.stringify(updatedHighlights));
        return updatedHighlights;
      });
      selection?.removeAllRanges();
    }
  }, [pageNumber, localStorageHighlightsKey, highlightColor]);

  // Commenting logic
  const handleAddComment = useCallback(() => {
    if (typeof window === "undefined") return;

    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (selectedText && selectedText.length > 0 && selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      const pdfPage = document.querySelector('.react-pdf__Page') as HTMLElement;
      if (!pdfPage) return;

      const pageRect = pdfPage.getBoundingClientRect();

      const commentInput = prompt(`Enter your comment for: "${selectedText.substring(0, Math.min(selectedText.length, 50))}..."`);
      if (commentInput !== null && commentInput.trim().length > 0) {
        const newComment: Comment = {
          id: crypto.randomUUID(),
          page: pageNumber,
          textSelection: selectedText,
          commentText: commentInput.trim(),
          position: {
            x: ((rect.left - pageRect.left + 10) / pageRect.width) * 100,
            y: ((rect.top - pageRect.top + (rect.height / 2)) / pageRect.height) * 100
          },
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

  const onDocumentLoadSuccess = useCallback(({ numPages: totalPages }: { numPages: number }) => {
    setNumPages(totalPages);
    setLoading(false);
    setError(null);
    setPageNumber((prevPage) => Math.min(prevPage, totalPages));
  }, []);

  const onDocumentLoadError = useCallback((err: Error) => {
    console.error("Failed to load PDF", err);
    let errorMessage = "Failed to load PDF. ";
    if (err.message.includes("CORS")) {
      errorMessage += "Cross-origin access denied.";
    } else if (err.message.includes("404") || err.message.includes("Not Found")) {
      errorMessage += "PDF file not found.";
    } else if (err.message.includes("network") || err.message.includes("fetch")) {
      errorMessage += "Network error. Please check your connection.";
    } else {
      errorMessage += `Error: ${err.message}`;
    }
    setError(errorMessage);
    setLoading(false);
  }, []);

  const goToPrevPage = useCallback(() => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages || 1));
  }, [numPages]);

  const handleZoomIn = useCallback(() => {
    setScale((prevScale) => Math.min(prevScale + 0.2, 3.0));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.5));
  }, []);

  const handleResetZoom = useCallback(() => {
    setScale(1.1);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      pdfContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handlePageInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= (numPages || 1)) {
      setPageNumber(value);
    }
  }, [numPages]);

  if (!pdfUrl) {
    return <p className="text-red-500 text-center py-8">PDF not available</p>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-red-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-red-800 font-semibold mb-2">PDF Load Error</h3>
              <p className="text-red-700 text-sm mb-4">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  setRetryKey(prev => prev + 1);
                }}
                className="btn-primary px-4 py-2 text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4">
      {/* Toolbar */}
      <div className="w-full max-w-7xl mb-4 bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="btn-secondary px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous Page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={pageNumber}
                onChange={handlePageInput}
                min={1}
                max={numPages || 1}
                className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <span className="text-sm text-gray-600">/ {numPages || "--"}</span>
            </div>
            <button
              onClick={goToNextPage}
              disabled={pageNumber >= (numPages || 1)}
              className="btn-secondary px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next Page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              className="btn-secondary px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom Out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>
            <span className="text-sm font-medium text-gray-700 w-16 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={scale >= 3.0}
              className="btn-secondary px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom In"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
            </button>
            <button
              onClick={handleResetZoom}
              className="btn-secondary px-3 py-2 text-sm"
              title="Reset Zoom"
            >
              Reset
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="btn-secondary px-3 py-2"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isFullscreen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              )}
            </svg>
          </button>
        </div>

        {/* Annotation Controls */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 mr-2">
            <label htmlFor="highlight-color" className="text-xs text-gray-600">Color:</label>
            <input
              type="color"
              id="highlight-color"
              value={highlightColor}
              onChange={(e) => setHighlightColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-gray-300"
              title="Choose highlight color"
            />
          </div>
          <button
            onClick={handleHighlightSelection}
            className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
            title="Select text then click to highlight"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            Highlight
          </button>
          <button
            onClick={handleAddComment}
            className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
            title="Select text then click to add comment"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Comment
          </button>
          {(highlights.length > 0 || comments.length > 0) && (
            <span className="ml-auto text-sm text-gray-600">
              {highlights.length} highlights, {comments.length} comments
            </span>
          )}
        </div>
      </div>

      {/* Main content area with PDF and Sidebar */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-4">
        {/* PDF Container */}
        <div ref={pdfContainerRef} className="flex-1 w-full md:max-w-4xl border border-gray-300 shadow-lg rounded-lg relative overflow-hidden">
          <div className="overflow-auto rounded-lg bg-gray-100" style={{ minHeight: '400px' }}>
            <div ref={pageRef} className="relative inline-block">
              <Document
                key={retryKey}
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                className="flex justify-center"
                loading={
                  <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto mb-2"></div>
                      <p className="text-gray-500 text-sm">Loading PDF...</p>
                    </div>
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  width={Math.min(getWindowWidth() * 0.95, 800) * scale}
                  onRenderSuccess={() => {
                    setLoading(false);
                    updatePageDimensions();
                  }}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  className="mx-auto"
                  loading={
                    <div className="flex items-center justify-center p-8">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto mb-2"></div>
                        <p className="text-gray-500 text-sm">Rendering page {pageNumber}...</p>
                      </div>
                    </div>
                  }
                />
              </Document>

              {/* Highlight Overlays - positioned absolutely over PDF */}
              {pageDimensions && highlights
                .filter(h => h.page === pageNumber)
                .map(highlight => (
                  highlight.rects.map((rect, idx) => {
                    // Convert percentage back to pixels based on current page size
                    const pixelX = (rect.x / 100) * pageDimensions.width;
                    const pixelY = (rect.y / 100) * pageDimensions.height;
                    const pixelWidth = (rect.width / 100) * pageDimensions.width;
                    const pixelHeight = (rect.height / 100) * pageDimensions.height;

                    // Convert hex color to rgba
                    const hexColor = highlight.color;
                    const r = parseInt(hexColor.slice(1, 3), 16);
                    const g = parseInt(hexColor.slice(3, 5), 16);
                    const b = parseInt(hexColor.slice(5, 7), 16);

                    return (
                      <div
                        key={`${highlight.id}-${idx}`}
                        className="absolute pointer-events-auto cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                          left: `${pixelX}px`,
                          top: `${pixelY}px`,
                          width: `${pixelWidth}px`,
                          height: `${pixelHeight}px`,
                          backgroundColor: `rgba(${r}, ${g}, ${b}, 0.3)`,
                          border: `1px solid rgba(${r}, ${g}, ${b}, 0.5)`,
                          borderRadius: '2px',
                          zIndex: 10,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Remove highlight: "${highlight.text.substring(0, 80)}..."?`)) {
                            handleDeleteHighlight(highlight.id);
                          }
                        }}
                        title={`📝 "${highlight.text.substring(0, 80)}${highlight.text.length > 80 ? '...' : ''}" (Click to remove)`}
                      />
                    );
                  })
                ))}

              {/* Comment Icon Overlays */}
              {pageDimensions && comments
                .filter(c => c.page === pageNumber)
                .map(comment => {
                  const pixelX = (comment.position.x / 100) * pageDimensions.width;
                  const pixelY = (comment.position.y / 100) * pageDimensions.height;

                  return (
                    <div
                      key={comment.id}
                      className="absolute cursor-pointer group pointer-events-auto"
                      style={{
                        left: `${pixelX + 20}px`, // Offset to the right to avoid hiding text
                        top: `${pixelY}px`,
                        transform: 'translate(0, -50%)', // Only center vertically
                        zIndex: 20,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedComment(comment);
                      }}
                      title="Click to view comment"
                    >
                      <div className="relative bg-blue-600 rounded-full p-1.5 shadow-lg hover:shadow-xl hover:scale-110 transition-all">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        {/* End PDF Container */}

        {/* Sidebar - Sticky on desktop, overlay on mobile */}
        {(highlights.filter(h => h.page === pageNumber).length > 0 || comments.filter(c => c.page === pageNumber).length > 0) && (
          <>
            {/* Mobile toggle button */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden fixed bottom-4 right-4 z-30 bg-brand text-white p-3 rounded-full shadow-lg hover:bg-brand-600 transition-colors"
              title="Toggle annotations"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {highlights.filter(h => h.page === pageNumber).length + comments.filter(c => c.page === pageNumber).length}
              </span>
            </button>

            {/* Sidebar */}
            <div className={`fixed md:sticky md:top-4 md:self-start top-20 right-0 md:right-auto p-4 bg-white border border-gray-200 shadow-xl z-20 max-h-[600px] md:max-h-[calc(100vh-8rem)] overflow-y-auto w-80 rounded-l-lg md:rounded-lg transition-transform duration-300 ${
              showSidebar ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-brand-900 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  Page {pageNumber} Annotations
                </h3>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="md:hidden text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {highlights.filter(h => h.page === pageNumber).length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Highlights ({highlights.filter(h => h.page === pageNumber).length})
                  </h4>
                  <div className="space-y-2">
                    {highlights.filter(h => h.page === pageNumber).map(h => (
                      <div key={h.id} className="p-2 border rounded-md group relative" style={{ backgroundColor: `${h.color}20`, borderColor: `${h.color}80` }}>
                        <p className="text-xs text-gray-800 pr-6">"{h.text.substring(0, Math.min(h.text.length, 100))}{h.text.length > 100 ? '...' : ''}"</p>
                        <button
                          onClick={() => handleDeleteHighlight(h.id)}
                          className="absolute top-1 right-1 p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete highlight"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {comments.filter(c => c.page === pageNumber).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    Comments ({comments.filter(c => c.page === pageNumber).length})
                  </h4>
                  <div className="space-y-2">
                    {comments.filter(c => c.page === pageNumber).map(c => (
                      <div key={c.id} className="p-2 bg-blue-50 border border-blue-200 rounded-md group relative">
                        <p className="text-xs font-semibold text-blue-900 mb-1 pr-6">"{c.textSelection.substring(0, Math.min(c.textSelection.length, 60))}{c.textSelection.length > 60 ? '...' : ''}"</p>
                        <p className="text-xs text-gray-700">{c.commentText}</p>
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          className="absolute top-1 right-1 p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete comment"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Comment Dialog - Outside container at top level */}
      {selectedComment && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setSelectedComment(null)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 max-w-md w-full z-50 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                Comment
              </h3>
              <button
                onClick={() => setSelectedComment(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <p className="text-sm font-medium text-blue-900 mb-1">Selected Text:</p>
              <p className="text-sm text-gray-700 italic">"{selectedComment.textSelection}"</p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Comment:</p>
              <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{selectedComment.commentText}</p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  handleDeleteComment(selectedComment.id);
                  setSelectedComment(null);
                }}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedComment(null)}
                className="px-4 py-2 text-sm bg-brand text-white rounded-lg hover:bg-brand-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
