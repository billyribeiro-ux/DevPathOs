export interface WeeklyReview {
  id: string;
  weekStart: Date;
  weekEnd: Date;
  totalStudyMinutes: number;
  conceptsLearned: string[];
  conceptsReviewed: string[];
  flashcardsReviewed: number;
  flashcardAccuracy: number;
  mistakeCount: number;
  topMistakeCategories: string[];
  streakDays: number;
  recommendations: string[];
  generatedAt: Date;
}

export interface StudyLog {
  id: string;
  date: string;
  conceptSlug?: string;
  activity: 'learn' | 'try' | 'build' | 'explain' | 'reuse' | 'flashcard' | 'note' | 'project';
  durationMinutes: number;
  timestamp: Date;
}
