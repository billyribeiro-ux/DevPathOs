import type { PageServerLoad } from './$types';
import { weeklyReviews, studyLogs, conceptProgress, mistakes, flashcards } from '$lib/server/collections';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) return { reviews: [], currentWeek: { totalStudyMinutes: 0, conceptsTouched: 0, mistakeCount: 0, flashcardsTotal: 0, flashcardsReviewed: 0, conceptsLearned: 0, dailyMinutes: [] } };

	const uid = locals.user.id;
	const [reviews, logs, progress, allMistakes, allCards] = await Promise.all([
		weeklyReviews.findBy(r => r.userId === uid),
		studyLogs.findBy(l => l.userId === uid),
		conceptProgress.findBy(p => p.userId === uid),
		mistakes.findBy(m => m.userId === uid),
		flashcards.findBy(c => c.userId === uid)
	]);

	const now = new Date();
	const weekStart = new Date(now);
	weekStart.setDate(now.getDate() - now.getDay());
	weekStart.setHours(0, 0, 0, 0);

	const thisWeekLogs = logs.filter(l => new Date(l.timestamp) >= weekStart);
	const totalMinutes = thisWeekLogs.reduce((sum, l) => sum + l.durationMinutes, 0);
	const uniqueConcepts = [...new Set(thisWeekLogs.map(l => l.conceptSlug).filter(Boolean))];
	const thisWeekMistakes = allMistakes.filter(m => new Date(m.createdAt) >= weekStart);

	const dailyMinutes: number[] = [0, 0, 0, 0, 0, 0, 0];
	for (const log of thisWeekLogs) {
		const day = new Date(log.timestamp).getDay();
		dailyMinutes[day] += log.durationMinutes;
	}

	return {
		reviews: reviews.sort((a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime()),
		currentWeek: {
			totalStudyMinutes: totalMinutes,
			conceptsTouched: uniqueConcepts.length,
			mistakeCount: thisWeekMistakes.length,
			flashcardsTotal: allCards.length,
			flashcardsReviewed: allCards.filter(c => c.reps > 0).length,
			conceptsLearned: progress.filter(p => p.status === 'learned' || p.status === 'mastered').length,
			dailyMinutes
		}
	};
};
