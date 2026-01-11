"use client";

import { useState } from "react";
import { Highlight, Comment } from "@/lib/readerStorage";

interface AnnotationsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  highlights: Highlight[];
  comments: Comment[];
  currentPage: number;
  onGoToPage: (page: number) => void;
  onDeleteHighlight: (id: string) => void;
  onDeleteComment: (id: string) => void;
}

type TabType = "all" | "highlights" | "comments";

export default function AnnotationsSidebar({
  isOpen,
  onClose,
  highlights,
  comments,
  currentPage,
  onGoToPage,
  onDeleteHighlight,
  onDeleteComment,
}: AnnotationsSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: "all", label: "All", count: highlights.length + comments.length },
    { id: "highlights", label: "Highlights", count: highlights.length },
    { id: "comments", label: "Comments", count: comments.length },
  ];

  // Combine and sort by page number
  const allAnnotations = [
    ...highlights.map((h) => ({ ...h, type: "highlight" as const })),
    ...comments.map((c) => ({ ...c, type: "comment" as const })),
  ].sort((a, b) => a.pageNumber - b.pageNumber);

  const filteredAnnotations =
    activeTab === "all"
      ? allAnnotations
      : activeTab === "highlights"
      ? allAnnotations.filter((a) => a.type === "highlight")
      : allAnnotations.filter((a) => a.type === "comment");

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-14 right-0 h-[calc(100vh-56px)] w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Annotations</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-brand-600 border-b-2 border-brand-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-gray-100">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-110px)] p-4">
          {filteredAnnotations.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-12 h-12 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-500 text-sm">
                {activeTab === "highlights"
                  ? "No highlights yet"
                  : activeTab === "comments"
                  ? "No comments yet"
                  : "No annotations yet"}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {activeTab === "highlights"
                  ? "Select text to highlight it"
                  : activeTab === "comments"
                  ? "Click on the page to add a comment"
                  : "Start reading and add annotations"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAnnotations.map((annotation) => (
                <div
                  key={annotation.id}
                  className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all ${
                    annotation.pageNumber === currentPage
                      ? "border-brand-300 bg-brand-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                  onClick={() => onGoToPage(annotation.pageNumber)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {annotation.type === "highlight" ? (
                        <div
                          className="w-4 h-4 rounded-sm flex-shrink-0"
                          style={{ backgroundColor: (annotation as Highlight).color }}
                        />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-amber-400 flex-shrink-0 flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      <span className="text-xs font-medium text-gray-500">
                        Page {annotation.pageNumber}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (annotation.type === "highlight") {
                          onDeleteHighlight(annotation.id);
                        } else {
                          onDeleteComment(annotation.id);
                        }
                      }}
                      className="p-1 hover:bg-red-100 rounded transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {annotation.type === "comment" && (
                    <p className="mt-2 text-sm text-gray-700 line-clamp-3">
                      {(annotation as Comment).text}
                    </p>
                  )}

                  <p className="mt-2 text-xs text-gray-400">
                    {new Date(annotation.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
