import { describe, expect, it } from 'vitest';
import { productionFirebaseConfig, selectFirebaseConfig } from './firebasePublicConfig';

describe('Firebase deployment boundary', () => {
  it('uses the pinned browser SDK config only on the production domain', () => {
    expect(selectFirebaseConfig({}, 't1ger.app')).toEqual(productionFirebaseConfig);
    for (const host of ['localhost', '127.0.0.1', 't1-ger-waitlist-preview.vercel.app', 'example.com']) {
      expect(selectFirebaseConfig({}, host)).toEqual({});
    }
  });
  it('preserves explicit isolated environment configuration without filling missing values from production', () => {
    const isolated = { projectId: 'demo-t1ger-web', apiKey: 'emulator-only' };
    expect(selectFirebaseConfig(isolated, 't1ger.app')).toBe(isolated);
    expect(selectFirebaseConfig(isolated, 'preview.vercel.app')).toBe(isolated);
  });
  it('uses the same-origin OAuth helper only for the canonical production project', () => {
    const oldEnvironment = { ...productionFirebaseConfig, authDomain: 't1ger-69d6a.firebaseapp.com' };
    expect(selectFirebaseConfig(oldEnvironment, 't1ger.app').authDomain).toBe('t1ger.app');
    expect(selectFirebaseConfig(oldEnvironment, 'preview.vercel.app')).toBe(oldEnvironment);
  });
});
