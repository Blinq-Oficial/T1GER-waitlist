import { doc, runTransaction, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { brainOf, type Profile } from './state';
import { DEFAULT_PET_STATE } from './product/petEngine';

function owner(uid: string) {
  if (!db || auth?.currentUser?.uid !== uid) throw new Error('Sign in again to save.');
  return db;
}
export async function savePreferences(uid: string, values: Pick<Profile, 'displayName' | 'dailyTime' | 'notificationPreferences' | 'weeklyReportOptIn'>) {
  if (!values.displayName?.trim() || values.displayName.trim().length > 60 || ![5, 10, 15, 20].includes(values.dailyTime || 0)) throw new Error('Check your name and daily pace.');
  await setDoc(doc(owner(uid), 'users', uid), { ...values, displayName: values.displayName.trim() }, { merge: true });
}
export async function saveReflection(uid: string, id: string, text: string) {
  const clean = text.trim();
  if (clean.length < 10 || clean.length > 2000) throw new Error('Use 10–2000 characters.');
  await setDoc(doc(owner(uid), 'users', uid, 'dailyQuestions', id), { type: 'web-reflection', reflection: clean, timestamp: Date.now() });
}
export async function saveFocus(uid: string, id: string, minutes: number) {
  if (!Number.isFinite(minutes) || minutes < 1 || minutes > 50) throw new Error('Invalid focus duration.');
  const cloud = owner(uid), record = doc(cloud, 'users', uid, 'dailyQuestions', id), user = doc(cloud, 'users', uid);
  await runTransaction(cloud, async transaction => {
    const [saved, account] = await Promise.all([transaction.get(record), transaction.get(user)]);
    if (saved.exists()) return;
    if (!account.exists()) throw new Error('Account unavailable.');
    const brain = brainOf(account.data() as Profile);
    const clock = new Date();
    const date = `${clock.getFullYear()}-${String(clock.getMonth()+1).padStart(2,'0')}-${String(clock.getDate()).padStart(2,'0')}`;
    const pet = brain.petState || DEFAULT_PET_STATE;
    const total = pet.metricsDate === date ? pet.totalFocusMinutesToday || 0 : 0;
    const normalized = pet.metricsDate === date ? pet : { ...pet, todayXPEarned:0, todayBuildActionsCompleted:0, totalFocusMinutesToday:0, timesPettedToday:0 };
    const next = { ...brain, petState: { ...normalized, metricsDate: date, totalFocusMinutesToday: total + minutes, lastFocusTimestamp: Date.now() } };
    transaction.update(user, { brainState: JSON.parse(JSON.stringify(next)) });
    transaction.set(record, { type: 'web-focus', minutes, timestamp: Date.now() });
  });
}
