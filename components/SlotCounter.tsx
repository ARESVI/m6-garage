'use client';

import { useEffect, useRef, useState } from 'react';

const DIGIT_HEIGHT = 40; // px
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const TOTAL_DIGITS = 3;

interface SlotReelProps {
  targetDigit: number;
  delay: number;
}

function SlotReel({ targetDigit, delay }: SlotReelProps) {
  const [offset, setOffset] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Total spins: go around a few times then land on target
    const extraSpins = 3;
    const targetOffset = (extraSpins * 10 + targetDigit) * DIGIT_HEIGHT;
    const duration = 1800;
    let startTime: number | null = null;

    const delayTimer = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setOffset(eased * targetOffset);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setOffset(targetOffset);
        }
      };
      rafRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(delayTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [targetDigit, delay]);

  // Which digit is visible at current offset
  const visibleIndex = Math.round(offset / DIGIT_HEIGHT) % 10;

  return (
    <span
      style={{
        display: 'inline-block',
        width: '1.1ch',
        height: `${DIGIT_HEIGHT}px`,
        overflow: 'hidden',
        position: 'relative',
        verticalAlign: 'middle',
      }}
    >
      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          top: 0,
          transform: `translateY(-${offset}px)`,
          willChange: 'transform',
        }}
      >
        {/* Render enough digits to cover all spins */}
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            style={{
              height: `${DIGIT_HEIGHT}px`,
              lineHeight: `${DIGIT_HEIGHT}px`,
              display: 'block',
              textAlign: 'center',
            }}
          >
            {DIGITS[i % 10]}
          </span>
        ))}
      </span>
    </span>
  );
}

interface SlotCounterProps {
  value: number;
  className?: string;
}

export default function SlotCounter({ value, className }: SlotCounterProps) {
  // Her zaman 3 basamak, soldan sıfır doldur (örn: 005)
  const padded = String(value).padStart(TOTAL_DIGITS, '0');
  const digits = padded.split('').map(Number);

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: `${DIGIT_HEIGHT}px`,
        overflow: 'hidden',
      }}
    >
      {digits.map((digit, i) => (
        <SlotReel
          key={i}
          targetDigit={digit}
          delay={i * 150}
        />
      ))}
    </span>
  );
}
