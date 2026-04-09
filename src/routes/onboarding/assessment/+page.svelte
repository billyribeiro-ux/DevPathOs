<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { userState } from '$lib/state/user.svelte';
  import { type Role, type ExperienceLevel, ROLE_LABELS } from '$lib/types/user';
  import { ArrowLeft, Plant, TreeEvergreen, Mountains } from 'phosphor-svelte';

  const role = $derived(($page.url.searchParams.get('role') ?? 'frontend') as Role);
  const name = $derived(decodeURIComponent($page.url.searchParams.get('name') ?? ''));
  const goals = $derived(
    decodeURIComponent($page.url.searchParams.get('goals') ?? '').split(',').filter(Boolean)
  );

  let saving = $state(false);

  const levels: { value: ExperienceLevel; label: string; description: string; icon: typeof Plant }[] = [
    {
      value: 'beginner',
      label: 'Beginner',
      description: 'New to programming or just starting with web development. Little to no experience with HTML, CSS, or JavaScript.',
      icon: Plant
    },
    {
      value: 'intermediate',
      label: 'Intermediate',
      description: 'Comfortable with basics. Can build simple websites. Some experience with a framework. Ready to level up.',
      icon: TreeEvergreen
    },
    {
      value: 'advanced',
      label: 'Advanced',
      description: 'Strong fundamentals. Experienced with frameworks and tooling. Looking to fill gaps and master specifics.',
      icon: Mountains
    }
  ];

  async function selectLevel(level: ExperienceLevel) {
    if (saving) return;
    saving = true;
    await userState.createProfile({ name, role, goals, experienceLevel: level });
    goto('/');
  }
</script>

<div class="min-h-screen bg-background flex flex-col items-center justify-center p-6">
  <div class="max-w-2xl w-full">
    <button
      onclick={() => goto(`/onboarding/goals?role=${role}`)}
      class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
    >
      <ArrowLeft size={16} />
      Back to goals
    </button>

    <div class="mb-8">
      <p class="text-sm font-medium text-primary mb-1">Step 3 of 3</p>
      <h1 class="text-3xl font-bold text-foreground mb-2">Where are you now?</h1>
      <p class="text-muted-foreground">
        Hey <strong class="text-foreground">{name}</strong>, this helps us calibrate your
        <strong class="text-foreground">{ROLE_LABELS[role]}</strong> roadmap.
      </p>
    </div>

    <div class="space-y-4">
      {#each levels as level}
        {@const Icon = level.icon}
        <button
          onclick={() => selectLevel(level.value)}
          disabled={saving}
          class="flex w-full items-start gap-4 rounded-xl border border-border bg-card p-6 text-left transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/5 disabled:opacity-50"
        >
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon size={24} />
          </div>
          <div>
            <h3 class="font-semibold text-foreground">{level.label}</h3>
            <p class="text-sm text-muted-foreground mt-1">{level.description}</p>
          </div>
        </button>
      {/each}
    </div>

    {#if saving}
      <p class="text-center text-muted-foreground mt-6 animate-pulse">Setting up your roadmap...</p>
    {/if}
  </div>
</div>
