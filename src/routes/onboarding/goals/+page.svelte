<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { type Role, ROLE_LABELS, ROLE_GOALS } from '$lib/types/user';
  import { ArrowLeft, ArrowRight, Check } from 'phosphor-svelte';

  const role = $derived(($page.url.searchParams.get('role') ?? 'frontend') as Role);
  const availableGoals = $derived(ROLE_GOALS[role] ?? []);

  let name = $state('');
  let selectedGoals = $state<string[]>([]);

  function toggleGoal(goal: string) {
    if (selectedGoals.includes(goal)) {
      selectedGoals = selectedGoals.filter(g => g !== goal);
    } else {
      selectedGoals = [...selectedGoals, goal];
    }
  }

  function proceed() {
    if (!name.trim() || selectedGoals.length === 0) return;
    const goals = encodeURIComponent(selectedGoals.join(','));
    goto(`/onboarding/assessment?role=${role}&name=${encodeURIComponent(name.trim())}&goals=${goals}`);
  }

  const canProceed = $derived(name.trim().length > 0 && selectedGoals.length > 0);
</script>

<div class="min-h-screen bg-background flex flex-col items-center justify-center p-6">
  <div class="max-w-2xl w-full">
    <button onclick={() => goto('/onboarding')} class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
      <ArrowLeft size={16} />
      Back to role selection
    </button>

    <div class="mb-8">
      <p class="text-sm font-medium text-primary mb-1">Step 2 of 3</p>
      <h1 class="text-3xl font-bold text-foreground mb-2">Customize your goals</h1>
      <p class="text-muted-foreground">You selected <strong class="text-foreground">{ROLE_LABELS[role]}</strong>. Tell us your name and pick the goals that matter most.</p>
    </div>

    <div class="mb-8">
      <label for="name" class="block text-sm font-medium text-foreground mb-2">Your name</label>
      <input
        id="name"
        type="text"
        bind:value={name}
        placeholder="Enter your name"
        class="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>

    <div class="space-y-3 mb-8">
      <p class="text-sm font-medium text-foreground">Select your goals</p>
      {#each availableGoals as goal}
        {@const selected = selectedGoals.includes(goal)}
        <button
          onclick={() => toggleGoal(goal)}
          class="flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-all {selected ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'}"
        >
          <div class="flex h-5 w-5 items-center justify-center rounded border {selected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'}">
            {#if selected}
              <Check size={12} weight="bold" />
            {/if}
          </div>
          <span class="text-sm font-medium text-foreground">{goal}</span>
        </button>
      {/each}
    </div>

    <button
      onclick={proceed}
      disabled={!canProceed}
      class="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Continue
      <ArrowRight size={16} />
    </button>
  </div>
</div>
