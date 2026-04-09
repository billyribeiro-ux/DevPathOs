<script lang="ts">
  import { Path } from 'phosphor-svelte';
</script>

<div class="space-y-6">
  <div class="flex items-center gap-3">
    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Path size={20} />
    </div>
    <div>
      <h1 class="text-2xl font-bold text-foreground">Learning Roadmap</h1>
      <p class="text-sm text-muted-foreground">Your personalized path to mastery</p>
    </div>
  </div>
  <div class="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
    <p class="text-muted-foreground">Your living roadmap will appear here once content is loaded.</p>
  </div>
</div>
