<script lang="ts">
  let { active = false }: { active: boolean } = $props();

  let particles = $state<Array<{id: number; x: number; y: number; color: string; delay: number}>>([]);

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

  $effect(() => {
    if (active) {
      particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5
      }));
      setTimeout(() => { particles = []; }, 3000);
    }
  });
</script>

{#if particles.length > 0}
  <div class="pointer-events-none fixed inset-0 z-[200] overflow-hidden" aria-hidden="true">
    {#each particles as p (p.id)}
      <div
        class="absolute h-2 w-2 rounded-full animate-confetti"
        style="left: {p.x}%; background: {p.color}; animation-delay: {p.delay}s;"
      ></div>
    {/each}
  </div>
{/if}

<style>
  @keyframes confetti {
    0% { top: -5%; opacity: 1; transform: rotate(0deg) scale(1); }
    50% { opacity: 1; }
    100% { top: 105%; opacity: 0; transform: rotate(720deg) scale(0.3); }
  }
  .animate-confetti {
    animation: confetti 2.5s ease-out forwards;
  }
</style>
