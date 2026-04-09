<script lang="ts">
  import { page } from '$app/stores';
  import { appState } from '$lib/state/app.svelte';
  import brandIcon from '$lib/assets/icon.svg';
  import {
    House,
    Path,
    Book,
    Brain,
    Folders,
    Bug,
    Robot,
    ChartBar,
    Briefcase,
    Gear,
    List
  } from 'phosphor-svelte';

  const navItems = [
    { href: '/', label: 'Dashboard', icon: House },
    { href: '/roadmap', label: 'Roadmap', icon: Path },
    { href: '/learn', label: 'Learn', icon: Book },
    { href: '/brain', label: 'Brain', icon: Brain },
    { href: '/projects', label: 'Projects', icon: Folders },
    { href: '/mistakes', label: 'Mistakes', icon: Bug },
    { href: '/mentor', label: 'Mentor', icon: Robot },
    { href: '/review', label: 'Reviews', icon: ChartBar },
    { href: '/career', label: 'Career', icon: Briefcase },
  ];

  const bottomItems = [
    { href: '/settings', label: 'Settings', icon: Gear },
  ];

  function isActive(href: string, currentPath: string): boolean {
    if (href === '/') return currentPath === '/';
    return currentPath.startsWith(href);
  }
</script>

<aside
  class="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 {appState.sidebarOpen ? 'translate-x-0' : '-translate-x-full'}"
>
  <div class="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
    <img src={brandIcon} alt="DevPath OS" class="h-8 w-8 rounded-lg" />
    <span class="text-lg font-semibold">DevPath OS</span>
  </div>

  <nav class="flex-1 overflow-y-auto px-3 py-4">
    <ul class="space-y-1">
      {#each navItems as item}
        <li>
          <a
            href={item.href}
            aria-current={isActive(item.href, $page.url.pathname) ? 'page' : undefined}
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary {isActive(item.href, $page.url.pathname) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}"
          >
            <item.icon size={20} />
            {item.label}
          </a>
        </li>
      {/each}
    </ul>
  </nav>

  <div class="border-t border-sidebar-border px-3 py-4">
    <ul class="space-y-1">
      {#each bottomItems as item}
        <li>
          <a
            href={item.href}
            aria-current={isActive(item.href, $page.url.pathname) ? 'page' : undefined}
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary {isActive(item.href, $page.url.pathname) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}"
          >
            <item.icon size={20} />
            {item.label}
          </a>
        </li>
      {/each}
    </ul>
  </div>
</aside>
