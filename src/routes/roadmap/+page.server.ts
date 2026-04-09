import type { PageServerLoad } from './$types';
import { roadmapStates, conceptProgress } from '$lib/server/collections';
import { getConceptsForTrack } from '$lib/content/tracks';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) return { concepts: [], roadmapState: null, trackSlug: 'frontend' };

	const uid = locals.user.id;
	const trackSlug = 'frontend';
	const concepts = getConceptsForTrack(trackSlug);

	const [progress, state] = await Promise.all([
		conceptProgress.findBy(p => p.trackSlug === trackSlug && p.userId === uid),
		roadmapStates.findOneBy(s => s.userId === uid && s.trackSlug === trackSlug)
	]);

	return {
		trackSlug,
		concepts: concepts.map(c => ({
			...c,
			progress: progress.find(p => p.conceptSlug === c.slug)
		})),
		roadmapState: state ?? null
	};
};
