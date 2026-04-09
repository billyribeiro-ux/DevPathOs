import type { PageServerLoad } from './$types';
import { notes, flashcards, snippets } from '$lib/server/collections';

export const load: PageServerLoad = async () => {
  const [allNotes, allFlashcards, allSnippets] = await Promise.all([
    notes.readAll(),
    flashcards.readAll(),
    snippets.readAll()
  ]);

  return { notes: allNotes, flashcards: allFlashcards, snippets: allSnippets };
};
