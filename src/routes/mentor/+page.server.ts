import type { PageServerLoad } from './$types';
import { chatSessions } from '$lib/server/collections';

export const load: PageServerLoad = async () => {
  const sessions = await chatSessions.readAll();
  return { sessions };
};
