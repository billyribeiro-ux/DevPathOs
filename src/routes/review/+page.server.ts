import type { PageServerLoad } from './$types';
import { weeklyReviews } from '$lib/server/collections';

export const load: PageServerLoad = async () => {
  const reviews = await weeklyReviews.readAll();
  return { reviews };
};
