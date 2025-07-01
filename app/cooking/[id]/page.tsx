// app/cooking/[id]/page.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaClock, 
  FaFire, 
  FaUsers, 
  FaCheckCircle,
  FaArrowLeft,
  FaPrint,
  FaShare,
  FaBookmark,
  FaStar
} from 'react-icons/fa';
import Navigation from '../../components/Navigation';

// This would come from your data source
const recipeData = {
  id: 'classic-carbonara',
  title: 'Classic Carbonara',
  category: 'italian',
  description: 'An authentic Roman carbonara made with guanciale, eggs, and pecorino romano. No cream, no peas - just the real deal.',
  prepTime: '15 min',
  cookTime: '20 min',
  totalTime: '35 min',
  servings: 4,
  difficulty: 'medium',
  rating: 4.8,
  reviewCount: 127,
  ingredients: [
    { amount: '400g', item: 'Spaghetti or rigatoni' },
    { amount: '200g', item: 'Guanciale (or pancetta if unavailable)' },
    { amount: '4', item: 'Large egg yolks' },
    { amount: '1', item: 'Whole egg' },
    { amount: '100g', item: 'Pecorino Romano, finely grated' },
    { amount: 'To taste', item: 'Freshly ground black pepper' },
    { amount: 'As needed', item: 'Pasta water' }
  ],
  instructions: [
    {
      step: 1,
      title: 'Prepare the guanciale',
      description: 'Cut the guanciale into small cubes or thick matchsticks. No need to add oil - the guanciale will render its own fat.'
    },
    {
      step: 2,
      title: 'Start the pasta',
      description: 'Bring a large pot of water to boil. Salt it well (it should taste like the sea). Add the pasta and cook according to package directions minus 1 minute.'
    },
    {
      step: 3,
      title: 'Render the guanciale',
      description: 'While the pasta cooks, place the guanciale in a large, cold pan. Turn heat to medium and cook, stirring occasionally, until deeply golden and crispy, about 5-7 minutes.'
    },
    {
      step: 4,
      title: 'Prepare the egg mixture',
      description: 'In a bowl, whisk together the egg yolks, whole egg, and most of the pecorino (save some for garnish). Add a generous amount of black pepper.'
    },
    {
      step: 5,
      title: 'Combine everything',
      description: 'When pasta is ready, reserve 1 cup of pasta water. Drain pasta and add to the pan with guanciale (heat OFF). Let it cool for 30 seconds, then add the egg mixture, tossing vigorously.'
    },
    {
      step: 6,
      title: 'Achieve the perfect cream',
      description: 'Add pasta water a little at a time, tossing constantly, until you achieve a creamy sauce that coats the pasta. The residual heat will cook the eggs without scrambling them.'
    },
    {
      step: 7,
      title: 'Serve immediately',
      description: 'Plate the carbonara, top with remaining pecorino and more black pepper. Serve immediately while hot.'
    }
  ],
  tips: [
    'The key to carbonara is temperature control - too hot and you get scrambled eggs, too cool and the sauce won\'t form',
    'Use the best quality eggs you can find - the yolks are the star',
    'If you can\'t find guanciale, pancetta works, but the flavor will be different',
    'Never add cream! The creaminess comes from the egg and pasta water emulsion'
  ],
  nutrition: {
    calories: 580,
    protein: '24g',
    carbs: '72g',
    fat: '22g'
  }
};

// Ingredient Item Component
const IngredientItem = ({ ingredient, index }: { ingredient: { amount: string; item: string }; index: number }) => (
  <motion.li
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className="flex items-start gap-3 py-2"
  >
    <FaCheckCircle className="text-[var(--accent-primary)] mt-0.5 flex-shrink-0" />
    <div>
      <span className="font-semibold text-white">{ingredient.amount}</span>
      <span className="text-gray-300 ml-2">{ingredient.item}</span>
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
      <h3 className="text-lg font-semibold text-white mb-1">{instruction.title}</h3>
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
  const [savedRecipe, setSavedRecipe] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface)] to-transparent opacity-50" />
        
        <div className="container mx-auto px-6 relative z-10">
          {/* Back button */}
          <motion.a
            href="/cooking"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Recipes
          </motion.a>

          {/* Title and meta */}
          <div className="max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mb-4"
            >
              {recipeData.title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-400 mb-6"
            >
              {recipeData.description}
            </motion.p>

            {/* Recipe meta info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-6 text-sm mb-8"
            >
              <div className="flex items-center gap-2">
                <FaClock className="text-[var(--accent-primary)]" />
                <span>Total: {recipeData.totalTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaUsers className="text-[var(--accent-primary)]" />
                <span>Serves {recipeData.servings}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaFire className="text-[var(--accent-primary)]" />
                <span className="capitalize">{recipeData.difficulty}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-400" />
                <span>{recipeData.rating} ({recipeData.reviewCount} reviews)</span>
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              <ActionButton icon={<FaPrint />} label="Print" />
              <ActionButton icon={<FaShare />} label="Share" />
              <ActionButton 
                icon={<FaBookmark className={savedRecipe ? 'text-[var(--accent-primary)]' : ''} />} 
                label={savedRecipe ? 'Saved' : 'Save'} 
                onClick={() => setSavedRecipe(!savedRecipe)}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recipe Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-12">
            {/* Ingredients */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="md:col-span-1"
            >
              <h2 className="text-2xl font-bold mb-6">Ingredients</h2>
              <ul className="space-y-1">
                {recipeData.ingredients.map((ingredient, index) => (
                  <IngredientItem key={index} ingredient={ingredient} index={index} />
                ))}
              </ul>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="md:col-span-2"
            >
              <h2 className="text-2xl font-bold mb-6">Instructions</h2>
              <div className="space-y-6">
                {recipeData.instructions.map((instruction, index) => (
                  <InstructionStep key={index} instruction={instruction} index={index} />
                ))}
              </div>

              {/* Tips */}
              {recipeData.tips.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-12 p-6 bg-[var(--surface)] rounded-2xl border border-[var(--border)]"
                >
                  <h3 className="text-xl font-bold mb-4">Pro Tips</h3>
                  <ul className="space-y-3">
                    {recipeData.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-[var(--accent-primary)] mt-1">•</span>
                        <span className="text-gray-300">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Nutrition */}
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
                    <p className="font-semibold">{recipeData.nutrition.calories}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Protein</span>
                    <p className="font-semibold">{recipeData.nutrition.protein}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Carbs</span>
                    <p className="font-semibold">{recipeData.nutrition.carbs}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Fat</span>
                    <p className="font-semibold">{recipeData.nutrition.fat}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}