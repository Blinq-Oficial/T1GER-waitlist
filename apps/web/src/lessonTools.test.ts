import { describe, expect, it } from 'vitest';
import { getInteractiveTrack } from './product/interactiveCurriculum';
import { buildTool } from './lessonTools';
describe('existing curriculum tools on Web', () => {
  it('requires authored Psychology fields and preserves their labels and values', () => {
    const widget = getInteractiveTrack('mindset-stoic').lessons[0].phases[2].widget;
    expect(buildTool(widget, {}).ready).toBe(false);
    const values = { situation: 'I think this app will help', evidence: 'It does not reduce my planning time', decision: 'Measure one week before deciding' };
    const result = buildTool(widget, values);
    expect(result.ready).toBe(true);
    expect(result.summary).toContain('Current belief: I think this app will help');
    expect(result.summary).toContain('Measure one week');
    expect(result.summary).not.toContain('Within my control');
  });
  it('models fee drag with equal capital and fixed assumptions, including reversed fees', () => {
    const widget = getInteractiveTrack('smart-money').lessons[2].phases[2].widget;
    const a = buildTool(widget, { balance: 5000, lowFee: .03, highFee: .75 });
    const b = buildTool(widget, { balance: 5000, lowFee: .75, highFee: .03 });
    expect(a.headline).toEqual(b.headline);
    expect(a.detail).toContain('8%');
    expect(a.detail).toContain('not a forecast');
  });
  it('keeps a zero contribution budget valid and does not pretend to execute a broker order', () => {
    const widget = getInteractiveTrack('smart-money').lessons[3].phases[2].widget;
    expect(buildTool(widget, { monthly: 0, payday: '1' }).headline).toBe('$0');
    expect(buildTool(widget, { monthly: 200, payday: '15' }).summary).toContain('Middle of month');
    expect(buildTool(widget, { monthly: 200, payday: '15' }).detail).toContain('does not place an order');
  });
  it('has a usable tool and answer contract for all 15 launch lessons', () => {
    const lessons = ['smart-money','ai-automation','mindset-stoic'].flatMap(id => getInteractiveTrack(id as 'smart-money').lessons);
    expect(lessons).toHaveLength(15);
    for (const lesson of lessons) {
      const challenge = lesson.phases[1].challenge;
      if (challenge.kind === 'matching') expect(challenge.pairs?.length).toBeGreaterThan(0);
      else if (challenge.kind === 'ordering') expect(new Set(challenge.orderedIds)).toEqual(new Set(challenge.options?.map(item => item.id)));
      else expect(challenge.options?.filter(item => item.correct)).toHaveLength(1);
      expect(lesson.learningDesign.retrievalAnswer.en.length).toBeGreaterThan(10);
    }
  });
});
