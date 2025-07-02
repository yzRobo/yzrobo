// app/auto/[slug]/page.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaCaretDown } from 'react-icons/fa';
import Navigation from '../../components/Navigation';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';

// --- MOCK DATA ---
const vehicleData: { [key: string]: any } = {
  '2006-yamaha-r6': {
    name: '2006 Yamaha R6 50th Anniversary',
    category: 'Motorcycle',
    heroImage: '/media/auto/r6_hero.jpg',
    gallery: [
        '/media/auto/r6_gallery_1.jpg',
        '/media/auto/r6_gallery_2.jpg',
        '/media/auto/r6_gallery_3.jpg',
        '/media/auto/r6_gallery_4.jpg',
    ],
    specs: [
      { label: 'Engine', value: '599cc, liquid-cooled, 4-stroke, DOHC, forward-inclined parallel 4-cylinder, 16-titanium valves' },
      { label: 'Power', value: 'Approx. 127 hp (94.7 kW) @ 14,500 rpm' },
      { label: 'Torque', value: '44.7 lb-ft (60.6 Nm) @ 11,500 rpm' },
      { label: 'Final Drive', value: '520 Chain Conversion' },
      { label: 'Seat Height', value: '33.5 in (850 mm)' },
      { label: 'Wet Weight', value: 'Approx. 410 lbs (186 kg)' },
    ],
    modifications: [
      {
        category: 'Performance',
        items: [
          'Full Akrapovič Racing Exhaust (Titanium)',
          'Dynojet Power Commander V',
          'Graves Smog Block Off Plates',
          'Custom Dyno Tune by EDR Performance',
        ],
      },
      {
        category: 'Chassis & Brakes',
        items: [
          'Spiegler Steel Braided Brake Lines (Front & Rear)',
          'EBC HH Sintered Brake Pads',
          'Vortex Rearsets',
        ],
      },
      {
        category: 'Aesthetics & Ergonomics',
        items: [
          'Puig Double Bubble Windscreen',
          'CRG RC2 Shorty Levers',
          'TST Industries Integrated Tail Light',
          'Flushmount Front Turn Signals',
        ],
      },
    ],
    story: [
      "The 2006 Yamaha R6 was a game-changer. It was one of the first production bikes to feature a ride-by-wire throttle (YCC-T) and a slipper clutch, technologies straight from MotoGP. This 50th Anniversary edition, with its iconic Kenny Roberts-inspired yellow and black 'bumblebee' livery, is a tribute to Yamaha's racing heritage.",
      "I've owned this bike the longest out of any vehicle, and it's been an incredible journey of learning and evolution. It started as my primary street bike and slowly transformed into a dedicated track machine. Every modification has been carefully chosen to enhance its performance on the circuit, from the full exhaust system to the fine-tuned suspension. It's a bike that demands respect and rewards precision, and it's taught me more about riding dynamics than any other machine."
    ],
  },
  '2014-yamaha-mt09': { name: '2014 Yamaha MT-09', category: 'Motorcycle', story: ["Coming soon."] },
  '2018-yamaha-mt07': { name: '2018 Yamaha MT-07', category: 'Motorcycle', story: ["Coming soon."] },
  '2000-yamaha-yz250': { name: '2000 Yamaha YZ250', category: 'Motorcycle', story: ["Coming soon."] },
  '1992-ford-f150': { name: '1992 Ford F-150 XLT', category: 'OBS Truck', story: ["Coming soon."] },
};

// --- REUSABLE COMPONENTS ---

const SpecItem = ({ label, value }: { label: string, value: string }) => (
  <div className="py-3 border-b border-white/10">
    <dt className="text-sm text-gray-400">{label}</dt>
    <dd className="text-base text-white mt-1">{value}</dd>
  </div>
);

const ModSection = ({ category, items }: { category: string, items: string[] }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="py-4 border-b border-white/10">
            <button className="w-full flex justify-between items-center text-left" onClick={() => setIsOpen(!isOpen)}>
                <h4 className="text-lg font-semibold text-[var(--accent-primary)]">{category}</h4>
                <FaCaretDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <ul className="mt-3 pl-4 space-y-2 list-disc list-outside text-gray-300">
                        {items.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---

export default function VehicleDetailPage() {
  const params = useParams<{ slug: string }>();
  const vehicle = vehicleData[params.slug];
  const [activeImage, setActiveImage] = useState(vehicle?.gallery?.[0] || vehicle?.heroImage);

  if (!vehicle) {
    notFound();
  }

  const hasContent = vehicle.specs || vehicle.modifications;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <section
          className="relative pt-32 pb-12 md:pt-40 md:pb-16 text-center bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,1) 100%), url(${activeImage || vehicle.heroImage})` }}
        >
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <Link href="/auto" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group">
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                Back to The Garage
              </Link>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-2 text-white" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                {vehicle.name}
              </h1>
              <p className="text-lg text-gray-300">{vehicle.category}</p>
            </motion.div>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">

              {hasContent && (
                 <div className="lg:col-span-2 lg:sticky top-28 self-start">
                    <motion.div initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }} transition={{delay: 0.4}}>
                        <div className="aspect-video rounded-xl overflow-hidden bg-[var(--surface)] mb-4">
                            <img src={activeImage} alt={`Main view of ${vehicle.name}`} className="w-full h-full object-cover" />
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {vehicle.gallery?.map((img: string, i: number) => (
                                <button key={i} onClick={() => setActiveImage(img)} className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${activeImage === img ? 'border-[var(--accent-primary)]' : 'border-transparent hover:border-white/50'}`}>
                                    <img src={img} alt={`Thumbnail ${i+1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                 </div>
              )}
             
              <div className={hasContent ? "lg:col-span-3" : "lg:col-span-5"}>
                {vehicle.story && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{delay: 0.5}}>
                        <h3 className="text-3xl font-bold mb-4 tracking-tight">The Story</h3>
                        <div className="prose prose-invert max-w-none text-gray-300 space-y-4">
                            {vehicle.story.map((paragraph: string, i: number) => <p key={i}>{paragraph}</p>)}
                        </div>
                    </motion.div>
                )}

                {hasContent && (
                  <>
                    <div className="border-t border-white/10 my-10" />

                    {vehicle.specs && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{delay: 0.6}}>
                          <h3 className="text-3xl font-bold mb-4 tracking-tight">Specifications</h3>
                          <dl>
                              {vehicle.specs.map((spec: any) => <SpecItem key={spec.label} label={spec.label} value={spec.value} />)}
                          </dl>
                      </motion.div>
                    )}

                    <div className="border-t border-white/10 my-10" />

                    {vehicle.modifications && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{delay: 0.7}}>
                            <h3 className="text-3xl font-bold mb-4 tracking-tight">Modifications</h3>
                            <div className="space-y-2">
                                {vehicle.modifications.map((mod: any) => <ModSection key={mod.category} category={mod.category} items={mod.items} />)}
                            </div>
                        </motion.div>
                    )}
                  </>
                )}

              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}