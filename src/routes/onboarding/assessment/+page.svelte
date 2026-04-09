<script lang="ts">
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';
  import { type ExperienceLevel, ROLE_LABELS, type Role } from '$lib/types/user';
  import { ArrowLeft, Plant, TreeEvergreen, Mountains } from 'phosphor-svelte';

  let { data } = $props();

  const role = $derived(data.role as Role);
  const name = $derived(data.name);
  const goals = $derived(data.goals);

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
        <form
          method="POST"
          use:enhance={() => {
            saving = true;
            return async ({ update }) => {
              await update();
              saving = false;
            };
          }}
        >
          <input type="hidden" name="role" value={role} />
          <input type="hidden" name="name" value={name} />
          {#each goals as goal}
            <input type="hidden" name="goals" value={goal} />
          {/each}
          <input type="hidden" name="experienceLevel" value={level.value} />

          <button
            type="submit"
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
        </form>
      {/each}
    </div>

    {#if saving}
      <p class="text-center text-muted-foreground mt-6 animate-pulse">Setting up your roadmap...</p>
    {/if}
  </div>
</div>
