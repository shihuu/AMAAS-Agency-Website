import { Variants, Transition } from 'motion/react';

// Premium agency cubic-bezier easing curve (inspired by Apple / Vercel design systems)
export const EASE_PREMIUM: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_DECEL: [number, number, number, number] = [0, 0, 0.2, 1];

export const TRANSITION_FAST: Transition = {
  duration: 0.22,
  ease: EASE_PREMIUM,
};

export const TRANSITION_NORMAL: Transition = {
  duration: 0.4,
  ease: EASE_PREMIUM,
};

export const TRANSITION_SLOW: Transition = {
  duration: 0.75,
  ease: EASE_PREMIUM,
};

// Reusable viewport configuration for IntersectionObserver scroll triggers
export const VIEWPORT_CONFIG = {
  once: true,
  margin: '-60px 0px -60px 0px',
  amount: 0.15,
};

// Fade up with slight blur for high-end text and titles
export const fadeUpVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: 'blur(3px)',
  },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.65,
      delay,
      ease: EASE_PREMIUM,
    },
  }),
};

// Gentle container reveal with children stagger
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: (delayChildren = 0.05) => ({
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren,
    },
  }),
};

// Individual card / item entrance
export const cardRevealVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: EASE_PREMIUM,
    },
  },
};

// Modal backdrop animation
export const backdropVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

// Modal content scale & slide
export const modalVariant: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.97,
    y: 16,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: EASE_PREMIUM,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 12,
    transition: {
      duration: 0.22,
      ease: 'easeIn',
    },
  },
};
