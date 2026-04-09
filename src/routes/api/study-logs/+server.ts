import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { studyLogs } from '$lib/server/collections';
import { studyLogSchema } from '$lib/schemas/api';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	return json(await studyLogs.findBy(l => l.userId === locals.user!.id));
};

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const raw = await request.json().catch(() => null);
	if (!raw) error(400, 'Invalid JSON');

	const parsed = studyLogSchema.safeParse(raw);
	if (!parsed.success) error(400, 'Invalid study log');

	const log = await studyLogs.create({
		id: crypto.randomUUID(),
		userId: locals.user.id,
		date: parsed.data.date ?? new Date().toISOString().split('T')[0],
		conceptSlug: parsed.data.conceptSlug,
		activity: parsed.data.activity,
		durationMinutes: parsed.data.durationMinutes,
		timestamp: new Date()
	});
	return json(log, { status: 201 });
};
