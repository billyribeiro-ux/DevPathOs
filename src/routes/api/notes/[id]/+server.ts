import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { notes } from '$lib/server/collections';

export const GET: RequestHandler = async ({ params }) => {
  const note = await notes.findById(params.id);
  if (!note) error(404, 'Note not found');
  return json(note);
};

export const PUT: RequestHandler = async ({ params, request }) => {
  const data = await request.json();
  const updated = await notes.update(params.id, { ...data, updatedAt: new Date() });
  if (!updated) error(404, 'Note not found');
  return json(updated);
};

export const DELETE: RequestHandler = async ({ params }) => {
  const deleted = await notes.delete(params.id);
  if (!deleted) error(404, 'Note not found');
  return new Response(null, { status: 204 });
};
