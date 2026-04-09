import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { conceptProgress, studyLogs } from '$lib/server/collections';
import { getConcept } from '$lib/content/tracks';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');

	const concept = getConcept(params.slug);
	if (!concept) error(404, 'Concept not found');

	const uid = locals.user.id;
	const [progress, logs] = await Promise.all([
		conceptProgress.findOneBy(p => p.conceptSlug === params.slug && p.userId === uid),
		studyLogs.findBy(l => l.conceptSlug === params.slug && l.userId === uid)
	]);

	const totalMinutes = logs.reduce((sum, l) => sum + l.durationMinutes, 0);

	return {
		concept,
		progress: progress ?? null,
		totalMinutes,
		recentLogs: logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10)
	};
};
