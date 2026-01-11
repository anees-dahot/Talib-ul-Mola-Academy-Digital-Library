"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import PDFToolbar from "./PDFToolbar";
import HighlightLayer from "./HighlightLayer";
import CommentLayer from "./CommentLayer";
import CommentModal from "./CommentModal";
import AnnotationsSidebar from "./AnnotationsSidebar";
import {
  getBookData,
  updateProgress,
  addHighlight,
  removeHighlight,
  addComment,
  updateComment,
  removeComment,
  Highlight,
  Comment,
} from "@/lib/readerStorage";

interface PDFViewerProps {
  bookId: string;
  pdfUrl: string;
  bookTitle: string;
  onBack: () => void;
}

// Lazy loaded PDF components
let pdfComponentsPromise: Promise<{
  Document: React.ComponentType<any>;
  Page: React.ComponentType<any>;
}> | null = null;

function loadPdfComponents() {
  if (!pdfComponentsPromise) {
    pdfComponentsPromise = (async () => {
      const pdfModule = await import("react-pdf");

      // Set worker source to local file
      pdfModule.pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      // Load styles
      await import("react-pdf/dist/Page/AnnotationLayer.css");
      await import("react-pdf/dist/Page/TextLayer.css");

      return {
        Document: pdfModule.Document,
        Page: pdfModule.Page,
      };
    })();
  }
  return pdfComponentsPromise;
}

export default function PDFViewer({ bookId, pdfUrl, bookTitle, onBack }: PDFViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [selectedTool, setSelectedTool] = useState<"select" | "highlight" | "comment">("select");
  const [highlightColor, setHighlightColor] = useState("#FFEB3B");
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [pageHighlights, setPageHighlights] = useState<Highlight[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [pageComments, setPageComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResumeToast, setShowResumeToast] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pdfComponents, setPdfComponents] = useState<{
    Document: React.ComponentType<any>;
    Page: React.ComponentType<any>;
  } | null>(null);

  // Comment modal state
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [commentPosition, setCommentPosition] = useState({ x: 0, y: 0 });
  const [pendingCommentPosition, setPendingCommentPosition] = useState({ x: 0, y: 0 });

  // Selection state for highlighting
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  // Load PDF components on mount
  useEffect(() => {
    let mounted = true;

    loadPdfComponents()
      .then((components) => {
        if (mounted) {
          setPdfComponents(components);
        }
      })
      .catch((err) => {
        console.error("Failed to load PDF components:", err);
        if (mounted) {
          setError("Failed to load PDF viewer");
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Load saved data on mount
  useEffect(() => {
    const data = getBookData(bookId);
    if (data.progress.currentPage > 1) {
      setCurrentPage(data.progress.currentPage);
      setShowResumeToast(true);
      setTimeout(() => setShowResumeToast(false), 3000);
    }
    if (data.progress.zoom > 0) {
      setZoom(data.progress.zoom);
    }
    setHighlights(data.highlights);
    setComments(data.comments);
  }, [bookId]);

  // Save progress when page or zoom changes
  useEffect(() => {
    if (numPages > 0) {
      updateProgress(bookId, {
        currentPage,
        totalPages: numPages,
        zoom,
      });
    }
  }, [bookId, currentPage, zoom, numPages]);

  // Load page-specific highlights and comments
  useEffect(() => {
    setPageHighlights(highlights.filter((h) => h.pageNumber === currentPage));
    setPageComments(comments.filter((c) => c.pageNumber === currentPage));
  }, [highlights, comments, currentPage]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    updateProgress(bookId, { totalPages: numPages });
  };

  const onDocumentLoadError = (error: Error) => {
    setError("Failed to load PDF. Please try again.");
    setIsLoading(false);
    console.error("PDF load error:", error);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  // Handle click on page for comments
  const handlePageClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (selectedTool !== "comment") return;

      const rect = pageRef.current?.getBoundingClientRect();
      if (!rect) return;

      const scale = zoom / 100;
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;

      setPendingCommentPosition({ x, y });
      setCommentPosition({ x: e.clientX, y: e.clientY });
      setCommentModalOpen(true);
    },
    [selectedTool, zoom]
  );

  // Handle mouse events for highlighting
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (selectedTool !== "highlight") return;

      const rect = pageRef.current?.getBoundingClientRect();
      if (!rect) return;

      const scale = zoom / 100;
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;

      setIsSelecting(true);
      setSelectionStart({ x, y });
      setSelectionEnd({ x, y });
    },
    [selectedTool, zoom]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isSelecting || selectedTool !== "highlight") return;

      const rect = pageRef.current?.getBoundingClientRect();
      if (!rect) return;

      const scale = zoom / 100;
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;

      setSelectionEnd({ x, y });
    },
    [isSelecting, selectedTool, zoom]
  );

  const handleMouseUp = useCallback(() => {
    if (!isSelecting || selectedTool !== "highlight") {
      setIsSelecting(false);
      return;
    }

    const width = Math.abs(selectionEnd.x - selectionStart.x);
    const height = Math.abs(selectionEnd.y - selectionStart.y);

    // Only create highlight if selection is meaningful
    if (width > 10 && height > 5) {
      const x = Math.min(selectionStart.x, selectionEnd.x);
      const y = Math.min(selectionStart.y, selectionEnd.y);

      const newHighlight = addHighlight(bookId, {
        pageNumber: currentPage,
        text: "",
        color: highlightColor,
        position: { x, y, width, height },
      });

      setHighlights((prev) => [...prev, newHighlight]);
    }

    setIsSelecting(false);
    setSelectionStart({ x: 0, y: 0 });
    setSelectionEnd({ x: 0, y: 0 });
  }, [isSelecting, selectedTool, selectionStart, selectionEnd, bookId, currentPage, highlightColor]);

  // Handle adding comment
  const handleSaveComment = (text: string) => {
    const newComment = addComment(bookId, {
      pageNumber: currentPage,
      text,
      position: pendingCommentPosition,
    });
    setComments((prev) => [...prev, newComment]);
    setCommentModalOpen(false);
  };

  // Handle updating comment
  const handleUpdateComment = (commentId: string, text: string) => {
    updateComment(bookId, commentId, text);
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, text, updatedAt: new Date().toISOString() } : c))
    );
  };

  // Handle deleting comment
  const handleDeleteComment = (commentId: string) => {
    removeComment(bookId, commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  // Handle deleting highlight
  const handleDeleteHighlight = (highlightId: string) => {
    removeHighlight(bookId, highlightId);
    setHighlights((prev) => prev.filter((h) => h.id !== highlightId));
  };

  // Selection rectangle for highlighting
  const getSelectionRect = () => {
    if (!isSelecting) return null;

    const x = Math.min(selectionStart.x, selectionEnd.x);
    const y = Math.min(selectionStart.y, selectionEnd.y);
    const width = Math.abs(selectionEnd.x - selectionStart.x);
    const height = Math.abs(selectionEnd.y - selectionStart.y);

    return { x, y, width, height };
  };

  const selectionRect = getSelectionRect();
  const scale = zoom / 100;

  return (
    <div className="min-h-screen bg-gray-100">
      <PDFToolbar
        currentPage={currentPage}
        totalPages={numPages}
        zoom={zoom}
        onPageChange={handlePageChange}
        onZoomChange={handleZoomChange}
        onToolSelect={setSelectedTool}
        selectedTool={selectedTool}
        highlightColor={highlightColor}
        onHighlightColorChange={setHighlightColor}
        onBack={onBack}
        bookTitle={bookTitle}
      />

      {/* Annotations toggle button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-16 right-4 z-40 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
        title="View Annotations"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        {(highlights.length + comments.length) > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-600 text-white text-xs rounded-full flex items-center justify-center">
            {highlights.length + comments.length}
          </span>
        )}
      </button>

      <div
        ref={containerRef}
        className="pt-14 pb-8 flex justify-center overflow-auto"
        style={{ height: "100vh" }}
      >
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading PDF...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <svg
                className="w-16 h-16 text-red-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-gray-800 font-medium mb-2">Error Loading PDF</p>
              <p className="text-gray-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {pdfComponents && (
          <pdfComponents.Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading=""
            className={isLoading ? "hidden" : ""}
          >
            <div
              ref={pageRef}
              className="relative bg-white shadow-lg my-4"
              style={{
                cursor:
                  selectedTool === "highlight"
                    ? "crosshair"
                    : selectedTool === "comment"
                    ? "pointer"
                    : "default",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={handlePageClick}
            >
              <pdfComponents.Page
                pageNumber={currentPage}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />

              {/* Highlights */}
              <HighlightLayer
                highlights={pageHighlights}
                scale={scale}
                onHighlightClick={() => {}}
                onDeleteHighlight={handleDeleteHighlight}
              />

              {/* Comments */}
              <CommentLayer
                comments={pageComments}
                scale={scale}
                onUpdateComment={handleUpdateComment}
                onDeleteComment={handleDeleteComment}
              />

              {/* Selection rectangle while dragging */}
              {isSelecting && selectionRect && (
                <div
                  className="absolute border-2 border-dashed pointer-events-none"
                  style={{
                    left: selectionRect.x * scale,
                    top: selectionRect.y * scale,
                    width: selectionRect.width * scale,
                    height: selectionRect.height * scale,
                    borderColor: highlightColor,
                    backgroundColor: `${highlightColor}40`,
                  }}
                />
              )}
            </div>
          </pdfComponents.Document>
        )}
      </div>

      {/* Comment Modal */}
      <CommentModal
        isOpen={commentModalOpen}
        position={commentPosition}
        onSave={handleSaveComment}
        onClose={() => setCommentModalOpen(false)}
      />

      {/* Annotations Sidebar */}
      <AnnotationsSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        highlights={highlights}
        comments={comments}
        currentPage={currentPage}
        onGoToPage={handlePageChange}
        onDeleteHighlight={handleDeleteHighlight}
        onDeleteComment={handleDeleteComment}
      />

      {/* Resume Reading Toast */}
      {showResumeToast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-brand-800 text-white px-4 py-3 rounded-lg shadow-lg text-sm flex items-center gap-3 animate-fade-in">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <div>
            <p className="font-medium">Welcome back!</p>
            <p className="text-white/80 text-xs">Resumed from page {currentPage}</p>
          </div>
          <button
            onClick={() => setShowResumeToast(false)}
            className="ml-2 p-1 hover:bg-white/20 rounded"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
