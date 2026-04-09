<script lang="ts">
  import { goto } from '$app/navigation';
  import { appState } from '$lib/state/app.svelte';
  import { MagnifyingGlass, House, Path, Book, Brain, Folders, Bug, Robot, ChartBar, Briefcase, Gear } from 'phosphor-svelte';

  let search = $state('');
  let selectedIdx = $state(0);
  let inputEl = $state<HTMLInputElement | null>(null);

  const commands = [
    { label: 'Dashboard', href: '/', icon: House, keywords: 'home overview stats' },
    { label: 'Roadmap', href: '/roadmap', icon: Path, keywords: 'learning path concepts' },
    { label: 'Learn', href: '/learn', icon: Book, keywords: 'study concepts timer' },
    { label: 'Developer Brain', href: '/brain', icon: Brain, keywords: 'notes flashcards snippets' },
    { label: 'Projects', href: '/projects', icon: Folders, keywords: 'build track project' },
    { label: 'Mistakes', href: '/mistakes', icon: Bug, keywords: 'errors bugs patterns' },
    { label: 'AI Mentor', href: '/mentor', icon: Robot, keywords: 'chat coach teacher debugger' },
    { label: 'Weekly Review', href: '/review', icon: ChartBar, keywords: 'progress summary' },
    { label: 'Career', href: '/career', icon: Briefcase, keywords: 'jobs skills relevance' },
    { label: 'Settings', href: '/settings', icon: Gear, keywords: 'preferences theme profile' }
  ];

  const filtered = $derived(
    search
      ? commands.filter(c =>
          c.label.toLowerCase().includes(search.toLowerCase()) ||
          c.keywords.toLowerCase().includes(search.toLowerCase())
        )
      : commands
  );

  const safeIdx = $derived(Math.min(selectedIdx, Math.max(0, filtered.length - 1)));

  $effect(() => {
    if (appState.commandPaletteOpen && inputEl) {
      inputEl.focus();
    }
  });

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIdx = (safeIdx + 1) % filtered.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIdx = (safeIdx - 1 + filtered.length) % filtered.length;
    } else if (e.key === 'Enter' && filtered[safeIdx]) {
      e.preventDefault();
      navigate(filtered[safeIdx].href);
    } else if (e.key === 'Escape') {
      appState.toggleCommandPalette();
    }
  }

  function navigate(href: string) {
    appState.toggleCommandPalette();
    search = '';
    selectedIdx = 0;
    goto(href);
  }
</script>

{#if appState.commandPaletteOpen}
  <div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" role="presentation" onclick={() => appState.toggleCommandPalette()}></div>

  <div class="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 rounded-xl border border-border bg-card shadow-2xl">
    <div class="flex items-center gap-3 border-b border-border px-4 py-3">
      <MagnifyingGlass size={20} class="text-muted-foreground" />
      <input
        type="text"
        bind:value={search}
        bind:this={inputEl}
        onkeydown={handleKeydown}
        placeholder="Type a command or search..."
        class="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
      <kbd class="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">esc</kbd>
    </div>
    <div class="max-h-80 overflow-y-auto p-2">
      {#each filtered as cmd, i (cmd.href)}
        {@const Icon = cmd.icon}
        <button
          onclick={() => navigate(cmd.href)}
          onmouseenter={() => { selectedIdx = i; }}
          class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors {i === safeIdx ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}"
        >
          <Icon size={18} class={i === safeIdx ? 'text-primary' : 'text-muted-foreground'} />
          {cmd.label}
        </button>
      {/each}
      {#if filtered.length === 0}
        <p class="px-3 py-6 text-center text-sm text-muted-foreground">No results found</p>
      {/if}
    </div>
  </div>
{/if}
