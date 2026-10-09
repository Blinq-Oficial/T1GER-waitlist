import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import LessonOpening, { LessonReading } from './LessonOpening';
import { MentorThinking } from './Coach';
import { getInteractiveLesson } from './product/interactiveCurriculum';

vi.mock('./firebase', () => ({ db: null, functions: null }));

it('introduces the purpose of all three starting lessons without a blank answer requirement', () => {
  for (const id of ['learn-money-01', 'learn-ai-01', 'learn-psychology-v1-01']) {
    const lesson = getInteractiveLesson(id)!;
    const html = renderToStaticMarkup(<LessonOpening lesson={lesson} onContinue={() => {}}/>);
    expect(html).toContain('No prior knowledge needed');
    expect(html).toContain('Let’s begin');
    expect(html).not.toContain('<textarea');
    const reading = renderToStaticMarkup(<LessonReading lesson={lesson}/>);
    expect(reading).toContain('Read the source');
    expect(reading).toContain('A thought to carry with you');
  }
});

it('keeps an accessible pending status for slow mentor replies', () => {
  const pending = renderToStaticMarkup(<MentorThinking/>);
  const slow = renderToStaticMarkup(<MentorThinking slow/>);
  expect(pending).toContain('role="status"');
  expect(pending).toContain('Thinking…');
  expect(slow).toContain('Still working on your reply…');
  expect(slow).not.toContain('Searching');
});
