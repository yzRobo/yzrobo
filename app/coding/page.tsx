// app/coding/page.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { SiNextdotjs, SiTailwindcss, SiFramer, SiTypescript } from 'react-icons/si';
import Navigation from '../components/Navigation';

// Reusable Project Card for Coding section
interface ProjectCardProps {
  title: string;
  description: string;
  techIcons: React.ReactNode[];
  githubUrl?: string;
  liveUrl?: string;
  delay: number;
}
const ProjectCard = ({ title, description, techIcons, githubUrl, liveUrl, delay }: ProjectCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.7, delay }}
    className="glass p-8 rounded-2xl flex flex-col h-full"
  >
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed mb-6 flex-grow">{description}</p>
    
    <div className="mb-6">
      <p className="text-sm font-medium text-gray-300 mb-2">Tech Stack:</p>
      <div className="flex items-center gap-4 text-gray-400 text-2xl">
        {techIcons.map((icon, index) => (
          <React.Fragment key={index}>{icon}</React.Fragment>
        ))}
      </div>
    </div>
    
    <div className="flex items-center gap-4 mt-auto">
      {githubUrl && (
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
        >
          <FaGithub /> GitHub
        </a>
      )}
      {liveUrl && (
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
        >
          <FaExternalLinkAlt /> Live Demo
        </a>
      )}
    </div>
  </motion.div>
);

export default function CodingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="pt-32 md:pt-40 pb-16 md:pb-20 text-center relative overflow-hidden"
      >
        {/* Unique Background Effect for this page */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[var(--accent-primary)]/20 to-transparent blur-3xl"
            animate={{ x: [-300, 0, -300], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--accent-primary)]/20 to-transparent blur-3xl"
            animate={{ x: [300, 0, 300], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 7.5 }}
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter mb-4">
                Coding
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
              Vibe coding my way through webapps, personal projects, and anything that sounds cool.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Projects Showcase Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Featured Projects</h2>
            <p className="text-lg text-gray-400 mt-2">A look at what I've been building.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProjectCard
              title="Personal Portfolio"
              description="The very site you're on now. A hub for my interests, built with a focus on modern design and fluid animations."
              techIcons={[<SiNextdotjs />, <SiTypescript />, <SiTailwindcss />, <SiFramer />]}
              githubUrl="https://github.com/yzRobo/yzrobo-portfolio"
              liveUrl="https://yzrobo.com"
              delay={0}
            />
            <ProjectCard
              title="Project Apex"
              description="A companion app for Apex Legends players to track stats, view leaderboards, and analyze their gameplay patterns."
              techIcons={[<SiNextdotjs />, <SiTypescript />, <SiTailwindcss />]}
              githubUrl="#"
              liveUrl="#"
              delay={0.1}
            />
            <ProjectCard
              title="Stream Tools"
              description="A custom suite of tools and overlays for my Twitch stream, including real-time alerts and interactive widgets."
              techIcons={[<FaCode />, <SiTypescript />]}
              githubUrl="#"
              delay={0.2}
            />
          </div>
        </div>
      </section>
    </div>
  );
}