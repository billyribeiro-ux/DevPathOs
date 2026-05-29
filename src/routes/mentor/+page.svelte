<script lang="ts">
  import { Robot, PaperPlaneTilt, Chalkboard, GraduationCap, Wrench, Microphone, Lightbulb, ArrowLeft, Trash } from 'phosphor-svelte';
  import { MENTOR_MODE_LABELS, MENTOR_MODE_DESCRIPTIONS, type MentorMode, type ChatSession, type ChatMessage } from '$lib/types/mentor';
  import { toastState } from '$lib/state/toast.svelte';
  import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
  import { tick } from 'svelte';

  let { data } = $props();

  let sessions = $state<ChatSession[]>([]);
  $effect(() => { sessions = data.sessions; });
  let activeSessionId = $state<string | null>(null);
  let messages = $state<ChatMessage[]>([]);
  let input = $state('');
  let sending = $state(false);
  let loadingMessages = $state(false);
  let creating = $state(false);
  let messagesEl = $state<HTMLDivElement | null>(null);
  let confirmOpen = $state(false);
  let pendingDeleteId = $state<string | null>(null);

  const modeIcons: Record<MentorMode, typeof Robot> = {
    coach: Lightbulb, teacher: GraduationCap, debugger: Wrench, interviewer: Microphone, reflection: Chalkboard
  };
  const modeColors: Record<MentorMode, string> = {
    coach: 'bg-green-500/10 text-green-500', teacher: 'bg-blue-500/10 text-blue-500',
    debugger: 'bg-red-500/10 text-red-500', interviewer: 'bg-violet-500/10 text-violet-500',
    reflection: 'bg-amber-500/10 text-amber-500'
  };
  const activeSession = $derived(sessions.find(s => s.id === activeSessionId));

  async function scrollToBottom() {
    await tick();
    if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function createSession(mode: MentorMode) {
    creating = true;
    try {
      const res = await fetch('/api/mentor/sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode }) });
      if (!res.ok) throw new Error('Failed to create session');
      const session = await res.json();
      sessions = [session, ...sessions];
      await loadSession(session.id);
    } catch (e) { toastState.error('Failed to create session'); }
    creating = false;
  }

  async function loadSession(id: string) {
    activeSessionId = id;
    loadingMessages = true;
    try {
      const res = await fetch(`/api/mentor/sessions/${id}/messages`);
      if (!res.ok) throw new Error('Failed to load messages');
      messages = await res.json();
      await scrollToBottom();
    } catch (e) { toastState.error('Failed to load messages'); }
    loadingMessages = false;
  }

  async function sendMessage() {
    if (!input.trim() || !activeSessionId || sending) return;
    sending = true;
    const userMsg = input;
    input = '';
    try {
      const res = await fetch(`/api/mentor/sessions/${activeSessionId}/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: userMsg }) });
      if (!res.ok) throw new Error('Failed to send');
      const newMessages = await res.json();
      messages = [...messages, ...newMessages];
      await scrollToBottom();
    } catch (e) {
      toastState.error('Failed to send message');
      input = userMsg;
    }
    sending = false;
  }

  async function doDeleteSession() {
    if (!pendingDeleteId) return;
    try {
      const res = await fetch(`/api/mentor/sessions/${pendingDeleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      sessions = sessions.filter(s => s.id !== pendingDeleteId);
      if (activeSessionId === pendingDeleteId) { activeSessionId = null; messages = []; }
      toastState.info('Session deleted');
    } catch (e) { toastState.error('Failed to delete session'); }
    pendingDeleteId = null;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }
</script>

<ConfirmDialog bind:open={confirmOpen} title="Delete this chat?" message="All messages in this session will be permanently removed." onconfirm={doDeleteSession} />

<div class="space-y-6">
  <div class="flex items-center gap-3">
    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-500"><Robot size={20} /></div>
    <div><h1 class="text-2xl font-bold text-foreground">AI Mentor</h1><p class="text-sm text-muted-foreground">Get coaching in 5 different modes</p></div>
  </div>

  {#if !activeSessionId}
    <div>
      <h2 class="text-lg font-semibold text-foreground mb-3">Start a new session</h2>
      <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {#each Object.entries(MENTOR_MODE_LABELS) as [mode, label]}
          {@const Icon = modeIcons[mode as MentorMode]}
          <button onclick={() => createSession(mode as MentorMode)} disabled={creating}
            class="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 text-left transition-all hover:border-primary hover:shadow-md disabled:opacity-50">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg {modeColors[mode as MentorMode]}"><Icon size={20} /></div>
            <div><h3 class="font-semibold text-foreground">{label}</h3><p class="text-sm text-muted-foreground mt-0.5">{MENTOR_MODE_DESCRIPTIONS[mode as MentorMode]}</p></div>
          </button>
        {/each}
      </div>
    </div>

    {#if sessions.length > 0}
      <div>
        <h2 class="text-lg font-semibold text-foreground mb-3">Recent Sessions</h2>
        <div class="space-y-2">
          {#each sessions as session (session.id)}
            {@const Icon = modeIcons[session.mode]}
            <div class="group flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/30">
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg {modeColors[session.mode]}"><Icon size={16} /></div>
              <button onclick={() => loadSession(session.id)} class="flex-1 text-left min-w-0">
                <h3 class="text-sm font-medium text-foreground truncate">{session.title ?? MENTOR_MODE_LABELS[session.mode] + ' Session'}</h3>
                <p class="text-xs text-muted-foreground">{new Date(session.createdAt).toLocaleDateString()}</p>
              </button>
              <button onclick={() => { pendingDeleteId = session.id; confirmOpen = true; }} class="shrink-0 rounded p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 transition-opacity" aria-label="Delete session"><Trash size={14} /></button>
            </div>
          {/each}
        </div>
      </div>
    {/if}

  {:else}
    <div class="flex items-center gap-3 mb-2">
      <button onclick={() => { activeSessionId = null; messages = []; }} class="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={16} /> Back</button>
      {#if activeSession}
        {@const Icon = modeIcons[activeSession.mode]}
        <span class="flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium {modeColors[activeSession.mode]}"><Icon size={12} /> {MENTOR_MODE_LABELS[activeSession.mode]}</span>
      {/if}
    </div>

    <div bind:this={messagesEl} class="space-y-4 min-h-[300px] max-h-[60vh] overflow-y-auto rounded-xl border border-border bg-card p-4 scroll-smooth">
      {#if loadingMessages}
        <div class="flex justify-center py-8"><div class="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div></div>
      {:else if messages.length === 0}
        <div class="text-center py-8">
          <Robot size={48} class="mx-auto mb-3 text-muted-foreground/30" />
          <p class="text-muted-foreground">Start a conversation. I'll respond in <strong class="text-foreground">{activeSession ? MENTOR_MODE_LABELS[activeSession.mode] : ''}</strong> mode.</p>
          <p class="text-xs text-muted-foreground mt-2">Try asking a question, sharing code, or describing what you're stuck on.</p>
        </div>
      {:else}
        {#each messages as msg (msg.id)}
          <div class="flex gap-3 {msg.role === 'user' ? 'flex-row-reverse' : ''}">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full {msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}">
              {#if msg.role === 'user'}<span class="text-xs font-bold">You</span>{:else}<Robot size={16} />{/if}
            </div>
            <div class="max-w-[80%] rounded-xl px-4 py-2.5 {msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}">
              <p class="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        {/each}
        {#if sending}
          <div class="flex gap-3">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"><Robot size={16} /></div>
            <div class="rounded-xl bg-muted px-4 py-2.5"><div class="flex gap-1"><span class="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"></span><span class="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style="animation-delay: 0.1s"></span><span class="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style="animation-delay: 0.2s"></span></div></div>
          </div>
        {/if}
      {/if}
    </div>

    <div class="flex gap-2">
      <textarea bind:value={input} onkeydown={handleKeydown} placeholder="Type your message..." rows={2}
        class="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"></textarea>
      <button onclick={sendMessage} disabled={!input.trim() || sending}
        class="flex h-auto items-center justify-center rounded-lg bg-primary px-4 text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
        <PaperPlaneTilt size={20} />
      </button>
    </div>
  {/if}
</div>
