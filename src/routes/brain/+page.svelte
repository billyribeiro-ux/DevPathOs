<script lang="ts">
  import { Brain } from 'phosphor-svelte';
</script>

<div class="space-y-6">
  <div class="flex items-center gap-3">
    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
      <Brain size={20} />
    </div>
    <div>
      <h1 class="text-2xl font-bold text-foreground">Developer Brain</h1>
      <p class="text-sm text-muted-foreground">Your personal knowledge base</p>
    </div>
  </div>
  <div class="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
    <p class="text-muted-foreground">Notes, flashcards, and code snippets will live here.</p>
  </div>
</div>
