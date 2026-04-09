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

  function confirm() {
    onconfirm();
    open = false;
  }
</script>

{#if open}
  <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true">
    <div class="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl">
      <div class="flex items-start gap-3 mb-4">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full {variant === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}">
          <WarningCircle size={24} />
        </div>
        <div>
          <h3 class="font-semibold text-foreground">{title}</h3>
          <p class="text-sm text-muted-foreground mt-1">{message}</p>
        </div>
      </div>
      <div class="flex justify-end gap-2">
        <button
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
