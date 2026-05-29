<script lang="ts">
  import { ROLE_LABELS, type Role } from '$lib/types/user';
  import { Path, Book, Brain, Bug, Lightning, CalendarCheck, ArrowRight } from 'phosphor-svelte';
  import { page } from '$app/stores';

  let { data } = $props();

  const user = $derived($page.data.user);

  const greeting = $derived.by(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  });

  const roleLabel = $derived(user ? ROLE_LABELS[user.role as Role] : '');
</script>

<div class="space-y-8">
  <div>
    <h1 class="text-3xl font-bold text-foreground">
      {greeting}, {user?.name ?? 'Developer'}
    </h1>
    <p class="text-muted-foreground mt-1">
      {#if user}
        Your path: <span class="font-medium text-foreground">{roleLabel}</span>
      {/if}
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <a href="/roadmap" class="group flex flex-col gap-3 rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md">
      <div class="flex items-center justify-between">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Path size={20} />
        </div>
        <ArrowRight size={16} class="text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <div>
        <h3 class="font-semibold text-foreground">Roadmap</h3>
        <p class="text-sm text-muted-foreground mt-1">View your learning path and track progress</p>
      </div>
    </a>

    <a href="/learn" class="group flex flex-col gap-3 rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md">
      <div class="flex items-center justify-between">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
          <Book size={20} />
        </div>
        <ArrowRight size={16} class="text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <div>
        <h3 class="font-semibold text-foreground">Continue Learning</h3>
        <p class="text-sm text-muted-foreground mt-1">Pick up where you left off</p>
      </div>
    </a>

    <a href="/brain" class="group flex flex-col gap-3 rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md">
      <div class="flex items-center justify-between">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
          <Brain size={20} />
        </div>
        <ArrowRight size={16} class="text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <div>
        <h3 class="font-semibold text-foreground">Developer Brain</h3>
        <p class="text-sm text-muted-foreground mt-1">Notes, flashcards, and snippets</p>
      </div>
    </a>

    <a href="/mistakes" class="group flex flex-col gap-3 rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md">
      <div class="flex items-center justify-between">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
          <Bug size={20} />
        </div>
        <ArrowRight size={16} class="text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <div>
        <h3 class="font-semibold text-foreground">Mistake Tracker</h3>
        <p class="text-sm text-muted-foreground mt-1">Track error patterns and grow from them</p>
      </div>
    </a>

    <a href="/mentor" class="group flex flex-col gap-3 rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md">
      <div class="flex items-center justify-between">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
          <Lightning size={20} />
        </div>
        <ArrowRight size={16} class="text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <div>
        <h3 class="font-semibold text-foreground">AI Mentor</h3>
        <p class="text-sm text-muted-foreground mt-1">Get coaching in 5 different modes</p>
      </div>
    </a>

    <a href="/review" class="group flex flex-col gap-3 rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md">
      <div class="flex items-center justify-between">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
          <CalendarCheck size={20} />
        </div>
        <ArrowRight size={16} class="text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <div>
        <h3 class="font-semibold text-foreground">Weekly Review</h3>
        <p class="text-sm text-muted-foreground mt-1">Your honest progress summary</p>
      </div>
    </a>
  </div>

  <div class="rounded-xl border border-border bg-card p-6">
    <h2 class="text-lg font-semibold text-foreground mb-4">Quick Stats</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="text-center">
        <p class="text-3xl font-bold text-primary">{data.stats.conceptsLearned}</p>
        <p class="text-sm text-muted-foreground">Concepts learned</p>
      </div>
      <div class="text-center">
        <p class="text-3xl font-bold text-primary">{data.stats.notesCreated}</p>
        <p class="text-sm text-muted-foreground">Notes created</p>
      </div>
      <div class="text-center">
        <p class="text-3xl font-bold text-primary">{data.stats.projectsBuilt}</p>
        <p class="text-sm text-muted-foreground">Projects built</p>
      </div>
      <div class="text-center">
        <p class="text-3xl font-bold text-primary">{data.stats.streakDays}</p>
        <p class="text-sm text-muted-foreground">Day streak</p>
      </div>
    </div>
  </div>
</div>
