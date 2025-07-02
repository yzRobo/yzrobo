'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUtensils, 
  FaFire, 
  FaLeaf,
  FaPepperHot,
  FaCookie,
  FaDrumstickBite,
  FaConciergeBell,
  FaTag,
  FaExclamationTriangle
} from 'react-icons/fa';
import { MdOutdoorGrill, MdLocalPizza } from "react-icons/md";
import { FaBowlRice } from "react-icons/fa6";
import Navigation from '../components/Navigation';
import RecipeCard from '../components/RecipeCard';
import RecipeSearch from '../components/RecipeSearch';
import { RecipeGridSkeleton } from '../components/LoadingStates';
import ErrorBoundary from '../components/ErrorBoundary';
import { Recipe, Tag } from '@/types/recipe';

// Helper to get an icon for a tag
const getTagIcon = (slug: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'main': <FaDrumstickBite />, 'main-course': <FaDrumstickBite />,
      'appetizer': <FaConciergeBell />, 'appetizers': <FaConciergeBell />,
      'side': <FaLeaf />, 'side-dish': <FaLeaf />,
      'italian': <MdLocalPizza />,
      'grilled': <MdOutdoorGrill />,
      'bbq': <FaFire />, 'bbq-smoking': <FaFire />,
      'rice': <FaBowlRice /> ,
      'experimental': <FaPepperHot />,
      'dessert': <FaCookie />, 'desserts': <FaCookie />,
    };
    return iconMap[slug] || <FaTag />;
  };
  

// Filter Button Component
const FilterButton = ({ 
  tag, 
  active, 
  onClick 
}: { 
  tag: { slug: string; name: string; icon: React.ReactNode };
  active: boolean;
  onClick: () => void;
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
      active
        ? 'bg-[var(--accent-primary)] text-white'
        : 'bg-[var(--surface)] text-gray-400 hover:bg-white/10 hover:text-white border border-[var(--border)]'
    }`}
  >
    <span className="text-base">{tag.icon}</span>
    <span>{tag.name}</span>
  </motion.button>
);

// Error State Component
const ErrorState = ({ error, retry }: { error: string; retry: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-20"
  >
    <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
    <p className="text-xl text-gray-400 mb-2">Oops! Something went wrong</p>
    <p className="text-gray-500 mb-6">{error}</p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={retry}
      className="px-6 py-3 bg-[var(--accent-primary)] rounded-full font-medium"
    >
      Try Again
    </motion.button>
  </motion.div>
);

function CookingPageContent() {
  const [activeTagSlug, setActiveTagSlug] = useState('all');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all available tags once on component mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tags');
        if (!response.ok) {
          throw new Error('Failed to load tags');
        }
        const data = await response.json();
        setAvailableTags(data);
      } catch (error) {
        console.error('Error fetching tags:', error);
        // Don't show error for tags, just log it
      }
    };
    fetchTags();
  }, []);

  // Fetch recipes whenever the active tag changes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/recipes?tag=${activeTagSlug}&published=true`);
        
        if (!response.ok) {
          throw new Error('Failed to load recipes');
        }
        
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setError('Unable to load recipes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [activeTagSlug]);

  const filterButtons = [
    { slug: 'all', name: 'All Recipes', icon: <FaUtensils /> },
    ...availableTags.map(tag => ({ ...tag, icon: getTagIcon(tag.slug) }))
  ];

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Trigger re-fetch by updating the tag
    const currentTag = activeTagSlug;
    setActiveTagSlug('');
    setTimeout(() => setActiveTagSlug(currentTag), 0);
  };

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
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--accent-primary)]/30 rounded-full blur-3xl opacity-60 animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--accent-primary)]/20 rounded-full blur-3xl opacity-60 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-primary)]/10 rounded-full blur-3xl opacity-40 animate-float"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter mb-4"
          >
            The Kitchen
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto"
          >
            From traditional Italian recipes passed down through generations to experimental BBQ techniques. 
            This is where tradition meets innovation.
          </motion.p>
        </div>
      </motion.section>

      {/* Filter Section */}
      <section className="py-8 border-y border-white/5 sticky top-[88px] z-30 bg-black/80 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-wrap gap-3 justify-center">
              {filterButtons.map((tag) => (
                <FilterButton
                  key={tag.slug}
                  tag={tag}
                  active={activeTagSlug === tag.slug}
                  onClick={() => setActiveTagSlug(tag.slug)}
                />
              ))}
            </div>
            {/* Search button - visible on all screen sizes */}
            <div className="flex-shrink-0">
              <RecipeSearch />
            </div>
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          {error ? (
            <ErrorState error={error} retry={handleRetry} />
          ) : loading ? (
            <RecipeGridSkeleton count={6} />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTagSlug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                {recipes.map((recipe, index) => (
                  <RecipeCard key={recipe.id} recipe={recipe} index={index} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {!loading && !error && recipes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <FaUtensils className="text-6xl text-gray-600 mx-auto mb-4" />
              <p className="text-xl text-gray-400">No recipes found with this tag yet.</p>
              <p className="text-gray-500 mt-2">Check back soon for new additions!</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-20 border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Want to Cook Along?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join me on stream for live cooking sessions, recipe development, and culinary experiments. 
              Sometimes we nail it, sometimes we learn - but it's always fun.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="https://twitch.tv/yzRobo"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-8 py-3 bg-[var(--accent-primary)] text-white font-bold rounded-full"
              >
                Watch Live Cooking
              </motion.a>
              <motion.a
                href="/links"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-8 py-3 bg-white/10 backdrop-blur-sm text-white font-bold rounded-full border border-white/20 hover:bg-white/20 transition-colors"
              >
                Follow for Updates
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default function CookingPage() {
  return (
    <ErrorBoundary>
      <CookingPageContent />
    </ErrorBoundary>
  );
}