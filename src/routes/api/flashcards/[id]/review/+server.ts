import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { flashcards } from '$lib/server/collections';
import { createEmptyCard, fsrs, generatorParameters, Rating } from 'ts-fsrs';

const params = generatorParameters();
const f = fsrs(params);

export const POST: RequestHandler = async ({ params: routeParams, request }) => {
	const card = await flashcards.findById(routeParams.id);
	if (!card) error(404, 'Flashcard not found');

	const { rating } = await request.json();
	const ratingMap: Record<number, Rating> = {
		1: Rating.Again,
		2: Rating.Hard,
		3: Rating.Good,
		4: Rating.Easy
	};

	const fsrsRating = ratingMap[rating] ?? Rating.Good;

	const fsrsCard = {
		due: new Date(card.dueDate),
		stability: card.stability,
		difficulty: card.difficulty,
		elapsed_days: card.elapsedDays,
		scheduled_days: card.scheduledDays,
		reps: card.reps,
		lapses: card.lapses,
		state: card.state === 'new' ? 0 : card.state === 'learning' ? 1 : card.state === 'review' ? 2 : 3,
		last_review: card.lastReviewDate ? new Date(card.lastReviewDate) : undefined
	};

	const result = f.repeat(fsrsCard as ReturnType<typeof createEmptyCard>, new Date());
	const scheduled = result[fsrsRating];
	const updatedFsrs = scheduled.card;

	const stateMap: Record<number, 'new' | 'learning' | 'review' | 'relearning'> = {
		0: 'new',
		1: 'learning',
		2: 'review',
		3: 'relearning'
	};

	const updated = await flashcards.update(card.id, {
		dueDate: updatedFsrs.due,
		stability: updatedFsrs.stability,
		difficulty: updatedFsrs.difficulty,
		elapsedDays: updatedFsrs.elapsed_days,
		scheduledDays: updatedFsrs.scheduled_days,
		reps: updatedFsrs.reps,
		lapses: updatedFsrs.lapses,
		state: stateMap[updatedFsrs.state] ?? 'review',
		lastReviewDate: new Date()
	});

	return json(updated);
};
