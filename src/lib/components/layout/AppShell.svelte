<script lang="ts">
  import { appState } from '$lib/state/app.svelte';
  import Sidebar from './Sidebar.svelte';
  import TopBar from './TopBar.svelte';

  let { children } = $props();
</script>

<div class="min-h-screen bg-background">
  <a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
    Skip to main content
  </a>
  <Sidebar />

  <div class="transition-all duration-200 {appState.sidebarOpen ? 'lg:ml-64' : ''}">
    <TopBar />
    <main id="main-content" class="p-6">
      {@render children()}
    </main>
  </div>
</div>
