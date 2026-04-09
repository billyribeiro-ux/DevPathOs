import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { notes, flashcards, snippets, projects, mistakes, studyLogs, conceptProgress, chatSessions, chatMessages } from '$lib/server/collections';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const uid = locals.user.id;

	const [
		userNotes, userCards, userSnippets, userProjects,
		userMistakes, userLogs, progress, sessions
	] = await Promise.all([
		notes.findBy(n => n.userId === uid),
		flashcards.findBy(c => c.userId === uid),
		snippets.findBy(s => s.userId === uid),
		projects.findBy(p => p.userId === uid),
		mistakes.findBy(m => m.userId === uid),
		studyLogs.findBy(l => l.userId === uid),
		conceptProgress.readAll(),
		chatSessions.findBy(s => s.userId === uid)
	]);

	const sessionIds = new Set(sessions.map(s => s.id));
	const msgs = await chatMessages.readAll();
	const userMessages = msgs.filter(m => sessionIds.has(m.sessionId));

	const exportData = {
		exportedAt: new Date().toISOString(),
		version: '1.0',
		user: { name: locals.user.name, role: locals.user.role, experienceLevel: locals.user.experienceLevel },
		data: {
			notes: userNotes,
			flashcards: userCards,
			snippets: userSnippets,
			projects: userProjects,
			mistakes: userMistakes,
			studyLogs: userLogs,
			conceptProgress: progress,
			chatSessions: sessions,
			chatMessages: userMessages
		}
	};

	return new Response(JSON.stringify(exportData, null, 2), {
		headers: {
			'Content-Type': 'application/json',
			'Content-Disposition': `attachment; filename="devpath-export-${new Date().toISOString().split('T')[0]}.json"`
		}
	});
};
