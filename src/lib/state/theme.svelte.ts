export type Theme = 'light' | 'dark' | 'system';

class ThemeState {
  current = $state<Theme>('system');
  private systemDark = $state(false);

  resolved = $derived.by<'light' | 'dark'>(() => {
    if (this.current === 'system') {
      return this.systemDark ? 'dark' : 'light';
    }
    return this.current;
  });

  init() {
    const saved = localStorage.getItem('devpath-theme') as Theme | null;
    if (saved) this.current = saved;

    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      this.systemDark = mq.matches;
      mq.addEventListener('change', (e) => {
        this.systemDark = e.matches;
        if (this.current === 'system') this.apply();
      });
    }

    this.apply();
  }

  set(theme: Theme) {
    this.current = theme;
    localStorage.setItem('devpath-theme', theme);
    this.apply();
  }

  toggle() {
    this.set(this.resolved === 'dark' ? 'light' : 'dark');
  }

  private apply() {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', this.resolved === 'dark');
  }
}

export const themeState = new ThemeState();
