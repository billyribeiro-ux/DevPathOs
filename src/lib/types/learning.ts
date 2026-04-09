import type { LearningLayer } from './roadmap';

export interface LearningSession {
  id: string;
  conceptSlug: string;
  trackSlug: string;
  currentLayer: LearningLayer;
  startedAt: Date;
  completedAt?: Date;
  durationMinutes: number;
}
