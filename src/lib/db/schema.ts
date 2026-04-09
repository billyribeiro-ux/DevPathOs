import Dexie, { type EntityTable } from 'dexie';
import type { UserProfile } from '$lib/types/user';
import type { RoadmapState, ConceptProgress } from '$lib/types/roadmap';
import type { LearningSession } from '$lib/types/learning';
import type { Note, NoteLink, Flashcard, Snippet } from '$lib/types/brain';
import type { Project, ProjectEvent } from '$lib/types/project';
import type { Mistake, MistakePattern } from '$lib/types/mistake';
import type { ChatSession, ChatMessage } from '$lib/types/mentor';
import type { WeeklyReview, StudyLog } from '$lib/types/review';

export class DevPathDB extends Dexie {
  userProfile!: EntityTable<UserProfile, 'id'>;
  roadmapState!: EntityTable<RoadmapState, 'id'>;
  conceptProgress!: EntityTable<ConceptProgress, 'id'>;
  learningSession!: EntityTable<LearningSession, 'id'>;
  notes!: EntityTable<Note, 'id'>;
  noteLinks!: EntityTable<NoteLink, 'id'>;
  flashcards!: EntityTable<Flashcard, 'id'>;
  snippets!: EntityTable<Snippet, 'id'>;
  projects!: EntityTable<Project, 'id'>;
  projectEvents!: EntityTable<ProjectEvent, 'id'>;
  mistakes!: EntityTable<Mistake, 'id'>;
  mistakePatterns!: EntityTable<MistakePattern, 'id'>;
  chatSessions!: EntityTable<ChatSession, 'id'>;
  chatMessages!: EntityTable<ChatMessage, 'id'>;
  weeklyReviews!: EntityTable<WeeklyReview, 'id'>;
  studyLogs!: EntityTable<StudyLog, 'id'>;

  constructor() {
    super('DevPathOS');
    this.version(1).stores({
      userProfile: 'id, role, createdAt',
      roadmapState: 'id, userId, trackSlug',
      conceptProgress: 'id, trackSlug, conceptSlug, status, *tags',
      learningSession: 'id, conceptSlug, startedAt, completedAt',
      notes: 'id, title, createdAt, updatedAt, *tags, *linkedConcepts',
      noteLinks: 'id, sourceNoteId, targetNoteId',
      flashcards: 'id, noteId, conceptSlug, dueDate, *tags',
      snippets: 'id, language, createdAt, *tags',
      projects: 'id, status, startedAt, *conceptSlugs',
      projectEvents: 'id, projectId, type, timestamp',
      mistakes: 'id, projectId, conceptSlug, category, createdAt',
      mistakePatterns: 'id, category, frequency',
      chatSessions: 'id, mode, createdAt',
      chatMessages: 'id, sessionId, role, createdAt',
      weeklyReviews: 'id, weekStart, weekEnd',
      studyLogs: 'id, date, conceptSlug, durationMinutes'
    });
  }
}
