<script lang="ts">
  import { Folders, Plus, X, FloppyDisk, Trash, PencilSimple, Clock, CheckCircle, WarningCircle, Rocket } from 'phosphor-svelte';
  import type { Project, ProjectStatus } from '$lib/types/project';
  import { toastState } from '$lib/state/toast.svelte';
  import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
  import Confetti from '$lib/components/ui/Confetti.svelte';

  let { data } = $props();
  let projectsList = $state<Project[]>([]);
  $effect(() => { projectsList = data.projects; });
  let showForm = $state(false);
  let editingProject = $state<Project | null>(null);
  let saving = $state(false);
  let projectName = $state('');
  let projectDesc = $state('');
  let filterStatus = $state<ProjectStatus | 'all'>('all');
  let confirmOpen = $state(false);
  let pendingDeleteFn = $state<(() => Promise<void>) | null>(null);
  let showConfetti = $state(false);

  function confirmDelete(fn: () => Promise<void>) { pendingDeleteFn = fn; confirmOpen = true; }
  async function executeDelete() { if (pendingDeleteFn) await pendingDeleteFn(); pendingDeleteFn = null; }

  const filtered = $derived(filterStatus === 'all' ? projectsList : projectsList.filter(p => p.status === filterStatus));
  const statusConfig: Record<ProjectStatus, { label: string; color: string; icon: typeof Clock }> = {
    planning: { label: 'Planning', color: 'bg-blue-500/10 text-blue-500', icon: Clock },
    active: { label: 'Active', color: 'bg-green-500/10 text-green-500', icon: CheckCircle },
    completed: { label: 'Completed', color: 'bg-amber-500/10 text-amber-500', icon: CheckCircle },
    abandoned: { label: 'Abandoned', color: 'bg-red-500/10 text-red-500', icon: WarningCircle }
  };
  const statuses: (ProjectStatus | 'all')[] = ['all', 'planning', 'active', 'completed', 'abandoned'];
  const counts = $derived({
    all: projectsList.length,
    planning: projectsList.filter(p => p.status === 'planning').length,
    active: projectsList.filter(p => p.status === 'active').length,
    completed: projectsList.filter(p => p.status === 'completed').length,
    abandoned: projectsList.filter(p => p.status === 'abandoned').length
  });

  async function saveProject() {
    saving = true;
    try {
      const body = { name: projectName, description: projectDesc };
      if (editingProject) {
        const res = await fetch(`/api/projects/${editingProject.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error('Failed to update');
        const updated = await res.json();
        projectsList = projectsList.map(p => p.id === updated.id ? updated : p);
        toastState.success('Project updated');
      } else {
        const res = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error('Failed to create');
        const created = await res.json();
        projectsList = [...projectsList, created];
        toastState.success('Project created');
      }
      resetForm();
    } catch (e) { toastState.error('Failed to save project'); }
    saving = false;
  }

  async function updateStatus(project: Project, status: ProjectStatus) {
    try {
      const body: Record<string, unknown> = { status };
      if (status === 'completed') body.completedAt = new Date().toISOString();
      const res = await fetch(`/api/projects/${project.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error('Failed to update');
      const updated = await res.json();
      projectsList = projectsList.map(p => p.id === updated.id ? updated : p);
      if (status === 'completed') {
        showConfetti = true;
        toastState.success('Project completed! Great work!');
        setTimeout(() => { showConfetti = false; }, 3000);
      } else {
        toastState.info(`Project moved to ${status}`);
      }
    } catch (e) { toastState.error('Failed to update status'); }
  }

  async function doDeleteProject(id: string) {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      projectsList = projectsList.filter(p => p.id !== id);
      toastState.info('Project deleted');
    } catch (e) { toastState.error('Failed to delete project'); }
  }

  function editProject(project: Project) { editingProject = project; projectName = project.name; projectDesc = project.description; showForm = true; }
  function resetForm() { showForm = false; editingProject = null; projectName = ''; projectDesc = ''; }
</script>

<Confetti active={showConfetti} />
<ConfirmDialog bind:open={confirmOpen} title="Delete this project?" message="All project data will be permanently removed." onconfirm={executeDelete} />

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500"><Folders size={20} /></div>
      <div><h1 class="text-2xl font-bold text-foreground">Projects</h1><p class="text-sm text-muted-foreground">Track what you're building</p></div>
    </div>
    <button onclick={() => { resetForm(); showForm = true; }} class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"><Plus size={16} /> New Project</button>
  </div>

  {#if showForm}
    <div class="rounded-xl border border-border bg-card p-6 space-y-4">
      <div class="flex items-center justify-between"><h3 class="font-semibold text-foreground">{editingProject ? 'Edit Project' : 'New Project'}</h3><button onclick={resetForm} class="text-muted-foreground hover:text-foreground"><X size={20} /></button></div>
      <input bind:value={projectName} placeholder="Project name" class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none" />
      <textarea bind:value={projectDesc} placeholder="Description" rows={3} class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"></textarea>
      <button onclick={saveProject} disabled={saving || !projectName} class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"><FloppyDisk size={16} /> {saving ? 'Saving...' : 'Save'}</button>
    </div>
  {/if}

  <div class="flex gap-2 flex-wrap">
    {#each statuses as status}
      <button onclick={() => { filterStatus = status; }} class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {filterStatus === status ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}">
        {status === 'all' ? 'All' : statusConfig[status].label} <span class="ml-1 opacity-70">({counts[status]})</span>
      </button>
    {/each}
  </div>

  {#if filtered.length === 0}
    <div class="rounded-xl border border-dashed border-border bg-gradient-to-br from-purple-500/5 to-transparent p-12 text-center">
      <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10"><Rocket size={32} class="text-purple-500" /></div>
      <h3 class="font-semibold text-foreground mb-1">{projectsList.length === 0 ? 'Launch your first project' : 'No projects match this filter'}</h3>
      <p class="text-sm text-muted-foreground mb-4">{projectsList.length === 0 ? 'Projects connect what you learn to what you build. Start small!' : 'Try a different filter.'}</p>
      {#if projectsList.length === 0}
        <button onclick={() => { resetForm(); showForm = true; }} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Create project</button>
      {/if}
    </div>
  {:else}
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each filtered as project (project.id)}
        {@const config = statusConfig[project.status]}
        {@const StatusIcon = config.icon}
        <div class="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5">
          <div class="flex items-start justify-between mb-3">
            <span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium {config.color}"><StatusIcon size={12} /> {config.label}</span>
            <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onclick={() => editProject(project)} class="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Edit"><PencilSimple size={14} /></button>
              <button onclick={() => confirmDelete(() => doDeleteProject(project.id))} class="rounded p-1 text-muted-foreground hover:bg-red-500/10 hover:text-red-500" aria-label="Delete"><Trash size={14} /></button>
            </div>
          </div>
          <h3 class="font-semibold text-foreground mb-1">{project.name}</h3>
          <p class="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
          <div class="flex gap-1.5 flex-wrap">
            {#if project.status === 'planning'}
              <button onclick={() => updateStatus(project, 'active')} class="rounded bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500 hover:bg-green-500/20">Start</button>
            {:else if project.status === 'active'}
              <button onclick={() => updateStatus(project, 'completed')} class="rounded bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-500 hover:bg-amber-500/20">Complete</button>
              <button onclick={() => updateStatus(project, 'planning')} class="rounded bg-muted px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground">Pause</button>
            {:else if project.status === 'completed'}
              <button onclick={() => updateStatus(project, 'active')} class="rounded bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-500 hover:bg-blue-500/20">Reopen</button>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
