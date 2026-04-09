<script lang="ts">
  import { Gear } from 'phosphor-svelte';
  import { userState } from '$lib/state/user.svelte';
  import { themeState } from '$lib/state/theme.svelte';
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
    <div class="rounded-xl border border-border bg-card p-6 space-y-2">
      <h2 class="text-lg font-semibold text-foreground">Profile</h2>
      <p class="text-sm text-muted-foreground">Name: <span class="text-foreground">{userState.profile.name}</span></p>
      <p class="text-sm text-muted-foreground">Role: <span class="text-foreground">{userState.profile.role}</span></p>
      <p class="text-sm text-muted-foreground">Level: <span class="text-foreground">{userState.profile.experienceLevel}</span></p>
    </div>
  {/if}
</div>
