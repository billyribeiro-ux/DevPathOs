<script lang="ts">
  import { Bug } from 'phosphor-svelte';
</script>

<div class="space-y-6">
  <div class="flex items-center gap-3">
    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
      <Bug size={20} />
    </div>
    <div>
      <h1 class="text-2xl font-bold text-foreground">Mistake Tracker</h1>
      <p class="text-sm text-muted-foreground">Your recurring error patterns and bug profile</p>
    </div>
  </div>
  <div class="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
    <p class="text-muted-foreground">Your mistake patterns will be tracked here.</p>
  </div>
</div>
