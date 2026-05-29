import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { flashcards } from '$lib/server/collections';
import { reviewRatingSchema } from '$lib/schemas/api';
import { fsrs, generatorParameters, Rating, type CardInput, type Grade } from 'ts-fsrs';

const params = generatorParameters();
const f = fsrs(params);

export const POST: RequestHandler = async ({ params: routeParams, request, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const card = await flashcards.findById(routeParams.id);
	if (!card || card.userId !== locals.user.id) error(404, 'Flashcard not found');

	const raw = await request.json().catch(() => null);
	if (!raw) error(400, 'Invalid JSON');
	const parsed = reviewRatingSchema.safeParse(raw);
	if (!parsed.success) error(400, 'Invalid rating');

	const ratingMap: Record<number, Grade> = {
		1: Rating.Again,
		2: Rating.Hard,
		3: Rating.Good,
		4: Rating.Easy
	};
	const fsrsRating = ratingMap[parsed.data.rating];

	const fsrsCard: CardInput = {
		due: new Date(card.dueDate),
		stability: card.stability,
		difficulty: card.difficulty,
		elapsed_days: card.elapsedDays,
		scheduled_days: card.scheduledDays,
		learning_steps: card.learningSteps ?? 0,
		reps: card.reps,
		lapses: card.lapses,
		state: card.state === 'new' ? 0 : card.state === 'learning' ? 1 : card.state === 'review' ? 2 : 3,
		last_review: card.lastReviewDate ? new Date(card.lastReviewDate) : undefined
	};

	const result = f.repeat(fsrsCard, new Date());
	const scheduled = result[fsrsRating];
	const updatedFsrs = scheduled.card;

	const stateMap: Record<number, 'new' | 'learning' | 'review' | 'relearning'> = {
		0: 'new', 1: 'learning', 2: 'review', 3: 'relearning'
	};

	const updated = await flashcards.update(card.id, {
		dueDate: updatedFsrs.due,
		stability: updatedFsrs.stability,
		difficulty: updatedFsrs.difficulty,
		elapsedDays: updatedFsrs.elapsed_days,
		scheduledDays: updatedFsrs.scheduled_days,
		learningSteps: updatedFsrs.learning_steps,
		reps: updatedFsrs.reps,
		lapses: updatedFsrs.lapses,
		state: stateMap[updatedFsrs.state] ?? 'review',
		lastReviewDate: new Date()
	});

	return json(updated);
};
