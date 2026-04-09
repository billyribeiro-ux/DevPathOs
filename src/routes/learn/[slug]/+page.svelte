<script lang="ts">
  import { ArrowLeft, Play, CheckCircle, Clock, Lightning, BookOpen, Hammer, ChatCircle, ArrowsClockwise } from 'phosphor-svelte';
  import type { ConceptMeta, ConceptProgress, LearningLayer } from '$lib/types/roadmap';
  import { toastState } from '$lib/state/toast.svelte';
  import Confetti from '$lib/components/ui/Confetti.svelte';

  let { data } = $props();

  const concept = data.concept as ConceptMeta;
  let progress = $state(data.progress as ConceptProgress | null);
  let studyTimer = $state(0);
  let timerRunning = $state(false);
  let timerInterval = $state<ReturnType<typeof setInterval> | null>(null);
  let activeLayer = $state<LearningLayer>('learn');
  let showConfetti = $state(false);

  const layers: { id: LearningLayer; label: string; description: string; icon: typeof BookOpen }[] = [
    { id: 'learn', label: 'Learn', description: 'Read, watch, or listen to understand the concept', icon: BookOpen },
    { id: 'try', label: 'Try', description: 'Experiment hands-on in a sandbox or small exercise', icon: Play },
    { id: 'build', label: 'Build', description: 'Apply the concept in a real project', icon: Hammer },
    { id: 'explain', label: 'Explain', description: 'Teach someone else or write about it', icon: ChatCircle },
    { id: 'reuse', label: 'Reuse', description: 'Use it again in a different context', icon: ArrowsClockwise }
  ];

  function startTimer(layer: LearningLayer) {
    activeLayer = layer;
    studyTimer = 0;
    timerRunning = true;
    timerInterval = setInterval(() => { studyTimer++; }, 1000);
  }

  async function stopTimer() {
    timerRunning = false;
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    if (studyTimer > 0) {
      try {
        await fetch('/api/study-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conceptSlug: concept.slug,
            activity: activeLayer,
            durationMinutes: Math.max(1, Math.round(studyTimer / 60))
          })
        });
        toastState.success(`Logged ${Math.round(studyTimer / 60)}m of ${activeLayer}`);
      } catch { toastState.error('Failed to log study time'); }
    }
    studyTimer = 0;
  }

  async function markLayerComplete(layer: LearningLayer) {
    try {
      const res = await fetch(`/api/concept-progress/${concept.slug}/layer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layer })
      });
      if (res.ok) {
        const updated = await res.json();
        progress = updated;
        showConfetti = true;
        toastState.success(`"${layer}" layer completed!`);
        setTimeout(() => { showConfetti = false; }, 3000);
      }
    } catch { toastState.error('Failed to update progress'); }
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  const isLayerCompleted = (layer: LearningLayer) => progress?.layers?.[layer]?.completed ?? false;
  const completedCount = $derived(layers.filter(l => isLayerCompleted(l.id)).length);
</script>

<Confetti active={showConfetti} />

<div class="space-y-6">
  <a href="/roadmap" class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
    <ArrowLeft size={16} /> Back to Roadmap
  </a>

  <div>
    <div class="flex items-center gap-2 mb-1">
      <span class="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{concept.layer}</span>
      <span class="text-xs text-muted-foreground">~{concept.estimatedMinutes} min</span>
    </div>
    <h1 class="text-3xl font-bold text-foreground">{concept.title}</h1>
    <p class="text-muted-foreground mt-1">{concept.description}</p>
  </div>

  <!-- Active timer -->
  {#if timerRunning}
    <div class="rounded-xl border-2 border-primary bg-primary/5 p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium text-primary mb-1">Studying: {activeLayer}</p>
          <p class="text-sm text-muted-foreground">{concept.title}</p>
        </div>
        <div class="text-right">
          <p class="text-3xl font-mono font-bold text-primary" aria-live="polite">{formatTime(studyTimer)}</p>
          <button onclick={stopTimer} class="mt-2 rounded-lg bg-red-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-600">Stop & Log</button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Progress overview -->
  <div class="rounded-xl border border-border bg-card p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-foreground">Learning Layers</h2>
      <span class="text-sm text-muted-foreground">{completedCount}/5 complete</span>
    </div>
    <div class="h-2 w-full rounded-full bg-muted overflow-hidden mb-6">
      <div class="h-full rounded-full bg-primary transition-all duration-500" style="width: {(completedCount / 5) * 100}%"></div>
    </div>

    <div class="space-y-3">
      {#each layers as layer}
        {@const Icon = layer.icon}
        {@const completed = isLayerCompleted(layer.id)}
        <div class="flex items-center gap-4 rounded-lg border p-4 transition-all {completed ? 'border-green-500/30 bg-green-500/5' : 'border-border hover:border-primary/30'}">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg {completed ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}">
            {#if completed}<CheckCircle size={20} />{:else}<Icon size={20} />{/if}
          </div>
          <div class="flex-1">
            <h3 class="text-sm font-semibold text-foreground">{layer.label}</h3>
            <p class="text-xs text-muted-foreground">{layer.description}</p>
          </div>
          <div class="flex gap-2">
            {#if !timerRunning && !completed}
              <button onclick={() => startTimer(layer.id)} class="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20">
                <Play size={12} class="inline mr-1" />Study
              </button>
              <button onclick={() => markLayerComplete(layer.id)} class="rounded-lg bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-500 hover:bg-green-500/20">
                <CheckCircle size={12} class="inline mr-1" />Done
              </button>
            {:else if completed}
              <span class="text-xs text-green-500 font-medium">Completed</span>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Concept details -->
  <div class="grid gap-4 md:grid-cols-2">
    <div class="rounded-xl border border-border bg-card p-5">
      <h3 class="text-sm font-semibold text-foreground mb-2">Why learn this?</h3>
      <p class="text-sm text-muted-foreground">{concept.whyNext}</p>
    </div>
    <div class="rounded-xl border border-border bg-card p-5">
      <h3 class="text-sm font-semibold text-foreground mb-2">What breaks if skipped?</h3>
      <p class="text-sm text-muted-foreground">{concept.whatBreaksIfSkipped}</p>
    </div>
  </div>

  <div class="rounded-xl border border-border bg-card p-5">
    <h3 class="text-sm font-semibold text-foreground mb-2">Project Proof</h3>
    <p class="text-sm text-muted-foreground">{concept.projectProof}</p>
  </div>

  {#if data.totalMinutes > 0}
    <div class="rounded-xl border border-border bg-card p-5">
      <h3 class="text-sm font-semibold text-foreground mb-2">Your Stats</h3>
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock size={16} /> {data.totalMinutes} minutes studied
      </div>
    </div>
  {/if}
</div>
