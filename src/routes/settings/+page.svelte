<script lang="ts">
  import { Gear, DownloadSimple, Export } from 'phosphor-svelte';
  import { userState } from '$lib/state/user.svelte';
  import { themeState } from '$lib/state/theme.svelte';
  import { toastState } from '$lib/state/toast.svelte';
  import { ROLE_LABELS } from '$lib/types/user';

  let exporting = $state(false);

  async function exportData() {
    exporting = true;
    try {
      const res = await fetch('/api/export');
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `devpath-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toastState.success('Data exported successfully');
    } catch (e) {
      toastState.error('Failed to export data');
    }
    exporting = false;
  }
</script>

<div class="space-y-6">
  <div class="flex items-center gap-3">
    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
      <Gear size={20} />
    </div>
    <div>
      <h1 class="text-2xl font-bold text-foreground">Settings</h1>
      <p class="text-sm text-muted-foreground">Manage your preferences</p>
    </div>
  </div>

  <div class="rounded-xl border border-border bg-card p-6 space-y-4">
    <h2 class="text-lg font-semibold text-foreground">Theme</h2>
    <div class="flex gap-3">
      {#each ['light', 'dark', 'system'] as theme}
        <button
          onclick={() => themeState.set(theme as 'light' | 'dark' | 'system')}
          class="rounded-lg border px-4 py-2 text-sm font-medium transition-colors {themeState.current === theme ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'}"
        >
          {theme.charAt(0).toUpperCase() + theme.slice(1)}
        </button>
      {/each}
    </div>
  </div>

  {#if userState.profile}
    <div class="rounded-xl border border-border bg-card p-6 space-y-3">
      <h2 class="text-lg font-semibold text-foreground">Profile</h2>
      <div class="grid gap-3 md:grid-cols-3">
        <div class="rounded-lg bg-muted/50 p-3">
          <p class="text-xs text-muted-foreground mb-0.5">Name</p>
          <p class="text-sm font-medium text-foreground">{userState.profile.name}</p>
        </div>
        <div class="rounded-lg bg-muted/50 p-3">
          <p class="text-xs text-muted-foreground mb-0.5">Path</p>
          <p class="text-sm font-medium text-foreground">{ROLE_LABELS[userState.profile.role]}</p>
        </div>
        <div class="rounded-lg bg-muted/50 p-3">
          <p class="text-xs text-muted-foreground mb-0.5">Level</p>
          <p class="text-sm font-medium text-foreground capitalize">{userState.profile.experienceLevel}</p>
        </div>
      </div>
    </div>
  {/if}

  <div class="rounded-xl border border-border bg-card p-6 space-y-4">
    <h2 class="text-lg font-semibold text-foreground">Data</h2>
    <p class="text-sm text-muted-foreground">Export all your data as a JSON file. Includes notes, flashcards, snippets, projects, mistakes, study logs, and chat history.</p>
    <button onclick={exportData} disabled={exporting} class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
      <DownloadSimple size={16} /> {exporting ? 'Exporting...' : 'Export All Data'}
    </button>
  </div>

  <div class="rounded-xl border border-border bg-card p-6 space-y-2">
    <h2 class="text-lg font-semibold text-foreground">Keyboard Shortcuts</h2>
    <div class="grid gap-2 text-sm">
      <div class="flex items-center justify-between py-1">
        <span class="text-muted-foreground">Command Palette</span>
        <kbd class="rounded bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">Cmd+K</kbd>
      </div>
    </div>
  </div>
</div>
