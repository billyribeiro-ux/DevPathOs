export type ConceptLayer = 'foundation' | 'framework' | 'professional';
export type ConceptStatus = 'locked' | 'available' | 'in-progress' | 'learned' | 'mastered';
export type LearningLayer = 'learn' | 'try' | 'build' | 'explain' | 'reuse';

export interface LayerStatus {
  completed: boolean;
  completedAt?: Date;
}

export interface ConceptMeta {
  slug: string;
  title: string;
  description: string;
  layer: ConceptLayer;
  order: number;
  prerequisites: string[];
  unlocks: string[];
  estimatedMinutes: number;
  whyNext: string;
  whatBreaksIfSkipped: string;
  projectProof: string;
  tags: string[];
  relatedMistakeCategories?: string[];
}

export interface ConceptProgress {
  id: string;
  userId: string;
  trackSlug: string;
  conceptSlug: string;
  status: ConceptStatus;
  layers: Record<LearningLayer, LayerStatus>;
  explanation?: string;
  reuseCount: number;
  lastReviewedAt?: Date;
  tags: string[];
}

export interface RoadmapState {
  id: string;
  userId: string;
  trackSlug: string;
  unlockedConcepts: string[];
  currentFocus: string | null;
}

export interface TrackMeta {
  slug: string;
  title: string;
  description: string;
  roles: string[];
  layers: Record<ConceptLayer, string[]>;
}
