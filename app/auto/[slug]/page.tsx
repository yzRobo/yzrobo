// app/auto/[slug]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaCaretDown, FaCalendarAlt, FaTag, FaClock } from 'react-icons/fa';
import Navigation from '../../components/Navigation';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

// Type definitions (inline for now)
interface VehicleTag {
  id: string;
  name: string;
  slug: string;
}

interface VehicleBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  heroImage?: string | null;
  heroImageAlt?: string | null;
  published: boolean;
  featured: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  vehicleId: string;
  tags?: VehicleTag[];
}

interface Modification {
  id: string;
  category: string;
  items: string[];
  order: number;
  vehicleId: string;
}

interface Spec {
  id: string;
  label: string;
  value: string;
  order: number;
  vehicleId: string;
}

interface Vehicle {
  id: string;
  slug: string;
  name: string;
  category: string;
  heroImage?: string | null;
  gallery?: string[];
  story?: string[];
  createdAt: Date;
  updatedAt: Date;
  modifications?: Modification[];
  specs?: Spec[];
  blogPosts?: VehicleBlogPost[];
}

// Spec Item Component
const SpecItem = ({ label, value }: { label: string, value: string }) => (
  <div className="py-3 border-b border-white/10">
    <dt className="text-sm text-gray-400">{label}</dt>
    <dd className="text-base text-white mt-1">{value}</dd>
  </div>
);

// Modification Section Component
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

// Blog Post Card Component
const BlogPostCard = ({ post, vehicleSlug }: { post: VehicleBlogPost; vehicleSlug: string }) => {
  const getRelativeTime = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffInMs = now.getTime() - d.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  return (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="group cursor-pointer"
  >
    <Link href={`/auto/${vehicleSlug}/${post.slug}`}>
      <div className="relative h-full bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-[var(--accent-primary)]/50 transition-all duration-300">
        {post.heroImage && (
          <div className="relative aspect-[16/9] bg-gradient-to-br from-[var(--surface)] to-black/50 overflow-hidden">
            <img
              src={post.heroImage}
              alt={post.heroImageAlt || post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
            {post.featured && (
              <div className="absolute top-4 right-4 px-3 py-1 bg-[var(--accent-primary)] text-white text-xs font-bold rounded-full">
                FEATURED
              </div>
            )}
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <FaCalendarAlt />
            <time>{getRelativeTime(post.publishedAt || post.createdAt)}</time>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-[var(--accent-primary)] transition-colors">
            {post.title}
          </h3>
          
          {post.excerpt && (
            <p className="text-gray-400 text-sm mb-4 line-clamp-3">
              {post.excerpt}
            </p>
          )}
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 bg-white/5 rounded-full text-xs text-gray-400 flex items-center gap-1"
                >
                  <FaTag className="text-[0.6rem]" />
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  </motion.article>
  );
};

export default function VehicleDetailPage() {
  const params = useParams<{ slug: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [blogPosts, setBlogPosts] = useState<VehicleBlogPost[]>([]);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'blog'>('overview');

  useEffect(() => {
    fetchVehicleData();
  }, [params.slug]);

  const fetchVehicleData = async () => {
    try {
      setLoading(true);
      
      // Fetch vehicle data
      const vehicleRes = await fetch(`/api/vehicles/${params.slug}`);
      if (!vehicleRes.ok) {
        notFound();
        return;
      }
      const vehicleData = await vehicleRes.json();
      setVehicle(vehicleData);
      setActiveImage(vehicleData.gallery?.[0] || vehicleData.heroImage);
      
      // Fetch blog posts
      const postsRes = await fetch(`/api/vehicles/${params.slug}/posts?published=true`);
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setBlogPosts(postsData);
      }
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
      notFound();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-pulse text-2xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    notFound();
  }

  const hasSpecs = vehicle.specs && vehicle.specs.length > 0;
  const hasMods = vehicle.modifications && vehicle.modifications.length > 0;
  const hasContent = hasSpecs || hasMods;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Hero Section */}
        <section
          className="relative pt-32 pb-12 md:pt-40 md:pb-16 text-center bg-cover bg-center"
          style={{ 
            backgroundImage: `linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,1) 100%), url(${activeImage || vehicle.heroImage})` 
          }}
        >
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <Link 
                href="/auto" 
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
              >
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                Back to The Garage
              </Link>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-2 text-white" 
                  style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                {vehicle.name}
              </h1>
              <p className="text-lg text-gray-300">{vehicle.category}</p>
            </motion.div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="sticky top-[88px] z-20 bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="container mx-auto px-6">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 font-medium transition-colors relative ${
                  activeTab === 'overview' 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Overview
                {activeTab === 'overview' && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)]" 
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('blog')}
                className={`py-4 font-medium transition-colors relative ${
                  activeTab === 'blog' 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Blog Posts ({blogPosts.length})
                {activeTab === 'blog' && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)]" 
                  />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-6 max-w-7xl">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' ? (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid lg:grid-cols-5 gap-12 lg:gap-16"
                >
                  {/* Gallery */}
                  {hasContent && vehicle.gallery && vehicle.gallery.length > 0 && (
                    <div className="lg:col-span-2 lg:sticky top-32 self-start">
                      <motion.div initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }} transition={{delay: 0.4}}>
                        <div className="aspect-video rounded-xl overflow-hidden bg-[var(--surface)] mb-4">
                          <img 
                            src={activeImage || ''} 
                            alt={`Main view of ${vehicle.name}`} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {vehicle.gallery.map((img: string, i: number) => (
                            <button 
                              key={i} 
                              onClick={() => setActiveImage(img)} 
                              className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                                activeImage === img 
                                  ? 'border-[var(--accent-primary)]' 
                                  : 'border-transparent hover:border-white/50'
                              }`}
                            >
                              <img 
                                src={img} 
                                alt={`Thumbnail ${i+1}`} 
                                className="w-full h-full object-cover" 
                              />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  )}
                 
                  {/* Details */}
                  <div className={hasContent ? "lg:col-span-3" : "lg:col-span-5"}>
                    {vehicle.story && vehicle.story.length > 0 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{delay: 0.5}}>
                        <h3 className="text-3xl font-bold mb-4 tracking-tight">The Story</h3>
                        <div className="prose prose-invert max-w-none text-gray-300 space-y-4">
                          {vehicle.story.map((paragraph: string, i: number) => (
                            <ReactMarkdown key={i}>{paragraph}</ReactMarkdown>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {hasContent && (
                      <>
                        {vehicle.story && <div className="border-t border-white/10 my-10" />}

                        {hasSpecs && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{delay: 0.6}}>
                            <h3 className="text-3xl font-bold mb-4 tracking-tight">Specifications</h3>
                            <dl>
                              {vehicle.specs!.map((spec: Spec) => (
                                <SpecItem key={spec.id} label={spec.label} value={spec.value} />
                              ))}
                            </dl>
                          </motion.div>
                        )}

                        {hasMods && (
                          <>
                            <div className="border-t border-white/10 my-10" />
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{delay: 0.7}}>
                              <h3 className="text-3xl font-bold mb-4 tracking-tight">Modifications</h3>
                              <div className="space-y-2">
                                {vehicle.modifications!.map((mod: Modification) => (
                                  <ModSection key={mod.id} category={mod.category} items={mod.items} />
                                ))}
                              </div>
                            </motion.div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="blog"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {blogPosts.length === 0 ? (
                    <div className="text-center py-20">
                      <p className="text-xl text-gray-400">No blog posts yet for this vehicle.</p>
                      <p className="text-gray-500 mt-2">Check back soon for updates!</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {blogPosts.map((post) => (
                        <BlogPostCard key={post.id} post={post} vehicleSlug={vehicle.slug} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </motion.div>
    </div>
  );
}