export const CELEBRATION_SECONDS = 3.2;
// One authored shot: anticipate, launch, turn, land, settle. Times are seconds.
const keys = [
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

export function celebrationPose(seconds: number) {
  const time = Math.max(0, Math.min(CELEBRATION_SECONDS, seconds));
  const index = keys.findIndex((key, i) => i > 0 && key[0] >= time);
  const a = keys[Math.max(0, index - 1)], b = keys[index < 0 ? keys.length - 1 : index];
  const progress = b[0] === a[0] ? 0 : (time - a[0]) / (b[0] - a[0]);
  const eased = progress * progress * (3 - 2 * progress);
  const value = (column: number) => a[column] + (b[column] - a[column]) * eased;
  return { y: value(1), sx: value(2), sy: value(3), rx: value(4), ry: value(5), rz: value(6), eye: value(7), brow: value(8) };
}
