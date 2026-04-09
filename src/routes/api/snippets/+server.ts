import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { snippets } from '$lib/server/collections';
import { snippetSchema } from '$lib/schemas/api';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	return json(await snippets.findBy(s => s.userId === locals.user!.id));
};

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const raw = await request.json().catch(() => null);
	if (!raw) error(400, 'Invalid JSON');

	const parsed = snippetSchema.safeParse(raw);
	if (!parsed.success) error(400, 'Invalid snippet data');

	const snippet = await snippets.create({
		id: crypto.randomUUID(),
		userId: locals.user.id,
		title: parsed.data.title,
		code: parsed.data.code,
		language: parsed.data.language,
		tags: parsed.data.tags,
		conceptSlug: parsed.data.conceptSlug,
		noteId: parsed.data.noteId,
		createdAt: new Date()
	});
	return json(snippet, { status: 201 });
};
