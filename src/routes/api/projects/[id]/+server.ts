import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { projects } from '$lib/server/collections';

export const GET: RequestHandler = async ({ params }) => {
  const project = await projects.findById(params.id);
  if (!project) error(404, 'Project not found');
  return json(project);
};

export const PUT: RequestHandler = async ({ params, request }) => {
  const data = await request.json();
  const updated = await projects.update(params.id, data);
  if (!updated) error(404, 'Project not found');
  return json(updated);
};

export const DELETE: RequestHandler = async ({ params }) => {
  const deleted = await projects.delete(params.id);
  if (!deleted) error(404, 'Project not found');
  return new Response(null, { status: 204 });
};
