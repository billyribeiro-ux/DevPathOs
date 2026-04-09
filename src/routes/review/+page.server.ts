import type { PageServerLoad } from './$types';
import { weeklyReviews, studyLogs, conceptProgress, mistakes, flashcards } from '$lib/server/collections';

export const load: PageServerLoad = async () => {
	const [reviews, logs, progress, allMistakes, allCards] = await Promise.all([
		weeklyReviews.readAll(),
		studyLogs.readAll(),
		conceptProgress.readAll(),
		mistakes.readAll(),
		flashcards.readAll()
	]);

	// Compute current week stats
	const now = new Date();
	const weekStart = new Date(now);
	weekStart.setDate(now.getDate() - now.getDay());
	weekStart.setHours(0, 0, 0, 0);

	const thisWeekLogs = logs.filter(l => new Date(l.timestamp) >= weekStart);
	const totalMinutes = thisWeekLogs.reduce((sum, l) => sum + l.durationMinutes, 0);
	const uniqueConcepts = [...new Set(thisWeekLogs.map(l => l.conceptSlug).filter(Boolean))];
	const thisWeekMistakes = allMistakes.filter(m => new Date(m.createdAt) >= weekStart);

	const currentWeek = {
		totalStudyMinutes: totalMinutes,
		conceptsTouched: uniqueConcepts.length,
		mistakeCount: thisWeekMistakes.length,
		flashcardsTotal: allCards.length,
		flashcardsReviewed: allCards.filter(c => c.reps > 0).length,
		conceptsLearned: progress.filter(p => p.status === 'learned' || p.status === 'mastered').length
	};

	return {
		reviews: reviews.sort((a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime()),
		currentWeek
	};
};
