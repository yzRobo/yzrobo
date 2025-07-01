// app/about/page.tsx
'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navigation from '../components/Navigation';

// Main component
export default function AboutPage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <div className="min-h-screen text-white overflow-x-hidden">
      <Navigation />
      
      {/* Main content section with background effects */}
      <section className="relative min-h-screen pt-32 pb-20">
        {/* Modern gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface)] via-[var(--background)] to-[var(--background)]" />
          <motion.div
            style={{ y: y1 }}
            className="absolute top-0 -left-1/4 w-[150%] h-[150%] bg-gradient-to-br from-blue-500/10 via-transparent to-transparent rounded-full blur-3xl"
          />
          <motion.div
            style={{ y: y2 }}
            className="absolute bottom-0 -right-1/4 w-[150%] h-[150%] bg-gradient-to-tl from-purple-500/10 via-transparent to-transparent rounded-full blur-3xl"
          />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20" />

        {/* Content */}
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                About
              </span>
            </h1>
            
            {/* Tagline */}
            <p className="text-2xl md:text-3xl font-semibold text-gray-300 mb-12">
              Always evolving while staying streamlined.
            </p>
            
            {/* Divider */}
            <div className="w-24 h-[1px] bg-gradient-to-r from-white/50 to-transparent mb-12" />
            
            {/* Main content from original site */}
            <div className="space-y-8 text-lg text-gray-300 leading-relaxed">
              <p>
                I started yzRobo as a way to pull all aspects of my shared interests together in one place. 
                I personally have always had a broad collection of things I find interesting ranging from 
                sports, video games, motorsports, technology, and everything in between.
              </p>
              
              <p>
                I like to think that gamers can care about fitness and health. Car enthusiasts can learn 
                how to cook. Powerlifters can stream video games. yzRobo is all about bridging the gaps 
                between the different hobbies and passions we love without pigeonholing ourselves into 
                one group. If you see something you like{' '}
                <a 
                  href="https://www.twitch.tv/yzRobo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white underline decoration-white/30 hover:decoration-white transition-all duration-300"
                >
                  drop by
                </a>{' '}
                and let me know what you think.
              </p>
            </div>
            
            {/* Back to home button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-16"
            >
              <motion.a
                href="/"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                whileHover={{ x: -5 }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="group-hover:text-white transition-colors">Back to Home</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}