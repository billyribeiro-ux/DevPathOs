<script lang="ts">
  import { appState } from '$lib/state/app.svelte';
  import ThemeToggle from './ThemeToggle.svelte';
  import { List, MagnifyingGlass } from 'phosphor-svelte';

  const isMac = $derived(typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent));
  const shortcutLabel = $derived(isMac ? '⌘K' : 'Ctrl+K');
</script>

<header class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
  <button
    onclick={() => appState.toggleSidebar()}
    class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors lg:hidden"
    aria-label="Toggle sidebar"
  >
    <List size={18} />
  </button>

  <div class="flex-1"></div>

  <button
    onclick={() => appState.toggleCommandPalette()}
    class="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
    aria-label="Open command palette ({shortcutLabel})"
  >
    <MagnifyingGlass size={16} />
    <span class="hidden sm:inline">Search...</span>
    <kbd class="hidden rounded bg-muted px-1.5 py-0.5 text-xs font-mono sm:inline">{shortcutLabel}</kbd>
  </button>

  <ThemeToggle />
</header>
