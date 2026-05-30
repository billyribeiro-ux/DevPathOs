import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { chatSessions } from '$lib/server/collections';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const sessions = await chatSessions.findBy(s => s.userId === locals.user!.id);
	return json(sessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
};

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const raw = await request.json().catch(() => null);
	if (!raw) error(400, 'Invalid JSON');
	const validModes = ['coach', 'teacher', 'debugger', 'interviewer', 'reflection'];
	if (!raw.mode || !validModes.includes(raw.mode)) error(400, 'Invalid mode');
	const mode = raw.mode;

	const session = await chatSessions.create({
		id: crypto.randomUUID(),
		userId: locals.user.id,
		mode,
		createdAt: new Date(),
		title: undefined
	});
	return json(session, { status: 201 });
};
