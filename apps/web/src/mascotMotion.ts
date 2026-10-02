export const CELEBRATION_SECONDS = 3.2;
// One authored shot: anticipate, launch, turn, land, settle. Times are seconds.
const celebrationKeys = [
  [0, 0, 1, 1, 0, 0, 0, 1, 0],
  [.25, -.02, 1.02, .98, -.05, -.12, -.03, .9, -.04],
  [.52, -.14, 1.12, .85, .12, -.3, -.12, .6, -.1],
  [.68, .1, .9, 1.15, -.12, -.16, .1, 1.15, .14],
  [.92, .48, .97, 1.03, -.12, 1.5, .12, .82, .17],
  [1.16, .56, 1, 1, -.05, 3.7, -.08, .82, .17],
  [1.42, .24, .93, 1.08, .06, 5.9, -.06, .82, .17],
  [1.58, -.12, 1.15, .84, .1, Math.PI * 2, .04, .46, .2],
  [1.79, .13, .94, 1.07, -.05, Math.PI * 2 + .07, -.04, .74, .17],
  [2.02, -.035, 1.025, .975, .02, Math.PI * 2 - .025, .015, .72, .13],
  [2.28, .035, .99, 1.01, -.01, Math.PI * 2 + .01, -.012, .9, .08],
  [2.65, 0, 1, 1, 0, Math.PI * 2, 0, 1, 0],
  [CELEBRATION_SECONDS, 0, 1, 1, 0, Math.PI * 2, 0, 1, 0],
];

export type MascotAnimation = 'idle' | 'welcome' | 'thinking' | 'correct' | 'retry' | 'saved' | 'recall' | 'celebrate' | 'milestone';
export const completionAnimation = (alreadyApplied: boolean, lessonOrder: number): MascotAnimation => alreadyApplied ? 'recall' : lessonOrder === 5 ? 'milestone' : 'celebrate';
const neutral = [0, 0, 1, 1, 0, 0, 0, 1, 0];
const clips: Record<MascotAnimation, number[][]> = {
  idle: [neutral, [.5, 0, 1, 1, 0, 0, 0, 1, 0]],
  welcome: [neutral, [.3, .035, 1, 1, -.02, -.12, .075, 1, .1], [.7, .06, .97, 1.04, -.05, .14, -.055, .8, .15], [1.1, .015, 1, 1, 0, -.04, .02, .9, .08], [1.6, 0, 1, 1, 0, 0, 0, 1, 0]],
  thinking: [neutral, [.4, -.015, 1, 1, -.045, -.12, .085, .9, .16], [.9, -.015, 1, 1, -.045, -.12, .085, .9, .16]],
  correct: [neutral, [.2, -.045, 1.035, .965, .1, 0, -.02, .7, .12], [.4, .1, .96, 1.04, -.08, .07, .025, .76, .18], [.65, -.015, 1.015, .985, .04, 0, 0, .9, .06], [.95, 0, 1, 1, 0, 0, 0, 1, 0]],
  retry: [neutral, [.22, -.025, 1, .98, .04, -.13, -.03, .78, -.1], [.43, -.025, 1, .98, .04, .13, .025, .78, -.1], [.62, -.01, 1, 1, .01, -.07, -.015, .9, -.04], [1.1, 0, 1, 1, 0, 0, 0, 1, .04]],
  saved: [neutral, [.3, .025, 1, 1, -.03, -.1, .055, .85, .13], [.55, .06, 1.015, 1.015, -.045, -.04, .035, 1, .17, .12], [.8, .04, 1, 1, -.02, .05, -.02, .85, .1], [1.4, 0, 1, 1, 0, 0, 0, 1, 0]],
  recall: [neutral, [.23, -.025, 1.025, .975, .12, 0, 0, .8, .1], [.5, .075, .97, 1.04, -.1, 0, -.03, .72, .16], [.8, .015, 1, 1, 0, .08, .02, .9, .07], [1.25, 0, 1, 1, 0, 0, 0, 1, 0]],
  celebrate: celebrationKeys,
  milestone: [...celebrationKeys.slice(0, -2), [2.65, .04, 1.04, 1.04, -.04, Math.PI * 2, -.04, .72, .18], [3.05, -.035, 1.04, .96, .05, Math.PI * 2, .03, .85, .12], [3.4, .05, .98, 1.03, -.04, Math.PI * 2, -.02, .85, .08], [3.8, 0, 1, 1, 0, Math.PI * 2, 0, 1, 0]],
};
export const animationDuration = (animation: MascotAnimation) => clips[animation].at(-1)![0];
export function animationPose(animation: MascotAnimation, seconds: number) {
  const keys = clips[animation];
  const time = Math.max(0, Math.min(animationDuration(animation), seconds));
  const index = keys.findIndex((key, i) => i > 0 && key[0] >= time);
  const a = keys[Math.max(0, index - 1)], b = keys[index < 0 ? keys.length - 1 : index];
  const progress = b[0] === a[0] ? 0 : (time - a[0]) / (b[0] - a[0]);
  const eased = progress * progress * (3 - 2 * progress);
  const value = (column: number) => a[column] + (b[column] - a[column]) * eased;
  const rightEyeA = a[9] ?? a[7], rightEyeB = b[9] ?? b[7];
  return { y: value(1), sx: value(2), sy: value(3), rx: value(4), ry: value(5), rz: value(6), eye: value(7), eyeRight: rightEyeA + (rightEyeB - rightEyeA) * eased, brow: value(8) };
}
export const celebrationPose = (seconds: number) => animationPose('celebrate', seconds);

export function blendPose(from: ReturnType<typeof animationPose>, to: ReturnType<typeof animationPose>, progress: number) {
  const t = Math.max(0, Math.min(1, progress));
  if (t === 0) return from;
  if (t === 1) return to;
  return Object.fromEntries(Object.keys(to).map(key => { const property = key as keyof typeof to; return [key, from[property] + (to[property] - from[property]) * t]; })) as typeof to;
}
