import type { Handle } from '@sveltejs/kit';
import { users } from '$lib/server/collections';
import { verifyUserId } from '$lib/server/cookie';

export const handle: Handle = async ({ event, resolve }) => {
	const signed = event.cookies.get('devpath_user_id');

	if (signed) {
		const userId = verifyUserId(signed);
		if (userId) {
			const user = await users.findById(userId);
			event.locals.user = user ?? null;
		} else {
			event.locals.user = null;
			event.cookies.delete('devpath_user_id', { path: '/' });
		}
	} else {
		event.locals.user = null;
	}

	return resolve(event);
};
