# Beginner experience — 9 October 2026

## Changes

- Center the shipped mascot geometry before animating it. Use one orthographic camera frame across host sizes, remove welcome offsets, and center the dashboard host. Keep the existing 3D asset and nine animations.
- Introduce lesson purpose, estimated time and a simple plan before asking for an answer. Money, AI and Psychology starters include a familiar example, an explicit clue, two choices and supportive feedback. This warm-up does not award XP or a mastery score.
- Present curriculum explanations one idea at a time before independent practice. Keep existing application, saved-tool, recall and reward contracts.
- Add visible readings and optional reflection to the three starters. Clearly distinguish excerpts, publisher descriptions and original summaries. Simplify the first Psychology story and application labels.
- Display a mentor question immediately while its reply is pending. Add an accessible animated Thinking status and a slower-reply message after 15 seconds. Keep the question draft on request failure; keep the existing unsaved-reply recovery. Do not simulate provider reasoning or stream an answer that has not arrived.

## Sources used

- [Duolingo teaching method](https://blog.duolingo.com/duolingo-teaching-method/): sequence, support and appropriate challenge. This implementation is inspired by those principles; it does not claim Duolingo's adaptive system or equivalent learning outcomes.
- [Francis Bacon, Novum Organum, Book I, XLVI](https://www.gutenberg.org/files/45988/old/45988-h/45988-h.htm): short historical excerpt with an explicit omission, followed by a T1GER explanation. Modern Psychology sources remain available in Sources & context.
- [The Psychology of Money, publisher description](https://harriman.house/books/the-psychology-of-money/): a short attributed excerpt from the publisher's description, not an invented passage from a chapter.
- [OpenAI prompt engineering guide](https://developers.openai.com/api/docs/guides/prompt-engineering): an original attributed summary, not a quotation or a book excerpt.

## Verification

- Web lint/typecheck and production build passed.
- Web tests: 47 passed; 3 emulator-only tests skipped locally. The release workflow runs emulator contracts separately.
- Added a regression check loading the actual GLB and sampling all nine animations at five aspect ratios. It checks centering and character bounds, rather than a duplicated mock model.
- Preview browser: Psychology Start → guided choice (wrong and right feedback) → all three explanations → independent practice → saved preview tool → application → recall → reward. Preview does not write account progress.
- Verified AI and Money starter context, choices, source cards and lack of horizontal overflow at 320px. Checked Psychology at 390px and dashboard at 320px. Inspected welcome, dashboard, mentor empty state and reward mascot framing.
- Mentor pending and slow-status rendering have automated component checks. A signed-in live provider conversation was not repeated in this sprint; provider configuration and backend are unchanged.

## Scope and remaining validation

Gold V2.1 is unchanged. Existing account, application and recall persistence remains in use. New source readings cover the three starters; this is not a complete book-library ingestion or licensing engine. Human sessions are still needed to measure comprehension, completion and retention. No claim of a 10/10 product or proven learning superiority is made.
