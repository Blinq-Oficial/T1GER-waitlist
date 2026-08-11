import { useEffect, useMemo, useState } from 'react';

interface TypewriterProps {
  text: string[];
  typingSpeed?: number;
  deleteSpeed?: number;
  pause?: number;
  className?: string;
}

export function Typewriter({
  text,
  typingSpeed = 85,
  deleteSpeed = 45,
  pause = 1_700,
  className = '',
}: TypewriterProps) {
  const words = useMemo(() => text.filter(Boolean), [text]);
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState(words[0] ?? '');
  const [isDeleting, setIsDeleting] = useState(false);
  const currentWord = words[wordIndex] ?? '';

  useEffect(() => {
    if (words.length < 2) return undefined;

    const atEnd = displayText === currentWord;
    const atStart = displayText.length === 0;
    const timeout = atEnd && !isDeleting ? pause : isDeleting ? deleteSpeed : typingSpeed;

    const timer = window.setTimeout(() => {
      if (!isDeleting && atEnd) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && atStart) {
        setWordIndex((index) => (index + 1) % words.length);
        setIsDeleting(false);
        return;
      }

      const nextLength = displayText.length + (isDeleting ? -1 : 1);
      setDisplayText(currentWord.slice(0, nextLength));
    }, timeout);

    return () => window.clearTimeout(timer);
  }, [currentWord, deleteSpeed, displayText, isDeleting, pause, typingSpeed, words.length]);

  return (
    <span className={className}>
      <span className="motion-reduce:hidden">{displayText}<span className="animate-pulse" aria-hidden="true">_</span></span>
      <span className="hidden motion-reduce:inline">{words[0]}</span>
    </span>
  );
}
