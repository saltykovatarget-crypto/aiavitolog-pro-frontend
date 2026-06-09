import React, { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  /** Конечное число */
  to: number;
  /** Длительность ms */
  duration?: number;
  /** Префикс/суффикс (например "+" или "%") */
  suffix?: string;
  prefix?: string;
}

/**
 * Считает от 0 до `to` при попадании в viewport.
 * Использует IntersectionObserver — без зависимостей.
 */
export function CountUp({ to, duration = 1400, suffix = '', prefix = '' }: CountUpProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !triggered.current) {
            triggered.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              // easeOutCubic
              const eased = 1 - Math.pow(1 - t, 3);
              setValue(Math.round(to * eased));
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
