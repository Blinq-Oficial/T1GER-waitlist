import { Component, type ReactNode } from 'react';

/** Keep a recoverable screen when a route chunk or rendering fails. */
export default class AppBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return <main className="app-recovery" role="alert"><span className="brand-mark">1</span><h1>Let’s reconnect.</h1><p>This screen could not load. Reload to continue. Your saved learning is kept.</p><button className="button primary" onClick={() => window.location.reload()}>Reload T1GER</button></main>;
  }
}

// A deployment can replace route chunks while an older tab is still open.
// Recover once; a repeated failure remains visible in the boundary above.
window.addEventListener('vite:preloadError', event => {
  try {
    const key = 't1ger-module-recovery', now = Date.now();
    const last = Number(sessionStorage.getItem(key)) || 0;
    if (now - last > 60_000) {
      sessionStorage.setItem(key, String(now));
      event.preventDefault();
      window.location.reload();
    }
  } catch { /* If storage is unavailable, provide the manual recovery screen. */ }
});
