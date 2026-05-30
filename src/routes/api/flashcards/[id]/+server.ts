import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { flashcards } from '$lib/server/collections';
import { flashcardSchema } from '$lib/schemas/api';

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const card = await flashcards.findById(params.id);
	if (!card || card.userId !== locals.user.id) error(404, 'Flashcard not found');
	return json(card);
};

export const PUT: RequestHandler = async ({ params, request, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const card = await flashcards.findById(params.id);
	if (!card || card.userId !== locals.user.id) error(404, 'Flashcard not found');

	const data = await request.json().catch(() => null);
	if (!data) error(400, 'Invalid JSON');

	const parsed = flashcardSchema.partial().safeParse(data);
	if (!parsed.success) error(400, 'Invalid flashcard data');

	const updated = await flashcards.update(params.id, parsed.data);
	return json(updated);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const card = await flashcards.findById(params.id);
	if (!card || card.userId !== locals.user.id) error(404, 'Flashcard not found');
	await flashcards.delete(params.id);
	return new Response(null, { status: 204 });
};
