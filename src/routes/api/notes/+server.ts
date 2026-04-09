import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { notes } from '$lib/server/collections';
import { noteSchema } from '$lib/schemas/api';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const allNotes = await notes.findBy(n => n.userId === locals.user!.id);
	return json(allNotes);
};

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const raw = await request.json().catch(() => null);
	if (!raw) error(400, 'Invalid JSON');

	const parsed = noteSchema.safeParse(raw);
	if (!parsed.success) error(400, parsed.error.flatten().fieldErrors.toString());

	const note = await notes.create({
		id: crypto.randomUUID(),
		userId: locals.user.id,
		title: parsed.data.title,
		content: parsed.data.content,
		tags: parsed.data.tags,
		linkedConcepts: parsed.data.linkedConcepts,
		linkedProjects: parsed.data.linkedProjects,
		createdAt: new Date(),
		updatedAt: new Date()
	});
	return json(note, { status: 201 });
};
