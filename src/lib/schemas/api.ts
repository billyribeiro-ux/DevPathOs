import { z } from 'zod';

export const noteSchema = z.object({
	title: z.string().min(1, 'Title is required').max(500),
	content: z.string().max(50000).default(''),
	tags: z.array(z.string().max(50)).max(20).default([]),
	linkedConcepts: z.array(z.string()).default([]),
	linkedProjects: z.array(z.string()).default([])
});

export const flashcardSchema = z.object({
	front: z.string().min(1, 'Front is required').max(2000),
	back: z.string().min(1, 'Back is required').max(5000),
	noteId: z.string().optional(),
	conceptSlug: z.string().optional(),
	tags: z.array(z.string().max(50)).max(20).default([])
});

export const snippetSchema = z.object({
	title: z.string().min(1, 'Title is required').max(200),
	code: z.string().min(1, 'Code is required').max(100000),
	language: z.string().min(1).max(50).default('javascript'),
	tags: z.array(z.string().max(50)).max(20).default([]),
	conceptSlug: z.string().optional(),
	noteId: z.string().optional()
});

export const projectSchema = z.object({
	name: z.string().min(1, 'Name is required').max(200),
	description: z.string().max(5000).default(''),
	conceptSlugs: z.array(z.string()).default([])
});

export const projectUpdateSchema = z.object({
	name: z.string().min(1).max(200),
	description: z.string().max(5000),
	status: z.enum(['planning', 'active', 'completed', 'abandoned']),
	completedAt: z.string().datetime().transform(s => new Date(s)).optional()
}).partial();

export const mistakeSchema = z.object({
	category: z.enum(['syntax', 'logic', 'type-error', 'async', 'state-management', 'css', 'other']),
	description: z.string().min(1, 'Description is required').max(5000),
	errorMessage: z.string().max(2000).optional(),
	resolution: z.string().max(5000).optional(),
	projectId: z.string().optional(),
	conceptSlug: z.string().optional()
});

export const studyLogSchema = z.object({
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
	conceptSlug: z.string().optional(),
	activity: z.enum(['learn', 'try', 'build', 'explain', 'reuse', 'flashcard', 'note', 'project']),
	durationMinutes: z.number().int().min(0).max(1440)
});

export const reviewRatingSchema = z.object({
	rating: z.number().int().min(1).max(4)
});
