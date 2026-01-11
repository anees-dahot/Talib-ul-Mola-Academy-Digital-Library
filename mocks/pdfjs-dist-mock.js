// mocks/pdfjs-dist-mock.js

// This mock is used by Next.js during SSR to prevent pdfjs-dist from loading
// and trying to access browser-specific APIs (like window)
// It needs to provide a basic structure that react-pdf expects from pdfjs-dist.

// Mock for pdfjs-dist/build/pdf.mjs
export const getDocument = () => ({
  promise: Promise.resolve({
    getPage: () => Promise.resolve(null),
  }),
});

export const version = "mock-version";
export const GlobalWorkerOptions = {
  workerSrc: "",
};

// Add mocks for AnnotationLayer, TextLayer, and AnnotationMode
// react-pdf might try to import these directly or access them via the pdfjs object
export const AnnotationLayer = {};
export const TextLayer = {};
export const AnnotationMode = {}; // Added AnnotationMode mock


// Mock for the default export, if any.
// Some modules might use `import * as pdfjsLib from 'pdfjs-dist'`
const pdfjs = {
  getDocument,
  version,
  GlobalWorkerOptions,
  // Add these to the default export as well, as react-pdf might look for them there
  AnnotationLayer,
  TextLayer,
  AnnotationMode, // Added AnnotationMode to default export
};
export default pdfjs;
