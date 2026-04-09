import { z } from 'zod';

const roles = [
	'frontend',
	'svelte-specialist',
	'fullstack',
	'freelancer',
	'career-switcher',
	'designer-coder'
] as const;

const experienceLevels = ['beginner', 'intermediate', 'advanced'] as const;

export const roleSchema = z.object({
	role: z.enum(roles)
});

export const goalsSchema = z.object({
	role: z.enum(roles),
	name: z.string().min(1, 'Name is required').max(100),
	goals: z.array(z.string().min(1)).min(1, 'Select at least one goal')
});

export const assessmentSchema = z.object({
	role: z.enum(roles),
	name: z.string().min(1),
	goals: z.array(z.string().min(1)).min(1),
	experienceLevel: z.enum(experienceLevels)
});
