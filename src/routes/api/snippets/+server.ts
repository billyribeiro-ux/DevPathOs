import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { snippets } from '$lib/server/collections';

export const GET: RequestHandler = async () => {
  return json(await snippets.readAll());
};

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  const snippet = await snippets.create({
    id: crypto.randomUUID(),
    title: data.title ?? 'Untitled',
    code: data.code ?? '',
    language: data.language ?? 'javascript',
    tags: data.tags ?? [],
    conceptSlug: data.conceptSlug,
    noteId: data.noteId,
    createdAt: new Date()
  });
  return json(snippet, { status: 201 });
};
