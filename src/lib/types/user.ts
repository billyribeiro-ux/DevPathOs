export type Role = 'frontend' | 'svelte-specialist' | 'fullstack' | 'freelancer' | 'career-switcher' | 'designer-coder';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  mentorRevealPolicy: 'never-reveal' | 'reveal-after-attempt' | 'always-reveal';
  dailyGoalMinutes: number;
  notificationsEnabled: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  role: Role;
  goals: string[];
  experienceLevel: ExperienceLevel;
  onboardingCompleted: boolean;
  createdAt: Date;
  preferences: UserPreferences;
}

export const ROLE_LABELS: Record<Role, string> = {
  'frontend': 'Front-End Developer',
  'svelte-specialist': 'Svelte Specialist',
  'fullstack': 'Full-Stack Engineer',
  'freelancer': 'Freelancer',
  'career-switcher': 'Career Switcher',
  'designer-coder': 'Designer Who Codes'
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  'frontend': 'Build modern, accessible, performant web interfaces',
  'svelte-specialist': 'Master Svelte 5 and SvelteKit for component-driven development',
  'fullstack': 'Handle both front-end and back-end to ship complete applications',
  'freelancer': 'Build and ship websites for clients independently',
  'career-switcher': 'Transition into a professional developer role',
  'designer-coder': 'Add coding skills to your design toolkit'
};

export const ROLE_GOALS: Record<Role, string[]> = {
  'frontend': ['Build responsive layouts', 'Master CSS architecture', 'Create accessible interfaces', 'Work with modern frameworks', 'Optimize performance'],
  'svelte-specialist': ['Master Svelte 5 runes', 'Build SvelteKit apps', 'Component library development', 'Server-side rendering', 'Deploy production apps'],
  'fullstack': ['Front-end fundamentals', 'API design', 'Database basics', 'Authentication flows', 'Deployment pipelines'],
  'freelancer': ['Build client websites', 'Responsive design', 'SEO fundamentals', 'CMS integration', 'Project management'],
  'career-switcher': ['Core programming concepts', 'Portfolio projects', 'Interview preparation', 'Git workflow', 'Team collaboration'],
  'designer-coder': ['HTML/CSS mastery', 'Design system implementation', 'Animation and transitions', 'Component thinking', 'Prototyping with code']
};
