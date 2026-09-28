const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function appHref(path: string): string {
  return `${base}${path}`;
}

export function appRoute(): string[] {
  const pathname = window.location.pathname;
  const relative = base && (pathname === base || pathname.startsWith(`${base}/`))
    ? pathname.slice(base.length)
    : pathname;
  return relative.split('/').filter(Boolean);
}
