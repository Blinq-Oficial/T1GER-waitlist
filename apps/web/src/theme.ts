export type Theme = 'dark' | 'light';

const storageKey = 't1ger-theme';

export function getPreferredTheme(): Theme {
  try {
    return localStorage.getItem(storageKey) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
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
