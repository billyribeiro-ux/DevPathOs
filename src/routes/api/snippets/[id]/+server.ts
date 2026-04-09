import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { snippets } from '$lib/server/collections';
import { snippetSchema } from '$lib/schemas/api';

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const snippet = await snippets.findById(params.id);
	if (!snippet || snippet.userId !== locals.user.id) error(404, 'Snippet not found');
	return json(snippet);
};

export const PUT: RequestHandler = async ({ params, request, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const snippet = await snippets.findById(params.id);
	if (!snippet || snippet.userId !== locals.user.id) error(404, 'Snippet not found');

	const data = await request.json().catch(() => null);
	if (!data) error(400, 'Invalid JSON');

	const parsed = snippetSchema.partial().safeParse(data);
	if (!parsed.success) error(400, 'Invalid snippet data');

	const updated = await snippets.update(params.id, parsed.data);
	return json(updated);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const snippet = await snippets.findById(params.id);
	if (!snippet || snippet.userId !== locals.user.id) error(404, 'Snippet not found');
	await snippets.delete(params.id);
	return new Response(null, { status: 204 });
};
