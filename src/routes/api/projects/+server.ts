import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { projects } from '$lib/server/collections';
import { projectSchema } from '$lib/schemas/api';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	return json(await projects.findBy(p => p.userId === locals.user!.id));
};

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const raw = await request.json().catch(() => null);
	if (!raw) error(400, 'Invalid JSON');

	const parsed = projectSchema.safeParse(raw);
	if (!parsed.success) error(400, 'Invalid project data');

	const project = await projects.create({
		id: crypto.randomUUID(),
		userId: locals.user.id,
		name: parsed.data.name,
		description: parsed.data.description,
		status: 'planning',
		conceptSlugs: parsed.data.conceptSlugs,
		startedAt: new Date()
	});
	return json(project, { status: 201 });
};
