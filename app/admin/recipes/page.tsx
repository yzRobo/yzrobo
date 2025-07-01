// app/admin/recipes/page.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import Navigation from '../../components/Navigation';

// Simple recipe form for creating/editing
const RecipeForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'italian',
    cuisine: '',
    prepTime: '',
    cookTime: '',
    servings: '4',
    difficulty: 'medium',
    ingredients: [{ amount: '', unit: '', item: '', notes: '' }],
    instructions: [{ title: '', description: '' }],
    tips: [''],
    featured: false,
    published: false,
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Calculate total time
      const totalTime = `${parseInt(formData.prepTime) + parseInt(formData.cookTime)} min`;

      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalTime,
          servings: parseInt(formData.servings),
          ingredients: formData.ingredients.filter(i => i.item),
          instructions: formData.instructions.filter(i => i.description),
          tips: formData.tips.filter(Boolean),
        }),
      });

      if (response.ok) {
        alert('Recipe created successfully!');
        onClose();
        window.location.reload(); // Simple reload for now
      } else {
        alert('Failed to create recipe');
      }
    } catch (error) {
      console.error('Error creating recipe:', error);
      alert('Error creating recipe');
    } finally {
      setSaving(false);
    }
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { amount: '', unit: '', item: '', notes: '' }],
    });
  };

  const addInstruction = () => {
    setFormData({
      ...formData,
      instructions: [...formData.instructions, { title: '', description: '' }],
    });
  };

  const addTip = () => {
    setFormData({
      ...formData,
      tips: [...formData.tips, ''],
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-[var(--surface)] rounded-2xl p-8 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-3xl font-bold mb-6">Create New Recipe</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none"
              >
                <option value="italian">Italian</option>
                <option value="bbq">BBQ</option>
                <option value="experimental">Experimental</option>
                <option value="dessert">Dessert</option>
                <option value="appetizer">Appetizer</option>
                <option value="main">Main</option>
                <option value="side">Side</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Prep Time (min)</label>
              <input
                type="number"
                required
                value={formData.prepTime}
                onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cook Time (min)</label>
              <input
                type="number"
                required
                value={formData.cookTime}
                onChange={(e) => setFormData({ ...formData, cookTime: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Servings</label>
              <input
                type="number"
                required
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium mb-2">Ingredients</label>
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Amount"
                  value={ingredient.amount}
                  onChange={(e) => {
                    const newIngredients = [...formData.ingredients];
                    newIngredients[index].amount = e.target.value;
                    setFormData({ ...formData, ingredients: newIngredients });
                  }}
                  className="w-24 px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Item"
                  value={ingredient.item}
                  onChange={(e) => {
                    const newIngredients = [...formData.ingredients];
                    newIngredients[index].item = e.target.value;
                    setFormData({ ...formData, ingredients: newIngredients });
                  }}
                  className="flex-1 px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="text-sm text-[var(--accent-primary)] hover:underline"
            >
              + Add Ingredient
            </button>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium mb-2">Instructions</label>
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="mb-3">
                <input
                  type="text"
                  placeholder="Step Title (optional)"
                  value={instruction.title}
                  onChange={(e) => {
                    const newInstructions = [...formData.instructions];
                    newInstructions[index].title = e.target.value;
                    setFormData({ ...formData, instructions: newInstructions });
                  }}
                  className="w-full mb-2 px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none"
                />
                <textarea
                  placeholder="Step description"
                  value={instruction.description}
                  onChange={(e) => {
                    const newInstructions = [...formData.instructions];
                    newInstructions[index].description = e.target.value;
                    setFormData({ ...formData, instructions: newInstructions });
                  }}
                  rows={2}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addInstruction}
              className="text-sm text-[var(--accent-primary)] hover:underline"
            >
              + Add Instruction
            </button>
          </div>

          {/* Options */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm">Featured Recipe</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm">Publish Immediately</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-[var(--accent-primary)] rounded-lg hover:bg-opacity-80 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Create Recipe'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Main admin page
export default function RecipeAdminPage() {
  const [showForm, setShowForm] = useState(false);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/recipes?published=false');
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Recipe Admin</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[var(--accent-primary)] rounded-full font-medium"
            >
              <FaPlus /> New Recipe
            </motion.button>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-pulse text-2xl">Loading recipes...</div>
            </div>
          ) : (
            <div className="grid gap-4">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="flex items-center justify-between p-6 bg-[var(--surface)] rounded-xl border border-white/10"
                >
                  <div>
                    <h3 className="text-xl font-semibold">{recipe.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{recipe.description}</p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span>{recipe.category}</span>
                      <span>•</span>
                      <span>{recipe.difficulty}</span>
                      <span>•</span>
                      <span>{recipe.published ? 'Published' : 'Draft'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <FaEdit />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      {recipe.published ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <button className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {showForm && <RecipeForm onClose={() => setShowForm(false)} />}
    </div>
  );
}="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none"
              />
            </div>
            <div>
              <label className