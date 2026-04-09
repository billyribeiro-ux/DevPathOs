<script lang="ts">
  import { goto } from '$app/navigation';
  import { type Role, ROLE_LABELS, ROLE_DESCRIPTIONS } from '$lib/types/user';
  import { Monitor, Atom, Stack, Rocket, ArrowsLeftRight, PaintBrush } from 'phosphor-svelte';

  const roleIcons: Record<Role, typeof Monitor> = {
    'frontend': Monitor,
    'svelte-specialist': Atom,
    'fullstack': Stack,
    'freelancer': Rocket,
    'career-switcher': ArrowsLeftRight,
    'designer-coder': PaintBrush
  };

  const roles: Role[] = ['frontend', 'svelte-specialist', 'fullstack', 'freelancer', 'career-switcher', 'designer-coder'];

  function selectRole(role: Role) {
    goto(`/onboarding/goals?role=${role}`);
  }
</script>

<div class="min-h-screen bg-background flex flex-col items-center justify-center p-6">
  <div class="max-w-4xl w-full text-center mb-12">
    <div class="flex items-center justify-center gap-2 mb-6">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">D</div>
      <span class="text-2xl font-bold text-foreground">DevPath OS</span>
    </div>
    <h1 class="text-4xl font-bold text-foreground mb-3">What are you trying to become?</h1>
    <p class="text-lg text-muted-foreground">Choose your path. This shapes your learning roadmap.</p>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl w-full">
    {#each roles as role}
      {@const Icon = roleIcons[role]}
      <button
        onclick={() => selectRole(role)}
        class="group flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-6 text-left transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/5"
      >
        <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Icon size={24} />
        </div>
        <div>
          <h3 class="font-semibold text-foreground">{ROLE_LABELS[role]}</h3>
          <p class="text-sm text-muted-foreground mt-1">{ROLE_DESCRIPTIONS[role]}</p>
        </div>
      </button>
    {/each}
  </div>
</div>
