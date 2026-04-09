<script lang="ts">
  import { Briefcase, Star, TrendUp, Buildings, Certificate, Target } from 'phosphor-svelte';
  import { page } from '$app/stores';
  import { getConceptsForTrack } from '$lib/content/tracks';

  let { data } = $props();

  const user = $derived($page.data.user);

  const concepts = getConceptsForTrack('frontend');

  const relevanceData = [
    {
      skill: 'HTML/CSS Fundamentals',
      concepts: ['html-semantics', 'css-box-model', 'css-flexbox', 'css-grid', 'css-responsive'],
      importance: 'essential' as const,
      companies: ['Every tech company', 'Agencies', 'Startups'],
      description: 'Required for any front-end role. Non-negotiable.'
    },
    {
      skill: 'JavaScript Mastery',
      concepts: ['js-fundamentals', 'js-dom', 'js-events', 'js-async', 'js-modules'],
      importance: 'essential' as const,
      companies: ['FAANG', 'Startups', 'Enterprise'],
      description: 'Core interview topic. 90% of technical interviews test JS fundamentals.'
    },
    {
      skill: 'Svelte/SvelteKit',
      concepts: ['svelte-basics', 'svelte-runes', 'svelte-components', 'svelte-stores', 'sveltekit-routing', 'sveltekit-load', 'sveltekit-forms', 'sveltekit-hooks'],
      importance: 'important' as const,
      companies: ['Apple', 'The New York Times', 'Ikea', 'Spotify', 'Growing startups'],
      description: 'Rapidly growing. Companies adopting Svelte value developers who know it deeply.'
    },
    {
      skill: 'Tailwind CSS',
      concepts: ['tailwind-basics', 'tailwind-responsive'],
      importance: 'important' as const,
      companies: ['Most startups', 'SaaS companies', 'Agencies'],
      description: 'Industry standard for utility-first CSS. Shows in most modern job listings.'
    },
    {
      skill: 'Testing & CI/CD',
      concepts: ['testing-basics', 'ci-cd'],
      importance: 'important' as const,
      companies: ['Enterprise', 'Scale-ups', 'Any serious team'],
      description: 'Separates junior from mid-level. Shows engineering maturity.'
    },
    {
      skill: 'TypeScript',
      concepts: ['typescript-basics'],
      importance: 'essential' as const,
      companies: ['Microsoft', 'Google', 'Most modern companies'],
      description: '80%+ of new projects use TypeScript. Essential for senior roles.'
    },
    {
      skill: 'Accessibility & Performance',
      concepts: ['a11y-fundamentals', 'perf-optimization'],
      importance: 'nice-to-have' as const,
      companies: ['Government', 'Healthcare', 'Finance', 'Large enterprises'],
      description: 'Differentiator for senior roles. Legal requirement in many industries.'
    }
  ];

  const importanceColors = {
    essential: 'bg-red-500/10 text-red-500',
    important: 'bg-amber-500/10 text-amber-500',
    'nice-to-have': 'bg-blue-500/10 text-blue-500'
  };

  const progress = $derived(data.progress ?? []);

  function getSkillProgress(conceptSlugs: string[]) {
    const total = conceptSlugs.length;
    const learned = conceptSlugs.filter(slug => {
      const p = progress.find((pr: { conceptSlug: string }) => pr.conceptSlug === slug);
      return p && (p.status === 'learned' || p.status === 'mastered');
    }).length;
    return { total, learned, percent: total > 0 ? Math.round((learned / total) * 100) : 0 };
  }
</script>

<div class="space-y-6">
  <div class="flex items-center gap-3">
    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
      <Briefcase size={20} />
    </div>
    <div>
      <h1 class="text-2xl font-bold text-foreground">Career Reality</h1>
      <p class="text-sm text-muted-foreground">How your skills map to real job requirements</p>
    </div>
  </div>

  <!-- Overall readiness -->
  <div class="rounded-xl border border-border bg-card p-6">
    <h2 class="text-lg font-semibold text-foreground mb-3">Job Readiness Score</h2>
    <div class="flex items-center gap-4">
      <div class="relative flex h-24 w-24 shrink-0 items-center justify-center">
        <svg class="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="8" class="text-muted" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="8" class="text-primary" stroke-dasharray="{2 * Math.PI * 45}" stroke-dashoffset="{2 * Math.PI * 45 * (1 - 0)}" stroke-linecap="round" />
        </svg>
        <span class="absolute text-xl font-bold text-foreground">0%</span>
      </div>
      <div>
        <p class="text-sm text-muted-foreground">Complete learning tracks to increase your score. Focus on <strong class="text-foreground">essential</strong> skills first.</p>
      </div>
    </div>
  </div>

  <!-- Skills breakdown -->
  <div class="space-y-4">
    {#each relevanceData as skill}
      {@const prog = getSkillProgress(skill.concepts)}
      <div class="rounded-xl border border-border bg-card p-5">
        <div class="flex items-start justify-between mb-2">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-semibold text-foreground">{skill.skill}</h3>
              <span class="rounded-full px-2 py-0.5 text-xs font-medium {importanceColors[skill.importance]}">
                {skill.importance}
              </span>
            </div>
            <p class="text-sm text-muted-foreground">{skill.description}</p>
          </div>
          <span class="shrink-0 text-lg font-bold text-foreground">{prog.percent}%</span>
        </div>

        <div class="h-2 w-full rounded-full bg-muted overflow-hidden my-3">
          <div class="h-full rounded-full bg-primary transition-all" style="width: {prog.percent}%"></div>
        </div>

        <div class="flex items-center gap-2 text-xs text-muted-foreground">
          <Buildings size={12} />
          {#each skill.companies as company, i}
            <span>{company}{i < skill.companies.length - 1 ? ',' : ''}</span>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  <!-- Portfolio proof tips -->
  <div class="rounded-xl border border-border bg-card p-6">
    <div class="flex items-center gap-2 mb-4">
      <Certificate size={20} class="text-primary" />
      <h2 class="text-lg font-semibold text-foreground">Portfolio Proof</h2>
    </div>
    <div class="space-y-3">
      <div class="flex items-start gap-3 rounded-lg bg-muted/30 p-3">
        <Target size={16} class="shrink-0 mt-0.5 text-primary" />
        <div>
          <p class="text-sm font-medium text-foreground">Build projects that demonstrate each skill</p>
          <p class="text-xs text-muted-foreground">Each concept in your roadmap has a "project proof" suggestion. Complete them for portfolio pieces.</p>
        </div>
      </div>
      <div class="flex items-start gap-3 rounded-lg bg-muted/30 p-3">
        <Star size={16} class="shrink-0 mt-0.5 text-primary" />
        <div>
          <p class="text-sm font-medium text-foreground">Document your learning journey</p>
          <p class="text-xs text-muted-foreground">Your notes, flashcards, and mistake logs show hiring managers you learn systematically.</p>
        </div>
      </div>
      <div class="flex items-start gap-3 rounded-lg bg-muted/30 p-3">
        <TrendUp size={16} class="shrink-0 mt-0.5 text-primary" />
        <div>
          <p class="text-sm font-medium text-foreground">Track improvement over time</p>
          <p class="text-xs text-muted-foreground">Weekly reviews create a growth narrative. Employers value developers who improve consistently.</p>
        </div>
      </div>
    </div>
  </div>
</div>
