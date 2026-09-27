import { getDevScreenTimeMinutes } from '../dev/devHarnessState';

export interface AppUsage {
  packageName: string;
  appName: string;
  minutes: number;
  iconEmoji: string;
  percentage: number;
}

export type ScreenTimeDataSource = 'native' | 'simulated' | 'manual' | 'unconfigured';

export interface ScreenTimeReport {
  isNativeAndroid: boolean;
  hasPermission: boolean;
  dataSource: ScreenTimeDataSource;
  totalMinutes: number;
  totalHours: number;
  awakeLifePercent: number;
  daysLostPerYear: number;
  annualHoursLost: number;
  hourlyWage: number;
  estimatedLossUSD: number;
  annualOpportunityUSD: number;
  monthlyOpportunityUSD: number;
  booksEquivalentYear: number;
  compound10YearsUSD: number;
  apps: AppUsage[];
  lastUpdated: number;
}

type AndroidScreenTimeBridge = {
  hasUsagePermission: () => boolean;
  requestUsagePermission: () => void;
  getDailySocialUsage: () => string;
};

declare global {
  interface Window {
    AndroidScreenTime?: AndroidScreenTimeBridge;
  }
}

const AWAKE_MINUTES_PER_DAY = 16 * 60;
const DEFAULT_HOURLY_WAGE = 10;
const MANUAL_APPS_KEY = 't1ger_manual_social_usage_v2';
const HOURLY_WAGE_KEY = 't1ger_hourly_wage';
const LEGACY_HOURS_KEY = 't1ger_screen_time_hours';

export const TRACKED_SOCIAL_APPS: ReadonlyArray<Omit<AppUsage, 'minutes' | 'percentage'>> = [
  { packageName: 'com.zhiliaoapp.musically', appName: 'TikTok', iconEmoji: '♪' },
  { packageName: 'com.instagram.android', appName: 'Instagram', iconEmoji: '◎' },
  { packageName: 'com.google.android.youtube', appName: 'YouTube', iconEmoji: '▶' },
  { packageName: 'com.twitter.android', appName: 'X', iconEmoji: '𝕏' },
  { packageName: 'com.facebook.katana', appName: 'Facebook', iconEmoji: 'f' },
  { packageName: 'com.reddit.frontpage', appName: 'Reddit', iconEmoji: '●' },
];

const LEGACY_DISTRIBUTION = [0.35, 0.25, 0.2, 0.08, 0.07, 0.05];

const createSimulatedApps = (totalMinutes: number): AppUsage[] => {
  let assignedMinutes = 0;
  return normalizeApps(TRACKED_SOCIAL_APPS.map((app, index) => {
    const minutes = index === TRACKED_SOCIAL_APPS.length - 1
      ? totalMinutes - assignedMinutes
      : Math.round(totalMinutes * LEGACY_DISTRIBUTION[index]);
    assignedMinutes += minutes;
    return { ...app, minutes };
  }));
};

const clampNumber = (value: unknown, min: number, max: number): number => {
  const numeric = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numeric)) return min;
  return Math.min(max, Math.max(min, numeric));
};

const round = (value: number, digits: number = 0): number => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

export function calculateOpportunityCost(totalMinutes: number, hourlyWage: number = DEFAULT_HOURLY_WAGE) {
  const safeMinutes = clampNumber(totalMinutes, 0, 24 * 60);
  const safeWage = clampNumber(hourlyWage, 1, 1000);
  const totalHours = safeMinutes / 60;
  const annualHoursLost = totalHours * 365;
  const dailyOpportunityUSD = totalHours * safeWage;
  const annualOpportunityUSD = dailyOpportunityUSD * 365;
  const monthlyOpportunityUSD = annualOpportunityUSD / 12;
  const monthlyRate = 0.08 / 12;
  const months = 10 * 12;
  const compound10YearsUSD = monthlyOpportunityUSD
    * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

  return {
    totalMinutes: Math.round(safeMinutes),
    totalHours: round(totalHours, 1),
    awakeLifePercent: round((safeMinutes / AWAKE_MINUTES_PER_DAY) * 100, 1),
    daysLostPerYear: round((safeMinutes * 365) / (24 * 60), 1),
    annualHoursLost: Math.round(annualHoursLost),
    hourlyWage: round(safeWage, 2),
    estimatedLossUSD: Math.round(dailyOpportunityUSD),
    annualOpportunityUSD: Math.round(annualOpportunityUSD),
    monthlyOpportunityUSD: Math.round(monthlyOpportunityUSD),
    booksEquivalentYear: Math.round(annualHoursLost / 4),
    compound10YearsUSD: Math.round(compound10YearsUSD),
  };
}

function normalizeApps(apps: Array<Partial<AppUsage>>): AppUsage[] {
  const normalized = TRACKED_SOCIAL_APPS.map((definition) => {
    const match = apps.find((app) =>
      app.packageName === definition.packageName
      || app.appName?.toLowerCase().startsWith(definition.appName.toLowerCase())
    );
    return {
      ...definition,
      minutes: Math.round(clampNumber(match?.minutes, 0, 24 * 60)),
      percentage: 0,
    };
  });
  const total = normalized.reduce((sum, app) => sum + app.minutes, 0);
  return normalized
    .map((app) => ({
      ...app,
      percentage: total > 0 ? Math.round((app.minutes / total) * 100) : 0,
    }))
    .sort((a, b) => b.minutes - a.minutes);
}

export class AndroidScreenTimeService {
  public static getHourlyWage(): number {
    if (typeof window === 'undefined') return DEFAULT_HOURLY_WAGE;
    return clampNumber(localStorage.getItem(HOURLY_WAGE_KEY) || DEFAULT_HOURLY_WAGE, 1, 1000);
  }

  public static saveHourlyWage(hourlyWage: number): number {
    const safeWage = clampNumber(hourlyWage, 1, 1000);
    if (typeof window !== 'undefined') localStorage.setItem(HOURLY_WAGE_KEY, String(safeWage));
    return safeWage;
  }

  public static isAndroidNative(): boolean {
    return typeof window !== 'undefined' && Boolean(window.AndroidScreenTime);
  }

  public static checkPermission(): boolean {
    if (!this.isAndroidNative()) return false;
    try {
      return Boolean(window.AndroidScreenTime?.hasUsagePermission());
    } catch {
      return false;
    }
  }

  public static requestPermission(): boolean {
    if (!this.isAndroidNative()) return false;
    try {
      window.AndroidScreenTime?.requestUsagePermission();
      return true;
    } catch {
      return false;
    }
  }

  public static getManualApps(): AppUsage[] {
    if (typeof window === 'undefined') return normalizeApps([]);

    try {
      const saved = localStorage.getItem(MANUAL_APPS_KEY);
      if (saved) return normalizeApps(JSON.parse(saved));
    } catch {
      localStorage.removeItem(MANUAL_APPS_KEY);
    }

    const legacyHours = clampNumber(localStorage.getItem(LEGACY_HOURS_KEY) || 0, 0, 24);
    const legacyMinutes = Math.round(legacyHours * 60);
    if (legacyMinutes > 0) {
      return normalizeApps(TRACKED_SOCIAL_APPS.map((app, index) => ({
        ...app,
        minutes: Math.round(legacyMinutes * LEGACY_DISTRIBUTION[index]),
      })));
    }

    return normalizeApps([]);
  }

  public static saveManualUsage(apps: Array<Pick<AppUsage, 'packageName' | 'appName' | 'minutes' | 'iconEmoji'>>, hourlyWage: number): ScreenTimeReport {
    const normalized = normalizeApps(apps);
    const safeWage = clampNumber(hourlyWage, 1, 1000);
    if (typeof window !== 'undefined') {
      localStorage.setItem(MANUAL_APPS_KEY, JSON.stringify(normalized.map(({ percentage, ...app }) => app)));
      localStorage.setItem(HOURLY_WAGE_KEY, String(safeWage));
      localStorage.setItem(LEGACY_HOURS_KEY, String(round(normalized.reduce((sum, app) => sum + app.minutes, 0) / 60, 2)));
    }
    return this.createReport(normalized, safeWage, 'manual', this.isAndroidNative(), this.checkPermission());
  }

  public static previewManualUsage(apps: Array<Partial<AppUsage>>, hourlyWage: number): ScreenTimeReport {
    return this.createReport(normalizeApps(apps), hourlyWage, 'manual', this.isAndroidNative(), this.checkPermission());
  }

  private static createReport(
    apps: AppUsage[],
    hourlyWage: number,
    dataSource: ScreenTimeDataSource,
    isNativeAndroid: boolean,
    hasPermission: boolean,
  ): ScreenTimeReport {
    const totalMinutes = apps.reduce((sum, app) => sum + app.minutes, 0);
    return {
      isNativeAndroid,
      hasPermission,
      dataSource,
      ...calculateOpportunityCost(totalMinutes, hourlyWage),
      apps,
      lastUpdated: Date.now(),
    };
  }

  public static getReport(): ScreenTimeReport {
    const hourlyWage = this.getHourlyWage();
    const isNativeAndroid = this.isAndroidNative();
    const hasPermission = this.checkPermission();
    const simulatedMinutes = getDevScreenTimeMinutes(isNativeAndroid);

    if (simulatedMinutes !== null) {
      return this.createReport(
        createSimulatedApps(simulatedMinutes),
        hourlyWage,
        'simulated',
        isNativeAndroid,
        hasPermission,
      );
    }

    if (isNativeAndroid && hasPermission) {
      try {
        const parsed = JSON.parse(window.AndroidScreenTime?.getDailySocialUsage() || '{}');
        const apps = normalizeApps(Array.isArray(parsed.apps) ? parsed.apps : []);
        return this.createReport(apps, hourlyWage, 'native', true, true);
      } catch (error) {
        console.warn('[ScreenTime] Native usage report unavailable; using manual fallback.', error);
      }
    }

    const manualApps = this.getManualApps();
    const hasManualData = manualApps.some((app) => app.minutes > 0);
    return this.createReport(
      manualApps,
      hourlyWage,
      hasManualData ? 'manual' : 'unconfigured',
      isNativeAndroid,
      hasPermission,
    );
  }

  public static async generateAINotificationScript(
    report: ScreenTimeReport,
    language: 'es' | 'en' = 'es'
  ): Promise<{ title: string; body: string; ctaText: string }> {
    const isEs = language === 'es';
    const topApp = report.apps.find((app) => app.minutes > 0)?.appName || (isEs ? 'redes sociales' : 'social feeds');
    const defaultScript = {
      title: isEs
        ? `T1GER perdió ${Math.round(report.totalHours * 10) / 10} h contigo hoy`
        : `T1GER lost ${Math.round(report.totalHours * 10) / 10} h with you today`,
      body: isEs
        ? `${topApp} consumió ${report.awakeLifePercent}% de tu día consciente. Una lección rescata tus vitales y protege tu racha.`
        : `${topApp} consumed ${report.awakeLifePercent}% of your waking day. One lesson rescues your vitals and protects your streak.`,
      ctaText: isEs ? 'Salvar a T1GER' : 'Save T1GER',
    };

    const clientAiEnabled = import.meta.env.DEV && import.meta.env.VITE_ENABLE_CLIENT_AI === 'true';
    const openRouterKey = clientAiEnabled ? import.meta.env.VITE_OPENROUTER_API_KEY : '';
    if (!openRouterKey?.trim()) return defaultScript;

    try {
      const prompt = isEs
        ? `Genera una alerta breve de T1GER: ${report.totalHours} horas perdidas en ${topApp}, ${report.awakeLifePercent}% del día consciente. Devuelve JSON con title, body y ctaText.`
        : `Generate a brief T1GER alert: ${report.totalHours} hours lost to ${topApp}, ${report.awakeLifePercent}% of the waking day. Return JSON with title, body and ctaText.`;
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openRouterKey.trim()}`,
          'HTTP-Referer': 'https://t1ger.app',
          'X-Title': 'T1GER Notification Engine',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 150,
        }),
      });
      if (!response.ok) return defaultScript;
      const data = await response.json();
      const match = String(data.choices?.[0]?.message?.content || '').match(/\{[\s\S]*\}/);
      if (!match) return defaultScript;
      const parsed = JSON.parse(match[0]);
      return parsed.title && parsed.body
        ? { title: parsed.title, body: parsed.body, ctaText: parsed.ctaText || defaultScript.ctaText }
        : defaultScript;
    } catch {
      return defaultScript;
    }
  }
}
