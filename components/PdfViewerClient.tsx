"use client";

import dynamic from "next/dynamic";

// IMPORTANT: dynamic import with SSR disabled for PdfViewerInner
const PdfViewerInner = dynamic(() => import("./PdfViewerInner"), {
  ssr: false,
});

export default function PdfViewerClient({ pdfUrl, bookId }: { pdfUrl: string; bookId: string }) {
  // Pass the pdfUrl and bookId props to the dynamically imported PdfViewerInner
  return <PdfViewerInner pdfUrl={pdfUrl} bookId={bookId} />;
}
