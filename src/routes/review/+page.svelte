<script lang="ts">
  import { ChartBar } from 'phosphor-svelte';
</script>

<div class="space-y-6">
  <div class="flex items-center gap-3">
    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
      <ChartBar size={20} />
    </div>
    <div>
      <h1 class="text-2xl font-bold text-foreground">Weekly Reviews</h1>
      <p class="text-sm text-muted-foreground">Your honest learning progress summaries</p>
    </div>
  </div>
  <div class="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
    <p class="text-muted-foreground">Weekly review summaries will be generated here.</p>
  </div>
</div>
