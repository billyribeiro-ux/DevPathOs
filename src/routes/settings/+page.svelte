<script lang="ts">
  import { Gear, DownloadSimple, PencilSimple, FloppyDisk, X } from 'phosphor-svelte';
  import { userState } from '$lib/state/user.svelte';
  import { themeState } from '$lib/state/theme.svelte';
  import type { Theme } from '$lib/state/theme.svelte';
  import { toastState } from '$lib/state/toast.svelte';
  import { ROLE_LABELS } from '$lib/types/user';
  import { invalidateAll } from '$app/navigation';

  let exporting = $state(false);
  let editingProfile = $state(false);
  let editName = $state('');
  let editLevel = $state<'beginner' | 'intermediate' | 'advanced'>('beginner');
  let savingProfile = $state(false);

  const isMac = $derived(typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent));

  function startEditProfile() {
    if (!userState.profile) return;
    editName = userState.profile.name;
    editLevel = userState.profile.experienceLevel;
    editingProfile = true;
  }

  async function saveProfile() {
    if (savingProfile || !editName.trim()) return;
    savingProfile = true;
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim(), experienceLevel: editLevel })
      });
      if (!res.ok) throw new Error('Failed');
      editingProfile = false;
      await invalidateAll();
      toastState.success('Profile updated');
    } catch { toastState.error('Failed to update profile'); }
    savingProfile = false;
  }

  async function exportData() {
    if (exporting) return;
    exporting = true;
    try {
      const res = await fetch('/api/export');
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `devpath-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toastState.success('Data exported successfully');
    } catch {
      toastState.error('Failed to export data');
    }
    exporting = false;
  }

  const themes: { value: Theme; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' }
  ];
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
      {#each themes as theme (theme.value)}
        <button
          onclick={() => themeState.set(theme.value)}
          class="rounded-lg border px-4 py-2 text-sm font-medium transition-colors {themeState.current === theme.value ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'}"
        >
          {theme.label}
        </button>
      {/each}
    </div>
  </div>

  {#if userState.profile}
    <div class="rounded-xl border border-border bg-card p-6 space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-foreground">Profile</h2>
        {#if !editingProfile}
          <button onclick={startEditProfile} class="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
            <PencilSimple size={14} /> Edit
          </button>
        {/if}
      </div>

      {#if editingProfile}
        <div class="space-y-3">
          <div>
            <label for="edit-name" class="block text-xs font-medium text-muted-foreground mb-1">Name</label>
            <input id="edit-name" type="text" bind:value={editName} class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label for="edit-level" class="block text-xs font-medium text-muted-foreground mb-1">Experience Level</label>
            <select id="edit-level" bind:value={editLevel} class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div class="flex gap-2">
            <button onclick={saveProfile} disabled={savingProfile || !editName.trim()} class="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              <FloppyDisk size={14} /> {savingProfile ? 'Saving...' : 'Save'}
            </button>
            <button onclick={() => { editingProfile = false; }} class="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">
              <X size={14} class="inline mr-1" />Cancel
            </button>
          </div>
        </div>
      {:else}
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
      {/if}
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
        <kbd class="rounded bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">{isMac ? '⌘K' : 'Ctrl+K'}</kbd>
      </div>
    </div>
  </div>
</div>
