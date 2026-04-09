<script lang="ts">
  import { page } from '$app/stores';
  import { WarningCircle } from 'phosphor-svelte';
</script>

<div class="flex min-h-[60vh] flex-col items-center justify-center text-center p-6">
  <WarningCircle size={64} class="text-muted-foreground/30 mb-4" />
  <h1 class="text-4xl font-bold text-foreground mb-2">{$page.status}</h1>
  <p class="text-lg text-muted-foreground mb-6">{$page.error?.message ?? 'Something went wrong'}</p>
  <a href="/" class="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
    Go Home
  </a>
</div>
