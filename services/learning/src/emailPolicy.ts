export type EmailKind = 'welcome' | 'review' | 'apply' | 'practice' | 'weekly' | 'return' | 'milestone';
export interface EmailPreferences {
  enabled: boolean; reminders: boolean; weekly: boolean; milestones: boolean;
  language: 'en' | 'es'; timeZone: string; hour: number;
}
export function normalizeEmailPreferences(value: any): EmailPreferences {
  if (!value || typeof value !== 'object' || typeof value.enabled !== 'boolean' || !['en','es'].includes(value.language) || !Number.isInteger(value.hour) || value.hour < 8 || value.hour > 20 || typeof value.timeZone !== 'string' || value.timeZone.length > 80) throw new Error('Invalid email preferences.');
  new Intl.DateTimeFormat('en', { timeZone: value.timeZone }).format(new Date());
  return { enabled: value.enabled, reminders: value.reminders === true, weekly: value.weekly === true, milestones: value.milestones === true, language: value.language, timeZone: value.timeZone, hour: value.hour };
}
export function emailLocalTime(now: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone, year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', hourCycle:'h23', weekday:'short' }).formatToParts(now);
  const part = (type: string) => parts.find(item => item.type === type)?.value || '';
  const day = `${part('year')}-${part('month')}-${part('day')}`;
  const date = new Date(day + 'T12:00:00Z'), dayOfWeek = date.getUTCDay() || 7;
  const week = new Date(date.getTime() - (dayOfWeek - 1) * 86400000).toISOString().slice(0,10);
  return { day, week, hour: Number(part('hour')), weekday: part('weekday') };
}
export interface EmailFacts { due: number; pending: boolean; appliedToday: boolean; weeklyApply: number; lastActivity: number; milestone: number; welcomeSent: boolean; returnSent: boolean }
export function chooseEmail(prefs: EmailPreferences, facts: EmailFacts, delivery: any, now: Date): { kind: EmailKind; occasion: string } | null {
  if (!prefs.enabled || delivery?.suppressed) return null;
  const local = emailLocalTime(now, prefs.timeZone);
  if (local.hour < prefs.hour || local.hour >= 21 || local.hour < 8 || delivery?.lastDay === local.day || (delivery?.week === local.week && Number(delivery?.weekCount) >= 3)) return null;
  if (!facts.welcomeSent) return { kind:'welcome', occasion:'v1' };
  const inactiveDays = (now.getTime() - facts.lastActivity) / 86400000;
  if (inactiveDays >= 7) return prefs.reminders && !facts.returnSent ? { kind:'return', occasion:String(Math.floor(facts.lastActivity / 86400000)) } : null;
  if (prefs.reminders && facts.due > 0) return { kind:'review', occasion:local.day };
  if (prefs.weekly && local.weekday === 'Sun' && facts.weeklyApply > 0) return { kind:'weekly', occasion:local.week };
  if (prefs.milestones && facts.milestone > Number(delivery?.lastMilestone || 0)) return { kind:'milestone', occasion:String(facts.milestone) };
  if (!prefs.reminders || facts.appliedToday) return null;
  return { kind: facts.pending ? 'apply' : 'practice', occasion:local.day };
}
const copy = {
  en: {
    welcome: ['Your first useful idea is ready', 'Start with one small idea, try it, and turn it into something you can use.', 'Start learning', 'learn'],
    review: ['Bring a good idea back', 'You have ideas ready to review. Try recalling them before seeing the answer.', 'Start my review', 'master'],
    apply: ['Put that idea to work', 'Your Apply step is waiting. Pick it up and keep something useful to use again.', 'Finish my Apply step', 'apply'],
    practice: ['One idea for today', 'Your next step is ready. When you have a few minutes, turn it into something useful.', 'Continue learning', 'learn'],
    weekly: ['Your week of useful ideas', 'This week you completed {n} Apply steps. Your next step is waiting in T1GER.', 'See my progress', 'progress'],
    return: ['Your next step is still here', 'Return with one idea when it suits you. You do not need to make up for every day you missed.', 'Return to my path', 'learn'],
    milestone: ['A moment worth keeping', 'You have completed {n} Apply steps. Come back to your saved tools when you need them.', 'See my tools', 'library'],
  },
  es: {
    welcome: ['Tu primera idea útil te espera', 'Empieza con una idea pequeña, pruébala y conviértela en algo que puedas usar.', 'Empezar a aprender', 'learn'],
    review: ['Trae de vuelta una buena idea', 'Tienes ideas listas para repasar. Intenta recordarlas antes de ver la respuesta.', 'Hacer mi repaso', 'master'],
    apply: ['Dale un uso a esa idea', 'Tu aplicación está pendiente. Retómala y guarda algo útil para volver a usarlo.', 'Terminar mi aplicación', 'apply'],
    practice: ['Una idea para hoy', 'Tu siguiente paso está listo. Cuando tengas unos minutos, conviértelo en algo útil.', 'Continuar aprendiendo', 'learn'],
    weekly: ['Tu semana de ideas útiles', 'Esta semana completaste {n} aplicaciones. Tu siguiente paso te espera en T1GER.', 'Ver mi progreso', 'progress'],
    return: ['Tu siguiente paso sigue aquí', 'Vuelve con una idea cuando te venga bien. No hace falta recuperar todos los días que pasaron.', 'Retomar mi camino', 'learn'],
    milestone: ['Un momento para recordar', 'Completaste {n} aplicaciones. Vuelve a tus herramientas guardadas cuando las necesites.', 'Ver mis herramientas', 'library'],
  },
};
export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]!));
export function learningEmail(kind: EmailKind, language: 'en'|'es', count: number, unsubscribe: string, operator: string) {
  const [subject, rawBody, cta, route] = copy[language][kind];
  const body = rawBody.replace('{n}', String(count)), href = `https://t1ger.app/app/${route}`;
  const footer = language === 'es' ? 'Recibes estos emails porque los activaste. Darse de baja' : 'You enabled these learning emails. Unsubscribe';
  return { subject, text:`T1GER\n\n${body}\n\n${cta}: ${href}\n\n${footer}: ${unsubscribe}\n${operator}`,
    html:`<!doctype html><html lang="${language}"><body style="margin:0;background:#f6f4f0;color:#24211e;font-family:Arial,sans-serif"><div style="max-width:520px;margin:0 auto;padding:40px 24px"><p style="font-weight:bold;letter-spacing:2px">T1GER</p><h1 style="font-size:28px;line-height:1.2;margin:32px 0 20px">${escapeHtml(subject)}</h1><p style="font-size:17px;line-height:1.65">${escapeHtml(body)}</p><p style="margin:32px 0"><a style="display:inline-block;background:#ff9b39;color:#201409;border-radius:12px;padding:16px 24px;font-weight:bold;text-decoration:none" href="${href}">${escapeHtml(cta)}</a></p><p style="font-size:12px;line-height:1.6;color:#625950"><a href="${escapeHtml(unsubscribe)}" style="color:#625950">${escapeHtml(footer)}</a><br>${escapeHtml(operator)}</p></div></body></html>` };
}
