import { describe, it, expect } from 'vitest';
import { calculateStreak } from './streak';
import type { StudyLog } from '$lib/types/review';

function makeLog(date: string): StudyLog {
	return {
		id: crypto.randomUUID(),
		userId: 'test-user',
		date,
		activity: 'learn',
		durationMinutes: 30,
		timestamp: new Date(date)
	};
}

describe('calculateStreak', () => {
	it('returns 0 for empty logs', () => {
		expect(calculateStreak([])).toBe(0);
	});

	it('returns 0 when no recent activity', () => {
		const logs = [makeLog('2020-01-01')];
		expect(calculateStreak(logs)).toBe(0);
	});

	it('returns 1 for activity today only', () => {
		const today = new Date().toISOString().split('T')[0];
		const logs = [makeLog(today)];
		expect(calculateStreak(logs)).toBe(1);
	});

	it('returns 1 for activity yesterday only', () => {
		const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
		const logs = [makeLog(yesterday)];
		expect(calculateStreak(logs)).toBe(1);
	});

	it('counts consecutive days', () => {
		const today = new Date();
		const logs = [
			makeLog(today.toISOString().split('T')[0]),
			makeLog(new Date(today.getTime() - 86400000).toISOString().split('T')[0]),
			makeLog(new Date(today.getTime() - 86400000 * 2).toISOString().split('T')[0])
		];
		expect(calculateStreak(logs)).toBe(3);
	});

	it('stops at gaps', () => {
		const today = new Date();
		const logs = [
			makeLog(today.toISOString().split('T')[0]),
			makeLog(new Date(today.getTime() - 86400000).toISOString().split('T')[0]),
			// gap
			makeLog(new Date(today.getTime() - 86400000 * 3).toISOString().split('T')[0])
		];
		expect(calculateStreak(logs)).toBe(2);
	});

	it('handles duplicate dates', () => {
		const today = new Date().toISOString().split('T')[0];
		const logs = [makeLog(today), makeLog(today), makeLog(today)];
		expect(calculateStreak(logs)).toBe(1);
	});
});
