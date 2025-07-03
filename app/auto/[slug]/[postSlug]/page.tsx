// app/auto/[slug]/[postSlug]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCalendarAlt, FaTag, FaClock, FaShare, FaPrint } from 'react-icons/fa';
import Navigation from '../../../components/Navigation';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

// Type definitions
interface VehicleTag {
  id: string;
  name: string;
  slug: string;
}

interface Vehicle {
  id: string;
  slug: string;
  name: string;
  category: string;
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
  vehicle?: Vehicle;
  tags?: VehicleTag[];
}

export default function VehicleBlogPostPage() {
  const params = useParams<{ slug: string; postSlug: string }>();
  const [post, setPost] = useState<VehicleBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    fetchPost();
  }, [params.slug, params.postSlug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/vehicles/${params.slug}/posts/${params.postSlug}`);
      
      if (!response.ok) {
        notFound();
        return;
      }
      
      const data = await response.json();
      setPost(data);
      
      // Calculate reading time
      const wordsPerMinute = 200;
      const words = data.content.split(/\s+/).length;
      setReadingTime(Math.ceil(words / wordsPerMinute));
    } catch (error) {
      console.error('Error fetching post:', error);
      notFound();
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!post) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt || '',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  const handlePrint = () => {
    window.print();
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

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-16">
        {post.heroImage && (
          <div className="absolute inset-0 z-0">
            <img 
              src={post.heroImage} 
              alt={post.heroImageAlt || post.title}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black" />
          </div>
        )}
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
              <Link href="/auto" className="hover:text-white transition-colors">
                The Garage
              </Link>
              <span>/</span>
              <Link 
                href={`/auto/${params.slug}`} 
                className="hover:text-white transition-colors"
              >
                {post.vehicle?.name || 'Vehicle'}
              </Link>
              <span>/</span>
              <span className="text-white">Blog</span>
            </div>

            {/* Title and Meta */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{post.title}</h1>
            
            {post.excerpt && (
              <p className="text-xl text-gray-300 mb-6">{post.excerpt}</p>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8">
              <div className="flex items-center gap-2">
                <FaCalendarAlt />
                <time>
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <FaClock />
                <span>{readingTime} min read</span>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <FaTag />
                  <div className="flex gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag.id} className="text-[var(--accent-primary)]">
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium hover:bg-white/20 transition-colors"
              >
                <FaShare />
                <span className="hidden sm:inline">Share</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium hover:bg-white/20 transition-colors"
              >
                <FaPrint />
                <span className="hidden sm:inline">Print</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hero Image */}
      {post.heroImage && (
        <section className="container mx-auto px-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src={post.heroImage}
              alt={post.heroImageAlt || post.title}
              className="w-full aspect-video object-cover"
            />
          </motion.div>
        </section>
      )}

      {/* Content */}
      <section className="container mx-auto px-6 pb-20">
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-4xl font-bold mt-12 mb-6">{children}</h1>,
                h2: ({ children }) => <h2 className="text-3xl font-bold mt-10 mb-4">{children}</h2>,
                h3: ({ children }) => <h3 className="text-2xl font-bold mt-8 mb-3">{children}</h3>,
                p: ({ children }) => <p className="mb-6 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="mb-6 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="mb-6 space-y-2">{children}</ol>,
                li: ({ children }) => <li className="ml-6">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-[var(--accent-primary)] pl-6 my-8 italic text-gray-300">
                    {children}
                  </blockquote>
                ),
                code: ({ inline, children }) => 
                  inline ? (
                    <code className="px-1.5 py-0.5 bg-white/10 rounded text-sm">{children}</code>
                  ) : (
                    <code className="block p-4 bg-white/5 rounded-lg overflow-x-auto text-sm">{children}</code>
                  ),
                img: ({ src, alt }) => (
                  <figure className="my-8">
                    <img 
                      src={src} 
                      alt={alt} 
                      className="w-full rounded-lg shadow-xl"
                    />
                    {alt && (
                      <figcaption className="text-center text-sm text-gray-400 mt-3">
                        {alt}
                      </figcaption>
                    )}
                  </figure>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </motion.article>
      </section>

      {/* Bottom Navigation */}
      <section className="border-t border-white/10">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <Link 
              href={`/auto/${params.slug}`}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Back to {post.vehicle?.name || 'Vehicle'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}