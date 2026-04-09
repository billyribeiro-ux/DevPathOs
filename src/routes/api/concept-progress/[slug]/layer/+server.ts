import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { conceptProgress } from '$lib/server/collections';
import type { LearningLayer } from '$lib/types/roadmap';

const validLayers: LearningLayer[] = ['learn', 'try', 'build', 'explain', 'reuse'];

export const POST: RequestHandler = async ({ params, request, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');

	const { layer } = await request.json().catch(() => ({ layer: null }));
	if (!layer || !validLayers.includes(layer)) error(400, 'Invalid layer');

	const uid = locals.user.id;
	let existing = await conceptProgress.findOneBy(
		p => p.conceptSlug === params.slug && p.userId === uid
	);

	if (!existing) {
		existing = await conceptProgress.create({
			id: crypto.randomUUID(),
			userId: uid,
			trackSlug: 'frontend',
			conceptSlug: params.slug,
			status: 'in-progress',
			layers: {
				learn: { completed: false },
				try: { completed: false },
				build: { completed: false },
				explain: { completed: false },
				reuse: { completed: false }
			},
			reuseCount: 0,
			tags: []
		});
	}

	const updatedLayers = {
		...existing.layers,
		[layer]: { completed: true, completedAt: new Date() }
	};

	const allCompleted = validLayers.every(l => updatedLayers[l]?.completed);
	const newStatus = allCompleted ? 'learned' : 'in-progress';

	const updated = await conceptProgress.update(existing.id, {
		layers: updatedLayers,
		status: newStatus,
		lastReviewedAt: new Date()
	});

	return json(updated);
};
