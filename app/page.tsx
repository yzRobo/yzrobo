// app/page.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaGamepad, FaCar, FaUtensils, FaCode } from 'react-icons/fa';
import Image from 'next/image';
import Navigation from './components/Navigation';

// Modern feature card
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
  href?: string;
}

const FeatureCard = ({ title, description, icon, delay = 0, href }: FeatureCardProps) => {
  const cardContent = (
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

  if (href) {
    return (
      <a href={href} className="block h-full no-underline">
        {cardContent}
      </a>
    );
  }

  return cardContent;
};


// Main component
export default function ModernHomepage() {
  return (
    <>
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

      {/* What I Do Section */}
      <section id="what-i-do" className="py-20 md:py-1 relative bg-black">
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
              Exploring the intersection of technology and creativity within my various hobbies and interests.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard href="/gaming" title="Gaming" description="Live streaming, how-to guides, and building communities around shared gaming experiences (Apex Movement)." icon={<FaGamepad />} delay={0}/>
            <FeatureCard href="/auto" title="Automotive" description="Motorcycles, Cars, and OBS Trucks. Project build updates, motovlogging, and tinkering." icon={<FaCar />} delay={0.1}/>
            <FeatureCard href="/cooking" title="Cooking" description="Traditional Italian. Smoking BBQ. Experiments. Still figuring this out as we go." icon={<FaUtensils />} delay={0.2}/>
            <FeatureCard href="/coding" title="Coding" description="Vibe coding our way through various projects. Webapps, custom domains, and anything that sounds cool." icon={<FaCode />} delay={0.3}/>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-24 relative bg-black">
        <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center md:text-left"
                >
                    <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white">
                      About
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                      Always evolving while staying streamlined.
                    </p>

                    {/* Divider */}
                    <div className="w-35 h-[1px] bg-gradient-to-r from-white/50 to-transparent mb-5" />

                    <div className="space-y-6 text-gray-300/80 leading-relaxed">
                      <p>
                        I started yzRobo as a way to pull all aspects of my shared interests together in one place. 
                        I personally have always had a broad collection of things I find interesting ranging from 
                        sports, video games, motorsports, technology, and everything in between.
                      </p>
                      <p>
                        yzRobo is all about bridging the gaps between the different hobbies and passions we love without pigeonholing ourselves into one group. If you see something you like{' '}
                        <a 
                          href="https://www.twitch.tv/yzRobo" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[var(--accent-primary)] font-semibold hover:underline"
                        >
                          drop by
                        </a>{' '}
                        and let me know what you think.
                      </p>
                    </div>
                    <div className="mt-12">
                       <motion.a
                          href="/links"
                          className="inline-block"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="relative px-10 py-4 bg-[var(--accent-primary)] text-white font-bold rounded-full">
                              Connect With Me
                          </div>
                        </motion.a>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="flex justify-center items-center"
                >
                  <div className="relative w-full max-w-sm">
                      <div className="absolute -inset-8 bg-[var(--accent-primary)]/10 rounded-full blur-3xl animate-pulse-slow"></div>
                      <Image
                        src="/media/R6_Circle.png"
                        alt="yzRobo Helmet Logo"
                        width={500}
                        height={500}
                        className="relative animate-float"
                      />
                  </div>
                </motion.div>
            </div>
        </div>
      </section>
    </>
  );
}