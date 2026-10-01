import { expect, test } from 'vitest';
import { celebrationPose, CELEBRATION_SECONDS } from './mascotMotion';

test('celebration anticipates, lifts, lands and settles without discontinuities', () => {
  expect(celebrationPose(.52).y).toBeLessThan(0);
  expect(celebrationPose(1.16).y).toBeGreaterThan(.5);
  expect(celebrationPose(1.58).sy).toBeLessThan(.9);
  expect(celebrationPose(CELEBRATION_SECONDS)).toEqual(celebrationPose(99));
  expect(celebrationPose(-1)).toEqual(celebrationPose(0));
  let previous = celebrationPose(0);
  for (let t = .001; t <= CELEBRATION_SECONDS; t += .001) {
    const pose = celebrationPose(t);
    expect(Object.values(pose).every(Number.isFinite)).toBe(true);
    expect(Math.abs(pose.ry - previous.ry)).toBeLessThan(.03);
    expect(Math.abs(pose.y - previous.y)).toBeLessThan(.01);
    expect(pose.sx * pose.sy).toBeGreaterThan(.9);
    previous = pose;
  }
  expect(celebrationPose(CELEBRATION_SECONDS).y).toBe(0);
  expect(celebrationPose(CELEBRATION_SECONDS).sy).toBe(1);
});
