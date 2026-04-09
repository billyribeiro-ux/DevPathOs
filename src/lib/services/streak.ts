import type { StudyLog } from '$lib/types/review';

export function calculateStreak(logs: StudyLog[]): number {
	if (logs.length === 0) return 0;

	const dates = [...new Set(logs.map(l => l.date))].sort().reverse();

	const today = new Date().toISOString().split('T')[0];
	const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

	// Must have activity today or yesterday to have a streak
	if (dates[0] !== today && dates[0] !== yesterday) return 0;

	let streak = 0;
	let currentDate = new Date(dates[0]);

	for (const date of dates) {
		const d = new Date(date);
		const expected = new Date(currentDate);

		if (d.getTime() === expected.getTime()) {
			streak++;
			currentDate = new Date(expected.getTime() - 86400000);
		} else {
			break;
		}
	}

	return streak;
}
