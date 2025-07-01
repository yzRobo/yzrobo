// app/components/GlobalEffects.tsx
'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import React, { useEffect } from 'react';

const CursorGlow = () => {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 hidden lg:block"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    >
      <div className="h-8 w-8 rounded-full bg-white/10 blur-xl" />
    </motion.div>
  );
};

const NoiseTexture = () => (
  <div className="pointer-events-none fixed inset-0 z-40 opacity-[0.015]">
    <svg width="100%" height="100%">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  </div>
);

export default function GlobalEffects() {
    return (
        <>
            <CursorGlow />
            <NoiseTexture />
        </>
    )
}