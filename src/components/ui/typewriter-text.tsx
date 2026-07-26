"use client";

import * as React from "react";
import { useEffect, useState } from "react";

export interface TypewriterProps {
  text: string | string[];
  speed?: number;
  cursor?: string;
  loop?: boolean;
  deleteSpeed?: number;
  delay?: number;
  className?: string;
}

export function Typewriter({
  text,
  speed = 100,
  cursor = "_",
  loop = true,
  deleteSpeed = 50,
  delay = 2000,
  className,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  const textArray = React.useMemo(
    () => (Array.isArray(text) ? text : [text]),
    [text]
  );

  useEffect(() => {
    const currentFullText = textArray[textIndex] || "";

    const handleTyping = () => {
      if (!isDeleting) {
        if (currentIndex < currentFullText.length) {
          setDisplayText(currentFullText.slice(0, currentIndex + 1));
          setCurrentIndex((prev) => prev + 1);
        } else {
          if (loop || textIndex < textArray.length - 1) {
            setTimeout(() => setIsDeleting(true), delay);
          }
        }
      } else {
        if (currentIndex > 0) {
          setDisplayText(currentFullText.slice(0, currentIndex - 1));
          setCurrentIndex((prev) => prev - 1);
        } else {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % textArray.length);
        }
      }
    };

    const timer = setTimeout(
      handleTyping,
      isDeleting ? deleteSpeed : speed
    );

    return () => clearTimeout(timer);
  }, [currentIndex, isDeleting, textIndex, textArray, speed, deleteSpeed, delay, loop]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">{cursor}</span>
    </span>
  );
}
