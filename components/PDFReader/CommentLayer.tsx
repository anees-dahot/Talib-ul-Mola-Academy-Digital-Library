"use client";

import { useState } from "react";
import { Comment } from "@/lib/readerStorage";

interface CommentLayerProps {
  comments: Comment[];
  scale: number;
  onUpdateComment: (commentId: string, text: string) => void;
  onDeleteComment: (commentId: string) => void;
}

interface CommentBubbleProps {
  comment: Comment;
  scale: number;
  onUpdate: (text: string) => void;
  onDelete: () => void;
}

function CommentBubble({ comment, scale, onUpdate, onDelete }: CommentBubbleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(editText);
    }
    setIsEditing(false);
  };

  return (
    <div
      className="absolute"
      style={{
        left: comment.position.x * scale,
        top: comment.position.y * scale,
      }}
    >
      {/* Comment Icon */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-6 h-6 bg-amber-400 hover:bg-amber-500 rounded-full flex items-center justify-center shadow-md transition-colors"
        title="View comment"
      >
        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Comment Popup */}
      {isExpanded && (
        <div className="absolute top-8 left-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
            <span className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Edit"
              >
                <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={onDelete}
                className="p-1 hover:bg-red-100 rounded transition-colors"
                title="Delete"
              >
                <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Close"
              >
                <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-3">
            {isEditing ? (
              <div>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full h-24 text-sm border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  autoFocus
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => {
                      setEditText(comment.text);
                      setIsEditing(false);
                    }}
                    className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 text-xs bg-brand-600 text-white rounded hover:bg-brand-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.text}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CommentLayer({
  comments,
  scale,
  onUpdateComment,
  onDeleteComment,
}: CommentLayerProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {comments.map((comment) => (
        <div key={comment.id} className="pointer-events-auto">
          <CommentBubble
            comment={comment}
            scale={scale}
            onUpdate={(text) => onUpdateComment(comment.id, text)}
            onDelete={() => onDeleteComment(comment.id)}
          />
        </div>
      ))}
    </div>
  );
}
