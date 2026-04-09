import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { chatSessions } from '$lib/server/collections';

export const GET: RequestHandler = async () => {
	const sessions = await chatSessions.readAll();
	return json(sessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
};

export const POST: RequestHandler = async ({ request }) => {
	const { mode } = await request.json();
	const session = await chatSessions.create({
		id: crypto.randomUUID(),
		mode: mode ?? 'coach',
		createdAt: new Date(),
		title: undefined
	});
	return json(session, { status: 201 });
};
