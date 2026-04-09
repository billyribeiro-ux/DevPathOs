import type { PageServerLoad } from './$types';
import { mistakes, mistakePatterns } from '$lib/server/collections';

export const load: PageServerLoad = async () => {
  const [allMistakes, allPatterns] = await Promise.all([
    mistakes.readAll(),
    mistakePatterns.readAll()
  ]);

  return { mistakes: allMistakes, patterns: allPatterns };
};
