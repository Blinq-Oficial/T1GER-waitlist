import { expect, test } from 'vitest';
import { mentorViewportLayout, submitMentorOnEnter } from './mobileViewport';

test('chat fits above the keyboard without mistaking pinch zoom for keyboard input', () => {
  const screen = { height: 844, offsetTop: 0, layoutHeight: 844, studioTop: 64, navigationHeight: 72, scale: 1, editing: false };
  expect(mentorViewportLayout(screen)).toEqual({ keyboardOpen: false, height: 696 });
  expect(mentorViewportLayout({ ...screen, editing: true, height: 460 })).toEqual({ keyboardOpen: true, height: 396 });
  expect(mentorViewportLayout({ ...screen, editing: true, height: 460, offsetTop: 30, studioTop: 94 }).height).toBe(396);
  expect(mentorViewportLayout({ ...screen, editing: true, height: 460, scale: 2 }).keyboardOpen).toBe(false);
  expect(mentorViewportLayout({ ...screen, height: 140 }).height).toBe(120);
});

test('mobile Enter writes a new line; explicit send shortcuts work without interrupting composition', () => {
  const key = { key: 'Enter', shift: false, composing: false, compact: true, modifier: false };
  expect(submitMentorOnEnter(key)).toBe(false);
  expect(submitMentorOnEnter({ ...key, modifier: true })).toBe(true);
  expect(submitMentorOnEnter({ ...key, compact: false })).toBe(true);
  expect(submitMentorOnEnter({ ...key, shift: true, compact: false })).toBe(false);
  expect(submitMentorOnEnter({ ...key, composing: true, modifier: true })).toBe(false);
});
