import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { mistakes } from '$lib/server/collections';

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const mistake = await mistakes.findById(params.id);
	if (!mistake || mistake.userId !== locals.user.id) error(404, 'Mistake not found');
	return json(mistake);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const mistake = await mistakes.findById(params.id);
	if (!mistake || mistake.userId !== locals.user.id) error(404, 'Mistake not found');
	await mistakes.delete(params.id);
	return new Response(null, { status: 204 });
};
