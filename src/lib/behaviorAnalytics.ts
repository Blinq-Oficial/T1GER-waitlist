import type { PostHog } from 'posthog-js';

const choiceKey = 't1ger_analytics_choice_v1';
export interface AnalyticsChoice { events: boolean; replay: boolean }
export function analyticsChoice(): AnalyticsChoice {
  try { const value = JSON.parse(localStorage.getItem(choiceKey) || 'null'); return { events: value?.events === true, replay: value?.events === true && value?.replay === true }; }
  catch { return { events: false, replay: false }; }
}
export const posthogConfigured = Boolean(import.meta.env.VITE_POSTHOG_KEY?.startsWith('phc_'));
let client: Pick<PostHog, 'capture' | 'startSessionRecording' | 'stopSessionRecording' | 'opt_in_capturing' | 'opt_out_capturing' | 'reset'> | undefined;
let loading: Promise<void> | undefined;
let currentPath = '/';
let replayUrlSafe = false;
let lastPage = '';
const privateReplayRoutes = new Set(['coach', 'profile', 'community', 'settings', 'lesson', 'apply', 'master', 'progress', 'library']);
export function replayAllowed(raw: string): boolean {
  try {
    const url = new URL(raw, 'https://t1ger.app');
    const area = url.pathname.replace(/^\/app\/?/, '').split('/')[0];
    return !url.search && !url.hash && /^\/app\/(learn|discover|more|focus|companion)\/?$/.test(url.pathname) && !privateReplayRoutes.has(area);
  } catch { return false; }
}
export function safeAnalyticsUrl(raw: string): string {
  try {
    const url = new URL(raw, 'https://t1ger.app');
    const route = url.pathname.replace(/\/$/, '') || '/';
    const lesson = /^\/app\/lesson\/(learn-(money|ai)-0[1-5]|learn-psychology-v1-0[1-5])$/.test(route);
    const known = /^(\/|\/(privacy|terms)|\/early-access\/success|\/app(\/(learn|discover|apply|master|coach|community|more|profile|focus|library|progress|settings|companion|privacy|terms|mascot))?)$/.test(route);
    return `${url.origin}${known || lesson ? route : '/other'}`;
  } catch { return 'https://t1ger.app/other'; }
}
function synchronizeReplay() {
  if (!client) return;
  if (analyticsChoice().replay && replayUrlSafe && navigator.globalPrivacyControl !== true && !document.querySelector('.auth-layout, .experience-onboard')) client.startSessionRecording();
  else client.stopSessionRecording();
}
export function initializeBehaviorAnalytics() {
  if (!posthogConfigured || !analyticsChoice().events || import.meta.env.DEV || navigator.globalPrivacyControl === true) return Promise.resolve();
  if (client) { client.opt_in_capturing(); synchronizeReplay(); return Promise.resolve(); }
  return loading ||= import('posthog-js').then(({ default: posthog }) => {
    // Consent may have been withdrawn while the lazy SDK was loading.
    if (!analyticsChoice().events) return;
    const apiHost = import.meta.env.VITE_POSTHOG_HOST === 'https://eu.i.posthog.com' ? 'https://eu.i.posthog.com' : 'https://us.i.posthog.com';
    posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
      api_host: apiHost, autocapture: false, capture_pageview: false, capture_pageleave: false,
      person_profiles: 'never', disable_session_recording: true, enable_recording_console_log: false,
      capture_exceptions: false, capture_performance: false, advanced_disable_feature_flags: true,
      session_recording: { maskAllInputs: true, maskTextSelector: '*', blockSelector: '.ph-no-capture, .auth-layout, .experience-onboard, .coach-page, .profile-page, .learning-export, .gold-shell', recordHeaders: false, recordBody: false, captureJsonLd: false, captureCanvas: { recordCanvas: false }, maskCapturedNetworkRequestFn: () => null },
      before_send: event => {
        if (!event || !analyticsChoice().events || navigator.globalPrivacyControl === true) return null;
        for (const key of Object.keys(event.properties)) {
          if (/url|referrer/i.test(key) && typeof event.properties[key] === 'string') event.properties[key] = safeAnalyticsUrl(event.properties[key]);
          if (/^\$(initial_)?utm_/.test(key)) delete event.properties[key];
        }
        return event;
      },
      loaded: instance => { client = instance; synchronizeReplay(); },
    });
  }).catch(() => { /* Analytics must never block learning. */ }).finally(() => { loading = undefined; });
}
export function setAnalyticsChoice(choice: AnalyticsChoice) {
  const safe = { events: choice.events, replay: choice.events && choice.replay };
  try { localStorage.setItem(choiceKey, JSON.stringify(safe)); } catch { return false; }
  if (!safe.events) { client?.stopSessionRecording(); client?.opt_out_capturing(); client?.reset(); }
  else void initializeBehaviorAnalytics().then(() => { lastPage = ''; behaviorPage(window.location.href); });
  window.dispatchEvent(new Event('t1ger-analytics-choice'));
  return true;
}
const allowedEvents = new Set(['auth_viewed', 'signup_started', 'signup_completed', 'signin_completed', 'auth_failed', 'onboarding_step_viewed', 'onboarding_step_completed', 'onboarding_completed', 'page_viewed', 'lesson_opened', 'waitlist_completed', 'learning_action_clicked', 'apply_completed', 'review_completed', 'lesson_completed']);
const allowedProperties = new Set(['method', 'step', 'route', 'lesson_id', 'action', 'screen']);
export function behaviorEvent(name: string, properties: Record<string, string | number | boolean> = {}) {
  if (!allowedEvents.has(name) || !analyticsChoice().events) return;
  const safe = Object.fromEntries(Object.entries(properties).filter(([key, value]) => allowedProperties.has(key) && (typeof value !== 'string' || new RegExp('^[a-z0-9_/-]{1,80}$', 'i').test(value))));
  void initializeBehaviorAnalytics().then(() => { if (analyticsChoice().events) client?.capture(name, safe); });
}
export function behaviorPage(raw: string) {
  replayUrlSafe = replayAllowed(raw);
  currentPath = new URL(safeAnalyticsUrl(raw)).pathname;
  // Route changes pause recording before rendering; resume only on permitted screens.
  synchronizeReplay();
  if (lastPage === currentPath) return;
  lastPage = currentPath;
  behaviorEvent('page_viewed', { route: currentPath });
}
export function pauseBehaviorReplay() { replayUrlSafe = false; client?.stopSessionRecording(); }

declare global { interface Navigator { readonly globalPrivacyControl?: boolean } }
