'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { 
  FaClock, 
  FaFire, 
  FaUsers, 
  FaCheckCircle,
  FaArrowLeft,
  FaPrint,
  FaShare,
  FaStar,
  FaGlobe
} from 'react-icons/fa';
import Navigation from '../../components/Navigation';
import { Recipe } from '@/types/recipe';

// Ingredient Item Component
const IngredientItem = ({ ingredient, index }: { ingredient: any; index: number }) => (
  <motion.li
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className="flex items-start gap-3 py-2"
  >
    <FaCheckCircle className="text-[var(--accent-primary)] mt-0.5 flex-shrink-0" />
    <div>
      <span className="font-semibold text-white">{ingredient.amount}</span>
      {ingredient.unit && <span className="text-gray-300 ml-1">{ingredient.unit}</span>}
      <span className="text-gray-300 ml-2">{ingredient.item}</span>
      {ingredient.notes && <span className="text-gray-400 ml-2 text-sm">({ingredient.notes})</span>}
    </div>
  </motion.li>
);

// Instruction Step Component
const InstructionStep = ({ instruction, index }: { instruction: any; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="flex gap-4"
  >
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--accent-primary)] text-white font-bold flex items-center justify-center">
      {instruction.step}
    </div>
    <div className="flex-1">
      {instruction.title && <h3 className="text-lg font-semibold text-white mb-1">{instruction.title}</h3>}
      <p className="text-gray-300 leading-relaxed">{instruction.description}</p>
    </div>
  </motion.div>
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

export default function RecipeDetailPage() {
  const params = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      fetchRecipe(params.slug as string);
    }
  }, [params.slug]);

  const fetchRecipe = async (slug: string) => {
    try {
      const response = await fetch(`/api/recipes/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setRecipe(data);
      } else {
        console.error('Recipe not found');
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-pulse text-2xl">Loading recipe...</div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <h1 className="text-4xl font-bold mb-4">Recipe Not Found</h1>
          <a href="/cooking" className="text-[var(--accent-primary)] hover:underline">
            ← Back to recipes
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-16">
        {recipe.heroImage && (
          <div className="absolute inset-0 z-0">
            <img 
              src={recipe.heroImage} 
              alt={recipe.heroImageAlt || recipe.title}
              className="w-full h-full object-cover opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black" />
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
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-400 mb-6"
            >
              {recipe.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-x-6 gap-y-3 text-sm mb-8"
            >
              <div className="flex items-center gap-2">
                <FaClock className="text-[var(--accent-primary)]" />
                <span>Total: {recipe.totalTime}</span>
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
                onClick={() => window.print()} 
              />
              <ActionButton 
                icon={<FaShare />} 
                label="Share" 
                onClick={async () => {
                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: recipe.title,
                        text: recipe.description,
                        url: window.location.href,
                      });
                    } catch (err) {
                      console.log('Error sharing:', err);
                    }
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="md:col-span-1"
            >
              <h2 className="text-2xl font-bold mb-6">Ingredients</h2>
              <ul className="space-y-1">
                {recipe.ingredients.map((ingredient, index) => (
                  <IngredientItem key={ingredient.id || index} ingredient={ingredient} index={index} />
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="md:col-span-2"
            >
              <h2 className="text-2xl font-bold mb-6">Instructions</h2>
              <div className="space-y-6">
                {recipe.instructions.map((instruction, index) => (
                  <InstructionStep key={instruction.id || index} instruction={instruction} index={index} />
                ))}
              </div>

              {recipe.tips && recipe.tips.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-12 p-6 bg-[var(--surface)] rounded-2xl border border-[var(--border)]"
                >
                  <h3 className="text-xl font-bold mb-4">Pro Tips</h3>
                  <ul className="space-y-3">
                    {recipe.tips.map((tip, index) => (
                      <li key={tip.id || index} className="flex items-start gap-3">
                        <span className="text-[var(--accent-primary)] mt-1">•</span>
                        <span className="text-gray-300">{tip.content}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {recipe.nutrition && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-8 p-6 bg-[var(--surface)]/50 rounded-2xl"
                >
                  <h3 className="text-lg font-bold mb-3">Nutrition Per Serving</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Calories</span>
                      <p className="font-semibold">{recipe.nutrition.calories}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Protein</span>
                      <p className="font-semibold">{recipe.nutrition.protein}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Carbs</span>
                      <p className="font-semibold">{recipe.nutrition.carbs}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Fat</span>
                      <p className="font-semibold">{recipe.nutrition.fat}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}