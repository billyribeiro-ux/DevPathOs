import { frontendTrack, frontendConcepts } from './frontend';
import type { TrackMeta, ConceptMeta } from '$lib/types/roadmap';

export const tracks: TrackMeta[] = [frontendTrack];

export const allConcepts: ConceptMeta[] = [...frontendConcepts];

export function getTrack(slug: string): TrackMeta | undefined {
	return tracks.find(t => t.slug === slug);
}

export function getConceptsForTrack(trackSlug: string): ConceptMeta[] {
	const track = getTrack(trackSlug);
	if (!track) return [];
	const allSlugs = [
		...track.layers.foundation,
		...track.layers.framework,
		...track.layers.professional
	];
	return allConcepts.filter(c => allSlugs.includes(c.slug));
}

export function getConcept(slug: string): ConceptMeta | undefined {
	return allConcepts.find(c => c.slug === slug);
}
