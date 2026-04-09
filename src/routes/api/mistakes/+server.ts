import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { mistakes } from '$lib/server/collections';
import { mistakeSchema } from '$lib/schemas/api';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	return json(await mistakes.findBy(m => m.userId === locals.user!.id));
};

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const raw = await request.json().catch(() => null);
	if (!raw) error(400, 'Invalid JSON');

	const parsed = mistakeSchema.safeParse(raw);
	if (!parsed.success) error(400, 'Invalid mistake data');

	const mistake = await mistakes.create({
		id: crypto.randomUUID(),
		userId: locals.user.id,
		category: parsed.data.category,
		description: parsed.data.description,
		projectId: parsed.data.projectId,
		conceptSlug: parsed.data.conceptSlug,
		errorMessage: parsed.data.errorMessage,
		resolution: parsed.data.resolution,
		createdAt: new Date()
	});
	return json(mistake, { status: 201 });
};
