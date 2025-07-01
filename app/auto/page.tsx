// app/auto/page.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaCar, FaWrench, FaTools } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Link from 'next/link';

// Using the paths to your local SVG files
const vehicles = [
  { slug: '2006-yamaha-r6', name: '2006 Yamaha R6 50th Anniversary', category: 'Motorcycle', description: "Yamaha's iconic track weapon. The bike I've owned the longest.", icon: '/media/icons/sportbike.svg' },
  { slug: '2014-yamaha-mt09', name: '2014 Yamaha MT-09', category: 'Motorcycle', description: 'The original master of torque. Raw, aggressive, and incredibly fun.', icon: '/media/icons/sportbike.svg' },
  { slug: '2018-yamaha-mt07', name: '2018 Yamaha MT-07', category: 'Motorcycle', description: 'The hyper-naked that balances performance and "streetability" perfectly.', icon: '/media/icons/sportbike.svg' },
  { slug: '2000-yamaha-yz250', name: '2000 Yamaha YZ250', category: 'Motorcycle', description: 'A classic two-stroke motocross bike. Pure, unfiltered off-road power. And it smells so good.', icon: '/media/icons/dirtbike.svg' },
  { slug: '1992-ford-f150', name: '1992 Ford F-150 XLT', category: 'OBS Truck', description: 'Super Cab with the 5.8L V8. A classic OBS Ford in the making.', icon: <FaWrench /> },
];

// Reusable Vehicle Card Component
interface VehicleCardProps {
  icon: React.ReactNode | string; // The icon can be a component OR a string path
  title: string;
  description: string;
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
        {/* This logic correctly handles both your custom SVGs and the react-icons */}
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
             A passion for anything with an engine. Explore project builds, motovlogs, and the learning as we go.
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