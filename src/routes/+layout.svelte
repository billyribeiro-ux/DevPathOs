<script lang="ts">
	import './layout.css';
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import CommandPalette from '$lib/components/layout/CommandPalette.svelte';
	import { themeState } from '$lib/state/theme.svelte';
	import { appState } from '$lib/state/app.svelte';
	import { page } from '$app/stores';

	let { children, data } = $props();

	const isOnboardingRoute = $derived($page.url.pathname.startsWith('/onboarding'));

	$effect(() => {
		themeState.init();
	});

	function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			appState.toggleCommandPalette();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<CommandPalette />

{#if isOnboardingRoute}
	{@render children()}
{:else}
	<AppShell>
		{@render children()}
	</AppShell>
{/if}
