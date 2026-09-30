// Firebase browser SDK identifiers are public; authorization is enforced by Auth and Security Rules.
// This fallback runs only on the canonical production host. Preview deployments require their own env.
export const productionFirebaseConfig = {
  "apiKey": "AIzaSyA5otjKee-NDSHRuQwPfgP7sDfbqOXFYFc",
  "authDomain": "t1ger-69d6a.firebaseapp.com",
  "projectId": "t1ger-69d6a",
  "appId": "1:263001013008:web:11d151e0e5abfeef614395",
  "messagingSenderId": "263001013008",
  "storageBucket": "t1ger-69d6a.firebasestorage.app"
};

export function selectFirebaseConfig(env: Partial<typeof productionFirebaseConfig>, hostname: string) {
  if (Object.values(env).some(Boolean)) return env;
  return hostname === 't1ger.app' ? productionFirebaseConfig : {};
}
