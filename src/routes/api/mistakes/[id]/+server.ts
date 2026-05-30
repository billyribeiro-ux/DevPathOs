import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { mistakes } from '$lib/server/collections';
import { mistakeSchema } from '$lib/schemas/api';

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const mistake = await mistakes.findById(params.id);
	if (!mistake || mistake.userId !== locals.user.id) error(404, 'Mistake not found');
	return json(mistake);
};

export const PUT: RequestHandler = async ({ params, request, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const mistake = await mistakes.findById(params.id);
	if (!mistake || mistake.userId !== locals.user.id) error(404, 'Mistake not found');

	const data = await request.json().catch(() => null);
	if (!data) error(400, 'Invalid JSON');

	const parsed = mistakeSchema.partial().safeParse(data);
	if (!parsed.success) error(400, 'Invalid mistake data');

	const updated = await mistakes.update(params.id, parsed.data);
	return json(updated);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const mistake = await mistakes.findById(params.id);
	if (!mistake || mistake.userId !== locals.user.id) error(404, 'Mistake not found');
	await mistakes.delete(params.id);
	return new Response(null, { status: 204 });
};
