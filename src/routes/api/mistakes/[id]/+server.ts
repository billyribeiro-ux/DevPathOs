import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { mistakes } from '$lib/server/collections';

export const GET: RequestHandler = async ({ params }) => {
	const mistake = await mistakes.findById(params.id);
	if (!mistake) error(404, 'Mistake not found');
	return json(mistake);
};

export const DELETE: RequestHandler = async ({ params }) => {
	const deleted = await mistakes.delete(params.id);
	if (!deleted) error(404, 'Mistake not found');
	return new Response(null, { status: 204 });
};
