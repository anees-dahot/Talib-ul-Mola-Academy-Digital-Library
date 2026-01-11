// Local storage utilities for PDF reader data

export interface Highlight {
  id: string;
  pageNumber: number;
  text: string;
  color: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  createdAt: string;
}

export interface Comment {
  id: string;
  pageNumber: number;
  text: string;
  position: {
    x: number;
    y: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ReadingProgress {
  bookId: string;
  currentPage: number;
  totalPages: number;
  scrollPosition: number;
  lastReadAt: string;
  zoom: number;
}

export interface BookData {
  highlights: Highlight[];
  comments: Comment[];
  progress: ReadingProgress;
}

const STORAGE_KEY_PREFIX = 'talib_reader_';

// Get storage key for a book
const getStorageKey = (bookId: string) => `${STORAGE_KEY_PREFIX}${bookId}`;

// Initialize empty book data
const getEmptyBookData = (bookId: string): BookData => ({
  highlights: [],
  comments: [],
  progress: {
    bookId,
    currentPage: 1,
    totalPages: 0,
    scrollPosition: 0,
    lastReadAt: new Date().toISOString(),
    zoom: 100,
  },
});

// Get book data from localStorage
export const getBookData = (bookId: string): BookData => {
  if (typeof window === 'undefined') return getEmptyBookData(bookId);

  try {
    const data = localStorage.getItem(getStorageKey(bookId));
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading book data:', error);
  }
  return getEmptyBookData(bookId);
};

// Save book data to localStorage
export const saveBookData = (bookId: string, data: BookData): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(getStorageKey(bookId), JSON.stringify(data));
  } catch (error) {
    console.error('Error saving book data:', error);
  }
};

// Update reading progress
export const updateProgress = (
  bookId: string,
  updates: Partial<ReadingProgress>
): void => {
  const data = getBookData(bookId);
  data.progress = {
    ...data.progress,
    ...updates,
    lastReadAt: new Date().toISOString(),
  };
  saveBookData(bookId, data);
};

// Add highlight
export const addHighlight = (bookId: string, highlight: Omit<Highlight, 'id' | 'createdAt'>): Highlight => {
  const data = getBookData(bookId);
  const newHighlight: Highlight = {
    ...highlight,
    id: `hl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  data.highlights.push(newHighlight);
  saveBookData(bookId, data);
  return newHighlight;
};

// Remove highlight
export const removeHighlight = (bookId: string, highlightId: string): void => {
  const data = getBookData(bookId);
  data.highlights = data.highlights.filter((h) => h.id !== highlightId);
  saveBookData(bookId, data);
};

// Get highlights for a page
export const getPageHighlights = (bookId: string, pageNumber: number): Highlight[] => {
  const data = getBookData(bookId);
  return data.highlights.filter((h) => h.pageNumber === pageNumber);
};

// Add comment
export const addComment = (bookId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Comment => {
  const data = getBookData(bookId);
  const now = new Date().toISOString();
  const newComment: Comment = {
    ...comment,
    id: `cm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: now,
    updatedAt: now,
  };
  data.comments.push(newComment);
  saveBookData(bookId, data);
  return newComment;
};

// Update comment
export const updateComment = (bookId: string, commentId: string, text: string): void => {
  const data = getBookData(bookId);
  const comment = data.comments.find((c) => c.id === commentId);
  if (comment) {
    comment.text = text;
    comment.updatedAt = new Date().toISOString();
    saveBookData(bookId, data);
  }
};

// Remove comment
export const removeComment = (bookId: string, commentId: string): void => {
  const data = getBookData(bookId);
  data.comments = data.comments.filter((c) => c.id !== commentId);
  saveBookData(bookId, data);
};

// Get comments for a page
export const getPageComments = (bookId: string, pageNumber: number): Comment[] => {
  const data = getBookData(bookId);
  return data.comments.filter((c) => c.pageNumber === pageNumber);
};

// Get all reading progress for library view
export const getAllReadingProgress = (): ReadingProgress[] => {
  if (typeof window === 'undefined') return [];

  const progress: ReadingProgress[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_KEY_PREFIX)) {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        if (data.progress) {
          progress.push(data.progress);
        }
      }
    }
  } catch (error) {
    console.error('Error reading all progress:', error);
  }
  return progress;
};

// Clear all data for a book
export const clearBookData = (bookId: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(getStorageKey(bookId));
};
