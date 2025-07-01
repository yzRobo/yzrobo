// app/auto/page.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaMotorcycle, FaCar, FaWrench, FaImage } from 'react-icons/fa';
import Navigation from '../components/Navigation';

// Reusable Image Placeholder
const ImagePlaceholder = ({ className }: { className?: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.5 }}
    className={`aspect-[4/3] bg-[var(--surface)] border border-[var(--border)] rounded-lg flex items-center justify-center ${className}`}
  >
    <FaImage className="text-gray-600 text-4xl" />
  </motion.div>
);

// Reusable Project Card
interface ProjectCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}
const ProjectCard = ({ icon, title, description, delay }: ProjectCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.7, delay }}
    className="bg-black/20 backdrop-blur-sm p-8 rounded-2xl border border-white/10 text-center"
  >
    <div className="text-5xl text-[var(--accent-primary)] mb-5 inline-block">{icon}</div>
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </motion.div>
);

export default function AutoPage() {
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
        <div className="absolute inset-0 z-0">
            <div className="absolute -top-16 -left-32 w-96 h-96 bg-[var(--accent-primary)]/25 rounded-full blur-3xl opacity-60 animate-pulse-slow"></div>
            <div className="absolute -bottom-32 -right-16 w-96 h-96 bg-[var(--accent-primary)]/20 rounded-full blur-3xl opacity-60"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter mb-4">
            The Garage
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
            A passion for anything with an engine. Explore project builds, motovlogs, and the art of tinkering.
          </p>
          <motion.a 
            href="https://youtube.com/@yzRobo"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block mt-8 px-8 py-3 bg-[var(--accent-primary)] text-white font-bold rounded-full"
          >
            Watch on YouTube
          </motion.a>
        </div>
      </motion.section>

      {/* Projects Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Current Projects</h2>
            <p className="text-lg text-gray-400 mt-2">What's currently in the build queue or on the road.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ProjectCard
              icon={<FaMotorcycle />}
              title="Motorcycles"
              description="From sport bikes to cruisers. Maintenance, modifications, and motovlogging adventures."
              delay={0}
            />
            <ProjectCard
              icon={<FaCar />}
              title="Cars"
              description="Performance tuning, cosmetic upgrades, and the occasional track day with four-wheeled machines."
              delay={0.1}
            />
            <ProjectCard
              icon={<FaWrench />}
              title="OBS Trucks"
              description="A special love for old body style trucks. Restorations, engine swaps, and bringing classics back to life."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 md:py-20 bg-[var(--surface)]/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Gallery</h2>
            <p className="text-lg text-gray-400 mt-2">Snapshots from the garage and the open road.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <ImagePlaceholder className="md:col-span-2" />
            <ImagePlaceholder />
            <ImagePlaceholder />
            <ImagePlaceholder />
            <ImagePlaceholder />
            <ImagePlaceholder className="md:col-span-2" />
          </div>
        </div>
      </section>
    </div>
  );
}