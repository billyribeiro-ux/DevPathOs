import type { PageServerLoad } from './$types';
import { learningSessions } from '$lib/server/collections';

export const load: PageServerLoad = async () => {
  const sessions = await learningSessions.readAll();
  return { sessions };
};
