<script lang="ts">
  import { toastState } from '$lib/state/toast.svelte';
  import { CheckCircle, XCircle, Info, X } from 'phosphor-svelte';

  const icons = { success: CheckCircle, error: XCircle, info: Info };
  const colors = {
    success: 'border-green-500/30 bg-green-500/10 text-green-500',
    error: 'border-red-500/30 bg-red-500/10 text-red-500',
    info: 'border-blue-500/30 bg-blue-500/10 text-blue-500'
  };
</script>

{#if toastState.toasts.length > 0}
  <div class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
    {#each toastState.toasts as toast (toast.id)}
      {@const Icon = icons[toast.type]}
      <div class="flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm {colors[toast.type]} animate-slide-in">
        <Icon size={18} />
        <span class="text-sm font-medium text-foreground">{toast.message}</span>
        <button onclick={() => toastState.dismiss(toast.id)} class="ml-2 rounded p-0.5 hover:bg-muted">
          <X size={14} class="text-muted-foreground" />
        </button>
      </div>
    {/each}
  </div>
{/if}

<style>
  @keyframes slide-in {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
</style>
