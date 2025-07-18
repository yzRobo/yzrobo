// app/cooking/[slug]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { 
  FaClock, 
  FaFire, 
  FaUsers, 
  FaCheckCircle,
  FaArrowLeft,
  FaPrint,
  FaShare,
  FaStar,
  FaGlobe,
  FaExclamationTriangle
} from 'react-icons/fa';
import Navigation from '../../components/Navigation';
import NutritionDisplay from '../../components/NutritionDisplay';
import { Recipe } from '@/types/recipe';
import { PageLoadingSpinner } from '../../components/LoadingStates';
import ErrorBoundary from '../../components/ErrorBoundary';
import { formatCookingTime } from '@/lib/utils/timeFormatting';
import ReactMarkdown from 'react-markdown';
import { useContentTracking } from '../../hooks/useAnalytics';

// Ingredient Item Component with divider
const IngredientItem = ({ ingredient, index, isLast }: { ingredient: any; index: number; isLast: boolean }) => (
  <>
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-start gap-3 py-3"
    >
      <FaCheckCircle className="text-[var(--accent-primary)] mt-0.5 flex-shrink-0" />
      <div>
        <span className="font-semibold text-white">{ingredient.amount}</span>
        {ingredient.unit && <span className="text-gray-300 ml-1">{ingredient.unit}</span>}
        <span className="text-gray-300 ml-2">{ingredient.item}</span>
        {ingredient.notes && <span className="text-gray-400 ml-2 text-sm">({ingredient.notes})</span>}
      </div>
    </motion.li>
    {!isLast && (
      <div className="border-b border-white/5 mx-2" />
    )}
  </>
);

// Instruction Step Component with divider
const InstructionStep = ({ instruction, index, isLast }: { instruction: any; index: number; isLast: boolean }) => (
  <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex gap-4 py-4"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--accent-primary)] text-white font-bold flex items-center justify-center">
        {instruction.step}
      </div>
      <div className="flex-1">
        {instruction.title && <h3 className="text-lg font-semibold text-white mb-1">{instruction.title}</h3>}
        <div className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown>{instruction.description}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
    {!isLast && (
      <div className="border-b border-white/5" />
    )}
  </>
);

// Action Button Component
const ActionButton = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium hover:bg-white/20 transition-colors"
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </motion.button>
);

// Error State Component
const RecipeErrorState = ({ error }: { error: string }) => {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="flex flex-col items-center justify-center h-[80vh] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <FaExclamationTriangle className="text-6xl text-[var(--accent-primary)] mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Recipe Not Found</h1>
          <p className="text-gray-400 mb-8">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="px-6 py-3 bg-white/10 rounded-full font-medium hover:bg-white/20 transition-colors"
            >
              Go Back
            </motion.button>
            <motion.a
              href="/cooking"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-[var(--accent-primary)] rounded-full font-medium"
            >
              Browse All Recipes
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

function RecipeDetailContent() {
  const params = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add analytics tracking
  useContentTracking('recipe', recipe?.id || '', recipe?.slug || '');

  useEffect(() => {
    if (params.slug) {
      fetchRecipe(params.slug as string);
    }
  }, [params.slug]);

  const fetchRecipe = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/recipes/${slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('This recipe could not be found. It may have been removed or the link might be incorrect.');
        } else {
          setError('Unable to load this recipe. Please try again later.');
        }
        return;
      }
      
      const data = await response.json();
      setRecipe(data);
    } catch (error) {
      console.error('Error fetching recipe:', error);
      setError('Something went wrong while loading the recipe. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!recipe) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
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
        <PageLoadingSpinner />
      </div>
    );
  }

  if (error || !recipe) {
    return <RecipeErrorState error={error || 'Recipe not found'} />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-16">
        {recipe.ingredientsImage && (
          <div className="absolute inset-0 z-0">
            <img 
              src={recipe.ingredientsImage} 
              alt={recipe.ingredientsImageAlt || `Ingredients for ${recipe.title}`}
              className="w-full h-full object-cover opacity-80"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface)] to-transparent opacity-50" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.a
            href="/cooking"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Recipes
          </motion.a>

          <div className="max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mb-4"
            >
              {recipe.title}
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose prose-invert prose-xl max-w-none mb-6"
            >
              <ReactMarkdown>{recipe.description}</ReactMarkdown>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-x-6 gap-y-3 text-sm mb-8"
            >
              <div className="flex items-center gap-2">
                <FaClock className="text-[var(--accent-primary)]" />
                <span>Prep: {formatCookingTime(recipe.prepTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-[var(--accent-primary)]" />
                <span>Cook: {formatCookingTime(recipe.cookTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaUsers className="text-[var(--accent-primary)]" />
                <span>Serves {recipe.servings}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaFire className="text-[var(--accent-primary)]" />
                <span className="capitalize">{recipe.difficulty}</span>
              </div>
              {recipe.cuisine && (
                <div className="flex items-center gap-2">
                  <FaGlobe className="text-[var(--accent-primary)]" />
                  <span>{recipe.cuisine}</span>
                </div>
              )}
              {recipe.rating && recipe.rating > 0 && (
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  <span>{recipe.rating} ({recipe.reviewCount} reviews)</span>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              <ActionButton 
                icon={<FaPrint />} 
                label="Print" 
                onClick={handlePrint} 
              />
              <ActionButton 
                icon={<FaShare />} 
                label="Share" 
                onClick={handleShare}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {recipe.heroImage && (
        <section className="container mx-auto px-6 mt-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-white/5"
            >
                <motion.img
                    src={recipe.heroImage}
                    alt={recipe.heroImageAlt || `Finished dish of ${recipe.title}`}
                    className="w-full aspect-video object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
            </motion.div>
        </section>
      )}
      
      {recipe.story && (
        <section className="container mx-auto px-6 my-12 md:my-8">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-2xl" 
            >
              <h3 className="text-2xl font-bold mb-4">About This Dish</h3>
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{recipe.story}</ReactMarkdown>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <section className="py-12 md:py-1">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="md:col-span-1"
            >
              <div className="glass p-6 rounded-2xl h-full">
                <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
                <ul className="space-y-0">
                  {recipe.ingredients.map((ingredient, index) => (
                    <IngredientItem 
                      key={ingredient.id || index} 
                      ingredient={ingredient} 
                      index={index}
                      isLast={index === recipe.ingredients.length - 1}
                    />
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="md:col-span-2"
            >
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-4">Instructions</h2>
                <div className="space-y-0">
                  {recipe.instructions.map((instruction, index) => (
                    <InstructionStep 
                      key={instruction.id || index} 
                      instruction={instruction} 
                      index={index}
                      isLast={index === recipe.instructions.length - 1}
                    />
                  ))}
                </div>
              </div>
              
              {recipe.tips && recipe.tips.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-8 p-6 bg-[var(--surface)] rounded-2xl border border-[var(--border)]"
                >
                  <h3 className="text-xl font-bold mb-4">Notes</h3>
                  <ul className="space-y-3">
                    {recipe.tips.map((tip, index) => (
                      <li key={tip.id || index} className="flex items-start gap-3">
                        <span className="text-[var(--accent-primary)] mt-1">•</span>
                        <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown>{tip.content}</ReactMarkdown>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {recipe.nutrition && (
                <div className="mt-8">
                  <NutritionDisplay 
                    nutrition={recipe.nutrition} 
                    servings={recipe.servings}
                  />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function RecipeDetailPage() {
  return (
    <ErrorBoundary>
      <RecipeDetailContent />
    </ErrorBoundary>
  );
}