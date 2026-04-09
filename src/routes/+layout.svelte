<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import { themeState } from '$lib/state/theme.svelte';
	import { page } from '$app/stores';

	let { children, data } = $props();

	const isOnboardingRoute = $derived($page.url.pathname.startsWith('/onboarding'));

	$effect(() => {
		themeState.init();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if isOnboardingRoute}
	{@render children()}
{:else}
	<AppShell>
		{@render children()}
	</AppShell>
{/if}
