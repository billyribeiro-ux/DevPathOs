import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { mistakes } from '$lib/server/collections';

export const GET: RequestHandler = async () => {
  return json(await mistakes.readAll());
};

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  const mistake = await mistakes.create({
    id: crypto.randomUUID(),
    category: data.category ?? 'other',
    description: data.description ?? '',
    projectId: data.projectId,
    conceptSlug: data.conceptSlug,
    errorMessage: data.errorMessage,
    resolution: data.resolution,
    createdAt: new Date()
  });
  return json(mistake, { status: 201 });
};
