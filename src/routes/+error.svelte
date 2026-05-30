<script lang="ts">
  import { page } from '$app/stores';
  import { WarningCircle, MagnifyingGlass, ArrowClockwise } from 'phosphor-svelte';

  const is404 = $derived($page.status === 404);
</script>

<div class="flex min-h-[60vh] flex-col items-center justify-center text-center p-6">
  <WarningCircle size={64} class="text-muted-foreground/30 mb-4" />
  <h1 class="text-4xl font-bold text-foreground mb-2">{$page.status}</h1>
  <p class="text-lg text-muted-foreground mb-6">
    {#if is404}
      The page you're looking for doesn't exist.
    {:else}
      {$page.error?.message ?? 'Something went wrong'}
    {/if}
  </p>
  <div class="flex gap-3">
    <a href="/" class="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
      Go Home
    </a>
    {#if !is404}
      <button
        onclick={() => location.reload()}
        class="flex items-center gap-2 rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
      >
        <ArrowClockwise size={16} /> Try Again
      </button>
    {/if}
  </div>
</div>
