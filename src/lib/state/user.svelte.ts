import type { UserProfile } from '$lib/types/user';

class UserState {
	profile = $state<UserProfile | null>(null);
	isOnboarded = $derived(this.profile?.onboardingCompleted ?? false);

	set(user: UserProfile | null) {
		this.profile = user;
	}
}

export const userState = new UserState();
