<script lang="ts">
  import { Path, Lock, CircleNotch, CheckCircle, Star, CaretDown, CaretRight, Lightning } from 'phosphor-svelte';
  import type { ConceptMeta, ConceptProgress, ConceptLayer } from '$lib/types/roadmap';

  let { data } = $props();

  type ConceptWithProgress = ConceptMeta & { progress?: ConceptProgress };

  let expandedConcept = $state<string | null>(null);
  let filterLayer = $state<ConceptLayer | 'all'>('all');

  const concepts = $derived(data.concepts as ConceptWithProgress[]);

  const filteredConcepts = $derived(
    filterLayer === 'all' ? concepts : concepts.filter(c => c.layer === filterLayer)
  );

  const layers: { id: ConceptLayer | 'all'; label: string; color: string }[] = [
    { id: 'all', label: 'All', color: 'text-foreground' },
    { id: 'foundation', label: 'Foundation', color: 'text-blue-500' },
    { id: 'framework', label: 'Framework', color: 'text-violet-500' },
    { id: 'professional', label: 'Professional', color: 'text-amber-500' }
  ];

  function getStatusIcon(status?: string) {
    switch (status) {
      case 'mastered': return Star;
      case 'learned': return CheckCircle;
      case 'in-progress': return CircleNotch;
      default: return Lock;
    }
  }

  function getStatusColor(status?: string) {
    switch (status) {
      case 'mastered': return 'text-amber-500 bg-amber-500/10';
      case 'learned': return 'text-green-500 bg-green-500/10';
      case 'in-progress': return 'text-blue-500 bg-blue-500/10';
      case 'available': return 'text-foreground bg-muted';
      default: return 'text-muted-foreground bg-muted/50';
    }
  }

  function getLayerColor(layer: ConceptLayer) {
    switch (layer) {
      case 'foundation': return 'bg-blue-500/10 text-blue-500';
      case 'framework': return 'bg-violet-500/10 text-violet-500';
      case 'professional': return 'bg-amber-500/10 text-amber-500';
    }
  }

  const stats = $derived({
    total: concepts.length,
    mastered: concepts.filter(c => c.progress?.status === 'mastered').length,
    learned: concepts.filter(c => c.progress?.status === 'learned').length,
    inProgress: concepts.filter(c => c.progress?.status === 'in-progress').length
  });

  const progressPercent = $derived(
    stats.total > 0 ? Math.round(((stats.mastered + stats.learned) / stats.total) * 100) : 0
  );

  const learningLayers = ['learn', 'try', 'build', 'explain', 'reuse'] as const;
  const layerLabels: Record<string, string> = {
    learn: 'Learn', try: 'Try', build: 'Build', explain: 'Explain', reuse: 'Reuse'
  };
</script>

<div class="space-y-6">
  <div class="flex items-center gap-3">
    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Path size={20} />
    </div>
    <div class="flex-1">
      <h1 class="text-2xl font-bold text-foreground">Learning Roadmap</h1>
      <p class="text-sm text-muted-foreground">Your personalized path to mastery</p>
    </div>
  </div>

  <!-- Progress bar -->
  <div class="rounded-xl border border-border bg-card p-6">
    <div class="flex items-center justify-between mb-3">
      <span class="text-sm font-medium text-foreground">Overall Progress</span>
      <span class="text-sm text-muted-foreground">{progressPercent}%</span>
    </div>
    <div class="h-3 w-full rounded-full bg-muted overflow-hidden">
      <div
        class="h-full rounded-full bg-primary transition-all duration-500"
        style="width: {progressPercent}%"
      ></div>
    </div>
    <div class="mt-3 grid grid-cols-4 gap-4 text-center text-xs">
      <div><span class="font-bold text-foreground text-lg">{stats.total}</span><br /><span class="text-muted-foreground">Total</span></div>
      <div><span class="font-bold text-blue-500 text-lg">{stats.inProgress}</span><br /><span class="text-muted-foreground">In Progress</span></div>
      <div><span class="font-bold text-green-500 text-lg">{stats.learned}</span><br /><span class="text-muted-foreground">Learned</span></div>
      <div><span class="font-bold text-amber-500 text-lg">{stats.mastered}</span><br /><span class="text-muted-foreground">Mastered</span></div>
    </div>
  </div>

  <!-- Layer filter -->
  <div class="flex gap-2">
    {#each layers as layer}
      <button
        onclick={() => { filterLayer = layer.id; }}
        class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {filterLayer === layer.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}"
      >
        {layer.label}
      </button>
    {/each}
  </div>

  <!-- Concept list -->
  <div class="space-y-2">
    {#each filteredConcepts as concept (concept.slug)}
      {@const StatusIcon = getStatusIcon(concept.progress?.status)}
      {@const isExpanded = expandedConcept === concept.slug}
      <div class="rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/30">
        <button
          onclick={() => { expandedConcept = isExpanded ? null : concept.slug; }}
          class="flex w-full items-center gap-4 p-4 text-left"
        >
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg {getStatusColor(concept.progress?.status)}">
            <StatusIcon size={20} />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h3 class="font-semibold text-foreground truncate">{concept.title}</h3>
              <span class="shrink-0 rounded-full px-2 py-0.5 text-xs {getLayerColor(concept.layer)}">{concept.layer}</span>
            </div>
            <p class="text-sm text-muted-foreground truncate">{concept.description}</p>
          </div>
          <div class="shrink-0 text-muted-foreground">
            {#if isExpanded}<CaretDown size={16} />{:else}<CaretRight size={16} />{/if}
          </div>
        </button>

        {#if isExpanded}
          <div class="border-t border-border bg-muted/30 p-4 space-y-4">
            <div class="grid gap-3 md:grid-cols-2">
              <div>
                <p class="text-xs font-medium text-muted-foreground mb-1">Why learn this next?</p>
                <p class="text-sm text-foreground">{concept.whyNext}</p>
              </div>
              <div>
                <p class="text-xs font-medium text-muted-foreground mb-1">What breaks if skipped?</p>
                <p class="text-sm text-foreground">{concept.whatBreaksIfSkipped}</p>
              </div>
            </div>
            <div>
              <p class="text-xs font-medium text-muted-foreground mb-1">Project proof</p>
              <p class="text-sm text-foreground">{concept.projectProof}</p>
            </div>

            <!-- 5-layer progress -->
            <div>
              <p class="text-xs font-medium text-muted-foreground mb-2">Learning Layers</p>
              <div class="flex gap-2">
                {#each learningLayers as layer}
                  {@const completed = concept.progress?.layers?.[layer]?.completed}
                  <div class="flex-1 rounded-lg border p-2 text-center text-xs {completed ? 'border-green-500/50 bg-green-500/10 text-green-500' : 'border-border text-muted-foreground'}">
                    {layerLabels[layer]}
                    {#if completed}
                      <CheckCircle size={12} class="mx-auto mt-0.5" />
                    {/if}
                  </div>
                {/each}
              </div>
            </div>

            <div class="flex items-center gap-4 text-xs text-muted-foreground">
              <span class="flex items-center gap-1"><Lightning size={12} /> ~{concept.estimatedMinutes} min</span>
              {#if concept.tags.length > 0}
                <div class="flex gap-1">
                  {#each concept.tags as tag}
                    <span class="rounded bg-muted px-1.5 py-0.5">{tag}</span>
                  {/each}
                </div>
              {/if}
            </div>

            <a
              href="/learn/{concept.slug}"
              class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Start Learning
            </a>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
