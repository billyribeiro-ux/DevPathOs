import type { PageServerLoad } from './$types';
import { notes, flashcards, snippets } from '$lib/server/collections';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) return { notes: [], flashcards: [], snippets: [] };

	const uid = locals.user.id;
	const [allNotes, allFlashcards, allSnippets] = await Promise.all([
		notes.findBy(n => n.userId === uid),
		flashcards.findBy(c => c.userId === uid),
		snippets.findBy(s => s.userId === uid)
	]);

	return { notes: allNotes, flashcards: allFlashcards, snippets: allSnippets };
};
