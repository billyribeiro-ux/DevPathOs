<script lang="ts">
  import { Bug, Plus, X, FloppyDisk, Trash, ChartBar, ShieldCheck } from 'phosphor-svelte';
  import type { Mistake, MistakeCategory } from '$lib/types/mistake';
  import { toastState } from '$lib/state/toast.svelte';
  import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';

  let { data } = $props();
  let mistakesList = $state<Mistake[]>(data.mistakes);
  let showForm = $state(false);
  let saving = $state(false);
  let activeView = $state<'log' | 'patterns'>('log');
  let filterCategory = $state<MistakeCategory | 'all'>('all');
  let confirmOpen = $state(false);
  let pendingDeleteFn = $state<(() => Promise<void>) | null>(null);

  function confirmDelete(fn: () => Promise<void>) { pendingDeleteFn = fn; confirmOpen = true; }
  async function executeDelete() { if (pendingDeleteFn) await pendingDeleteFn(); pendingDeleteFn = null; }

  let formCategory = $state<MistakeCategory>('other');
  let formDescription = $state('');
  let formError = $state('');
  let formResolution = $state('');

  const categories: { value: MistakeCategory; label: string; color: string }[] = [
    { value: 'syntax', label: 'Syntax', color: 'bg-red-500/10 text-red-500' },
    { value: 'logic', label: 'Logic', color: 'bg-orange-500/10 text-orange-500' },
    { value: 'type-error', label: 'Type Error', color: 'bg-violet-500/10 text-violet-500' },
    { value: 'async', label: 'Async', color: 'bg-blue-500/10 text-blue-500' },
    { value: 'state-management', label: 'State', color: 'bg-green-500/10 text-green-500' },
    { value: 'css', label: 'CSS', color: 'bg-pink-500/10 text-pink-500' },
    { value: 'other', label: 'Other', color: 'bg-muted text-muted-foreground' }
  ];
  const filtered = $derived(filterCategory === 'all' ? mistakesList : mistakesList.filter(m => m.category === filterCategory));
  function getCategoryConfig(cat: MistakeCategory) { return categories.find(c => c.value === cat) ?? categories[6]; }
  const computedPatterns = $derived.by(() => {
    const map = new Map<MistakeCategory, number>();
    for (const m of mistakesList) map.set(m.category, (map.get(m.category) ?? 0) + 1);
    return Array.from(map.entries()).map(([cat, count]) => ({ category: cat, count, config: getCategoryConfig(cat) })).sort((a, b) => b.count - a.count);
  });

  async function saveMistake() {
    saving = true;
    try {
      const res = await fetch('/api/mistakes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ category: formCategory, description: formDescription, errorMessage: formError || undefined, resolution: formResolution || undefined }) });
      if (!res.ok) throw new Error('Failed to log mistake');
      const created = await res.json();
      mistakesList = [created, ...mistakesList];
      toastState.success('Mistake logged — growth starts here');
      resetForm();
    } catch (e) { toastState.error('Failed to log mistake'); }
    saving = false;
  }

  async function doDeleteMistake(id: string) {
    try {
      const res = await fetch(`/api/mistakes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      mistakesList = mistakesList.filter(m => m.id !== id);
      toastState.info('Mistake removed');
    } catch (e) { toastState.error('Failed to delete mistake'); }
  }

  function resetForm() { showForm = false; formCategory = 'other'; formDescription = ''; formError = ''; formResolution = ''; }
</script>

<ConfirmDialog bind:open={confirmOpen} title="Delete this mistake?" message="The learning from this mistake will be lost." onconfirm={executeDelete} />

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-500"><Bug size={20} /></div>
      <div><h1 class="text-2xl font-bold text-foreground">Mistake Tracker</h1><p class="text-sm text-muted-foreground">Track error patterns and grow from them</p></div>
    </div>
    <button onclick={() => { resetForm(); showForm = true; }} class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"><Plus size={16} /> Log Mistake</button>
  </div>

  <div class="flex gap-1 border-b border-border" role="tablist">
    <button role="tab" aria-selected={activeView === 'log'} onclick={() => { activeView = 'log'; }} class="border-b-2 px-4 py-2.5 text-sm font-medium transition-colors {activeView === 'log' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}">Mistake Log ({mistakesList.length})</button>
    <button role="tab" aria-selected={activeView === 'patterns'} onclick={() => { activeView = 'patterns'; }} class="flex items-center gap-1 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors {activeView === 'patterns' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}"><ChartBar size={14} /> Patterns</button>
  </div>

  {#if showForm}
    <div class="rounded-xl border border-border bg-card p-6 space-y-4">
      <div class="flex items-center justify-between"><h3 class="font-semibold text-foreground">Log a Mistake</h3><button onclick={resetForm} class="text-muted-foreground hover:text-foreground"><X size={20} /></button></div>
      <div>
        <label class="block text-xs font-medium text-muted-foreground mb-1.5">Category</label>
        <div class="flex flex-wrap gap-2">
          {#each categories as cat}
            <button onclick={() => { formCategory = cat.value; }} class="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors {formCategory === cat.value ? cat.color + ' ring-2 ring-primary/30' : 'bg-muted text-muted-foreground'}">{cat.label}</button>
          {/each}
        </div>
      </div>
      <textarea bind:value={formDescription} placeholder="What happened?" rows={3} class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"></textarea>
      <input bind:value={formError} placeholder="Error message (optional)" class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none" />
      <textarea bind:value={formResolution} placeholder="How did you fix it? (optional)" rows={2} class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"></textarea>
      <button onclick={saveMistake} disabled={saving || !formDescription} class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"><FloppyDisk size={16} /> {saving ? 'Saving...' : 'Save'}</button>
    </div>
  {/if}

  {#if activeView === 'log'}
    <div class="flex gap-2 flex-wrap">
      <button onclick={() => { filterCategory = 'all'; }} class="rounded-lg px-3 py-1.5 text-xs font-medium {filterCategory === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}">All</button>
      {#each categories as cat}
        <button onclick={() => { filterCategory = cat.value; }} class="rounded-lg px-3 py-1.5 text-xs font-medium {filterCategory === cat.value ? cat.color : 'bg-muted text-muted-foreground'}">{cat.label}</button>
      {/each}
    </div>

    {#if filtered.length === 0}
      <div class="rounded-xl border border-dashed border-border bg-gradient-to-br from-green-500/5 to-transparent p-12 text-center">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10"><ShieldCheck size={32} class="text-green-500" /></div>
        <h3 class="font-semibold text-foreground mb-1">{mistakesList.length === 0 ? 'Clean slate — for now' : 'No mistakes in this category'}</h3>
        <p class="text-sm text-muted-foreground mb-4">{mistakesList.length === 0 ? 'Every developer makes mistakes. Logging them turns errors into growth.' : 'Try a different filter.'}</p>
        {#if mistakesList.length === 0}
          <button onclick={() => { resetForm(); showForm = true; }} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Log your first mistake</button>
        {/if}
      </div>
    {:else}
      <div class="space-y-3">
        {#each filtered as mistake (mistake.id)}
          {@const config = getCategoryConfig(mistake.category)}
          <div class="group rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm">
            <div class="flex items-start justify-between mb-2">
              <span class="rounded-full px-2 py-0.5 text-xs font-medium {config.color}">{config.label}</span>
              <button onclick={() => confirmDelete(() => doDeleteMistake(mistake.id))} class="rounded p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 transition-opacity" aria-label="Delete mistake"><Trash size={14} /></button>
            </div>
            <p class="text-sm text-foreground mb-2">{mistake.description}</p>
            {#if mistake.errorMessage}<pre class="rounded bg-muted/50 px-3 py-2 text-xs text-red-500 font-mono overflow-x-auto mb-2">{mistake.errorMessage}</pre>{/if}
            {#if mistake.resolution}
              <div class="rounded-lg bg-green-500/5 border border-green-500/20 px-3 py-2"><p class="text-xs font-medium text-green-500 mb-0.5">Resolution</p><p class="text-sm text-foreground">{mistake.resolution}</p></div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  {:else}
    {#if computedPatterns.length === 0}
      <div class="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center"><p class="text-muted-foreground">Log some mistakes first to see patterns emerge.</p></div>
    {:else}
      <div class="space-y-4">
        {#each computedPatterns as pattern}
          <div class="rounded-xl border border-border bg-card p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="rounded-full px-2 py-0.5 text-xs font-medium {pattern.config.color}">{pattern.config.label}</span>
              <span class="text-2xl font-bold text-foreground">{pattern.count}x</span>
            </div>
            <div class="h-2 w-full rounded-full bg-muted overflow-hidden"><div class="h-full rounded-full bg-red-500/60 transition-all" style="width: {Math.min(100, (pattern.count / mistakesList.length) * 100)}%"></div></div>
            <p class="text-xs text-muted-foreground mt-2">{Math.round((pattern.count / mistakesList.length) * 100)}% of all mistakes</p>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>
