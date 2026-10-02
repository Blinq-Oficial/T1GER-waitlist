export type LeagueTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'obsidian';

export interface LeagueTierConfig {
  id: LeagueTier;
  nameEs: string;
  nameEn: string;
  shortName: string;
  minXP: number;
  color: string;
  glow: string;
  rewards: {
    first: { coins: number; xp: number };
    promotion: { coins: number; xp: number };
  };
}

export const LEAGUE_TIERS: Record<LeagueTier, LeagueTierConfig> = {
  bronze: { id: 'bronze', nameEs: 'Liga Bronce', nameEn: 'Bronze League', shortName: 'BR', minXP: 0, color: '#CD7F32', glow: 'rgba(205,127,50,.28)', rewards: { first: { coins: 120, xp: 200 }, promotion: { coins: 40, xp: 80 } } },
  silver: { id: 'silver', nameEs: 'Liga Plata', nameEn: 'Silver League', shortName: 'SL', minXP: 250, color: '#D4D4D8', glow: 'rgba(212,212,216,.24)', rewards: { first: { coins: 180, xp: 300 }, promotion: { coins: 60, xp: 110 } } },
  gold: { id: 'gold', nameEs: 'Liga Oro', nameEn: 'Gold League', shortName: 'GD', minXP: 600, color: '#F59E0B', glow: 'rgba(245,158,11,.30)', rewards: { first: { coins: 260, xp: 420 }, promotion: { coins: 90, xp: 150 } } },
  platinum: { id: 'platinum', nameEs: 'Liga Platino', nameEn: 'Platinum League', shortName: 'PT', minXP: 1200, color: '#67E8F9', glow: 'rgba(103,232,249,.26)', rewards: { first: { coins: 380, xp: 600 }, promotion: { coins: 130, xp: 210 } } },
  diamond: { id: 'diamond', nameEs: 'Liga Diamante', nameEn: 'Diamond League', shortName: 'DM', minXP: 2500, color: '#A78BFA', glow: 'rgba(167,139,250,.30)', rewards: { first: { coins: 560, xp: 850 }, promotion: { coins: 190, xp: 300 } } },
  obsidian: { id: 'obsidian', nameEs: 'Liga Obsidiana', nameEn: 'Obsidian League', shortName: 'OB', minXP: 5000, color: '#FF7300', glow: 'rgba(255,115,0,.36)', rewards: { first: { coins: 1000, xp: 1200 }, promotion: { coins: 300, xp: 450 } } },
};

export interface LeagueMember {
  id: string;
  uid?: string;
  name: string;
  avatar: string;
  niche: string;
  vXP: number;
  streak: number;
  tier: LeagueTier;
  isCurrentUser?: boolean;
  lastActiveAt?: number;
}

export interface LeagueTimeRemaining {
  totalSeconds: number;
  days: number;
  hours: number;
  minutes: number;
  formatted: string;
}

const ORDERED_TIERS: LeagueTier[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'obsidian'];

export class LeagueService {
  static getCurrentWeekId(date = new Date()): string {
    const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const day = utcDate.getUTCDay() || 7;
    utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((utcDate.getTime() - yearStart.getTime()) / 86_400_000) + 1) / 7);
    return `${utcDate.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
  }

  static getTimeRemaining(now = new Date()): LeagueTimeRemaining {
    const utcDay = now.getUTCDay();
    const daysUntilMonday = utcDay === 0 ? 1 : 8 - utcDay;
    const cutoff = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + daysUntilMonday, 0, 0, 0, 0));
    const totalSeconds = Math.max(0, Math.floor((cutoff.getTime() - now.getTime()) / 1000));
    const days = Math.floor(totalSeconds / 86_400);
    const hours = Math.floor((totalSeconds % 86_400) / 3_600);
    const minutes = Math.floor((totalSeconds % 3_600) / 60);
    return { totalSeconds, days, hours, minutes, formatted: days > 0 ? `${days}d ${hours}h` : `${hours}h ${minutes}m` };
  }

  static normalizeTier(value?: string): LeagueTier | null {
    if (value === 'amber') return 'platinum';
    return ORDERED_TIERS.includes(value as LeagueTier) ? value as LeagueTier : null;
  }

  static getUserTier(totalVerifiedXP: number): LeagueTier {
    if (totalVerifiedXP >= LEAGUE_TIERS.obsidian.minXP) return 'obsidian';
    if (totalVerifiedXP >= LEAGUE_TIERS.diamond.minXP) return 'diamond';
    if (totalVerifiedXP >= LEAGUE_TIERS.platinum.minXP) return 'platinum';
    if (totalVerifiedXP >= LEAGUE_TIERS.gold.minXP) return 'gold';
    if (totalVerifiedXP >= LEAGUE_TIERS.silver.minXP) return 'silver';
    return 'bronze';
  }

  static getNextTier(tier: LeagueTier): LeagueTier | null {
    const index = ORDERED_TIERS.indexOf(tier);
    return index >= 0 && index < ORDERED_TIERS.length - 1 ? ORDERED_TIERS[index + 1] : null;
  }

  static getPreviousTier(tier: LeagueTier): LeagueTier | null {
    const index = ORDERED_TIERS.indexOf(tier);
    return index > 0 ? ORDERED_TIERS[index - 1] : null;
  }

  static getCohortId(uid: string, tier: LeagueTier, weekId = this.getCurrentWeekId()): string {
    let hash = 2166136261;
    for (let index = 0; index < uid.length; index += 1) {
      hash ^= uid.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    const room = Math.abs(hash) % 8;
    return `${weekId}-${tier}-${room}`;
  }

  static getZones(memberCount: number, tier?: LeagueTier): { promotionEnd: number; demotionStart: number } {
    const promotionEnd = memberCount <= 10 ? Math.min(3, memberCount) : Math.min(5, memberCount);
    // Bronze league has no demotion (it is the foundation tier)
    if (tier === 'bronze') {
      return { promotionEnd, demotionStart: memberCount + 1 };
    }
    const demotionStart = memberCount <= 10
      ? Math.max(promotionEnd + 1, memberCount - 1)
      : Math.max(promotionEnd + 1, Math.min(26, memberCount - 4));
    return { promotionEnd, demotionStart };
  }
}
