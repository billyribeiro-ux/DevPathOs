import type { PageServerLoad } from './$types';
import { notes, projects, conceptProgress, studyLogs } from '$lib/server/collections';
import { calculateStreak } from '$lib/services/streak';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) return { stats: { conceptsLearned: 0, notesCreated: 0, projectsBuilt: 0, streakDays: 0 } };

  const [allProgress, allNotes, allProjects, allLogs] = await Promise.all([
    conceptProgress.readAll(),
    notes.readAll(),
    projects.readAll(),
    studyLogs.readAll()
  ]);

  const conceptsLearned = allProgress.filter((c) => c.status === 'learned' || c.status === 'mastered').length;
  const notesCreated = allNotes.length;
  const projectsBuilt = allProjects.filter((p) => p.status === 'completed').length;
  const streakDays = calculateStreak(allLogs);

  return {
    stats: {
      conceptsLearned,
      notesCreated,
      projectsBuilt,
      streakDays
    }
  };
};
