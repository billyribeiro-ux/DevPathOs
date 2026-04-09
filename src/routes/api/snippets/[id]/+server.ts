import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { snippets } from '$lib/server/collections';

export const GET: RequestHandler = async ({ params }) => {
	const snippet = await snippets.findById(params.id);
	if (!snippet) error(404, 'Snippet not found');
	return json(snippet);
};

export const DELETE: RequestHandler = async ({ params }) => {
	const deleted = await snippets.delete(params.id);
	if (!deleted) error(404, 'Snippet not found');
	return new Response(null, { status: 204 });
};
