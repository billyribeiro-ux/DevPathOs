<script lang="ts">
  import { Brain, NotePencil, Lightning, Code, Plus, MagnifyingGlass, Trash, PencilSimple, FloppyDisk, X, Copy, Check, ArrowCounterClockwise, Sparkle } from 'phosphor-svelte';
  import type { Note, Flashcard, Snippet } from '$lib/types/brain';
  import { toastState } from '$lib/state/toast.svelte';
  import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
  import Confetti from '$lib/components/ui/Confetti.svelte';

  let { data } = $props();

  let activeTab = $state<'notes' | 'flashcards' | 'snippets'>('notes');
  let search = $state('');
  let showConfetti = $state(false);

  // Delete confirmation
  let confirmOpen = $state(false);
  let pendingDeleteFn = $state<(() => Promise<void>) | null>(null);

  function confirmDelete(fn: () => Promise<void>) {
    pendingDeleteFn = fn;
    confirmOpen = true;
  }

  async function executeDelete() {
    if (pendingDeleteFn) await pendingDeleteFn();
    pendingDeleteFn = null;
  }

  // Notes state
  let notesList = $state<Note[]>([]);
  let editingNote = $state<Note | null>(null);
  let showNoteForm = $state(false);
  let noteTitle = $state('');
  let noteContent = $state('');
  let noteTags = $state('');
  let savingNote = $state(false);

  let cardsList = $state<Flashcard[]>([]);
  let showCardForm = $state(false);
  let cardFront = $state('');
  let cardBack = $state('');
  let cardTags = $state('');
  let savingCard = $state(false);
  let reviewMode = $state(false);
  let currentCardIndex = $state(0);
  let showAnswer = $state(false);

  let snippetsList = $state<Snippet[]>([]);
  let showSnippetForm = $state(false);
  let snippetTitle = $state('');
  let snippetCode = $state('');
  let snippetLang = $state('javascript');
  let snippetTags = $state('');
  let savingSnippet = $state(false);
  let copiedId = $state<string | null>(null);

  $effect(() => { notesList = data.notes; });
  $effect(() => { cardsList = data.flashcards; });
  $effect(() => { snippetsList = data.snippets; });

  const filteredNotes = $derived(
    notesList.filter(n =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()) ||
      n.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    )
  );
  const filteredCards = $derived(
    cardsList.filter(c =>
      c.front.toLowerCase().includes(search.toLowerCase()) ||
      c.back.toLowerCase().includes(search.toLowerCase())
    )
  );
  const filteredSnippets = $derived(
    snippetsList.filter(s =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.language.toLowerCase().includes(search.toLowerCase())
    )
  );
  const dueCards = $derived(cardsList.filter(c => new Date(c.dueDate) <= new Date()));
  const newCards = $derived(cardsList.filter(c => c.state === 'new'));

  async function saveNote() {
    if (savingNote) return;
    savingNote = true;
    try {
      const body = { title: noteTitle, content: noteContent, tags: noteTags.split(',').map(t => t.trim()).filter(Boolean) };
      if (editingNote) {
        const res = await fetch(`/api/notes/${editingNote.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error('Failed to update note');
        const updated = await res.json();
        notesList = notesList.map(n => n.id === updated.id ? updated : n);
        toastState.success('Note updated');
      } else {
        const res = await fetch('/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error('Failed to create note');
        const created = await res.json();
        notesList = [...notesList, created];
        toastState.success('Note created');
      }
      resetNoteForm();
    } catch (e) {
      toastState.error(e instanceof Error ? e.message : 'Something went wrong');
    }
    savingNote = false;
  }

  function editNote(note: Note) { editingNote = note; noteTitle = note.title; noteContent = note.content; noteTags = note.tags.join(', '); showNoteForm = true; }

  async function doDeleteNote(id: string) {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      notesList = notesList.filter(n => n.id !== id);
      toastState.info('Note deleted');
    } catch (e) { toastState.error('Failed to delete note'); }
  }

  function resetNoteForm() { showNoteForm = false; editingNote = null; noteTitle = ''; noteContent = ''; noteTags = ''; }

  async function saveCard() {
    if (savingCard) return;
    savingCard = true;
    try {
      const res = await fetch('/api/flashcards', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ front: cardFront, back: cardBack, tags: cardTags.split(',').map(t => t.trim()).filter(Boolean) }) });
      if (!res.ok) throw new Error('Failed to create card');
      const created = await res.json();
      cardsList = [...cardsList, created];
      showCardForm = false; cardFront = ''; cardBack = ''; cardTags = '';
      toastState.success('Flashcard created');
    } catch (e) { toastState.error('Failed to create flashcard'); }
    savingCard = false;
  }

  async function reviewCard(rating: 1 | 2 | 3 | 4) {
    const card = dueCards[currentCardIndex];
    if (!card) return;
    try {
      const res = await fetch(`/api/flashcards/${card.id}/review`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rating }) });
      if (!res.ok) throw new Error('Review failed');
      const updated = await res.json();
      cardsList = cardsList.map(c => c.id === updated.id ? updated : c);
      showAnswer = false;
      if (currentCardIndex >= dueCards.length - 1) {
        reviewMode = false; currentCardIndex = 0;
        showConfetti = true;
        toastState.success('Review session complete!');
        setTimeout(() => { showConfetti = false; }, 3000);
      }
    } catch (e) { toastState.error('Failed to submit review'); }
  }

  async function doDeleteCard(id: string) {
    try {
      const res = await fetch(`/api/flashcards/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      cardsList = cardsList.filter(c => c.id !== id);
      toastState.info('Card deleted');
    } catch (e) { toastState.error('Failed to delete card'); }
  }

  async function saveSnippet() {
    if (savingSnippet) return;
    savingSnippet = true;
    try {
      const res = await fetch('/api/snippets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: snippetTitle, code: snippetCode, language: snippetLang, tags: snippetTags.split(',').map(t => t.trim()).filter(Boolean) }) });
      if (!res.ok) throw new Error('Failed to create snippet');
      const created = await res.json();
      snippetsList = [...snippetsList, created];
      showSnippetForm = false; snippetTitle = ''; snippetCode = ''; snippetLang = 'javascript'; snippetTags = '';
      toastState.success('Snippet saved');
    } catch (e) { toastState.error('Failed to save snippet'); }
    savingSnippet = false;
  }

  async function doDeleteSnippet(id: string) {
    try {
      const res = await fetch(`/api/snippets/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      snippetsList = snippetsList.filter(s => s.id !== id);
      toastState.info('Snippet deleted');
    } catch (e) { toastState.error('Failed to delete snippet'); }
  }

  async function copyCode(code: string, id: string) {
    try {
      await navigator.clipboard.writeText(code);
      copiedId = id;
      toastState.success('Copied to clipboard');
      setTimeout(() => { copiedId = null; }, 2000);
    } catch {
      toastState.error('Clipboard access denied');
    }
  }

  const tabs = $derived([
    { id: 'notes' as const, label: 'Notes', icon: NotePencil, count: notesList.length },
    { id: 'flashcards' as const, label: 'Flashcards', icon: Lightning, count: cardsList.length },
    { id: 'snippets' as const, label: 'Snippets', icon: Code, count: snippetsList.length }
  ]);
  const languages = ['javascript', 'typescript', 'svelte', 'html', 'css', 'python', 'rust', 'go', 'bash', 'sql', 'json', 'other'];
</script>

<Confetti active={showConfetti} />
<ConfirmDialog bind:open={confirmOpen} title="Delete this item?" message="This action cannot be undone." onconfirm={executeDelete} />

<div class="space-y-6">
  <div class="flex items-center gap-3">
    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
      <Brain size={20} />
    </div>
    <div>
      <h1 class="text-2xl font-bold text-foreground">Developer Brain</h1>
      <p class="text-sm text-muted-foreground">Your personal knowledge base</p>
    </div>
  </div>

  <div class="flex items-center gap-1 border-b border-border" role="tablist">
    {#each tabs as tab}
      {@const Icon = tab.icon}
      <button role="tab" aria-selected={activeTab === tab.id} onclick={() => { activeTab = tab.id; search = ''; }}
        class="flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors {activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}">
        <Icon size={16} /> {tab.label}
        <span class="rounded-full bg-muted px-2 py-0.5 text-xs">{tab.count}</span>
      </button>
    {/each}
  </div>

  <div class="flex items-center gap-3">
    <div class="relative flex-1">
      <MagnifyingGlass size={16} class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input type="text" bind:value={search} placeholder="Search {activeTab}..." class="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
    </div>
    {#if activeTab === 'notes'}
      <button onclick={() => { resetNoteForm(); showNoteForm = true; }} class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"><Plus size={16} /> New Note</button>
    {:else if activeTab === 'flashcards'}
      <button onclick={() => { showCardForm = true; }} class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"><Plus size={16} /> New Card</button>
      {#if dueCards.length > 0}
        <button onclick={() => { reviewMode = true; currentCardIndex = 0; showAnswer = false; }} class="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"><ArrowCounterClockwise size={16} /> Review ({dueCards.length})</button>
      {/if}
    {:else}
      <button onclick={() => { showSnippetForm = true; }} class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"><Plus size={16} /> New Snippet</button>
    {/if}
  </div>

  {#if activeTab === 'notes'}
    {#if showNoteForm}
      <div class="rounded-xl border border-border bg-card p-6 space-y-4 animate-in">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-foreground">{editingNote ? 'Edit Note' : 'New Note'}</h3>
          <button onclick={resetNoteForm} class="text-muted-foreground hover:text-foreground"><X size={20} /></button>
        </div>
        <input bind:value={noteTitle} placeholder="Title" class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none" />
        <textarea bind:value={noteContent} placeholder="Write your note in markdown..." rows={10} class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none"></textarea>
        <input bind:value={noteTags} placeholder="Tags (comma separated)" class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none" />
        <button onclick={saveNote} disabled={savingNote || !noteTitle} class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
          <FloppyDisk size={16} /> {savingNote ? 'Saving...' : 'Save Note'}
        </button>
      </div>
    {/if}

    {#if filteredNotes.length === 0}
      <div class="rounded-xl border border-dashed border-border bg-gradient-to-br from-amber-500/5 to-transparent p-12 text-center">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10">
          <NotePencil size={32} class="text-amber-500" />
        </div>
        <h3 class="font-semibold text-foreground mb-1">{search ? 'No notes found' : 'Your knowledge starts here'}</h3>
        <p class="text-sm text-muted-foreground mb-4">{search ? 'Try a different search term.' : 'Capture concepts, ideas, and learnings as you go.'}</p>
        {#if !search}
          <button onclick={() => { resetNoteForm(); showNoteForm = true; }} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Create your first note</button>
        {/if}
      </div>
    {:else}
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each filteredNotes as note (note.id)}
          <div class="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5">
            <div class="flex items-start justify-between mb-2">
              <h3 class="font-semibold text-foreground line-clamp-1">{note.title}</h3>
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onclick={() => editNote(note)} class="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Edit note"><PencilSimple size={14} /></button>
                <button onclick={() => confirmDelete(() => doDeleteNote(note.id))} class="rounded p-1 text-muted-foreground hover:bg-red-500/10 hover:text-red-500" aria-label="Delete note"><Trash size={14} /></button>
              </div>
            </div>
            <div class="text-sm text-muted-foreground line-clamp-3 mb-3 prose prose-sm dark:prose-invert max-w-none">{note.content}</div>
            {#if note.tags.length > 0}
              <div class="flex flex-wrap gap-1">
                {#each note.tags as tag}<span class="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{tag}</span>{/each}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}

  {:else if activeTab === 'flashcards'}
    {#if reviewMode && dueCards.length > 0}
      {@const card = dueCards[currentCardIndex]}
      <div class="mx-auto max-w-lg space-y-4">
        <div class="flex items-center justify-between text-sm text-muted-foreground">
          <span>Card {currentCardIndex + 1} of {dueCards.length}</span>
          <button onclick={() => { reviewMode = false; }} class="text-muted-foreground hover:text-foreground">Exit Review</button>
        </div>
        <div class="rounded-xl border-2 border-primary/20 bg-card p-8 text-center min-h-[200px] flex flex-col items-center justify-center shadow-lg">
          <p class="text-lg font-medium text-foreground mb-4">{card.front}</p>
          {#if showAnswer}
            <div class="w-full border-t border-border pt-4 mt-2">
              <p class="text-foreground">{card.back}</p>
            </div>
          {/if}
        </div>
        {#if !showAnswer}
          <button onclick={() => { showAnswer = true; }} class="w-full rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">Show Answer</button>
        {:else}
          <div class="grid grid-cols-4 gap-2">
            <button onclick={() => reviewCard(1)} class="rounded-lg bg-red-500/10 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/20">Again</button>
            <button onclick={() => reviewCard(2)} class="rounded-lg bg-orange-500/10 py-2.5 text-sm font-medium text-orange-500 hover:bg-orange-500/20">Hard</button>
            <button onclick={() => reviewCard(3)} class="rounded-lg bg-blue-500/10 py-2.5 text-sm font-medium text-blue-500 hover:bg-blue-500/20">Good</button>
            <button onclick={() => reviewCard(4)} class="rounded-lg bg-green-500/10 py-2.5 text-sm font-medium text-green-500 hover:bg-green-500/20">Easy</button>
          </div>
        {/if}
      </div>
    {:else}
      {#if showCardForm}
        <div class="rounded-xl border border-border bg-card p-6 space-y-4 animate-in">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-foreground">New Flashcard</h3>
            <button onclick={() => { showCardForm = false; }} class="text-muted-foreground hover:text-foreground"><X size={20} /></button>
          </div>
          <textarea bind:value={cardFront} placeholder="Front (question)" rows={3} class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"></textarea>
          <textarea bind:value={cardBack} placeholder="Back (answer)" rows={3} class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"></textarea>
          <input bind:value={cardTags} placeholder="Tags (comma separated)" class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none" />
          <button onclick={saveCard} disabled={savingCard || !cardFront || !cardBack} class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            <FloppyDisk size={16} /> {savingCard ? 'Saving...' : 'Save Card'}
          </button>
        </div>
      {/if}

      <div class="grid grid-cols-3 gap-4">
        <div class="rounded-xl border border-border bg-card p-4 text-center"><p class="text-2xl font-bold text-blue-500">{newCards.length}</p><p class="text-xs text-muted-foreground">New</p></div>
        <div class="rounded-xl border border-border bg-card p-4 text-center"><p class="text-2xl font-bold text-amber-500">{dueCards.length}</p><p class="text-xs text-muted-foreground">Due</p></div>
        <div class="rounded-xl border border-border bg-card p-4 text-center"><p class="text-2xl font-bold text-green-500">{cardsList.length - dueCards.length - newCards.length}</p><p class="text-xs text-muted-foreground">Reviewed</p></div>
      </div>

      {#if filteredCards.length === 0}
        <div class="rounded-xl border border-dashed border-border bg-gradient-to-br from-violet-500/5 to-transparent p-12 text-center">
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10">
            <Lightning size={32} class="text-violet-500" />
          </div>
          <h3 class="font-semibold text-foreground mb-1">{search ? 'No cards found' : 'Build your memory palace'}</h3>
          <p class="text-sm text-muted-foreground mb-4">{search ? 'Try a different search term.' : 'Flashcards use spaced repetition (FSRS) to make knowledge stick.'}</p>
          {#if !search}
            <button onclick={() => { showCardForm = true; }} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Create your first card</button>
          {/if}
        </div>
      {:else}
        <div class="grid gap-3 md:grid-cols-2">
          {#each filteredCards as card (card.id)}
            <div class="group rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm">
              <div class="flex items-start justify-between mb-2">
                <span class="inline-block rounded-full px-2 py-0.5 text-xs font-medium {card.state === 'new' ? 'bg-blue-500/10 text-blue-500' : card.state === 'learning' ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-500'}">{card.state}</span>
                <button onclick={() => confirmDelete(() => doDeleteCard(card.id))} class="rounded p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 transition-opacity" aria-label="Delete card"><Trash size={14} /></button>
              </div>
              <p class="text-sm font-medium text-foreground mb-1">{card.front}</p>
              <p class="text-xs text-muted-foreground line-clamp-2">{card.back}</p>
            </div>
          {/each}
        </div>
      {/if}
    {/if}

  {:else}
    {#if showSnippetForm}
      <div class="rounded-xl border border-border bg-card p-6 space-y-4 animate-in">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-foreground">New Snippet</h3>
          <button onclick={() => { showSnippetForm = false; }} class="text-muted-foreground hover:text-foreground"><X size={20} /></button>
        </div>
        <input bind:value={snippetTitle} placeholder="Title" class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none" />
        <select bind:value={snippetLang} class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
          {#each languages as lang}<option value={lang}>{lang}</option>{/each}
        </select>
        <textarea bind:value={snippetCode} placeholder="Paste your code here..." rows={10} class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none"></textarea>
        <input bind:value={snippetTags} placeholder="Tags (comma separated)" class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none" />
        <button onclick={saveSnippet} disabled={savingSnippet || !snippetTitle || !snippetCode} class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
          <FloppyDisk size={16} /> {savingSnippet ? 'Saving...' : 'Save Snippet'}
        </button>
      </div>
    {/if}

    {#if filteredSnippets.length === 0}
      <div class="rounded-xl border border-dashed border-border bg-gradient-to-br from-blue-500/5 to-transparent p-12 text-center">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">
          <Code size={32} class="text-blue-500" />
        </div>
        <h3 class="font-semibold text-foreground mb-1">{search ? 'No snippets found' : 'Your code cookbook'}</h3>
        <p class="text-sm text-muted-foreground mb-4">{search ? 'Try a different search term.' : 'Save reusable code patterns, solutions, and recipes.'}</p>
        {#if !search}
          <button onclick={() => { showSnippetForm = true; }} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Save your first snippet</button>
        {/if}
      </div>
    {:else}
      <div class="space-y-4">
        {#each filteredSnippets as snippet (snippet.id)}
          <div class="group rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-sm">
            <div class="flex items-center justify-between border-b border-border px-4 py-2.5">
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-semibold text-foreground">{snippet.title}</h3>
                <span class="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{snippet.language}</span>
              </div>
              <div class="flex gap-1">
                <button onclick={() => copyCode(snippet.code, snippet.id)} class="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Copy code">
                  {#if copiedId === snippet.id}<Check size={14} class="text-green-500" />{:else}<Copy size={14} />{/if}
                </button>
                <button onclick={() => confirmDelete(() => doDeleteSnippet(snippet.id))} class="rounded p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 transition-opacity" aria-label="Delete snippet"><Trash size={14} /></button>
              </div>
            </div>
            <pre class="overflow-x-auto p-4 text-sm text-foreground font-mono bg-muted/30"><code>{snippet.code}</code></pre>
            {#if snippet.tags.length > 0}
              <div class="flex flex-wrap gap-1 px-4 pb-3">
                {#each snippet.tags as tag}<span class="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{tag}</span>{/each}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  @keyframes animate-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
  .animate-in { animation: animate-in 0.2s ease-out; }
</style>
