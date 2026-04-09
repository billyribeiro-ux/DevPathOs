import type { PageServerLoad } from './$types';
import { learningSessions, conceptProgress, studyLogs } from '$lib/server/collections';
import { getConceptsForTrack } from '$lib/content/tracks';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) return { concepts: [], sessions: [], recentLogs: [] };

	const uid = locals.user.id;
	const trackSlug = 'frontend';
	const concepts = getConceptsForTrack(trackSlug);

	const [sessions, progress, logs] = await Promise.all([
		learningSessions.findBy(s => s.userId === uid),
		conceptProgress.findBy(p => p.trackSlug === trackSlug && p.userId === uid),
		studyLogs.findBy(l => l.userId === uid)
	]);

	const recentLogs = logs
		.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
		.slice(0, 20);

	return {
		trackSlug,
		concepts: concepts.map(c => ({
			...c,
			progress: progress.find(p => p.conceptSlug === c.slug)
		})),
		sessions,
		recentLogs
	};
};
