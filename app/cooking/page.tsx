// app/cooking/page.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUtensils, 
  FaClock, 
  FaFire, 
  FaLeaf,
  FaPepperHot,
  FaHamburger,
  FaWineGlass,
  FaCookie
} from 'react-icons/fa';
import Navigation from '../components/Navigation';

// Recipe type definition
interface Recipe {
  id: string;
  slug: string;
  title: string;
  category: 'italian' | 'bbq' | 'experimental' | 'dessert';
  description: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  heroImage?: string | null;
  featured?: boolean;
  rating?: number;
  reviewCount?: number;
}

// Sample recipes data - this would come from your CMS/database later
const recipes: Recipe[] = [];

// Category configuration
const categories = [
  { id: 'all', name: 'All Recipes', icon: <FaUtensils /> },
  { id: 'italian', name: 'Italian', icon: <FaLeaf /> },
  { id: 'bbq', name: 'BBQ & Smoking', icon: <FaFire /> },
  { id: 'experimental', name: 'Experiments', icon: <FaPepperHot /> },
  { id: 'dessert', name: 'Desserts', icon: <FaCookie /> }
];

// Recipe Card Component
const RecipeCard = ({ recipe, index }: { recipe: Recipe; index: number }) => {
  const difficultyColors = {
    easy: 'text-green-400',
    medium: 'text-yellow-400',
    hard: 'text-red-400'
  };

  const categoryIcons = {
    italian: <FaLeaf />,
    bbq: <FaFire />,
    experimental: <FaPepperHot />,
    dessert: <FaCookie />
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group cursor-pointer"
    >
      <div className="relative h-full bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-[var(--accent-primary)]/50 transition-all duration-300">
        {/* Image placeholder */}
        <div className="aspect-[4/3] bg-gradient-to-br from-[var(--surface)] to-black/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <div className="absolute top-4 left-4 z-20 text-3xl text-white/80">
            {categoryIcons[recipe.category]}
          </div>
          {recipe.featured && (
            <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-[var(--accent-primary)] text-white text-xs font-bold rounded-full">
              FEATURED
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
            {recipe.title}
          </h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {recipe.description}
          </p>

          {/* Meta info */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <FaClock className="text-[var(--accent-primary)]" />
                {recipe.prepTime}
              </span>
              <span className="flex items-center gap-1">
                <FaFire className="text-[var(--accent-primary)]" />
                {recipe.cookTime}
              </span>
            </div>
            <span className={`font-medium ${difficultyColors[recipe.difficulty]}`}>
              {recipe.difficulty.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

// Filter Button Component
const FilterButton = ({ 
  category, 
  active, 
  onClick 
}: { 
  category: { id: string; name: string; icon: React.ReactNode };
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
    <span className="text-base">{category.icon}</span>
    <span>{category.name}</span>
  </motion.button>
);

export default function CookingPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchRecipes();
  }, [activeCategory]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/recipes?category=${activeCategory}&published=true`);
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = recipes;

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
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl opacity-60"></div>
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
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <FilterButton
                key={category.id}
                category={category}
                active={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-pulse text-2xl">Loading recipes...</div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                {filteredRecipes.map((recipe, index) => (
                  <RecipeCard key={recipe.id} recipe={recipe} index={index} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {!loading && filteredRecipes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <FaUtensils className="text-6xl text-gray-600 mx-auto mb-4" />
              <p className="text-xl text-gray-400">No recipes found in this category yet.</p>
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