import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { notes } from '$lib/server/collections';
import { noteSchema } from '$lib/schemas/api';

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const note = await notes.findById(params.id);
	if (!note || note.userId !== locals.user.id) error(404, 'Note not found');
	return json(note);
};

export const PUT: RequestHandler = async ({ params, request, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const note = await notes.findById(params.id);
	if (!note || note.userId !== locals.user.id) error(404, 'Note not found');

	const data = await request.json().catch(() => null);
	if (!data) error(400, 'Invalid JSON');

	const parsed = noteSchema.partial().safeParse(data);
	if (!parsed.success) error(400, 'Invalid note data');

	const updated = await notes.update(params.id, { ...parsed.data, updatedAt: new Date() });
	return json(updated);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const note = await notes.findById(params.id);
	if (!note || note.userId !== locals.user.id) error(404, 'Note not found');
	await notes.delete(params.id);
	return new Response(null, { status: 204 });
};
