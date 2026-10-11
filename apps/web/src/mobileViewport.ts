/** Keep the chat composer inside the visible screen, including iOS's visual-only keyboard resize. */
export function mentorViewportLayout({ height, offsetTop, layoutHeight, studioTop, navigationHeight, scale, editing }: {
  height: number; offsetTop: number; layoutHeight: number; studioTop: number; navigationHeight: number; scale: number; editing: boolean;
}) {
  const keyboardOpen = editing && Math.abs(scale - 1) < .05 && layoutHeight - height > 120;
  return { keyboardOpen, height: Math.max(120, height + offsetTop - studioTop - (keyboardOpen ? 0 : navigationHeight + 12)) };
}

export function submitMentorOnEnter({ key, shift, composing, compact, modifier }: {
  key: string; shift: boolean; composing: boolean; compact: boolean; modifier: boolean;
}) {
  return key === 'Enter' && !shift && !composing && (!compact || modifier);
}
