import type { PageServerLoad } from './$types';
import { projects } from '$lib/server/collections';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) return { projects: [] };
	const allProjects = await projects.findBy(p => p.userId === locals.user!.id);
	return { projects: allProjects };
};
