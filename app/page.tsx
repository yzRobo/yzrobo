// app/page.tsx
'use client';

import React, { useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { FaGamepad, FaCar, FaUtensils, FaCode } from 'react-icons/fa';
import Image from 'next/image';
import Navigation from './components/Navigation';

// Modern cursor follower component
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

// Noise texture overlay for modern depth
const NoiseTexture = () => (
  <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.015]">
    <svg width="100%" height="100%">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  </div>
);

// Modern feature card
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

const FeatureCard = ({ title, description, icon, delay = 0 }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay, duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
      className="relative group h-full"
    >
      <div className="relative h-full p-8 bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-[var(--accent-primary)]/80 transition-colors duration-500">
        <div className="text-4xl mb-6 inline-block text-[var(--accent-primary)]">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
          {title}
        </h3>
        <p className="text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};


// Main component
export default function ModernHomepage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <CursorGlow />
      <NoiseTexture />
      <Navigation />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-40 pb-20 md:pt-48 md:pb-28">
        <div className="absolute inset-0 bg-black" />

        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-lg md:max-w-2xl px-4"
          >
            <Image
              src="/media/yzRobo_Text_With_Background.png"
              alt="yzRobo Main Logo"
              width={1000} 
              height={310} 
              priority
              className="w-full h-auto"
            />
          </motion.div>
          
          <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-sm md:text-base text-gray-500 font-light tracking-widest mt-6"
          >
              GAMING • AUTOMOTIVE • COOKING • CODING
          </motion.p>

          {/* Animated Scroll Down Indicator */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-16"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-6 h-6 border-b-2 border-r-2 border-gray-500 transform rotate-45"
            />
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section id="what-i-do" className="py-20 md:py-24 relative bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900/20 to-black" />
        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white">
              What I Do
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Exploring the intersection of technology, creativity, and passion through various mediums.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard title="Gaming" description="Live streaming, gameplay content, and building communities around shared gaming experiences." icon={<FaGamepad />} delay={0}/>
            <FeatureCard title="Automotive" description="Engineering insights, project builds, and the art of mechanical perfection." icon={<FaCar />} delay={0.1}/>
            <FeatureCard title="Cooking" description="Culinary experiments, recipe development, and the science behind great food." icon={<FaUtensils />} delay={0.2}/>
            <FeatureCard title="Coding" description="Building digital solutions, web applications, and pushing the boundaries of what's possible." icon={<FaCode />} delay={0.3}/>
          </div>
            
          <div className="text-center mt-24">
             <motion.a
                href="/links"
                className="inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative px-10 py-4 bg-[var(--accent-primary)] text-white font-bold rounded-full">
                    View All Links
                </div>
              </motion.a>
          </div>
        </div>
      </section>
    </div>
  );
}