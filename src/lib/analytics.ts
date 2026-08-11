import { track } from '@vercel/analytics';

type EventValue = string | number | boolean;

export function trackEvent(name: string, properties: Record<string, EventValue> = {}) {
  const params = new URLSearchParams(window.location.search);
  const campaign = Object.fromEntries(
    ['utm_source', 'utm_medium', 'utm_campaign', 'ref']
      .map((key) => [key, params.get(key)] as const)
      .filter((entry): entry is [string, string] => Boolean(entry[1])),
  );

  track(name, { ...campaign, ...properties });
}
