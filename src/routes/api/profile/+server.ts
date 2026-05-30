import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { users } from '$lib/server/collections';
import { z } from 'zod';

const profileUpdateSchema = z.object({
	name: z.string().min(1).max(100),
	experienceLevel: z.enum(['beginner', 'intermediate', 'advanced'])
}).partial();

export const PUT: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');

	const raw = await request.json().catch(() => null);
	if (!raw) error(400, 'Invalid JSON');

	const parsed = profileUpdateSchema.safeParse(raw);
	if (!parsed.success) error(400, 'Invalid profile data');

	const updated = await users.update(locals.user.id, parsed.data);
	return json(updated);
};
