import { expect, test } from 'vitest';
import { animationDuration, animationPose, blendPose, celebrationPose, completionAnimation, CELEBRATION_SECONDS, type MascotAnimation } from './mascotMotion';

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

test('every reaction stays continuous, finite and within the camera framing', () => {
  const animations: MascotAnimation[] = ['idle', 'welcome', 'thinking', 'correct', 'retry', 'saved', 'recall', 'celebrate', 'milestone'];
  for (const animation of animations) {
    const duration = animationDuration(animation);
    expect(animationPose(animation, -1)).toEqual(animationPose(animation, 0));
    expect(animationPose(animation, 99)).toEqual(animationPose(animation, duration));
    let previous = animationPose(animation, 0);
    for (let t = .005; t <= duration; t += .005) {
      const pose = animationPose(animation, t);
      expect(Object.values(pose).every(Number.isFinite)).toBe(true);
      expect(pose.y).toBeGreaterThanOrEqual(-.15);
      expect(pose.y).toBeLessThanOrEqual(.57);
      expect(pose.sx * pose.sy).toBeGreaterThan(.9);
      expect(pose.eyeRight).toBeGreaterThan(0);
      expect(Math.abs(pose.ry - previous.ry)).toBeLessThan(.15);
      expect(Math.abs(pose.y - previous.y)).toBeLessThan(.05);
      previous = pose;
    }
  }
});

test('interrupted reactions blend from the visible pose without jumping', () => {
  const from = animationPose('retry', .3), to = animationPose('correct', .08);
  expect(blendPose(from, to, 0)).toEqual(from);
  expect(blendPose(from, to, 1)).toEqual(to);
  expect(blendPose(from, to, -1)).toEqual(from);
  expect(blendPose(from, to, 2)).toEqual(to);
  const midpoint = blendPose(from, to, .5);
  for (const key of Object.keys(to) as (keyof typeof to)[]) expect(midpoint[key]).toBeCloseTo((from[key] + to[key]) / 2);
  expect(animationPose('saved', .55).eyeRight).toBeLessThan(animationPose('saved', .55).eye);
});

test('revisiting an applied lesson refreshes memory rather than celebrating a new milestone', () => {
  expect(completionAnimation(false, 1)).toBe('celebrate');
  expect(completionAnimation(false, 5)).toBe('milestone');
  expect(completionAnimation(true, 1)).toBe('recall');
  expect(completionAnimation(true, 5)).toBe('recall');
});
