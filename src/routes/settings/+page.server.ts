import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { users } from '$lib/server/collections';

export const load: PageServerLoad = async ({ locals }) => {
  return { user: locals.user };
};

export const actions: Actions = {
  updateTheme: async ({ request, locals }) => {
    if (!locals.user) return fail(401);

    const formData = await request.formData();
    const theme = formData.get('theme') as string;

    if (!['light', 'dark', 'system'].includes(theme)) {
      return fail(400, { error: 'Invalid theme' });
    }

    await users.update(locals.user.id, {
      preferences: { ...locals.user.preferences, theme: theme as 'light' | 'dark' | 'system' }
    });

    return { success: true };
  }
};
