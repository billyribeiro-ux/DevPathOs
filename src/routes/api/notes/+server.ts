import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { notes } from '$lib/server/collections';

export const GET: RequestHandler = async () => {
  const allNotes = await notes.readAll();
  return json(allNotes);
};

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  const note = await notes.create({
    id: crypto.randomUUID(),
    title: data.title ?? 'Untitled',
    content: data.content ?? '',
    tags: data.tags ?? [],
    linkedConcepts: data.linkedConcepts ?? [],
    linkedProjects: data.linkedProjects ?? [],
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return json(note, { status: 201 });
};
