<script lang="ts">
	import './layout.css';
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import { themeState } from '$lib/state/theme.svelte';
	import { page } from '$app/stores';

	let { children, data } = $props();

	const isOnboardingRoute = $derived($page.url.pathname.startsWith('/onboarding'));

	$effect(() => {
		themeState.init();
	});
</script>

{#if isOnboardingRoute}
	{@render children()}
{:else}
	<AppShell>
		{@render children()}
	</AppShell>
{/if}
