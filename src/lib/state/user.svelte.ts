import type { UserProfile, Role, ExperienceLevel, UserPreferences } from '$lib/types/user';
import { userRepo } from '$lib/db/repositories/user.repo';
import { v4 as uuid } from 'uuid';

class UserState {
	profile = $state<UserProfile | null>(null);
	loading = $state(true);
	isOnboarded = $derived(this.profile?.onboardingCompleted ?? false);

	async load() {
		this.loading = true;
		this.profile = (await userRepo.get()) ?? null;
		this.loading = false;
	}

	async createProfile(data: {
		name: string;
		role: Role;
		goals: string[];
		experienceLevel: ExperienceLevel;
	}): Promise<UserProfile> {
		const profile: UserProfile = {
			id: uuid(),
			name: data.name,
			role: data.role,
			goals: data.goals,
			experienceLevel: data.experienceLevel,
			onboardingCompleted: true,
			createdAt: new Date(),
			preferences: {
				theme: 'system',
				mentorRevealPolicy: 'reveal-after-attempt',
				dailyGoalMinutes: 30,
				notificationsEnabled: true
			}
		};
		await userRepo.create(profile);
		this.profile = profile;
		return profile;
	}

	async updatePreferences(prefs: Partial<UserPreferences>) {
		if (!this.profile) return;
		this.profile.preferences = { ...this.profile.preferences, ...prefs };
		await userRepo.update(this.profile);
	}
}

export const userState = new UserState();
