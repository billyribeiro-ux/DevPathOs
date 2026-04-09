import type { PageServerLoad } from './$types';
import { chatSessions } from '$lib/server/collections';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) return { sessions: [] };
	const sessions = await chatSessions.findBy(s => s.userId === locals.user!.id);
	return {
		sessions: sessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
	};
};
