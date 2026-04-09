import type { PageServerLoad } from './$types';
import { conceptProgress } from '$lib/server/collections';

export const load: PageServerLoad = async () => {
	const progress = await conceptProgress.readAll();
	return { progress };
};
