import type { PageServerLoad } from './$types';
import { roadmapStates, conceptProgress } from '$lib/server/collections';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) return { roadmapState: null, progress: [] };

  const state = await roadmapStates.findOneBy((s) => s.userId === locals.user!.id);
  const progress = await conceptProgress.readAll();

  return { roadmapState: state ?? null, progress };
};
