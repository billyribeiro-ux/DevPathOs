<script lang="ts">
  import { Book, Play, Timer, CheckCircle, Clock, ArrowRight } from 'phosphor-svelte';
  import type { ConceptMeta, ConceptProgress, LearningLayer } from '$lib/types/roadmap';
  import { toastState } from '$lib/state/toast.svelte';

  let { data } = $props();

  type ConceptWithProgress = ConceptMeta & { progress?: ConceptProgress };

  let studyTimer = $state(0);
  let timerRunning = $state(false);
  let timerInterval = $state<ReturnType<typeof setInterval> | null>(null);
  let activeConceptSlug = $state<string | null>(null);
  let activeLayer = $state<LearningLayer>('learn');

  $effect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  });

  const concepts = $derived(data.concepts as ConceptWithProgress[]);

  const inProgressConcepts = $derived(concepts.filter(c => c.progress?.status === 'in-progress'));
  const availableConcepts = $derived(concepts.filter(c => !c.progress || c.progress.status === 'available' || c.progress.status === 'locked'));

  const nextUp = $derived(
    availableConcepts.find(c => {
      const prereqs = c.prerequisites;
      return prereqs.length === 0 || prereqs.every(p => {
        const prog = concepts.find(x => x.slug === p)?.progress;
        return prog && (prog.status === 'learned' || prog.status === 'mastered');
      });
    })
  );

  function startTimer(slug: string, layer: LearningLayer) {
    activeConceptSlug = slug;
    activeLayer = layer;
    studyTimer = 0;
    timerRunning = true;
    timerInterval = setInterval(() => { studyTimer++; }, 1000);
  }

  async function stopTimer() {
    timerRunning = false;
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    if (activeConceptSlug && studyTimer > 0) {
      try {
        const res = await fetch('/api/study-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conceptSlug: activeConceptSlug,
            activity: activeLayer,
            durationMinutes: Math.max(1, Math.round(studyTimer / 60))
          })
        });
        if (res.ok) {
          toastState.success(`Logged ${Math.max(1, Math.round(studyTimer / 60))}m of study`);
        } else {
          toastState.error('Failed to log study time');
        }
      } catch { toastState.error('Failed to log study time'); }
    }
    activeConceptSlug = null;
    studyTimer = 0;
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  const layerLabels: Record<LearningLayer, string> = {
    learn: 'Learn the concept',
    try: 'Try it hands-on',
    build: 'Build something real',
    explain: 'Explain to others',
    reuse: 'Reuse in new contexts'
  };

  const layerColors: Record<LearningLayer, string> = {
    learn: 'bg-blue-500/10 text-blue-500',
    try: 'bg-green-500/10 text-green-500',
    build: 'bg-amber-500/10 text-amber-500',
    explain: 'bg-violet-500/10 text-violet-500',
    reuse: 'bg-pink-500/10 text-pink-500'
  };
</script>

<div class="space-y-6">
  <div class="flex items-center gap-3">
    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
      <Book size={20} />
    </div>
    <div>
      <h1 class="text-2xl font-bold text-foreground">Learn</h1>
      <p class="text-sm text-muted-foreground">Browse concepts and track your study sessions</p>
    </div>
  </div>

  <!-- Active timer -->
  {#if timerRunning && activeConceptSlug}
    {@const concept = concepts.find(c => c.slug === activeConceptSlug)}
    <div class="rounded-xl border-2 border-primary bg-primary/5 p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium text-primary mb-1">Studying Now</p>
          <h3 class="text-lg font-bold text-foreground">{concept?.title}</h3>
          <p class="text-sm text-muted-foreground mt-0.5">Layer: {layerLabels[activeLayer]}</p>
        </div>
        <div class="text-right">
          <p class="text-3xl font-mono font-bold text-primary">{formatTime(studyTimer)}</p>
          <button onclick={stopTimer} class="mt-2 rounded-lg bg-red-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-600">
            Stop & Log
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Next Up -->
  {#if nextUp && !timerRunning}
    <div class="rounded-xl border border-border bg-card p-5">
      <p class="text-xs font-medium text-primary mb-2">Recommended Next</p>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-semibold text-foreground">{nextUp.title}</h3>
          <p class="text-sm text-muted-foreground">{nextUp.description}</p>
          <div class="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span class="flex items-center gap-1"><Clock size={12} /> ~{nextUp.estimatedMinutes} min</span>
          </div>
        </div>
        <button onclick={() => startTimer(nextUp.slug, 'learn')} class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Play size={16} /> Start
        </button>
      </div>
    </div>
  {/if}

  <!-- In Progress -->
  {#if inProgressConcepts.length > 0}
    <div>
      <h2 class="text-lg font-semibold text-foreground mb-3">In Progress</h2>
      <div class="grid gap-3 md:grid-cols-2">
        {#each inProgressConcepts as concept (concept.slug)}
          <div class="rounded-xl border border-border bg-card p-4">
            <h3 class="font-semibold text-foreground mb-2">{concept.title}</h3>
            <div class="flex gap-1.5 mb-3">
              {#each (['learn', 'try', 'build', 'explain', 'reuse'] as const) as layer}
                {@const completed = concept.progress?.layers?.[layer]?.completed}
                <div class="flex-1 rounded py-1 text-center text-xs font-medium {completed ? layerColors[layer] : 'bg-muted text-muted-foreground'}">
                  {layer}
                </div>
              {/each}
            </div>
            {#if !timerRunning}
              <div class="flex gap-1.5 flex-wrap">
                {#each (['learn', 'try', 'build', 'explain', 'reuse'] as const) as layer}
                  {#if !concept.progress?.layers?.[layer]?.completed}
                    <button
                      onclick={() => startTimer(concept.slug, layer)}
                      class="rounded px-2 py-1 text-xs font-medium {layerColors[layer]} hover:ring-2 hover:ring-primary/30"
                    >
                      {layer}
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- All Concepts -->
  <div>
    <h2 class="text-lg font-semibold text-foreground mb-3">All Concepts</h2>
    <div class="space-y-2">
      {#each concepts as concept (concept.slug)}
        {@const status = concept.progress?.status}
        <div class="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/30">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg {status === 'learned' || status === 'mastered' ? 'bg-green-500/10 text-green-500' : status === 'in-progress' ? 'bg-blue-500/10 text-blue-500' : 'bg-muted text-muted-foreground'}">
            {#if status === 'learned' || status === 'mastered'}<CheckCircle size={16} />{:else}<Book size={16} />{/if}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-medium text-foreground truncate">{concept.title}</h3>
            <p class="text-xs text-muted-foreground truncate">{concept.description}</p>
          </div>
          <span class="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">~{concept.estimatedMinutes}m</span>
          {#if !timerRunning}
            <button onclick={() => startTimer(concept.slug, 'learn')} class="shrink-0 rounded p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary">
              <Play size={16} />
            </button>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>
