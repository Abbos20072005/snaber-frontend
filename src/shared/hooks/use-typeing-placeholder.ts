// hooks/use-typing-placeholder.ts
import { useEffect, useState } from 'react';

const TYPING_SPEED = 80; // ms per character typed
const ERASING_SPEED = 40; // ms per character erased
const PAUSE_AFTER_WORD = 3000; // ms to hold the full word
const PAUSE_BEFORE_NEXT = 300; // ms pause after erasing

export function useTypingPlaceholder(
  words: string[],
  {
    prefix = '',
    typingSpeed = TYPING_SPEED,
    erasingSpeed = ERASING_SPEED,
    pauseAfterWord = PAUSE_AFTER_WORD,
    pauseBeforeNext = PAUSE_BEFORE_NEXT
  } = {}
) {
  const [placeholder, setPlaceholder] = useState(prefix);

  useEffect(() => {
    let wordIndex = 0;
    let charIndex = 0;
    let isErasing = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const currentWord = words[wordIndex];
      const currentText = prefix + currentWord.slice(0, charIndex);

      setPlaceholder(currentText);

      if (!isErasing) {
        if (charIndex < currentWord.length) {
          // Still typing
          charIndex++;
          timeoutId = setTimeout(tick, typingSpeed);
        } else {
          // Word complete — pause, then start erasing
          isErasing = true;
          timeoutId = setTimeout(tick, pauseAfterWord);
        }
      } else {
        if (charIndex > 0) {
          // Still erasing
          charIndex--;
          timeoutId = setTimeout(tick, erasingSpeed);
        } else {
          // Erased — move to next word
          isErasing = false;
          wordIndex = (wordIndex + 1) % words.length;
          timeoutId = setTimeout(tick, pauseBeforeNext);
        }
      }
    };

    timeoutId = setTimeout(tick, pauseBeforeNext);
    return () => clearTimeout(timeoutId);
  }, [words, prefix]);

  return placeholder;
}
