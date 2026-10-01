export type Theme = 'dark' | 'light';

const storageKey = 't1ger-theme';

export function getPreferredTheme(): Theme {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#111217' : '#f6f7fb');
  try {
    localStorage.setItem(storageKey, theme);
  } catch {
    // The selected theme still works when storage is unavailable.
  }
}

export function initializeTheme(): Theme {
  const theme = getPreferredTheme();
  applyTheme(theme);
  return theme;
}
