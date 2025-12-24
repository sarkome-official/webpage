import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const phrases = [
  "Will this drug work?",
  "Why did others fail?",
  "What breaks if inhibited?",
  "What alternative remains unexplored?"
];

export const RotatingHeading = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-[60px] md:h-[80px] overflow-visible perspective-[1000px] relative select-none pointer-events-none">
      <div 
        className="transition-transform duration-1000 ease-in-out relative w-full h-full"
        style={{ 
          transform: `rotateX(${index * -90}deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        {phrases.map((phrase, i) => (
          <div
            key={i}
            className="absolute inset-0 flex items-center"
            style={{
              transform: `rotateX(${i * 90}deg) translateZ(40px)`,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          >
            <h2 className={cn(
              "text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] whitespace-nowrap",
              "text-text-main-light dark:text-white"
            )}>
              {phrase}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};
