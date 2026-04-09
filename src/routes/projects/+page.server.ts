import type { PageServerLoad } from './$types';
import { projects } from '$lib/server/collections';

export const load: PageServerLoad = async () => {
  const allProjects = await projects.readAll();
  return { projects: allProjects };
};
