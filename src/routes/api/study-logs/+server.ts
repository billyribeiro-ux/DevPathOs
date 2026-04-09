import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { studyLogs } from '$lib/server/collections';

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  const log = await studyLogs.create({
    id: crypto.randomUUID(),
    date: data.date ?? new Date().toISOString().split('T')[0],
    conceptSlug: data.conceptSlug,
    activity: data.activity ?? 'learn',
    durationMinutes: data.durationMinutes ?? 0,
    timestamp: new Date()
  });
  return json(log, { status: 201 });
};
