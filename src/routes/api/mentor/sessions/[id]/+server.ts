import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { chatSessions, chatMessages } from '$lib/server/collections';

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const session = await chatSessions.findById(params.id);
	if (!session || session.userId !== locals.user.id) error(404, 'Session not found');
	return json(session);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const session = await chatSessions.findById(params.id);
	if (!session || session.userId !== locals.user.id) error(404, 'Session not found');

	await chatSessions.delete(params.id);
	await chatMessages.deleteBy(m => m.sessionId === params.id);
	return new Response(null, { status: 204 });
};
