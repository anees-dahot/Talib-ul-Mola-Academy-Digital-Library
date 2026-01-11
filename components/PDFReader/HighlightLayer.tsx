"use client";

import { Highlight } from "@/lib/readerStorage";

interface HighlightLayerProps {
  highlights: Highlight[];
  scale: number;
  onHighlightClick: (highlight: Highlight) => void;
  onDeleteHighlight: (highlightId: string) => void;
}

export default function HighlightLayer({
  highlights,
  scale,
  onHighlightClick,
  onDeleteHighlight,
}: HighlightLayerProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {highlights.map((highlight) => (
        <div
          key={highlight.id}
          className="absolute pointer-events-auto cursor-pointer group"
          style={{
            left: highlight.position.x * scale,
            top: highlight.position.y * scale,
            width: highlight.position.width * scale,
            height: highlight.position.height * scale,
            backgroundColor: highlight.color,
            opacity: 0.4,
          }}
          onClick={() => onHighlightClick(highlight)}
        >
          {/* Delete button on hover */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteHighlight(highlight.id);
            }}
            className="absolute -top-6 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            title="Delete highlight"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
