import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { projects } from '$lib/server/collections';

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const project = await projects.findById(params.id);
	if (!project || project.userId !== locals.user.id) error(404, 'Project not found');
	return json(project);
};

export const PUT: RequestHandler = async ({ params, request, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const project = await projects.findById(params.id);
	if (!project || project.userId !== locals.user.id) error(404, 'Project not found');

	const data = await request.json().catch(() => null);
	if (!data) error(400, 'Invalid JSON');

	// Only allow specific fields to be updated
	const allowed: Record<string, unknown> = {};
	if (data.name !== undefined) allowed.name = data.name;
	if (data.description !== undefined) allowed.description = data.description;
	if (data.status !== undefined) {
		const validStatuses = ['planning', 'active', 'completed', 'abandoned'];
		if (!validStatuses.includes(data.status)) error(400, 'Invalid status');
		allowed.status = data.status;
	}
	if (data.completedAt !== undefined) allowed.completedAt = data.completedAt;

	const updated = await projects.update(params.id, allowed);
	return json(updated);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const project = await projects.findById(params.id);
	if (!project || project.userId !== locals.user.id) error(404, 'Project not found');
	await projects.delete(params.id);
	return new Response(null, { status: 204 });
};
