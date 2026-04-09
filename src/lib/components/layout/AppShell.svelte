<script lang="ts">
  import { appState } from '$lib/state/app.svelte';
  import Sidebar from './Sidebar.svelte';
  import TopBar from './TopBar.svelte';

  let { children } = $props();
</script>

<div class="min-h-screen bg-background">
  <Sidebar />

  <div class="transition-all duration-200 {appState.sidebarOpen ? 'lg:ml-64' : ''}">
    <TopBar />
    <main class="p-6">
      {@render children()}
    </main>
  </div>
</div>
