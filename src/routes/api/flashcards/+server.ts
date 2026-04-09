import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { flashcards } from '$lib/server/collections';
import { flashcardSchema } from '$lib/schemas/api';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	return json(await flashcards.findBy(c => c.userId === locals.user!.id));
};

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const raw = await request.json().catch(() => null);
	if (!raw) error(400, 'Invalid JSON');

	const parsed = flashcardSchema.safeParse(raw);
	if (!parsed.success) error(400, 'Invalid flashcard data');

	const card = await flashcards.create({
		id: crypto.randomUUID(),
		userId: locals.user.id,
		front: parsed.data.front,
		back: parsed.data.back,
		noteId: parsed.data.noteId,
		conceptSlug: parsed.data.conceptSlug,
		tags: parsed.data.tags,
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
