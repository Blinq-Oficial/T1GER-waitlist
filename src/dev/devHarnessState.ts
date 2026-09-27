import { useSyncExternalStore } from 'react';

export type DevScreenTimePreset = 'auto' | 'focused' | 'neglected';
export type DevStreakPreset = 'real' | 'active' | 'at_risk';
export type DevEntitlementPreset = 'real' | 'free' | 'pro';

export interface DevHarnessState {
  screenTime: DevScreenTimePreset;
  streak: DevStreakPreset;
  entitlement: DevEntitlementPreset;
}

const STORAGE_KEY = 't1ger_dev_harness_v1';
const CHANGE_EVENT = 't1ger_dev_harness_changed';
const IS_DEV_BUILD = Boolean(import.meta.env?.DEV);

const DEFAULT_STATE: DevHarnessState = {
  screenTime: 'auto',
  streak: 'real',
  entitlement: 'real',
};

const isState = (value: unknown): value is Partial<DevHarnessState> => Boolean(value && typeof value === 'object');

const readStoredState = (): DevHarnessState => {
  if (!IS_DEV_BUILD || typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
    if (!isState(parsed)) return DEFAULT_STATE;
    return {
      screenTime: ['auto', 'focused', 'neglected'].includes(String(parsed.screenTime))
        ? parsed.screenTime as DevScreenTimePreset
        : DEFAULT_STATE.screenTime,
      streak: ['real', 'active', 'at_risk'].includes(String(parsed.streak))
        ? parsed.streak as DevStreakPreset
        : DEFAULT_STATE.streak,
      entitlement: ['real', 'free', 'pro'].includes(String(parsed.entitlement))
        ? parsed.entitlement as DevEntitlementPreset
        : DEFAULT_STATE.entitlement,
    };
  } catch {
    return DEFAULT_STATE;
  }
};

let currentState = readStoredState();

export const isDevHarnessEnabled = (): boolean => {
  if (!IS_DEV_BUILD || typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('devHarness') === '1';
};

export const getDevHarnessState = (): DevHarnessState => currentState;

export const setDevHarnessState = (patch: Partial<DevHarnessState>): DevHarnessState => {
  if (!isDevHarnessEnabled()) return currentState;
  currentState = { ...currentState, ...patch };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: currentState }));
  return currentState;
};

export const resetDevHarnessState = (): DevHarnessState => {
  if (!isDevHarnessEnabled()) return currentState;
  currentState = DEFAULT_STATE;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: currentState }));
  return currentState;
};

const subscribe = (listener: () => void): (() => void) => {
  if (!IS_DEV_BUILD || typeof window === 'undefined') return () => undefined;
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    currentState = readStoredState();
    listener();
  };
  window.addEventListener(CHANGE_EVENT, listener);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener('storage', onStorage);
  };
};

export const useDevHarnessState = (): DevHarnessState => useSyncExternalStore(
  subscribe,
  getDevHarnessState,
  () => DEFAULT_STATE,
);

/**
 * Returns a deterministic Screen Time override for development. Browser runs
 * default to a healthy 30-minute day; native runs use real UsageStats unless a
 * developer explicitly selects a preset.
 */
export const getDevScreenTimeMinutes = (isNativeAndroid: boolean): number | null => {
  if (!isDevHarnessEnabled()) return null;
  if (currentState.screenTime === 'focused') return 30;
  if (currentState.screenTime === 'neglected') return 5 * 60;
  return isNativeAndroid ? null : 30;
};
