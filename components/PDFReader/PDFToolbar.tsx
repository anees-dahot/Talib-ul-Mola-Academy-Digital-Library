"use client";

import { useState } from "react";

interface PDFToolbarProps {
  currentPage: number;
  totalPages: number;
  zoom: number;
  onPageChange: (page: number) => void;
  onZoomChange: (zoom: number) => void;
  onToolSelect: (tool: "select" | "highlight" | "comment") => void;
  selectedTool: "select" | "highlight" | "comment";
  highlightColor: string;
  onHighlightColorChange: (color: string) => void;
  onBack: () => void;
  bookTitle: string;
}

const HIGHLIGHT_COLORS = [
  { name: "Yellow", value: "#FFEB3B" },
  { name: "Green", value: "#4CAF50" },
  { name: "Blue", value: "#2196F3" },
  { name: "Pink", value: "#E91E63" },
  { name: "Orange", value: "#FF9800" },
];

export default function PDFToolbar({
  currentPage,
  totalPages,
  zoom,
  onPageChange,
  onZoomChange,
  onToolSelect,
  selectedTool,
  highlightColor,
  onHighlightColorChange,
  onBack,
  bookTitle,
}: PDFToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [pageInput, setPageInput] = useState(currentPage.toString());

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(pageInput);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left Section - Back & Title */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Back to Library"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-sm font-medium text-gray-800 truncate max-w-[200px] md:max-w-[300px]">
            {bookTitle}
          </h1>
        </div>

        {/* Center Section - Page Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Previous Page"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <form onSubmit={handlePageSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={() => setPageInput(currentPage.toString())}
              className="w-12 text-center text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <span className="text-sm text-gray-500">/ {totalPages}</span>
          </form>

          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Next Page"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Right Section - Tools */}
        <div className="flex items-center gap-1 flex-1 justify-end">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 mr-4 border-r border-gray-200 pr-4">
            <button
              onClick={() => onZoomChange(Math.max(50, zoom - 25))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-xs text-gray-600 w-12 text-center">{zoom}%</span>
            <button
              onClick={() => onZoomChange(Math.min(200, zoom + 25))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Zoom In"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Select Tool */}
          <button
            onClick={() => onToolSelect("select")}
            className={`p-2 rounded-lg transition-colors ${
              selectedTool === "select" ? "bg-brand-100 text-brand-700" : "hover:bg-gray-100 text-gray-600"
            }`}
            title="Select Text"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </button>

          {/* Highlight Tool */}
          <div className="relative">
            <button
              onClick={() => onToolSelect("highlight")}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
                selectedTool === "highlight" ? "bg-brand-100 text-brand-700" : "hover:bg-gray-100 text-gray-600"
              }`}
              title="Highlight Text"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <div
                className="w-3 h-3 rounded-full border border-gray-300"
                style={{ backgroundColor: highlightColor }}
              />
            </button>

            {selectedTool === "highlight" && (
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border border-gray-300 flex items-center justify-center"
              >
                <svg className="w-2 h-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}

            {showColorPicker && (
              <div className="absolute top-full right-0 mt-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200 flex gap-1 z-50">
                {HIGHLIGHT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => {
                      onHighlightColorChange(color.value);
                      setShowColorPicker(false);
                    }}
                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                      highlightColor === color.value ? "border-gray-800" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Comment Tool */}
          <button
            onClick={() => onToolSelect("comment")}
            className={`p-2 rounded-lg transition-colors ${
              selectedTool === "comment" ? "bg-brand-100 text-brand-700" : "hover:bg-gray-100 text-gray-600"
            }`}
            title="Add Comment"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
