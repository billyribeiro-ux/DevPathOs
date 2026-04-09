<script lang="ts">
  import { ChartBar, Clock, Brain, Bug, Lightning, TrendUp, CalendarCheck } from 'phosphor-svelte';
  import type { WeeklyReview } from '$lib/types/review';

  let { data } = $props();

  const reviews = data.reviews as WeeklyReview[];
  const week = data.currentWeek;

  const dailyMinutes = $derived(week.dailyMinutes ?? [0, 0, 0, 0, 0, 0, 0]);
  const maxMinutes = $derived(Math.max(...dailyMinutes, 1));

  const stats = [
    { label: 'Study Time', value: `${week.totalStudyMinutes}m`, icon: Clock, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'Concepts Touched', value: week.conceptsTouched, icon: Brain, color: 'text-amber-500 bg-amber-500/10' },
    { label: 'Concepts Learned', value: week.conceptsLearned, icon: TrendUp, color: 'text-green-500 bg-green-500/10' },
    { label: 'Mistakes Logged', value: week.mistakeCount, icon: Bug, color: 'text-red-500 bg-red-500/10' },
    { label: 'Flashcards', value: `${week.flashcardsReviewed}/${week.flashcardsTotal}`, icon: Lightning, color: 'text-violet-500 bg-violet-500/10' }
  ];
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

  <!-- This Week -->
  <div class="rounded-xl border border-border bg-card p-6">
    <div class="flex items-center gap-2 mb-4">
      <CalendarCheck size={20} class="text-primary" />
      <h2 class="text-lg font-semibold text-foreground">This Week</h2>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
      {#each stats as stat}
        {@const Icon = stat.icon}
        <div class="text-center">
          <div class="mx-auto flex h-10 w-10 items-center justify-center rounded-lg {stat.color} mb-2">
            <Icon size={20} />
          </div>
          <p class="text-2xl font-bold text-foreground">{stat.value}</p>
          <p class="text-xs text-muted-foreground">{stat.label}</p>
        </div>
      {/each}
    </div>
  </div>

  <!-- Study intensity (visual bar for each day) -->
  <div class="rounded-xl border border-border bg-card p-6">
    <h2 class="text-lg font-semibold text-foreground mb-4">Study Consistency</h2>
    <div class="flex items-end gap-1 h-24">
      {#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day, i}
        {@const mins = dailyMinutes[i] ?? 0}
        {@const height = Math.max(4, (mins / maxMinutes) * 100)}
        <div class="flex-1 flex flex-col items-center gap-1">
          <div
            class="w-full rounded-t transition-all hover:bg-primary {mins > 0 ? 'bg-primary/60' : 'bg-muted/40'}"
            style="height: {height}%"
            title="{mins}m studied"
          ></div>
          <span class="text-xs text-muted-foreground">{day}</span>
        </div>
      {/each}
    </div>
  </div>

  <!-- Past reviews -->
  {#if reviews.length > 0}
    <div>
      <h2 class="text-lg font-semibold text-foreground mb-3">Past Reviews</h2>
      <div class="space-y-3">
        {#each reviews as review (review.id)}
          <div class="rounded-xl border border-border bg-card p-5">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-medium text-foreground">
                {new Date(review.weekStart).toLocaleDateString()} — {new Date(review.weekEnd).toLocaleDateString()}
              </span>
              <span class="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{review.streakDays} day streak</span>
            </div>
            <div class="grid grid-cols-4 gap-3 text-center text-sm mb-3">
              <div>
                <p class="font-bold text-foreground">{review.totalStudyMinutes}m</p>
                <p class="text-xs text-muted-foreground">Study Time</p>
              </div>
              <div>
                <p class="font-bold text-foreground">{review.conceptsLearned.length}</p>
                <p class="text-xs text-muted-foreground">Concepts</p>
              </div>
              <div>
                <p class="font-bold text-foreground">{review.flashcardsReviewed}</p>
                <p class="text-xs text-muted-foreground">Cards Reviewed</p>
              </div>
              <div>
                <p class="font-bold text-foreground">{review.mistakeCount}</p>
                <p class="text-xs text-muted-foreground">Mistakes</p>
              </div>
            </div>
            {#if review.recommendations.length > 0}
              <div class="border-t border-border pt-3">
                <p class="text-xs font-medium text-muted-foreground mb-1">Recommendations</p>
                <ul class="text-sm text-foreground space-y-1">
                  {#each review.recommendations as rec}
                    <li class="flex items-start gap-2"><span class="text-primary">-</span> {rec}</li>
                  {/each}
                </ul>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <div class="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
      <p class="text-muted-foreground">Weekly reviews will be auto-generated as you study. Start learning to build your first review!</p>
    </div>
  {/if}
</div>
