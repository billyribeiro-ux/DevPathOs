import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { projects } from '$lib/server/collections';

export const GET: RequestHandler = async () => {
  return json(await projects.readAll());
};

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  const project = await projects.create({
    id: crypto.randomUUID(),
    name: data.name ?? 'Untitled Project',
    description: data.description ?? '',
    status: 'planning',
    conceptSlugs: data.conceptSlugs ?? [],
    startedAt: new Date()
  });
  return json(project, { status: 201 });
};
