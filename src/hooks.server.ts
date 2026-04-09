import type { Handle } from '@sveltejs/kit';
import { users } from '$lib/server/collections';

export const handle: Handle = async ({ event, resolve }) => {
	const userId = event.cookies.get('devpath_user_id');

	if (userId) {
		const user = await users.findById(userId);
		event.locals.user = user ?? null;
	} else {
		event.locals.user = null;
	}

	return resolve(event);
};
