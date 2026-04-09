import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.user && !url.pathname.startsWith('/onboarding')) {
		redirect(303, '/onboarding');
	}

	return {
		user: locals.user
	};
};
