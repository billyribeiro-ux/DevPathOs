import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { projects } from '$lib/server/collections';
import { projectUpdateSchema } from '$lib/schemas/api';

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

	const parsed = projectUpdateSchema.safeParse(data);
	if (!parsed.success) error(400, 'Invalid project data');

	const updated = await projects.update(params.id, parsed.data);
	return json(updated);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const project = await projects.findById(params.id);
	if (!project || project.userId !== locals.user.id) error(404, 'Project not found');
	await projects.delete(params.id);
	return new Response(null, { status: 204 });
};
