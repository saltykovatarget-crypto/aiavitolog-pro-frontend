import React from 'react';
import { motion } from 'motion/react';

type Direction = 'up' | 'left' | 'right' | 'fade';

const getOffset = (direction: Direction, distance: number) => {
  switch (direction) {
    case 'up': return { y: distance, x: 0 };
    case 'left': return { y: 0, x: -distance };
    case 'right': return { y: 0, x: distance };
    case 'fade':
    default: return { y: 0, x: 0 };
  }
};

interface RevealProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  distance?: number;
  rootMargin?: string;
}

/**
 * Универсальный scroll-reveal wrapper для одного элемента.
 *   <Reveal>...</Reveal>
 *   <Reveal direction="left" delay={0.2}>...</Reveal>
 */
export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.5,
  className,
  distance = 18,
  rootMargin = '-80px',
}: RevealProps) {
  const offset = getOffset(direction, distance);
  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: rootMargin }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface RevealItemProps {
  children: React.ReactNode;
  index?: number;
  baseDelay?: number;
  staggerDelay?: number;
  direction?: Direction;
  distance?: number;
  duration?: number;
  className?: string;
  rootMargin?: string;
}

/**
 * Элемент сетки/списка с задержкой по индексу.
 *   {items.map((item, i) => (
 *     <RevealItem key={item.id} index={i}>...</RevealItem>
 *   ))}
 */
export function RevealItem({
  children,
  index = 0,
  baseDelay = 0,
  staggerDelay = 0.08,
  direction = 'up',
  distance = 18,
  duration = 0.5,
  className,
  rootMargin = '-80px',
}: RevealItemProps) {
  const offset = getOffset(direction, distance);
  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: rootMargin }}
      transition={{ duration, delay: baseDelay + index * staggerDelay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
