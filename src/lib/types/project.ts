export type ProjectStatus = 'planning' | 'active' | 'completed' | 'abandoned';
export type ProjectEventType = 'milestone' | 'concept-applied' | 'bug-fixed' | 'file-touched' | 'note';

export interface PostReview {
  whatWentWell: string;
  whatWasHard: string;
  conceptsStrengthened: string[];
  weakAreas: string[];
  nextSteps: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  conceptSlugs: string[];
  startedAt: Date;
  completedAt?: Date;
  postReview?: PostReview;
}

export interface ProjectEvent {
  id: string;
  projectId: string;
  type: ProjectEventType;
  title: string;
  description?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}
