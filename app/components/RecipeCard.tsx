// app/components/RecipeCard.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaClock, FaFire, FaUsers, FaStar } from 'react-icons/fa';
import { Recipe } from '@/types/recipe';
import { getDifficultyColor, getCategoryIcon } from '@/lib/recipes';

interface RecipeCardProps {
  recipe: Recipe;
  index?: number;
  featured?: boolean;
}

export default function RecipeCard({ recipe, index = 0, featured = false }: RecipeCardProps) {
  const router = useRouter();
  
  // Debug log
  console.log('Recipe rating:', recipe.rating, 'Type:', typeof recipe.rating);
  
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1]
      }
    }
  };

  const handleClick = () => {
    console.log('Card clicked!', recipe.slug);
    router.push(`/cooking/${recipe.slug}`);
  };

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`group cursor-pointer ${featured ? 'md:col-span-2 lg:col-span-1' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <div className="relative h-full bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-[var(--accent-primary)]/50 transition-all duration-300">
          {/* Image section */}
          <div className="relative aspect-[4/3] bg-gradient-to-br from-[var(--surface)] to-black/50 overflow-hidden">
            {recipe.heroImage ? (
              <img
                src={recipe.heroImage}
                alt={recipe.heroImageAlt || recipe.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">
                {getCategoryIcon(recipe.category)}
              </div>
            )}
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Category badge */}
            <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs font-medium text-white capitalize">
              {recipe.category}
            </div>
            
            {/* Featured badge */}
            {recipe.featured && (
              <div className="absolute top-4 right-4 px-3 py-1 bg-[var(--accent-primary)] text-white text-xs font-bold rounded-full">
                FEATURED
              </div>
            )}
            
            {/* Rating */}
            {recipe.rating !== undefined && recipe.rating > 0 && (
              <div className="absolute bottom-4 left-4 flex items-center gap-1 text-yellow-400">
                <FaStar className="w-4 h-4" />
                <span className="text-sm font-medium text-white">{recipe.rating}</span>
              </div>
            )}
          </div>

          {/* Content section */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-[var(--accent-primary)] transition-colors">
              {recipe.title}
            </h3>
            
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {recipe.description}
            </p>

            {/* Meta info */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4 text-gray-500">
                <span className="flex items-center gap-1">
                  <FaClock className="text-[var(--accent-primary)]" />
                  {recipe.totalTime}
                </span>
                <span className="flex items-center gap-1">
                  <FaUsers className="text-[var(--accent-primary)]" />
                  {recipe.servings}
                </span>
              </div>
              
              <span className={`font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                {recipe.difficulty.toUpperCase()}
              </span>
            </div>

            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {recipe.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 bg-white/5 rounded-full text-xs text-gray-400"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
    </motion.article>
  );
}