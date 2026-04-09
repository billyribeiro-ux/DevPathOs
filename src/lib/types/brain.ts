export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  linkedConcepts: string[];
  linkedProjects: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteLink {
  id: string;
  sourceNoteId: string;
  targetNoteId: string;
  label?: string;
}

export interface Flashcard {
  id: string;
  userId: string;
  front: string;
  back: string;
  noteId?: string;
  conceptSlug?: string;
  tags: string[];
  dueDate: Date;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  state: 'new' | 'learning' | 'review' | 'relearning';
  lastReviewDate?: Date;
}

export interface Snippet {
  id: string;
  userId: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
  conceptSlug?: string;
  noteId?: string;
  createdAt: Date;
}
