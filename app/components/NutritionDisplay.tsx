// app/components/NutritionDisplay.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Nutrition } from '@/types/recipe';
import { FaFire, FaDrumstickBite, FaBreadSlice } from 'react-icons/fa';
import { GiWheat, GiSugarCane, GiSaltShaker, GiWaterDrop } from 'react-icons/gi';

// Update the recipe detail page at app/cooking/[slug]/page.tsx
// Replace the nutrition section (around line 285-310) with:
/*
{recipe.nutrition && (
  <NutritionDisplay 
    nutrition={recipe.nutrition} 
    servings={recipe.servings}
  />
)}
*/
// And add this import at the top:
// import NutritionDisplay from '../../components/NutritionDisplay';

interface NutritionDisplayProps {
  nutrition: Nutrition;
  servings?: number;
  variant?: 'default' | 'compact';
}

const NutritionIcon = ({ type }: { type: string }) => {
  const icons = {
    calories: <FaFire />,
    protein: <FaDrumstickBite />,
    carbs: <FaBreadSlice />,
    fat: <GiWaterDrop />,
    fiber: <GiWheat />,
    sugar: <GiSugarCane />,
    sodium: <GiSaltShaker />
  };
  return icons[type as keyof typeof icons] || null;
};

export default function NutritionDisplay({ nutrition, servings, variant = 'default' }: NutritionDisplayProps) {
  const mainNutrients = [
    { key: 'calories', label: 'Calories', value: nutrition.calories, unit: '', color: 'text-orange-400' },
    { key: 'protein', label: 'Protein', value: nutrition.protein, unit: '', color: 'text-red-400' },
    { key: 'carbs', label: 'Carbs', value: nutrition.carbs, unit: '', color: 'text-blue-400' },
    { key: 'fat', label: 'Fat', value: nutrition.fat, unit: '', color: 'text-yellow-400' },
  ];

  const additionalNutrients = [
    { key: 'fiber', label: 'Fiber', value: nutrition.fiber, unit: '', color: 'text-green-400' },
    { key: 'sugar', label: 'Sugar', value: nutrition.sugar, unit: '', color: 'text-pink-400' },
    { key: 'sodium', label: 'Sodium', value: nutrition.sodium, unit: '', color: 'text-gray-400' },
  ].filter(n => n.value);

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap gap-4 text-sm">
        {mainNutrients.map((nutrient) => (
          <div key={nutrient.key} className="flex items-center gap-2">
            <span className={nutrient.color}><NutritionIcon type={nutrient.key} /></span>
            <span className="text-gray-400">{nutrient.label}:</span>
            <span className="font-medium text-white">{nutrient.value}{nutrient.unit}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Nutrition Information</h3>
        {servings && (
          <span className="text-sm text-gray-400">Per serving ({servings} servings total)</span>
        )}
      </div>

      {/* Main Nutrients Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {mainNutrients.map((nutrient, index) => (
          <motion.div
            key={nutrient.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="text-center p-4 bg-black/30 rounded-xl"
          >
            <div className={`text-2xl mb-2 ${nutrient.color}`}>
              <NutritionIcon type={nutrient.key} />
            </div>
            <div className="text-2xl font-bold text-white">
              {nutrient.value}{nutrient.unit}
            </div>
            <div className="text-sm text-gray-400">{nutrient.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Additional Nutrients */}
      {additionalNutrients.length > 0 && (
        <div className="border-t border-white/10 pt-4">
          <div className="grid grid-cols-3 gap-4">
            {additionalNutrients.map((nutrient, index) => (
              <motion.div
                key={nutrient.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className={`text-lg ${nutrient.color}`}>
                    <NutritionIcon type={nutrient.key} />
                  </span>
                  <span className="text-sm text-gray-400">{nutrient.label}</span>
                </div>
                <span className="font-medium text-white">{nutrient.value}{nutrient.unit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-6 text-xs text-gray-500 text-center">
        * Nutritional values are estimates and may vary based on specific ingredients used.
      </div>
    </motion.div>
  );
}