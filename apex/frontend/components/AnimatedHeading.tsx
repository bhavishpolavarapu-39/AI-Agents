'use client';

import React, { useState, useEffect } from 'react';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
  initialDelay?: number;
  charDelay?: number;
  transitionDuration?: number;
  style?: React.CSSProperties;
}

export default function AnimatedHeading({
  text,
  className = '',
  initialDelay = 200,
  charDelay = 30,
  transitionDuration = 500,
  style = {},
}: AnimatedHeadingProps) {
  const [animatedChars, setAnimatedChars] = useState<boolean[]>([]);

  const lines = text.split('\n');

  useEffect(() => {
    const totalChars = lines.reduce((sum, line) => sum + line.length, 0) + (lines.length - 1); // +1 for newlines
    const chars = new Array(totalChars).fill(false);

    let charIndex = 0;
    lines.forEach((line, lineIndex) => {
      line.split('').forEach((_, charIndex_) => {
        const delay =
          initialDelay +
          (lineIndex * (line.length + 1) * charDelay) +
          charIndex_ * charDelay;

        setTimeout(() => {
          setAnimatedChars((prev) => {
            const updated = [...prev];
            updated[charIndex] = true;
            return updated;
          });
        }, delay);

        charIndex++;
      });

      // Add delay for newline character
      if (lineIndex < lines.length - 1) {
        charIndex++;
      }
    });
  }, [text, initialDelay, charDelay]);

  return (
    <div className={className} style={style}>
      {lines.map((line, lineIndex) => (
        <div key={lineIndex}>
          {line.split('').map((char, charIndex) => {
            let globalCharIndex = 0;
            for (let i = 0; i < lineIndex; i++) {
              globalCharIndex += lines[i].length + 1; // +1 for newline
            }
            globalCharIndex += charIndex;

            const isAnimated = animatedChars[globalCharIndex] || false;

            return (
              <span
                key={`${lineIndex}-${charIndex}`}
                style={{
                  display: 'inline-block',
                  opacity: isAnimated ? 1 : 0,
                  transform: isAnimated ? 'translateX(0)' : 'translateX(-18px)',
                  transition: `opacity ${transitionDuration}ms ease-out, transform ${transitionDuration}ms ease-out`,
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
