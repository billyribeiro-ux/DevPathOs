import { describe, it, expect } from 'vitest';
import { tracks, allConcepts, getTrack, getConceptsForTrack, getConcept } from './index';

describe('tracks', () => {
	it('has at least one track', () => {
		expect(tracks.length).toBeGreaterThan(0);
	});

	it('frontend track exists', () => {
		const track = getTrack('frontend');
		expect(track).toBeDefined();
		expect(track!.slug).toBe('frontend');
		expect(track!.title).toBe('Front-End Developer');
	});

	it('returns undefined for missing track', () => {
		expect(getTrack('nonexistent')).toBeUndefined();
	});
});

describe('concepts', () => {
	it('has concepts', () => {
		expect(allConcepts.length).toBeGreaterThan(0);
	});

	it('all concepts have required fields', () => {
		for (const c of allConcepts) {
			expect(c.slug).toBeTruthy();
			expect(c.title).toBeTruthy();
			expect(c.description).toBeTruthy();
			expect(c.layer).toBeTruthy();
			expect(c.estimatedMinutes).toBeGreaterThan(0);
		}
	});

	it('getConceptsForTrack returns concepts', () => {
		const concepts = getConceptsForTrack('frontend');
		expect(concepts.length).toBeGreaterThan(0);
	});

	it('getConcept finds a concept', () => {
		const concept = getConcept('html-semantics');
		expect(concept).toBeDefined();
		expect(concept!.title).toBe('HTML Semantics');
	});

	it('prerequisite references are valid', () => {
		const slugs = new Set(allConcepts.map(c => c.slug));
		for (const c of allConcepts) {
			for (const prereq of c.prerequisites) {
				expect(slugs.has(prereq)).toBe(true);
			}
		}
	});
});
