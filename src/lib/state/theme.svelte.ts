export type Theme = 'light' | 'dark' | 'system';

class ThemeState {
  current = $state<Theme>('system');

  resolved = $derived.by<'light' | 'dark'>(() => {
    if (this.current === 'system') {
      if (typeof window === 'undefined') return 'light';
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return this.current;
  });

  init() {
    const saved = localStorage.getItem('devpath-theme') as Theme | null;
    if (saved) this.current = saved;
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
