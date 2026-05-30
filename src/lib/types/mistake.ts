export type MistakeCategory = 'syntax' | 'logic' | 'type-error' | 'async' | 'state-management' | 'css' | 'other';

export interface Mistake {
  id: string;
  userId: string;
  projectId?: string;
  conceptSlug?: string;
  category: MistakeCategory;
  description: string;
  errorMessage?: string;
  resolution?: string;
  createdAt: Date;
}

export interface MistakePattern {
  id: string;
  userId: string;
  category: MistakeCategory;
  description: string;
  frequency: number;
  lastOccurrence: Date;
  relatedConceptSlugs: string[];
  suggestedReview?: string;
}
