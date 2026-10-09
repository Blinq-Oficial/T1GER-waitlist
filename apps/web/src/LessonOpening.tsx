import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, Clock3, Lightbulb, Target } from 'lucide-react';
import type { AtomicLesson } from './product/interactiveCurriculumTypes';
import DomainArtwork from './DomainArtwork';
import { TigerPortrait } from './Visual';
import './lessonOpening.css';

const beginnings = {
  'learn-psychology-v1-01': {
    purpose: 'Make a choice with the whole picture.',
    why: 'Ever liked something so much that you ignored its flaws? This lesson helps you notice that pull before a purchase or decision.',
    title: 'The headphones you already want',
    scene: 'You love a pair of headphones. Five reviews praise the sound. Two say the battery does not last a full commute.',
    clue: 'When we want something to be true, we may pay more attention to the evidence that agrees. That habit is called confirmation bias.',
    question: 'What would give you a fuller picture?',
    options: [
      { label: 'Read only the reviews praising the sound.', correct: false, feedback: 'That feels reassuring, but leaves the battery concern unexplored. Read both sides and check whether the concern matters for your commute.' },
      { label: 'Read both sides and check the battery claim.', correct: true, feedback: 'Exactly. You can still buy them. You are checking a concern that could change your choice, rather than only collecting praise.' },
    ],
    reading: { title: 'Novum Organum', author: 'Francis Bacon', location: 'Book I, aphorism XLVI · 1620', excerpt: 'The human understanding, when any proposition has been once laid down […] forces everything else to add fresh support and confirmation', note: 'Short excerpt; omitted words marked with […].', url: 'https://www.gutenberg.org/files/45988/old/45988-h/45988-h.htm', explanation: 'In everyday language: once we settle on an opinion, we may recruit evidence to defend it. This historical observation is paired with the modern research in Sources & context.', reflection: 'Which review would you be tempted to dismiss—and what would help you check it?' },
  },
  'learn-money-01': {
    purpose: 'See what your money can actually buy.',
    why: 'A balance can stay the same while prices change. Learn to spot the difference, while keeping the purpose of emergency savings in view.',
    title: 'The same wallet. A different price.',
    scene: 'You have $10. A snack costs $2, so you can buy five. Later, the price is $2.50 and your wallet still holds $10.',
    clue: 'Your balance is the number of dollars. Your buying power is what those dollars can buy. In this example, it falls from five snacks to four.',
    question: 'What changed in this example?',
    options: [
      { label: 'My $10 buys fewer snacks.', correct: true, feedback: 'Yes—same dollars, less buying power. This is an illustration of rising prices, not a forecast or a reason to empty an emergency fund.' },
      { label: 'Money disappeared from my wallet.', correct: false, feedback: 'The wallet still holds $10. The price changed, so the same dollars buy four snacks instead of five.' },
    ],
    reading: { title: 'The Psychology of Money', author: 'Morgan Housel', location: 'Publisher’s introduction', excerpt: 'Doing well with money isn’t necessarily about what you know.', note: 'Short excerpt from the publisher’s description.', url: 'https://harriman.house/books/the-psychology-of-money/', explanation: 'T1GER connection: knowing the numbers is a start. Give money a purpose, too. Accessible emergency savings and money for distant goals serve different jobs.', reflection: 'When would access to cash matter more to you than long-term growth?' },
  },
  'learn-ai-01': {
    purpose: 'Help AI understand what you need.',
    why: 'A vague request leaves the model guessing. A little context can make a draft more useful and easier for you to check.',
    title: 'Ask for the draft you actually need',
    scene: 'You need a short email asking a teammate to move a meeting. Compare “Write an email” with “Write a friendly, three-sentence email asking to move our Tuesday meeting to Thursday.”',
    clue: 'The second request gives a goal, context and a format. It cannot guarantee a correct reply, but it tells the model what a useful draft should look like.',
    question: 'Which request gives the model more useful guidance?',
    options: [
      { label: '“Write an email.”', correct: false, feedback: 'The model must guess the purpose and length. Adding the situation and the format gives it clearer instructions.' },
      { label: 'The request with the meeting details and three-sentence limit.', correct: true, feedback: 'Yes. You made the goal and format clear. You still review the draft before sending it.' },
    ],
    reading: { title: 'Prompt engineering', author: 'OpenAI', location: 'Official guide · T1GER summary', excerpt: null, note: 'Original summary, not a quotation.', url: 'https://developers.openai.com/api/docs/guides/prompt-engineering', explanation: 'Give the model instructions, relevant context and the format you want. Examples can clarify the expected result. Check its response rather than treating a clear prompt as a guarantee.', reflection: 'What detail would the model have to guess if you left it out?' },
  },
} as const;

export function LessonReading({ lesson }: { lesson: AtomicLesson }) {
  const reading = beginnings[lesson.id as keyof typeof beginnings]?.reading;
  if (!reading) return null;
  return <aside className="lesson-reading" aria-label="Read and connect">
    <div className="reading-heading"><BookOpen size={20}/><span>READ & CONNECT</span></div>
    <h2>{reading.title}</h2><p className="reading-credit">{reading.author} · {reading.location}</p>
    {reading.excerpt && <blockquote>“{reading.excerpt}”</blockquote>}
    <p className="reading-explanation">{reading.explanation}</p>
    <div className="reading-reflection"><Lightbulb size={18}/><p><strong>A thought to carry with you</strong>{reading.reflection}</p></div>
    <footer><small>{reading.note}</small><a href={reading.url} target="_blank" rel="noopener noreferrer">Read the source ↗</a></footer>
  </aside>;
}

/** A supported first encounter. This warm-up never awards XP or a mastery score. */
export default function LessonOpening({ lesson, onContinue }: { lesson: AtomicLesson; onContinue: () => void }) {
  const beginning = beginnings[lesson.id as keyof typeof beginnings];
  const [example, setExample] = useState(false);
  const [choice, setChoice] = useState<number | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); window.scrollTo(0, 0); }, [example]);
  const feedback = choice === null ? null : beginning?.options[choice];
  return <div className="lesson-opening">
    <div className="opening-guide"><TigerPortrait/><p>{example ? 'You have the clue. Let’s try one small choice.' : 'Let’s start with something familiar. I’ll guide you.'}</p></div>
    <p className="eyebrow">{example ? 'TRY IT TOGETHER' : `LESSON ${lesson.order} · START HERE`}</p>
    <h1 ref={heading} tabIndex={-1}>{example ? beginning?.title : beginning?.purpose || lesson.title.en}</h1>
    {!example ? <>
      <p className="opening-purpose">{beginning?.why || lesson.objective.en}</p>
      <div className="opening-plan"><DomainArtwork domain={lesson.trackId}/><div><strong>One useful idea. One step at a time.</strong><span><Clock3 size={15}/> About 4 minutes</span><ol><li><Lightbulb size={17}/> {beginning ? 'Explore a familiar example' : 'Understand a useful idea'}</li><li><BookOpen size={17}/> Read, then try it yourself</li><li><Target size={17}/> Make something you can use</li></ol></div></div>
      <p className="opening-reassurance">No prior knowledge needed. Mistakes are part of learning.</p>
      <button className="button primary large" onClick={() => beginning ? setExample(true) : onContinue()}>Let’s begin<ArrowRight size={19}/></button>
    </> : beginning && <>
      <div className="opening-example"><p>{beginning.scene}</p><div><Lightbulb size={20}/><p>{beginning.clue}</p></div></div>
      <fieldset className="opening-options"><legend>{beginning.question}</legend>{beginning.options.map((option, index) => <label className={choice === index ? 'selected' : ''} key={option.label}><input type="radio" name="lesson-warmup" checked={choice === index} onChange={() => setChoice(index)}/><span>{option.label}</span>{choice === index && <Check size={18}/>}</label>)}</fieldset>
      {feedback && <div className={`opening-feedback ${feedback.correct ? 'understood' : ''}`} role="status"><strong>{feedback.correct ? 'You spotted it.' : 'Let’s look at the clue.'}</strong><p>{feedback.feedback}</p></div>}
      <button className="button primary large" disabled={choice === null} onClick={onContinue}>Explore the idea<ArrowRight size={19}/></button>
      <button className="opening-back" onClick={() => { setExample(false); setChoice(null); }}><ArrowLeft size={16}/> Why this matters</button>
    </>}
  </div>;
}
