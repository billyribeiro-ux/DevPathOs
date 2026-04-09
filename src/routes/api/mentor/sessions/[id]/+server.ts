import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { chatSessions, chatMessages } from '$lib/server/collections';

export const GET: RequestHandler = async ({ params }) => {
	const session = await chatSessions.findById(params.id);
	if (!session) error(404, 'Session not found');
	return json(session);
};

export const DELETE: RequestHandler = async ({ params }) => {
	const deleted = await chatSessions.delete(params.id);
	if (!deleted) error(404, 'Session not found');
	// Also delete associated messages
	const msgs = await chatMessages.findBy(m => m.sessionId === params.id);
	for (const msg of msgs) {
		await chatMessages.delete(msg.id);
	}
	return new Response(null, { status: 204 });
};
