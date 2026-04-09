<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import { themeState } from '$lib/state/theme.svelte';
	import { userState } from '$lib/state/user.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let { children } = $props();

	let initialized = $state(false);

	$effect(() => {
		themeState.init();
		userState.load().then(() => {
			initialized = true;
		});
	});

	$effect(() => {
		if (!initialized) return;
		const path = $page.url.pathname;
		if (!userState.isOnboarded && !path.startsWith('/onboarding')) {
			goto('/onboarding');
		}
	});

	const isOnboardingRoute = $derived($page.url.pathname.startsWith('/onboarding'));
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if !initialized}
	<div class="flex min-h-screen items-center justify-center bg-background">
		<div class="animate-pulse text-muted-foreground">Loading...</div>
	</div>
{:else if isOnboardingRoute}
	{@render children()}
{:else}
	<AppShell>
		{@render children()}
	</AppShell>
{/if}
