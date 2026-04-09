import type { PageServerLoad } from './$types';
import { conceptProgress } from '$lib/server/collections';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) return { progress: [] };
	const progress = await conceptProgress.findBy(p => p.userId === locals.user!.id);
	return { progress };
};
