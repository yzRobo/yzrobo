// app/page.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

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
  <div className="pointer-events-none fixed inset-0 z-20 opacity-[0.015]">
    <svg width="100%" height="100%">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  </div>
);

// Modern navigation bar
const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : ''
      }`}
    >
      <div className="container mx-auto px-6 py-6 flex justify-between items-center">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-bold tracking-tight"
        >
          <span className="text-white">YZ</span>
          <span className="text-gray-400">ROBO</span>
        </motion.div>
        
        <div className="hidden md:flex items-center space-x-8">
          {['About', 'Gaming', 'Automotive', 'Projects'].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-gray-400 hover:text-white transition-colors duration-300 text-sm tracking-wide"
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {item}
            </motion.a>
          ))}
          <motion.a
            href="/links"
            className="relative group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all duration-300" />
            <div className="relative px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white text-sm">
              Connect
            </div>
          </motion.a>
        </div>
      </div>
    </motion.nav>
  );
};

// Modern hero section with parallax
const HeroSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Modern gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-black" />
        <motion.div
          style={{ y: y1 }}
          className="absolute top-0 -left-1/4 w-[150%] h-[150%] bg-gradient-to-br from-purple-900/20 via-transparent to-transparent rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-0 -right-1/4 w-[150%] h-[150%] bg-gradient-to-tl from-blue-900/20 via-transparent to-transparent rounded-full blur-3xl"
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20" />

      <motion.div 
        style={{ opacity }}
        className="container mx-auto px-6 z-10 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <motion.h1 
            className="text-[8rem] md:text-[12rem] font-black leading-[0.8] tracking-tighter mb-4"
            initial={{ letterSpacing: "0.5em", opacity: 0 }}
            animate={{ letterSpacing: "-0.05em", opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
              YZ
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-2xl md:text-3xl text-gray-500 font-light tracking-[0.2em] mb-8"
          >
            ROBO
          </motion.p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
        >
          Gaming enthusiast. Automotive engineer. Creative coder.
          <br />
          <span className="text-gray-500 text-base">
            Crafting digital experiences at the intersection of passion and technology.
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.a
            href="#about"
            className="group relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
            <div className="relative px-8 py-4 bg-white text-black font-medium rounded-full">
              Explore My Work
            </div>
          </motion.a>

          <motion.a
            href="/links"
            className="relative group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative px-8 py-4 border border-white/20 text-white font-medium rounded-full backdrop-blur-sm hover:bg-white/5 transition-all duration-300">
              Connect With Me
            </div>
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Modern scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-16 bg-gradient-to-b from-white/50 to-transparent"
        />
      </motion.div>
    </section>
  );
};

// Modern feature card
interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  delay?: number;
}

const FeatureCard = ({ title, description, icon, delay = 0 }: FeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay, duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      <div className="relative h-full p-8 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-500">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Icon */}
        <motion.div
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="text-5xl mb-6 inline-block"
        >
          {icon}
        </motion.div>

        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
          {title}
        </h3>
        
        <p className="text-gray-400 leading-relaxed">
          {description}
        </p>

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-bl-2xl rounded-tr-2xl" />
      </div>
    </motion.div>
  );
};

// Main component
export default function ModernHomepage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <CursorGlow />
      <NoiseTexture />
      <Navigation />
      <HeroSection />
      
      {/* Features Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                What I Do
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Exploring the intersection of technology, creativity, and passion through various mediums.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              title="Gaming"
              description="Live streaming, gameplay content, and building communities around shared gaming experiences."
              icon="🎮"
              delay={0}
            />
            <FeatureCard
              title="Automotive"
              description="Engineering insights, project builds, and the art of mechanical perfection."
              icon="🏎️"
              delay={0.1}
            />
            <FeatureCard
              title="Cooking"
              description="Culinary experiments, recipe development, and the science behind great food."
              icon="👨‍🍳"
              delay={0.2}
            />
            <FeatureCard
              title="Coding"
              description="Building digital solutions, web applications, and pushing the boundaries of what's possible."
              icon="⚡"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
              Ready to Connect?
            </h2>
            <p className="text-xl text-gray-400 mb-12">
              Join me on this journey across gaming, tech, and creativity.
            </p>
            <motion.a
              href="/links"
              className="inline-flex items-center gap-3 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-30 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative px-10 py-4 bg-white text-black font-medium rounded-full">
                  View All Links
                </div>
              </div>
              <motion.svg
                className="w-5 h-5 text-white"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}