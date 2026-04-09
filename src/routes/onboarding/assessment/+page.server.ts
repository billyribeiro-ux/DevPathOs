import { fail, redirect } from '@sveltejs/kit';
import { assessmentSchema } from '$lib/schemas/onboarding';
import { users } from '$lib/server/collections';
import type { Actions, PageServerLoad } from './$types';
import type { UserPreferences } from '$lib/types/user';

export const load: PageServerLoad = async ({ url }) => {
	const role = url.searchParams.get('role') ?? 'frontend';
	const name = decodeURIComponent(url.searchParams.get('name') ?? '');
	const goalsParam = url.searchParams.get('goals') ?? '';
	const goals = decodeURIComponent(goalsParam).split(',').filter(Boolean);

	return { role, name, goals };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();

		const parsed = assessmentSchema.safeParse({
			role: formData.get('role'),
			name: formData.get('name'),
			goals: formData.getAll('goals'),
			experienceLevel: formData.get('experienceLevel')
		});

		if (!parsed.success) {
			return fail(400, {
				error: 'Invalid form data',
				issues: parsed.error.flatten().fieldErrors
			});
		}

		const { role, name, goals, experienceLevel } = parsed.data;

		const defaultPreferences: UserPreferences = {
			theme: 'system',
			mentorRevealPolicy: 'reveal-after-attempt',
			dailyGoalMinutes: 30,
			notificationsEnabled: true
		};

		const profile = {
			id: crypto.randomUUID(),
			name,
			role,
			goals,
			experienceLevel,
			onboardingCompleted: true,
			createdAt: new Date(),
			preferences: defaultPreferences
		};

		await users.create(profile);

		cookies.set('devpath_user_id', profile.id, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 365 // 1 year
		});

		redirect(303, '/');
	}
};
