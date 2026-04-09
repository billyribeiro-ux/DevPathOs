import { db } from '$lib/db';
import type { RoadmapState, ConceptProgress } from '$lib/types/roadmap';

export const roadmapRepo = {
  async getState(userId: string): Promise<RoadmapState | undefined> {
    return db.roadmapState.where('userId').equals(userId).first();
  },

  async createState(state: RoadmapState): Promise<string> {
    return db.roadmapState.add(state);
  },

  async updateState(state: RoadmapState): Promise<void> {
    await db.roadmapState.put(state);
  },

  async getConceptProgress(trackSlug: string, conceptSlug: string): Promise<ConceptProgress | undefined> {
    return db.conceptProgress
      .where({ trackSlug, conceptSlug })
      .first();
  },

  async getAllProgress(trackSlug: string): Promise<ConceptProgress[]> {
    return db.conceptProgress.where('trackSlug').equals(trackSlug).toArray();
  },

  async upsertProgress(progress: ConceptProgress): Promise<void> {
    await db.conceptProgress.put(progress);
  }
};
