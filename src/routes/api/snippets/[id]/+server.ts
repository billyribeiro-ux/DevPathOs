import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { snippets } from '$lib/server/collections';

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const snippet = await snippets.findById(params.id);
	if (!snippet || snippet.userId !== locals.user.id) error(404, 'Snippet not found');
	return json(snippet);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const snippet = await snippets.findById(params.id);
	if (!snippet || snippet.userId !== locals.user.id) error(404, 'Snippet not found');
	await snippets.delete(params.id);
	return new Response(null, { status: 204 });
};
