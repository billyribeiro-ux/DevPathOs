<script lang="ts">
  import { Book } from 'phosphor-svelte';
</script>

<div class="space-y-6">
  <div class="flex items-center gap-3">
    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
      <Book size={20} />
    </div>
    <div>
      <h1 class="text-2xl font-bold text-foreground">Learn</h1>
      <p class="text-sm text-muted-foreground">Browse learning tracks and concepts</p>
    </div>
  </div>
  <div class="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
    <p class="text-muted-foreground">Learning tracks will appear here.</p>
  </div>
</div>
