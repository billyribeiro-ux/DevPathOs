import type { PageServerLoad } from './$types';
import { mistakes, mistakePatterns } from '$lib/server/collections';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) return { mistakes: [], patterns: [] };
	const uid = locals.user.id;
	const [allMistakes, allPatterns] = await Promise.all([
		mistakes.findBy(m => m.userId === uid),
		mistakePatterns.findBy(p => p.userId === uid)
	]);
	return { mistakes: allMistakes, patterns: allPatterns };
};
