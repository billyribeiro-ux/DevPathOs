import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { flashcards } from '$lib/server/collections';

export const GET: RequestHandler = async ({ params }) => {
	const card = await flashcards.findById(params.id);
	if (!card) error(404, 'Flashcard not found');
	return json(card);
};

export const DELETE: RequestHandler = async ({ params }) => {
	const deleted = await flashcards.delete(params.id);
	if (!deleted) error(404, 'Flashcard not found');
	return new Response(null, { status: 204 });
};
