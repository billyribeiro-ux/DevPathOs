import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { flashcards } from '$lib/server/collections';

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const card = await flashcards.findById(params.id);
	if (!card || card.userId !== locals.user.id) error(404, 'Flashcard not found');
	return json(card);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const card = await flashcards.findById(params.id);
	if (!card || card.userId !== locals.user.id) error(404, 'Flashcard not found');
	await flashcards.delete(params.id);
	return new Response(null, { status: 204 });
};
