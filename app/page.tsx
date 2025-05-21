// app/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

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
      staggerChildren: 0.15
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

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-gray-100">
        {/* Static content while mounting */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-purple-900/10 via-transparent to-blue-900/10"></div>
          </div>
          
          <div className="container mx-auto px-4 z-10 text-center">
            <div className="mb-8">
              <h1 className="text-7xl md:text-9xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-600 tracking-wider">
                YZ
              </h1>
              <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 tracking-wide">
                ROBO
              </h2>
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
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-purple-900/10 via-transparent to-blue-900/10"></div>
        </div>
        
        <div className="container mx-auto px-4 z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="text-7xl md:text-9xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-600 tracking-wider">
              YZ
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 tracking-wide">
              ROBO
            </h2>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl md:text-2xl max-w-4xl mx-auto mb-12 text-gray-300 leading-relaxed"
          >
            Gaming • Automotive • Cooking • Coding
            <br className="hidden md:block"/>
            <span className="text-lg md:text-xl text-purple-300 mt-2 block">
              Always evolving while staying streamlined
            </span>
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link 
              href="/links"
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-full transition duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105 transform"
            >
              <span className="relative z-10">Connect</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
            </Link>
            
            <Link 
              href="#about"
              className="px-8 py-4 bg-transparent border-2 border-purple-500 hover:bg-purple-500/20 text-purple-300 hover:text-white font-bold rounded-full transition duration-300 hover:scale-105 transform"
            >
              Learn More
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400"
        >
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-purple-500 rounded-full flex justify-center"
            >
              <div className="w-1 h-3 bg-purple-500 rounded-full mt-2"></div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h2 
              variants={itemVariant}
              className="text-5xl md:text-6xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
            >
              Hey, I'm Robbie
            </motion.h2>
            
            <motion.div 
              variants={itemVariant}
              className="grid md:grid-cols-2 gap-12 items-center mb-16"
            >
              <div className="space-y-6">
                <p className="text-xl leading-relaxed text-gray-300">
                  I bring together my diverse interests in one place. From gaming streams to automotive projects, 
                  cooking adventures to coding solutions - this is where I share it all.
                </p>
                
                <p className="text-xl leading-relaxed text-gray-300">
                  I believe in breaking down the walls between different hobbies and interests. 
                  Whether you're here for gaming content, automotive inspiration, recipes, or tech projects - 
                  there's something for everyone.
                </p>
              </div>
              
              <div className="relative">
                <div className="w-full h-80 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl flex items-center justify-center">
                  <div className="text-8xl">🤖</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Interests Grid Section */}
      <section className="py-24 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
          >
            What I'm Into
          </motion.h2>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <InterestCard 
              title="Gaming" 
              description="Streaming on Twitch and creating gaming content on YouTube. Come hang out!"
              icon="🎮" 
              link="/gaming"
              gradient="from-green-500 to-blue-500"
            />
            
            <InterestCard 
              title="Automotive" 
              description="Cars, motorcycles, and the engineering that makes them tick. Projects and builds."
              icon="🏍️" 
              link="/automotive"
              gradient="from-red-500 to-orange-500"
            />
            
            <InterestCard 
              title="Cooking" 
              description="Recipes, techniques, and experimenting in the kitchen. Good food, good times."
              icon="🍳" 
              link="/cooking"
              gradient="from-yellow-500 to-red-500"
            />
            
            <InterestCard 
              title="Coding" 
              description="Development projects, web apps, and technical solutions I've built."
              icon="💻" 
              link="/portfolio"
              gradient="from-purple-500 to-pink-500"
            />
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-gradient-to-r from-purple-900/50 via-black to-blue-900/50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Let's Connect
            </h2>
            
            <p className="text-xl max-w-2xl mx-auto mb-10 text-gray-300">
              Follow my streams, check out my latest projects, or just say hi. 
              I'd love to hear from you!
            </p>
            
            <Link 
              href="/links"
              className="group relative inline-flex items-center px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-full transition duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105 transform"
            >
              <span className="relative z-10">View All Links</span>
              <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.main>
  );
}

// Interest Card Component
function InterestCard({ title, description, icon, link, gradient }: {
  title: string;
  description: string;
  icon: string;
  link: string;
  gradient: string;
}) {
  return (
    <motion.div 
      variants={itemVariant}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 hover:bg-gray-800/70 transition-all duration-300 border border-gray-700/50 hover:border-purple-500/50"
    >
      <Link href={link} className="block h-full">
        <div className={`text-6xl mb-6 p-4 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-20 w-fit`}>
          {icon}
        </div>
        <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300">
          {title}
        </h3>
        <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
          {description}
        </p>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </Link>
    </motion.div>
  );
}