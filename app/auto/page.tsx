// app/auto/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCar, FaTools, FaCalendarAlt, FaTruckPickup } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Link from 'next/link';
import type { VehicleBlogPost } from '@/types/vehicle';

// --- NEW COMPONENT for the Featured Post ---
const FeaturedPostCard = ({ post }: { post: VehicleBlogPost }) => {
  // This guard clause is good practice, even if the API should always provide the vehicle
  if (!post.vehicle) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      className="group"
    >
      <Link href={`/auto/${post.vehicle.slug}/${post.slug}`}>
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden grid md:grid-cols-2 lg:grid-cols-5 gap-0 group-hover:border-[var(--accent-primary)]/50 transition-colors">
          <div className="lg:col-span-3">
            {post.heroImage ? (
              <img
                src={post.heroImage}
                alt={post.heroImageAlt || post.title}
                className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-64 md:h-full bg-white/5 flex items-center justify-center">
                <FaCar className="text-5xl text-gray-700" />
              </div>
            )}
          </div>
          <div className="lg:col-span-2 p-8 flex flex-col justify-center">
            <p className="text-sm text-[var(--accent-primary)] font-bold uppercase tracking-wider mb-2">
              {post.vehicle.name}
            </p>
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              {post.title}
            </h3>
            <p className="text-gray-400 text-sm mb-6 line-clamp-3">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-2">
                    <FaCalendarAlt />
                    <time dateTime={new Date(post.publishedAt || post.createdAt).toISOString()}>
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </time>
                </span>
                <span className="font-semibold text-[var(--accent-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                  Read More →
                </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};


// Static vehicle data for the category sections
const vehicles = [
  { slug: '2006-yamaha-r6', name: '2006 Yamaha R6 50th Anniversary', category: 'Motorcycle', description: "Yamaha's iconic track weapon. The bike I've owned the longest.", icon: '/media/icons/sportbike.svg' },
  { slug: '2014-yamaha-mt09', name: '2014 Yamaha MT-09', category: 'Motorcycle', description: 'The original master of torque. Raw, aggressive, and incredibly fun.', icon: '/media/icons/sportbike.svg' },
  { slug: '2018-yamaha-mt07', name: '2018 Yamaha MT-07', category: 'Motorcycle', description: <>The hyper-naked that balances performance and "<em>streetability</em>" perfectly.</>, icon: '/media/icons/sportbike.svg' },
  { slug: '2000-yamaha-yz250', name: '2000 Yamaha YZ250', category: 'Motorcycle', description: 'A classic two-stroke motocross bike. Pure, unfiltered off-road power. And it smells so good.', icon: '/media/icons/dirtbike.svg' },
  { slug: '1992-ford-f150', name: '1992 Ford F-150 XLT', category: 'OBS Truck', description: 'Super Cab with the 5.8L V8. A classic OBS Ford in the making.', icon: <FaTruckPickup /> },
];

// Reusable Vehicle Card Component
interface VehicleCardProps {
  icon: React.ReactNode | string;
  title: string;
  description: React.ReactNode;
  delay: number;
  href?: string;
  isPlaceholder?: boolean;
}
const VehicleCard = ({ icon, title, description, delay, href, isPlaceholder = false }: VehicleCardProps) => {
  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, delay }}
      className={`group bg-black/20 backdrop-blur-sm p-8 rounded-2xl border border-white/10 text-center h-full flex flex-col ${isPlaceholder ? 'opacity-60' : 'hover:border-[var(--accent-primary)] transition-colors'}`}
    >
      <div className={`h-14 w-14 mx-auto mb-5 flex items-center justify-center`}>
        {typeof icon === 'string' ? (
          <img src={icon} alt={`${title} icon`} className="h-full w-full filter-white" />
        ) : (
          <div className={`text-5xl ${isPlaceholder ? 'text-gray-500' : 'text-[var(--accent-primary)]'}`}>{icon}</div>
        )}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed flex-grow">{description}</p>
      {!isPlaceholder && (
        <div className="text-sm mt-6 text-[var(--accent-primary)] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Read More →</div>
      )}
    </motion.div>
  );

  return isPlaceholder || !href ? (
    cardContent
  ) : (
    <Link href={href} className="no-underline h-full">
      {cardContent}
    </Link>
  );
};


export default function AutoPage() {
  const motorcycles = vehicles.filter(v => v.category === 'Motorcycle');
  const trucks = vehicles.filter(v => v.category === 'OBS Truck');
  const [latestPost, setLatestPost] = useState<VehicleBlogPost | null>(null);

  useEffect(() => {
    const fetchLatestPost = async () => {
      try {
        const res = await fetch('/api/posts/latest');
        if (res.ok) {
          const postData = await res.json();
          if (postData) {
            setLatestPost(postData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch latest post:", error);
      }
    };
    fetchLatestPost();
  }, []);
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
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
             A passion for anything with an engine. Explore project builds, motovlogs, and learning as we go.
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

      {/* --- Featured Post Section --- */}
      {latestPost && (
        <section className="py-16 md:py-20 border-y border-white/10">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Latest Blog</h2>
                </div>
                <FeaturedPostCard post={latestPost} />
            </div>
        </section>
      )}

      <section className="py-16 md:py-20 space-y-20">
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Motorcycles</h2>
            <p className="text-lg text-gray-400 mt-2">From street to dirt, I love them all.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {motorcycles.map((vehicle, index) => (
              <VehicleCard
                key={vehicle.name}
                icon={vehicle.icon}
                title={vehicle.name}
                description={vehicle.description}
                delay={index * 0.1}
                href={`/auto/${vehicle.slug}`}
              />
            ))}
          </div>
        </div>
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Cars</h2>
            <p className="text-lg text-gray-400 mt-2">Future projects and builds.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
             <div className="md:col-start-2 lg:col-start-2 lg:col-span-2">
                 <VehicleCard
                  icon={<FaTools />}
                  title="Future Car Projects"
                  description="Rotary powered vehicles! Working on acquiring an FD RX-7 for a weekend cruiser, and an RX-8 as a track weapon. "
                  delay={0}
                  isPlaceholder={true}
                />
             </div>
          </div>
        </div>

        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">OBS Trucks</h2>
            <p className="text-lg text-gray-400 mt-2">Bringing classics back to life.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
            {trucks.map((vehicle, index) => (
               <div key={vehicle.name} className="md:col-start-2 lg:col-start-2 lg:col-span-2">
                <VehicleCard
                  icon={vehicle.icon}
                  title={vehicle.name}
                  description={vehicle.description}
                  delay={index * 0.1}
                  href={`/auto/${vehicle.slug}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}