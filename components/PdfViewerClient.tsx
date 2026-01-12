"use client";

import dynamic from "next/dynamic";

// IMPORTANT: dynamic import with SSR disabled for PdfViewerInner
const PdfViewerInner = dynamic(() => import("./PdfViewerInner"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto mb-2"></div>
        <p className="text-gray-500 text-sm">Loading PDF Reader...</p>
      </div>
    </div>
  ),
});

export default function PdfViewerClient({ pdfUrl, bookId }: { pdfUrl: string; bookId: string }) {
  // Pass the pdfUrl and bookId props to the dynamically imported PdfViewerInner
  return <PdfViewerInner pdfUrl={pdfUrl} bookId={bookId} />;
}
