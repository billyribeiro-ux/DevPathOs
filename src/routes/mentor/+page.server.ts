import type { PageServerLoad } from './$types';
import { chatSessions, chatMessages } from '$lib/server/collections';

export const load: PageServerLoad = async () => {
	const sessions = await chatSessions.readAll();
	return {
		sessions: sessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
	};
};
