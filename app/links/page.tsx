// app/links/page.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariant = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { 
      ease: "easeOut", 
      duration: 0.6 
    }
  }
};

// Social links data
const socialLinks = [
  {
    name: 'Twitch',
    url: 'https://twitch.tv/yzRobo',
    description: 'Live gaming streams and interactive content',
    icon: '🎮',
    color: 'from-purple-600 to-purple-400',
    category: 'gaming'
  },
  {
    name: 'YouTube Gaming',
    url: 'https://youtube.com/@yzrobogaming',
    description: 'Gaming videos, highlights, and tutorials',
    icon: '🎬',
    color: 'from-red-600 to-red-400',
    category: 'gaming'
  },
  {
    name: 'YouTube Motorsports',
    url: 'https://youtube.com/@yzrobo',
    description: 'Automotive content, builds, and reviews',
    icon: '🏍️',
    color: 'from-orange-600 to-red-500',
    category: 'automotive'
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/yzrobo_',
    description: 'Photos, stories, and behind-the-scenes content',
    icon: '📸',
    color: 'from-pink-600 to-purple-600',
    category: 'social'
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/yzRobo',
    description: 'Quick updates, thoughts, and interactions',
    icon: '🐦',
    color: 'from-blue-500 to-blue-400',
    category: 'social'
  },
  {
    name: 'TikTok',
    url: 'https://tiktok.com/@yzrobo_',
    description: 'Short-form videos and quick content',
    icon: '📱',
    color: 'from-gray-800 to-gray-600',
    category: 'social'
  },
  {
    name: 'Discord',
    url: 'https://discord.gg/thepadcast',
    description: 'Join the community and chat with me',
    icon: '💬',
    color: 'from-indigo-600 to-purple-600',
    category: 'community'
  }
];

const categories = [
  { id: 'all', name: 'All Links' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'automotive', name: 'Automotive' },
  { id: 'social', name: 'Social Media' },
  { id: 'community', name: 'Community' }
];

export default function LinksPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredLinks = activeCategory === 'all' 
    ? socialLinks 
    : socialLinks.filter(link => link.category === activeCategory);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-gray-100">
        {/* Static content while mounting */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-10 left-10 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 z-10 relative">
            <div className="text-center mb-12">
              <Link 
                href="/"
                className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-200 mb-8 group"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </Link>

              <h1 className="text-6xl md:text-7xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-600">
                YZ ROBO
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Connect with me across all platforms. Gaming streams, automotive content, 
                and everything in between.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <motion.main 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-gray-100"
    >
      {/* Header Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            {/* Back to home link */}
            <Link 
              href="/"
              className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-200 mb-8 group"
            >
              <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>

            <h1 className="text-6xl md:text-7xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-600">
              YZ ROBO
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Connect with me across all platforms. Gaming streams, automotive content, 
              and everything in between.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-600/50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Links Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid gap-6"
          >
            {filteredLinks.map((link, index) => (
              <LinkCard key={link.name} link={link} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/30 via-black to-blue-900/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Don't Miss Out
            </h2>
            
            <p className="text-xl max-w-2xl mx-auto mb-10 text-gray-300">
              Follow me on Twitch for live gaming sessions, subscribe to my YouTube channels 
              for automotive and gaming content, and join our Discord community to chat!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="https://twitch.tv/yzRobo"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-full transition duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105 transform"
              >
                <span className="relative z-10">🔴 Live on Twitch</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
              </a>
              
              <a 
                href="https://discord.gg/thepadcast"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-transparent border-2 border-indigo-500 hover:bg-indigo-500/20 text-indigo-300 hover:text-white font-bold rounded-full transition duration-300 hover:scale-105 transform"
              >
                💬 Join Discord
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.main>
  );
}

// Link Card Component
function LinkCard({ link, index }: { link: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={itemVariant}
      whileHover={{ scale: 1.02, y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 transition-all duration-300 hover:border-purple-500/50 hover:bg-gray-800/70"
      >
        {/* Background gradient effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${link.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
        
        <div className="relative z-10 flex items-center">
          {/* Icon */}
          <div className={`text-4xl mr-6 p-3 rounded-xl bg-gradient-to-br ${link.color} bg-opacity-20 transition-transform duration-300 group-hover:scale-110`}>
            {link.icon}
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300">
              {link.name}
            </h3>
            <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
              {link.description}
            </p>
          </div>
          
          {/* Arrow */}
          <div className="ml-4">
            <motion.svg 
              className="w-6 h-6 text-gray-500 group-hover:text-purple-400"
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.2 }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </motion.svg>
          </div>
        </div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
      </a>
    </motion.div>
  );
}