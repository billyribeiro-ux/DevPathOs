import type { PageServerLoad } from './$types';
import { roadmapStates, conceptProgress } from '$lib/server/collections';
import { getConceptsForTrack } from '$lib/content/tracks';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) return { concepts: [], progress: [], roadmapState: null, trackSlug: 'frontend' };

	const trackSlug = 'frontend';
	const concepts = getConceptsForTrack(trackSlug);

	const [progress, state] = await Promise.all([
		conceptProgress.findBy(p => p.trackSlug === trackSlug),
		roadmapStates.findOneBy(s => s.userId === locals.user!.id && s.trackSlug === trackSlug)
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
