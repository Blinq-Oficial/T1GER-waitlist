import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { RetrievalInteraction } from '../LearningInteractions';
import { addLearningEvent, assessRetrieval, boundedRecallScore, canAdvanceStep, coherentRule, goldRewardTitle, newGoldDraft, retrievalEvidence, retrievalVariants, structuredRule, validPrediction } from './learningEngine';

const variant = retrievalVariants[0];
function ratings(result: string, mechanism: string, reflection = '') {
  const response = assessRetrieval(variant, result, mechanism, reflection);
  const html = renderToStaticMarkup(<RetrievalInteraction variant={variant} initialResponse={response} onRate={() => {}} busy={false}/>);
  return { response, html, events: retrievalEvidence('stable-review', variant, response, 100, 1) };
}
describe('Gold V2.1 objective integrity', () => {
  it('right number plus wrong mechanism cannot produce Good/Easy or a mastery reward', () => {
    const { response, html, events } = ratings('242', 'rate', 'The rate increases every year.');
    expect(response.resultCorrect).toBe(true);
    expect(response.mechanismCorrect).toBe(false);
    expect(html).toMatch(/disabled=""[^>]*><strong>Good/);
    expect(html).toMatch(/disabled=""[^>]*><strong>Easy/);
    expect(events.at(-1)?.rating).toBe(40);
    expect(goldRewardTitle).toBe('You practiced.');
  });
  it('wrong number plus correct-sounding prose still requires Again', () => {
    const { response, events, html } = ratings('240', 'balance', 'Growth uses the new balance, including earlier growth.');
    expect(response.resultCorrect).toBe(false);
    expect(response.mechanismCorrect).toBe(true);
    expect(events.at(-1)?.rating).toBe(40);
    expect(html).toMatch(/disabled=""[^>]*><strong>Hard/);
  });
  it('both correct objective parts allow all canonical FSRS ratings', () => {
    const { html, response, events } = ratings('242', 'balance');
    for (const label of ['Again','Hard','Good','Easy']) expect(html).not.toMatch(new RegExp('disabled=""[^>]*><strong>' + label));
    for (const score of [40,60,80,100]) expect(boundedRecallScore(score, response.resultCorrect && response.mechanismCorrect)).toBe(score);
    expect(events.map(event => event.name)).toEqual(['retrieval_calculation','retrieval_mechanism','difficulty_rating','retrieval_result']);
    expect(retrievalEvidence('stable-review', variant, response, 100, 2).map(event => event.id)).toEqual(events.map(event => event.id));
  });
  it('random slider movements cannot replace prediction and interpretation', () => {
    let draft = { ...newGoldDraft(), step: 4 };
    for (const monthly of [500,25,500,100,255]) draft = { ...draft, inputs: { ...draft.inputs, startAge: 30, finishAge: 50, monthly } };
    expect(canAdvanceStep(draft)).toBe(false);
    draft = addLearningEvent(draft,{name:'manipulation_prediction',interactionId:'manipulate',answer:'decrease',assessment:'self_reported'});
    expect(canAdvanceStep(draft)).toBe(false);
    draft = addLearningEvent(draft,{name:'manipulation_interpretation',interactionId:'manipulate',answer:'rate',correct:false,assessment:'objective'});
    expect(canAdvanceStep(draft)).toBe(false);
    draft = addLearningEvent(draft,{name:'manipulation_interpretation',interactionId:'manipulate',answer:'contributions',correct:true,assessment:'objective'});
    expect(canAdvanceStep(draft)).toBe(true);
    expect(draft.events.filter(event => event.name === 'manipulation_interpretation').map(event => event.correct)).toEqual([false,true]);
  });
  it('structured Apply cannot encode earlier always wins or ignore contribution trade-offs', () => {
    const inputs = newGoldDraft().inputs;
    expect(coherentRule({...inputs,ruleContribution:'increase',ruleBoundary:'always',rule:'Earlier always wins.'})).toBe(false);
    expect(coherentRule({...inputs,ruleContribution:'decrease',ruleBoundary:'compare'})).toBe(false);
    expect(coherentRule({...inputs,ruleContribution:'increase',ruleBoundary:'compare',rule:''})).toBe(true);
    expect(structuredRule).toContain('does not automatically beat every');
  });
  it('initial uncertainty is valid without invented prose', () => {
    const draft = newGoldDraft();
    draft.inputs = {...draft.inputs,prediction:'unsure',predictionBasis:'unsure'};
    expect(validPrediction(draft.inputs)).toBe(true);
    expect(canAdvanceStep(addLearningEvent(draft,{name:'prediction_answer',interactionId:'prediction',answer:'unsure'}))).toBe(true);
    expect(validPrediction({...draft.inputs,predictionBasis:'filler'})).toBe(false);
  });
  it('keeps the first misconception and latest correction during repeated attempts', () => {
    let draft = newGoldDraft();
    draft = addLearningEvent(draft,{name:'manipulation_interpretation',interactionId:'manipulate',answer:'rate',correct:false});
    const firstId = draft.events.at(-1)!.id;
    for (let i=0;i<150;i++) draft = addLearningEvent(draft,{name:'manipulation_interpretation',interactionId:'manipulate',answer:'contributions',correct:true});
    expect(draft.events).toHaveLength(100);
    expect(draft.events.find(event => event.id === firstId)?.correct).toBe(false);
    expect(draft.events.at(-1)?.correct).toBe(true);
    expect(draft.events[0].name).toBe('first_exposure');
  });
});
