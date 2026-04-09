<script lang="ts">
  import { themeState } from '$lib/state/theme.svelte';
  import { Moon, Sun } from 'phosphor-svelte';
</script>

<button
  onclick={() => themeState.toggle()}
  class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
  aria-label="Toggle theme"
>
  {#if themeState.resolved === 'dark'}
    <Sun size={18} />
  {:else}
    <Moon size={18} />
  {/if}
</button>
