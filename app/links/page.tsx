// app/links/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '../components/Navigation';

// Social links data
const socialLinks = [
  {
    name: 'Twitch',
    handle: '@yzRobo',
    url: 'https://twitch.tv/yzRobo',
    description: 'Live gaming streams',
    icon: ( <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg> ),
    color: '#0038b8',
    category: 'gaming'
  },
  {
    name: 'YouTube Gaming',
    handle: '@yzRoboGaming',
    url: 'https://youtube.com/@yzRoboGaming',
    description: 'Gaming content & tutorials',
    icon: ( <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> ),
    color: '#0038b8',
    category: 'gaming'
  },
  {
    name: 'YouTube Motorsports',
    handle: '@yzRobo',
    url: 'https://youtube.com/@yzRobo',
    description: 'Automotive builds & reviews',
    icon: ( <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> ),
    color: '#0038b8',
    category: 'automotive'
  },
  {
    name: 'Instagram',
    handle: '@yzRobo_',
    url: 'https://instagram.com/yzRobo_',
    description: 'Behind the scenes',
    icon: ( <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/></svg> ),
    color: '#0038b8',
    category: 'social'
  },
  {
    name: 'Twitter',
    handle: '@yzRobo',
    url: 'https://twitter.com/yzRobo',
    description: 'Updates & thoughts',
    icon: ( <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg> ),
    color: '#0038b8',
    category: 'social'
  },
  {
    name: 'Bluesky',
    handle: '@yzrobo.com',
    url: 'https://bsky.app/profile/yzrobo.com',
    description: 'Social updates & thoughts',
    icon: ( <svg viewBox="0 0 600 530" fill="currentColor" className="w-6 h-6"><path d="M135.72 44.03C202.216 93.951 273.74 195.17 300 249.49c26.262-54.316 97.782-155.54 164.28-205.46C512.26 8.009 590-19.862 590 68.825c0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.38-3.69-10.832-3.708-7.896-.017-2.936-1.193.516-3.707 7.896-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.45-163.25-81.433C20.15 217.613 9.997 86.535 9.997 68.825c0-88.687 77.742-60.816 125.72-24.795z"/></svg> ),
    color: '#0038b8',
    category: 'social'
  },
  {
    name: 'TikTok',
    handle: '@yzRobo_',
    url: 'https://tiktok.com/@yzRobo_',
    description: 'Short-form content',
    icon: ( <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg> ),
    color: '#0038b8',
    category: 'social'
  },
  {
    name: 'Discord',
    handle: 'Join Server',
    url: 'https://discord.gg/thepadcast',
    description: 'Community chat',
    icon: ( <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/></svg> ),
    color: '#0038b8',
    category: 'community'
  }
];

// Link card component
interface LinkType {
  name: string;
  handle: string;
  url: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: string;
}

interface LinkCardProps {
  link: LinkType;
  index: number;
}

const LinkCard = ({ link, index }: LinkCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="block relative group w-full bg-[var(--surface)] rounded-2xl border border-transparent hover:border-[var(--accent-primary)]/50 transition-colors duration-300"
    >
      <div className="relative p-6 sm:p-8">
        {/* Hover glow effect */}
        <div 
          className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, color-mix(in srgb, var(--accent-primary) 15%, transparent) 0%, transparent 70%)`,
          }}
        />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Icon with dynamic color */}
          <motion.div
            animate={{ 
              rotate: isHovered ? [0, -10, 10, -10, 0] : 0,
              scale: isHovered ? 1.1 : 1
            }}
            transition={{ duration: 0.5 }}
            className="mb-4 p-4 rounded-2xl bg-white/5 text-[var(--accent-primary)]"
          >
            {link.icon}
          </motion.div>
          
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center justify-center gap-2">
              {link.name}
              <motion.svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 group-hover:text-white flex-shrink-0"
                animate={{ x: isHovered ? 3 : 0, opacity: isHovered ? 1 : 0.5 }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </motion.svg>
            </h3>
            <p className="text-sm text-gray-500">{link.handle}</p>
            <p className="text-sm text-gray-400">{link.description}</p>
          </div>
        </div>
      </div>
    </motion.a>
  );
};

// Filter button component
interface FilterButtonProps {
  category: string;
  active: boolean;
  onClick: () => void;
}

const FilterButton = ({ category, active, onClick }: FilterButtonProps) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
      active
        ? 'bg-[var(--accent-primary)] text-white'
        : 'bg-[var(--surface)] text-gray-400 hover:bg-white/10 hover:text-white border border-[var(--border)]'
    }`}
  >
    {category}
  </motion.button>
);

// Main component
export default function LinksPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'gaming', name: 'Gaming' },
    { id: 'automotive', name: 'Automotive' },
    { id: 'social', name: 'Social' },
    { id: 'community', name: 'Community' }
  ];

  const filteredLinks = activeCategory === 'all' 
    ? socialLinks 
    : socialLinks.filter(link => link.category === activeCategory);

  return (
    <div className="min-h-screen text-white bg-[var(--background)]">
      <Navigation />
      
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-primary)]/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--accent-primary)]/5 rounded-full blur-3xl animate-pulse-slow" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 md:mb-6 tracking-tight text-white">
              Let's Connect
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 mb-8 md:mb-12 max-w-lg mx-auto">
              Find me across the web. Gaming streams, automotive content, and community spaces.
            </p>
            
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center max-w-xl mx-auto">
              {categories.map((cat) => (
                <FilterButton
                  key={cat.id}
                  category={cat.name}
                  active={activeCategory === cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      <section className="pb-16 md:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3 sm:space-y-4"
            >
              {filteredLinks.map((link, index) => (
                <LinkCard key={link.name} link={link} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
      
      <section className="py-16 md:py-20 border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              Don't see what you're looking for?
            </h2>
            <p className="text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
              Drop me a message on any platform, or join the Discord community to chat directly.
            </p>
            <motion.a
              href="https://discord.gg/thepadcast"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-[var(--accent-primary)] text-white font-medium rounded-full transition-colors text-sm sm:text-base"
            >
              <span>Join Discord</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/></svg>
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}