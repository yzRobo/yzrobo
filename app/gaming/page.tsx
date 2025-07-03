// app/gaming/page.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaTwitch, FaYoutube, FaDiscord, FaImage } from 'react-icons/fa';
import Navigation from '../components/Navigation';

// A placeholder component for images
const ImagePlaceholder = ({ className }: { className?: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5 }}
    className={`aspect-video bg-[var(--surface)] border border-[var(--border)] rounded-lg flex items-center justify-center ${className}`}
  >
    <FaImage className="text-gray-600 text-4xl" />
  </motion.div>
);

// A reusable card for featured content
interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  linkText: string;
}
const Feature = ({ icon, title, description, link, linkText }: FeatureProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.6 }}
    className="glass p-8 rounded-2xl flex flex-col text-center items-center"
  >
    <div className="text-4xl text-[var(--accent-primary)] mb-4">{icon}</div>
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <p className="text-gray-400 mb-6 flex-grow">{description}</p>
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-[var(--accent-primary)] text-white font-medium py-2 px-6 rounded-full hover:bg-opacity-80 transition-colors"
    >
      {linkText}
    </a>
  </motion.div>
);

export default function GamingPage() {
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--accent-primary)]/20 rounded-full blur-3xl animate-pulse-slow" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter mb-4">
            Gaming
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
            Dodging the 4-3 linear turrets of Apex and sharing tips for stream improvements.
          </p>
        </div>
      </motion.section>

      {/* Featured Content Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature
              icon={<FaTwitch />}
              title="Live on Twitch"
              description="Catch me live for Apex movement, cooking streams, IRL projects, and general shenanigans."
              link="https://twitch.tv/yzRobo"
              linkText="Follow on Twitch"
            />
            <Feature
              icon={<FaYoutube />}
              title="YouTube Content"
              description="Find stream highlights, curated gameplay videos, and in-depth tutorials on my YouTube channels."
              link="https://youtube.com/@yzRoboGaming"
              linkText="Subscribe"
            />
            <Feature
              icon={<FaDiscord />}
              title="Join the Community"
              description="Connect with other members of the community, get stream notifications, and chat directly in our official Discord server."
              link="https://discord.gg/thepadcast"
              linkText="Join Discord"
            />
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Hardware</h2>
            <p className="text-lg text-gray-400 mt-2">A glimpse into the hardware and games that power the stream.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <ImagePlaceholder />
            <ImagePlaceholder className="lg:col-span-2" />
            <ImagePlaceholder className="lg:col-span-2" />
            <ImagePlaceholder />
            <ImagePlaceholder />
            <ImagePlaceholder />
          </div>
        </div>
      </section>
    </div>
  );
}