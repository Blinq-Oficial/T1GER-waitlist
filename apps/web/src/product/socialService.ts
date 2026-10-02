// Ported from T1GER APP: same Firestore and callable contracts.
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  startAt,
  endAt,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
  type QuerySnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { auth as webAuth, db as webDb } from '../firebase';
const auth = webAuth!;
const db = webDb!;
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app as webApp } from '../firebase';
const app = webApp!;
import { LeagueService, type LeagueMember, type LeagueTier } from './leagueService';

export type SocialReaction = 'fire' | 'tiger' | 'respect';
export type FriendshipStatus = 'pending' | 'accepted' | 'declined';
export type ChallengeStatus = 'pending' | 'active' | 'completed' | 'declined';
export type ReportReason = 'spam' | 'harassment' | 'inappropriate_content' | 'offensive_language' | 'impersonation' | 'other';

export interface SocialProfile {
  uid: string;
  displayName: string;
  username: string;
  inviteCode: string;
  photoURL?: string;
  niche: string;
  weeklyXP: number;
  verifiedXP: number;
  streak: number;
  missionCompletedToday: boolean;
  tigerStatus: 'thriving' | 'steady' | 'critical';
  lastActiveAt: number;
}

export interface Friendship {
  id: string;
  userId1: string;
  userId2: string;
  requesterId: string;
  addresseeId: string;
  status: FriendshipStatus;
  createdAt: number;
  profile: SocialProfile;
}

export interface SquadActivity {
  id: string;
  circleId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  missionTitle: string;
  missionType: 'learn' | 'apply';
  durationMinutes: number;
  verified: boolean;
  proofURL?: string;
  proofLabel?: string;
  createdAt: number;
  reactionCounts: Record<SocialReaction, number>;
  myReactions: SocialReaction[];
  commentCount: number;
}

export interface SocialComment {
  id: string;
  userId: string;
  userName: string;
  body: string;
  createdAt: number;
}

export interface DirectChallenge {
  id: string;
  senderId: string;
  receiverId: string;
  participantIds: string[];
  senderName: string;
  receiverName: string;
  durationDays: 3 | 7 | 14;
  metric: 'missions' | 'streak';
  stakeCoins: number;
  potCoins: number;
  status: ChallengeStatus;
  startsAt: number;
  endsAt: number;
  senderScore: number;
  receiverScore: number;
  createdAt: number;
}

export interface SocialViewer {
  uid: string;
  displayName: string;
  photoURL?: string;
  niche?: string;
  weeklyXP?: number;
  verifiedXP?: number;
  currentWeekId?: string;
  leagueTier?: string;
  streak?: number;
}

const DEMO_UID_PREFIXES = ['demo-', 'anonymous', 'guest-'];
const LOCAL_STORAGE_KEY = 't1ger_social_preview_v1';
const SOCIAL_DEMO_ENABLED = import.meta.env.DEV && new URLSearchParams(window.location.search).get('preview') === '1';

const DEMO_PROFILES: SocialProfile[] = [
  { uid: 'demo-valeria', displayName: 'Valeria M.', username: 'valeria.builds', inviteCode: 'VALERIA', niche: 'SaaS B2B', weeklyXP: 860, verifiedXP: 4480, streak: 18, missionCompletedToday: true, tigerStatus: 'thriving', lastActiveAt: Date.now() - 8 * 60_000 },
  { uid: 'demo-mateo', displayName: 'Mateo G.', username: 'mateo.growth', inviteCode: 'MATEO7', niche: 'Growth', weeklyXP: 710, verifiedXP: 3320, streak: 12, missionCompletedToday: true, tigerStatus: 'steady', lastActiveAt: Date.now() - 21 * 60_000 },
  { uid: 'demo-sofia', displayName: 'Sofía T.', username: 'sofia.invests', inviteCode: 'SOFIA8', niche: 'Inversión', weeklyXP: 640, verifiedXP: 2890, streak: 9, missionCompletedToday: true, tigerStatus: 'thriving', lastActiveAt: Date.now() - 52 * 60_000 },
  { uid: 'demo-daniela', displayName: 'Daniela V.', username: 'daniela.ops', inviteCode: 'DANIOPS', niche: 'Operaciones', weeklyXP: 430, verifiedXP: 1640, streak: 6, missionCompletedToday: false, tigerStatus: 'critical', lastActiveAt: Date.now() - 9 * 60 * 60_000 },
  { uid: 'demo-lucas', displayName: 'Lucas B.', username: 'lucas.sales', inviteCode: 'LUCASB', niche: 'Ventas B2B', weeklyXP: 315, verifiedXP: 1200, streak: 4, missionCompletedToday: false, tigerStatus: 'critical', lastActiveAt: Date.now() - 13 * 60 * 60_000 },
  { uid: 'demo-camila', displayName: 'Camila H.', username: 'camila.ai', inviteCode: 'CAMILA', niche: 'IA aplicada', weeklyXP: 190, verifiedXP: 910, streak: 2, missionCompletedToday: false, tigerStatus: 'steady', lastActiveAt: Date.now() - 25 * 60 * 60_000 },
];

const DEMO_ACTIVITIES: SquadActivity[] = [
  { id: 'activity-1', circleId: 'demo-circle', userId: 'demo-valeria', userName: 'Valeria M.', missionTitle: 'Construyó su primera tesis de inversión', missionType: 'apply', durationMinutes: 24, verified: true, proofLabel: 'Tesis de NVIDIA · 3 páginas', createdAt: Date.now() - 11 * 60_000, reactionCounts: { fire: 12, tiger: 5, respect: 8 }, myReactions: [], commentCount: 3 },
  { id: 'activity-2', circleId: 'demo-circle', userId: 'demo-mateo', userName: 'Mateo G.', missionTitle: 'Completó: El poder del interés compuesto', missionType: 'learn', durationMinutes: 8, verified: true, proofLabel: 'Quiz verificado · 5/5', createdAt: Date.now() - 47 * 60_000, reactionCounts: { fire: 7, tiger: 4, respect: 6 }, myReactions: [], commentCount: 1 },
  { id: 'activity-3', circleId: 'demo-circle', userId: 'demo-sofia', userName: 'Sofía T.', missionTitle: 'Registró una compra en paper trading', missionType: 'apply', durationMinutes: 16, verified: true, proofLabel: 'Orden simulada · VOO', createdAt: Date.now() - 2.3 * 60 * 60_000, reactionCounts: { fire: 18, tiger: 9, respect: 11 }, myReactions: [], commentCount: 5 },
];

const DEMO_LEAGUE_MEMBERS = [
  ['Mariana R.', 'E-commerce'], ['Andrés C.', 'Fintech'], ['Elena P.', 'Consultoría'], ['Nicolás S.', 'Operaciones'],
  ['Isabela N.', 'Biotech'], ['Gabriel M.', 'Logística'], ['Lucía G.', 'Startups'], ['Tomás R.', 'Finanzas'],
  ['Valentina C.', 'Automatización'], ['Javier O.', 'Copywriting'], ['Martina F.', 'Ofertas'], ['Alejandro K.', 'Equity'],
  ['Sara D.', 'Real Estate'], ['Emilio A.', 'Producto'], ['Paula V.', 'Creator'], ['Bruno L.', 'Ventas'],
  ['Natalia H.', 'Marketing'], ['Samuel T.', 'IA'], ['Amelia B.', 'Wellness'], ['Thiago J.', 'SaaS'],
  ['Renata Q.', 'Research'], ['Felipe Z.', 'Agencia'], ['Mía E.', 'Inversión'],
] as const;

function toMillis(value: unknown, fallback = Date.now()): number {
  if (value && typeof value === 'object' && 'toMillis' in value && typeof (value as { toMillis: () => number }).toMillis === 'function') {
    return (value as { toMillis: () => number }).toMillis();
  }
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return fallback;
}

function cleanUsername(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9._]/g, '')
    .slice(0, 24);
}

function profileFromData(uid: string, data: DocumentData = {}): SocialProfile {
  const displayName = String(data.displayName || data.name || 'Miembro T1GER').slice(0, 100);
  const username = cleanUsername(String(data.username || data.usernameNormalized || displayName.replace(/\s+/g, '.'))) || `t1ger.${uid.slice(0, 6)}`;
  const missionTimestamp = toMillis(data.lastMissionDate, 0);
  const missionDate = missionTimestamp ? new Date(missionTimestamp) : null;
  const today = new Date();
  const missionCompletedToday = Boolean(data.missionCompletedToday) && Boolean(missionDate) && Boolean(missionDate && (
    missionDate.getFullYear() === today.getFullYear()
    && missionDate.getMonth() === today.getMonth()
    && missionDate.getDate() === today.getDate()
  ));
  const streak = Math.max(0, Number(data.streak) || 0);
  const tigerStatus = data.tigerStatus === 'critical' || data.tigerStatus === 'thriving'
    ? data.tigerStatus
    : missionCompletedToday || streak > 5 ? 'thriving' : 'steady';

  return {
    uid,
    displayName,
    username,
    inviteCode: String(data.inviteCode || uid.slice(0, 8)).toUpperCase(),
    photoURL: typeof data.photoURL === 'string' && data.photoURL ? data.photoURL : undefined,
    niche: String(data.niche || 'Construyendo').slice(0, 50),
    weeklyXP: Math.max(0, Number(data.weeklyXP) || 0),
    verifiedXP: Math.max(0, Number(data.verifiedXP) || 0),
    streak,
    missionCompletedToday,
    tigerStatus,
    lastActiveAt: toMillis(data.lastActive, Date.now() - 60 * 60_000),
  };
}

function activityFromData(circleId: string, id: string, data: DocumentData, uid: string): SquadActivity {
  const rawCounts = data.reactionCounts || {};
  const rawMine = Array.isArray(data.reactedBy?.[uid]) ? data.reactedBy[uid] : [];
  return {
    id,
    circleId,
    userId: String(data.userId || ''),
    userName: String(data.userName || data.displayName || 'Miembro T1GER'),
    userAvatar: typeof data.userAvatar === 'string' ? data.userAvatar : undefined,
    missionTitle: String(data.missionTitle || data.title || 'Misión completada'),
    missionType: data.missionType === 'learn' ? 'learn' : 'apply',
    durationMinutes: Math.max(1, Number(data.durationMinutes) || 1),
    verified: data.verified !== false,
    proofURL: typeof data.proofURL === 'string' ? data.proofURL : undefined,
    proofLabel: typeof data.proofLabel === 'string' ? data.proofLabel : undefined,
    createdAt: toMillis(data.createdAt),
    reactionCounts: {
      fire: Math.max(0, Number(rawCounts.fire) || 0),
      tiger: Math.max(0, Number(rawCounts.tiger) || 0),
      respect: Math.max(0, Number(rawCounts.respect) || 0),
    },
    myReactions: rawMine.filter((item: unknown): item is SocialReaction => item === 'fire' || item === 'tiger' || item === 'respect'),
    commentCount: Math.max(0, Number(data.commentCount) || 0),
  };
}

function readLocalState(): { reactions: Record<string, SocialReaction[]>; requests: string[]; nudges: string[]; challenges: DirectChallenge[] } {
  const empty = { reactions: {}, requests: [], nudges: [], challenges: [] };
  if (typeof window === 'undefined') return empty;
  try {
    return { ...empty, ...JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}') };
  } catch {
    return empty;
  }
}

function writeLocalState(state: ReturnType<typeof readLocalState>): void {
  if (typeof window !== 'undefined') localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}

export class SocialService {
  static isCloudEnabled(uid?: string): boolean {
    if (!uid || DEMO_UID_PREFIXES.some(prefix => uid.startsWith(prefix))) return false;
    return auth.currentUser?.uid === uid;
  }

  static haptic(pattern: number | number[] = 12): void {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern);
  }

  static getUsername(displayName: string | undefined, uid: string): string {
    return cleanUsername(displayName || '') || `t1ger.${uid.slice(0, 6)}`;
  }

  static getInviteCode(uid: string): string {
    return uid.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase() || 'T1GER';
  }

  static getInviteLink(uid: string): string {
    return `https://t1ger.app/app/community?invite=${encodeURIComponent(uid)}`;
  }

  static getInviteUid(pathname = typeof window !== 'undefined' ? window.location.pathname : ''): string | null {
    const match = pathname.match(/^\/invite\/([^/?#]+)/i);
    return match ? decodeURIComponent(match[1]) : null;
  }

  static async copyInviteLink(uid: string): Promise<string> {
    const link = this.getInviteLink(uid);
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(link);
    else {
      const input = document.createElement('textarea');
      input.value = link;
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      input.remove();
    }
    return link;
  }

  static async ensurePublicSocialProfile(viewer: SocialViewer): Promise<void> {
    if (!this.isCloudEnabled(viewer.uid)) return;
    await setDoc(doc(db, 'users_public', viewer.uid), {
      uid: viewer.uid,
      displayName: viewer.displayName || 'Miembro T1GER',
      photoURL: viewer.photoURL || '',
      niche: viewer.niche || 'Construyendo',
      username: this.getUsername(viewer.displayName, viewer.uid),
      usernameNormalized: this.getUsername(viewer.displayName, viewer.uid),
      inviteCode: this.getInviteCode(viewer.uid),
      lastActive: serverTimestamp(),
    }, { merge: true });
  }

  static subscribeLeague(viewer: SocialViewer, onData: (members: LeagueMember[]) => void, onError?: (error: Error) => void): Unsubscribe {
    const fallback = () => {
      const currentWeek = LeagueService.getCurrentWeekId();
      const currentTier = LeagueService.normalizeTier(viewer.leagueTier) || LeagueService.getUserTier(viewer.verifiedXP || 0);
      const current: LeagueMember = {
        id: viewer.uid,
        uid: viewer.uid,
        name: viewer.displayName || 'Tú',
        avatar: viewer.photoURL || 'T1',
        niche: viewer.niche || 'Construyendo',
        vXP: viewer.currentWeekId === currentWeek ? Math.max(0, viewer.weeklyXP || 0) : 0,
        streak: Math.max(0, viewer.streak || 0),
        tier: currentTier,
        isCurrentUser: true,
        lastActiveAt: Date.now(),
      };
      const coreMembers: LeagueMember[] = DEMO_PROFILES.map(profile => ({
        id: profile.uid,
        uid: profile.uid,
        name: profile.displayName,
        avatar: profile.photoURL || profile.displayName.slice(0, 2).toUpperCase(),
        niche: profile.niche,
        vXP: profile.weeklyXP,
        streak: profile.streak,
        tier: currentTier,
        isCurrentUser: false,
        lastActiveAt: profile.lastActiveAt,
      }));
      const roomMembers: LeagueMember[] = DEMO_LEAGUE_MEMBERS.map(([name, niche], index) => ({
        id: `league-preview-${index}`,
        uid: `league-preview-${index}`,
        name,
        avatar: name.slice(0, 2).toUpperCase(),
        niche,
        vXP: Math.max(25, 590 - index * 24),
        streak: Math.max(1, 14 - (index % 11)),
        tier: currentTier,
        isCurrentUser: false,
        lastActiveAt: Date.now() - (index + 2) * 31 * 60_000,
      }));
      const blocked = new Set(SocialService.getBlockedUserIds(viewer.uid));
      const seeded: LeagueMember[] = SOCIAL_DEMO_ENABLED ? [...coreMembers, ...roomMembers] : [];
      onData([...seeded, current].filter(m => Boolean(m.isCurrentUser) || !blocked.has(m.uid || m.id)).sort((a, b) => b.vXP - a.vXP));
    };

    if (!this.isCloudEnabled(viewer.uid)) {
      fallback();
      return () => undefined;
    }

    const weekId = LeagueService.getCurrentWeekId();
    const tier = LeagueService.normalizeTier(viewer.leagueTier) || LeagueService.getUserTier(viewer.verifiedXP || 0);
    const cohortId = LeagueService.getCohortId(viewer.uid, tier, weekId);
    const leagueQuery = query(
      collection(db, 'users_public'),
      where('leagueCohortId', '==', cohortId),
      orderBy('weeklyXP', 'desc'),
      limit(50),
    );

    return onSnapshot(leagueQuery, snapshot => {
      const blocked = new Set(SocialService.getBlockedUserIds(viewer.uid));
      const members = snapshot.docs.map(item => {
        const profile = profileFromData(item.id, item.data());
        return {
          id: profile.uid,
          uid: profile.uid,
          name: profile.displayName,
          avatar: profile.photoURL || profile.displayName.slice(0, 2).toUpperCase(),
          niche: profile.niche,
          vXP: profile.weeklyXP,
          streak: profile.streak,
          tier,
          isCurrentUser: profile.uid === viewer.uid,
          lastActiveAt: profile.lastActiveAt,
        } satisfies LeagueMember;
      });

      if (!members.some(member => member.uid === viewer.uid)) {
        members.push({
          id: viewer.uid,
          uid: viewer.uid,
          name: viewer.displayName || 'Tú',
          avatar: viewer.photoURL || 'T1',
          niche: viewer.niche || 'Construyendo',
          vXP: viewer.currentWeekId === weekId ? viewer.weeklyXP || 0 : 0,
          streak: viewer.streak || 0,
          tier,
          isCurrentUser: true,
          lastActiveAt: Date.now(),
        });
      }
      onData(members.filter(m => m.isCurrentUser || !blocked.has(m.uid || m.id)).sort((a, b) => b.vXP - a.vXP));
    }, error => {
      onData([]);
      onError?.(error);
    });
  }

  static subscribeFriends(uid: string, onData: (friends: Friendship[], requests: Friendship[]) => void, onError?: (error: Error) => void): Unsubscribe {
    if (!this.isCloudEnabled(uid)) {
      if (!SOCIAL_DEMO_ENABLED) {
        onData([], []);
        return () => undefined;
      }
      const friends = DEMO_PROFILES.slice(0, 5).map((profile, index) => ({
        id: `friend-${profile.uid}`,
        userId1: uid,
        userId2: profile.uid,
        requesterId: uid,
        addresseeId: profile.uid,
        status: 'accepted' as const,
        createdAt: Date.now() - index * 86_400_000,
        profile,
      }));
      onData(friends, []);
      return () => undefined;
    }

    const snapshots = new Map<string, QuerySnapshot<DocumentData>>();
    let cancelled = false;
    let generation = 0;
    const emit = async () => {
      const currentGeneration = ++generation;
      try {
        const uniqueDocuments = new Map<string, QueryDocumentSnapshot<DocumentData>>();
        snapshots.forEach(snapshot => snapshot.docs.forEach(item => uniqueDocuments.set(item.id, item)));
        const records = await Promise.all([...uniqueDocuments.values()].map(async item => {
          const data = item.data();
          const otherUid = data.userId1 === uid ? data.userId2 : data.userId1;
          const publicProfile = await getDoc(doc(db, 'users_public', otherUid));
          return {
            id: item.id,
            userId1: data.userId1,
            userId2: data.userId2,
            requesterId: data.requesterId || data.userId1,
            addresseeId: data.addresseeId || data.userId2,
            status: data.status,
            createdAt: toMillis(data.createdAt),
            profile: profileFromData(otherUid, publicProfile.data()),
          } as Friendship;
        }));
        if (!cancelled && currentGeneration === generation) {
          onData(records.filter(item => item.status === 'accepted'), records.filter(item => item.status === 'pending' && item.addresseeId === uid));
        }
      } catch (error) {
        onError?.(error as Error);
      }
    };
    const queries = [
      query(collection(db, 'friendships'), where('userIds', 'array-contains', uid), limit(100)),
      query(collection(db, 'friendships'), where('userId1', '==', uid), limit(100)),
      query(collection(db, 'friendships'), where('userId2', '==', uid), limit(100)),
    ];
    const unsubscribers = queries.map((friendshipsQuery, index) => onSnapshot(friendshipsQuery, snapshot => {
      snapshots.set(String(index), snapshot);
      void emit();
    }, error => onError?.(error)));
    return () => {
      cancelled = true;
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }

  static subscribeActivityFeed(uid: string, onData: (activities: SquadActivity[]) => void, onError?: (error: Error) => void): Unsubscribe {
    if (!this.isCloudEnabled(uid)) {
      const local = readLocalState();
      onData(SOCIAL_DEMO_ENABLED ? DEMO_ACTIVITIES.map(activity => ({ ...activity, myReactions: local.reactions[activity.id] || [] })) : []);
      return () => undefined;
    }

    const activityMap = new Map<string, SquadActivity>();
    const activityUnsubscribers = new Map<string, Unsubscribe>();
    const emit = () => {
      const blocked = new Set(SocialService.getBlockedUserIds(uid));
      onData([...activityMap.values()].filter(a => !blocked.has(a.userId)).sort((a, b) => b.createdAt - a.createdAt).slice(0, 50));
    };
    const circlesQuery = query(collection(db, 'circles'), where('members', 'array-contains', uid), limit(10));
    const unsubscribeCircles = onSnapshot(circlesQuery, snapshot => {
      const activeCircleIds = new Set(snapshot.docs.map(item => item.id));
      activityUnsubscribers.forEach((unsubscribe, circleId) => {
        if (!activeCircleIds.has(circleId)) {
          unsubscribe();
          activityUnsubscribers.delete(circleId);
          [...activityMap.keys()].filter(key => key.startsWith(`${circleId}:`)).forEach(key => activityMap.delete(key));
        }
      });

      snapshot.docs.forEach(circle => {
        if (activityUnsubscribers.has(circle.id)) return;
        const feedQuery = query(collection(db, 'circles', circle.id, 'activities'), orderBy('createdAt', 'desc'), limit(30));
        const unsubscribe = onSnapshot(feedQuery, activitySnapshot => {
          [...activityMap.keys()].filter(key => key.startsWith(`${circle.id}:`)).forEach(key => activityMap.delete(key));
          activitySnapshot.docs.forEach(item => activityMap.set(`${circle.id}:${item.id}`, activityFromData(circle.id, item.id, item.data(), uid)));
          emit();
        }, error => onError?.(error));
        activityUnsubscribers.set(circle.id, unsubscribe);
      });
      emit();
    }, error => onError?.(error));

    return () => {
      unsubscribeCircles();
      activityUnsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }

  static async searchProfiles(term: string, uid: string): Promise<SocialProfile[]> {
    const normalized = cleanUsername(term.trim().replace(/^@/, ''));
    const inviteCode = term.trim().toUpperCase();
    if (!normalized && !inviteCode) return [];
    if (!this.isCloudEnabled(uid)) {
      if (!SOCIAL_DEMO_ENABLED) return [];
      return DEMO_PROFILES.filter(profile => profile.uid !== uid && (
        profile.username.includes(normalized) || profile.displayName.toLowerCase().includes(term.toLowerCase()) || profile.inviteCode === inviteCode
      )).slice(0, 10);
    }

    const results = new Map<string, SocialProfile>();
    const codeQuery = query(collection(db, 'users_public'), where('inviteCode', '==', inviteCode), limit(5));
    const usernameQuery = query(collection(db, 'users_public'), orderBy('usernameNormalized'), startAt(normalized), endAt(`${normalized}\uf8ff`), limit(10));
    const [codeSnapshot, usernameSnapshot] = await Promise.all([getDocs(codeQuery), getDocs(usernameQuery)]);
    const addResults = (snapshot: QuerySnapshot<DocumentData>) => snapshot.docs.forEach(item => {
      if (item.id !== uid) results.set(item.id, profileFromData(item.id, item.data()));
    });
    addResults(codeSnapshot);
    addResults(usernameSnapshot);
    return [...results.values()].slice(0, 10);
  }

  static async getProfile(targetUid: string): Promise<SocialProfile | null> {
    const demo = SOCIAL_DEMO_ENABLED ? DEMO_PROFILES.find(profile => profile.uid === targetUid) : undefined;
    if (demo) return demo;
    if (!auth.currentUser) return null;
    const snapshot = await getDoc(doc(db, 'users_public', targetUid));
    return snapshot.exists() ? profileFromData(snapshot.id, snapshot.data()) : null;
  }

  static async sendFriendRequest(uid: string, targetUid: string): Promise<void> {
    if (uid === targetUid) throw new Error('No puedes agregarte a ti mismo.');
    if (!this.isCloudEnabled(uid)) {
      if (!SOCIAL_DEMO_ENABLED) throw new Error('Inicia sesión para agregar amigos.');
      const state = readLocalState();
      if (!state.requests.includes(targetUid)) state.requests.push(targetUid);
      writeLocalState(state);
      return;
    }
    const users = [uid, targetUid].sort();
    const existing = await getDoc(doc(db,'friendships',users.join('_')));
    if(existing.exists()) { if(existing.data().status==='accepted') return; if(existing.data().status==='pending') throw new Error('A request between you is already pending.'); throw new Error('This request was declined. Use a new invitation after agreeing to reconnect.'); }
    await setDoc(doc(db, 'friendships', users.join('_')), {
      userIds: users,
      userId1: uid,
      userId2: targetUid,
      requesterId: uid,
      addresseeId: targetUid,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  static async declineFriendRequest(friendshipId: string, uid: string): Promise<void> {
    if (!this.isCloudEnabled(uid)) return;
    await updateDoc(doc(db, 'friendships', friendshipId), { status:'declined', updatedAt:serverTimestamp() });
  }
  static subscribeBlocked(uid:string,onData:(ids:string[])=>void,onError?:(error:Error)=>void):Unsubscribe {
    if(!this.isCloudEnabled(uid))return()=>undefined;
    return onSnapshot(collection(db,'users',uid,'blockedUsers'),snapshot=>{
      const ids=snapshot.docs.map(item=>item.id);
      try { localStorage.setItem('t1ger_blocked_users_'+uid,JSON.stringify(ids)); } catch { /* Cloud subscription still works. */ }
      onData(ids);
    },error=>onError?.(error));
  }
  static async acceptFriendRequest(friendshipId: string, uid: string): Promise<void> {
    if (!this.isCloudEnabled(uid)) return;
    const friendshipRef = doc(db, 'friendships', friendshipId);
    const friendshipSnapshot = await getDoc(friendshipRef);
    if (!friendshipSnapshot.exists()) throw new Error('La solicitud ya no existe.');
    const data = friendshipSnapshot.data();
    const addresseeId = data.addresseeId || data.userId2;
    if (addresseeId !== uid) throw new Error('Solo el destinatario puede aceptar esta solicitud.');
    await updateDoc(friendshipRef, { status: 'accepted', acceptedAt: serverTimestamp(), updatedAt: serverTimestamp() });
    await setDoc(doc(db, 'circles', `friendship_${friendshipId}`), {
      name: 'Accountability Squad',
      members: [data.userId1, data.userId2],
      ownerId: data.requesterId,
      friendshipId,
      weeklyScore: 0,
      inviteCode: friendshipId.slice(0, 12).toUpperCase(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }

  static async publishMissionActivity(viewer: SocialViewer, mission: {
    id: string;
    title: string;
    type: 'learn' | 'apply';
    durationMinutes: number;
    verified: boolean;
    proofLabel?: string;
    proofURL?: string;
  }): Promise<void> {
    if (!this.isCloudEnabled(viewer.uid)) return;
    const circlesSnapshot = await getDocs(query(collection(db, 'circles'), where('members', 'array-contains', viewer.uid), limit(10)));
    await Promise.all(circlesSnapshot.docs.map(circle => setDoc(
      doc(db, 'circles', circle.id, 'activities', `${viewer.uid}_${mission.id}_${LeagueService.getCurrentWeekId()}`),
      {
        userId: viewer.uid,
        userName: viewer.displayName || 'Miembro T1GER',
        userAvatar: viewer.photoURL || '',
        missionId: mission.id,
        missionTitle: mission.title.slice(0, 160),
        missionType: mission.type,
        durationMinutes: Math.max(1, Math.round(mission.durationMinutes)),
        verified: mission.verified,
        proofLabel: mission.proofLabel || '',
        proofURL: mission.proofURL || '',
        reactionCounts: { fire: 0, tiger: 0, respect: 0 },
        reactedBy: {},
        commentCount: 0,
        createdAt: serverTimestamp(),
      },
      { merge: false },
    )));
    await setDoc(doc(db, 'users_public', viewer.uid), {
      lastActive: serverTimestamp(),
    }, { merge: true });
  }

  static async reactToActivity(activity: SquadActivity, uid: string, type: SocialReaction, add: boolean): Promise<void> {
    if (!this.isCloudEnabled(uid)) {
      if (!SOCIAL_DEMO_ENABLED) throw new Error('Inicia sesión para reaccionar.');
      const state = readLocalState();
      const reactions = new Set(state.reactions[activity.id] || []);
      add ? reactions.add(type) : reactions.delete(type);
      state.reactions[activity.id] = [...reactions];
      writeLocalState(state);
      return;
    }

    await httpsCallable(getFunctions(app, 'us-central1'), 'interactWithSquadActivity')({
      circleId: activity.circleId, activityId: activity.id, action: 'reaction', type, add,
    });
  }

  static async addComment(activity: SquadActivity, uid: string, userName: string, body: string): Promise<void> {
    const cleanBody = body.trim().slice(0, 280);
    if (!cleanBody) return;
    if (!this.isCloudEnabled(uid)) return;
    await httpsCallable(getFunctions(app, 'us-central1'), 'interactWithSquadActivity')({
      circleId: activity.circleId, activityId: activity.id, action: 'comment', body: cleanBody,
    });
  }

  static subscribeComments(activity: SquadActivity, onData: (comments: SocialComment[]) => void, onError?: (error: Error) => void): Unsubscribe {
    if (!this.isCloudEnabled(auth.currentUser?.uid)) {
      onData([]);
      return () => undefined;
    }
    const commentsQuery = query(collection(db, 'circles', activity.circleId, 'activities', activity.id, 'comments'), orderBy('createdAt', 'asc'), limit(50));
    return onSnapshot(commentsQuery, snapshot => onData(snapshot.docs.map(item => ({
      id: item.id,
      userId: String(item.data().userId || ''),
      userName: String(item.data().userName || 'Miembro'),
      body: String(item.data().body || ''),
      createdAt: toMillis(item.data().createdAt),
    }))), error => onError?.(error));
  }

  static async createChallenge(viewer: SocialViewer, opponent: SocialProfile, durationDays: 3 | 7 | 14, stakeCoins: number, metric: 'missions' | 'streak' = 'missions'): Promise<DirectChallenge> {
    const now = Date.now();
    const challenge: DirectChallenge = {
      id: `local-${now}`,
      senderId: viewer.uid,
      receiverId: opponent.uid,
      participantIds: [viewer.uid, opponent.uid],
      senderName: viewer.displayName || 'Miembro T1GER',
      receiverName: opponent.displayName,
      durationDays,
      metric,
      stakeCoins,
      potCoins: stakeCoins * 2,
      status: 'pending',
      startsAt: now,
      endsAt: now + durationDays * 86_400_000,
      senderScore: 0,
      receiverScore: 0,
      createdAt: now,
    };

    if (!this.isCloudEnabled(viewer.uid)) {
      if (!SOCIAL_DEMO_ENABLED) throw new Error('Inicia sesión para crear retos oficiales.');
      const state = readLocalState();
      state.challenges.unshift(challenge);
      writeLocalState(state);
      return challenge;
    }

    const { id: _localId, createdAt: _localCreatedAt, startsAt: _localStartsAt, endsAt: _localEndsAt, ...persistedChallenge } = challenge;
    const reference = await addDoc(collection(db, 'challenges'), {
      ...persistedChallenge,
      createdAt: serverTimestamp(),
      startsAt: null,
      endsAt: null,
    });
    return { ...challenge, id: reference.id };
  }

  static subscribeChallenges(uid: string, onData: (challenges: DirectChallenge[]) => void, onError?: (error: Error) => void): Unsubscribe {
    if (!this.isCloudEnabled(uid)) {
      onData(SOCIAL_DEMO_ENABLED ? readLocalState().challenges : []);
      return () => undefined;
    }
    const challengeQuery = query(collection(db, 'challenges'), where('participantIds', 'array-contains', uid), orderBy('createdAt', 'desc'), limit(30));
    return onSnapshot(challengeQuery, snapshot => {
      const blocked = new Set(SocialService.getBlockedUserIds(uid));
      const challenges = snapshot.docs.map(item => {
        const data = item.data();
        return {
          id: item.id,
          senderId: data.senderId,
          receiverId: data.receiverId,
          participantIds: data.participantIds || [data.senderId, data.receiverId],
          senderName: data.senderName || 'T1GER',
          receiverName: data.receiverName || 'T1GER',
          durationDays: data.durationDays || 7,
          metric: data.metric === 'streak' ? 'streak' : 'missions',
          stakeCoins: Math.max(0, Number(data.stakeCoins) || 0),
          potCoins: Math.max(0, Number(data.potCoins) || 0),
          status: data.status || 'pending',
          startsAt: toMillis(data.startsAt, 0),
          endsAt: toMillis(data.endsAt, 0),
          senderScore: Math.max(0, Number(data.senderScore) || 0),
          receiverScore: Math.max(0, Number(data.receiverScore) || 0),
          createdAt: toMillis(data.createdAt),
        } as DirectChallenge;
      }).filter(c => !blocked.has(c.senderId));
      onData(challenges);
    }, error => onError?.(error));
  }

  static async acceptChallenge(challengeId: string, uid: string): Promise<void> {
    if (!this.isCloudEnabled(uid)) return;
    const accept = httpsCallable<{ challengeId: string }, { status: string }>(getFunctions(app, 'us-central1'), 'acceptDirectChallenge');
    await accept({ challengeId });
  }

  static async declineChallenge(challengeId: string, uid: string): Promise<void> {
    if (!this.isCloudEnabled(uid)) return;
    await updateDoc(doc(db, 'challenges', challengeId), { status: 'declined', updatedAt: serverTimestamp() });
  }

  static async sendNudge(viewer: SocialViewer, friend: SocialProfile): Promise<void> {
    if (!this.isCloudEnabled(viewer.uid)) {
      if (!SOCIAL_DEMO_ENABLED) throw new Error('Inicia sesión para enviar un nudge.');
      const state = readLocalState();
      if (!state.nudges.includes(friend.uid)) state.nudges.push(friend.uid);
      writeLocalState(state);
      return;
    }
    await httpsCallable(getFunctions(app, 'us-central1'), 'queueSquadNudge')({ receiverId: friend.uid });
  }

  static async reportUser(reporterId: string, reportedUserId: string, reason: ReportReason, details = ''): Promise<void> {
    if (!reporterId || !reportedUserId || reporterId === reportedUserId) return;
    if (this.isCloudEnabled(reporterId)) {
      await addDoc(collection(db, 'reports'), {
        reporterId,
        reportedUserId,
        reason,
        details: details.slice(0, 500),
        createdAt: serverTimestamp(),
      });
    }
  }

  static async blockUser(currentUserId:string,blockedUserId:string):Promise<void> {
    if(!currentUserId||!blockedUserId||currentUserId===blockedUserId)return;
    if(this.isCloudEnabled(currentUserId))await setDoc(doc(db,'users',currentUserId,'blockedUsers',blockedUserId),{blockedUid:blockedUserId,createdAt:serverTimestamp()});
    const ids=this.getBlockedUserIds(currentUserId);if(!ids.includes(blockedUserId))ids.push(blockedUserId);
    try { localStorage.setItem('t1ger_blocked_users_'+currentUserId,JSON.stringify(ids)); } catch { /* The cloud record remains authoritative. */ }
  }
  static async unblockUser(currentUserId:string,blockedUserId:string):Promise<void> {
    if(!currentUserId||!blockedUserId)return;
    if(this.isCloudEnabled(currentUserId))await deleteDoc(doc(db,'users',currentUserId,'blockedUsers',blockedUserId));
    try {localStorage.setItem('t1ger_blocked_users_'+currentUserId,JSON.stringify(this.getBlockedUserIds(currentUserId).filter(id=>id!==blockedUserId)));}catch { /* The cloud record remains authoritative. */ }
  }
  static getBlockedUserIds(currentUserId: string): string[] {
    if (typeof window === 'undefined' || !currentUserId) return [];
    try {
      return JSON.parse(localStorage.getItem(`t1ger_blocked_users_${currentUserId}`) || '[]') as string[];
    } catch {
      return [];
    }
  }
}
