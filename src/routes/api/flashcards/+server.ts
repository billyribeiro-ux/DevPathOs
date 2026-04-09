import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { flashcards } from '$lib/server/collections';

export const GET: RequestHandler = async () => {
  return json(await flashcards.readAll());
};

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  const card = await flashcards.create({
    id: crypto.randomUUID(),
    front: data.front ?? '',
    back: data.back ?? '',
    noteId: data.noteId,
    conceptSlug: data.conceptSlug,
    tags: data.tags ?? [],
    dueDate: new Date(),
    stability: 0,
    difficulty: 0,
    elapsedDays: 0,
    scheduledDays: 0,
    reps: 0,
    lapses: 0,
    state: 'new',
    lastReviewDate: undefined
  });
  return json(card, { status: 201 });
};
