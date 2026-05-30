<script lang="ts">
  import { WarningCircle } from 'phosphor-svelte';

  let {
    open = $bindable(false),
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel',
    variant = 'danger' as 'danger' | 'warning',
    onconfirm
  }: {
    open: boolean;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning';
    onconfirm: () => void;
  } = $props();

  let dialogEl = $state<HTMLDivElement | null>(null);
  let cancelBtnEl = $state<HTMLButtonElement | null>(null);

  $effect(() => {
    if (open && cancelBtnEl) cancelBtnEl.focus();
  });

  function confirm() {
    onconfirm();
    open = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.stopPropagation();
      open = false;
      return;
    }
    if (e.key !== 'Tab' || !dialogEl) return;
    const focusable = dialogEl.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
</script>

{#if open}
  <div
    class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-labelledby="confirm-dialog-title"
    aria-describedby="confirm-dialog-message"
    tabindex="-1"
    onkeydown={handleKeydown}
  >
    <div bind:this={dialogEl} class="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl">
      <div class="flex items-start gap-3 mb-4">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full {variant === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}">
          <WarningCircle size={24} />
        </div>
        <div>
          <h3 id="confirm-dialog-title" class="font-semibold text-foreground">{title}</h3>
          <p id="confirm-dialog-message" class="text-sm text-muted-foreground mt-1">{message}</p>
        </div>
      </div>
      <div class="flex justify-end gap-2">
        <button
          bind:this={cancelBtnEl}
          onclick={() => { open = false; }}
          class="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          {cancelLabel}
        </button>
        <button
          onclick={confirm}
          class="rounded-lg px-4 py-2 text-sm font-medium text-white {variant === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'}"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
{/if}
