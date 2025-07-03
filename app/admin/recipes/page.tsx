// app/admin/recipes/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaImage, FaUpload } from 'react-icons/fa';
import Navigation from '../../components/Navigation';
import { Recipe, Ingredient, Instruction, Tip, Tag, ThumbnailDisplay } from '@/types/recipe';

const TagSelector = ({ selectedTags, onTagChange }: { selectedTags: string[], onTagChange: (newTags: string[]) => void }) => {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/tags');
        if (res.ok) {
          const data = await res.json();
          setAvailableTags(data);
        }
      } catch (error) {
        console.error("Failed to fetch tags", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      onTagChange([...selectedTags, value]);
    } else {
      onTagChange(selectedTags.filter(tag => tag !== value));
    }
  };

  const handleAddNewTag = () => {
      const tagName = newTag.trim();
      if (tagName && !selectedTags.includes(tagName)) {
        onTagChange([...selectedTags, tagName]);
        if (!availableTags.find(t => t.name === tagName)) {
            setAvailableTags([...availableTags, { id: tagName, name: tagName, slug: tagName.toLowerCase().replace(/\s+/g, '-') }]);
        }
      }
      setNewTag('');
  };

  if (loading) return <p>Loading tags...</p>;

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Tags</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 bg-black/50 border border-white/10 rounded-lg">
        {availableTags.map(tag => (
          <label key={tag.id} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              value={tag.name}
              checked={selectedTags.includes(tag.name)}
              onChange={handleCheckboxChange}
              className="w-4 h-4 bg-transparent border-gray-600 rounded text-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]"
            />
            <span className="text-sm">{tag.name}</span>
          </label>
        ))}
         {availableTags.length === 0 && <p className="text-sm text-gray-500 col-span-full">No tags found. Create new tags below.</p>}
      </div>
      <div className="flex gap-2 mt-2">
        <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddNewTag(); } }}
            placeholder="Create a new tag"
            className="flex-1 px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none text-sm"
        />
        <button type="button" onClick={handleAddNewTag} className="px-4 py-2 bg-white/10 text-sm rounded-lg hover:bg-white/20 transition-colors">Add Tag</button>
      </div>
    </div>
  );
};

const RecipeForm = ({ onClose, editingRecipe }: { onClose: () => void; editingRecipe?: Recipe | null }) => {
    const [formData, setFormData] = useState({
        title: editingRecipe?.title || '',
        description: editingRecipe?.description || '',
        story: editingRecipe?.story || '',
        cuisine: editingRecipe?.cuisine || '',
        prepTime: editingRecipe?.prepTime || '',
        cookTime: editingRecipe?.cookTime || '',
        servings: editingRecipe?.servings?.toString() || '4',
        difficulty: editingRecipe?.difficulty || 'medium',
        ingredients: editingRecipe?.ingredients?.length ? [...editingRecipe.ingredients] : [{ amount: '', unit: '', item: '', notes: '' }],
        instructions: editingRecipe?.instructions?.length ? [...editingRecipe.instructions] : [{ step: 1, title: '', description: '' }],
        tips: editingRecipe?.tips?.length ? editingRecipe.tips.map((tip: any) => tip.content) : [''],
        tags: editingRecipe?.tags?.map((tag: any) => tag.name) || [],
        featured: editingRecipe?.featured || false,
        published: editingRecipe?.published || false,
        thumbnailDisplay: editingRecipe?.thumbnailDisplay || ThumbnailDisplay.HERO,
        hasNutrition: !!editingRecipe?.nutrition,
        nutrition: {
            calories: editingRecipe?.nutrition?.calories?.toString() || '',
            protein: editingRecipe?.nutrition?.protein || '',
            carbs: editingRecipe?.nutrition?.carbs || '',
            fat: editingRecipe?.nutrition?.fat || '',
            fiber: editingRecipe?.nutrition?.fiber || '',
            sugar: editingRecipe?.nutrition?.sugar || '',
            sodium: editingRecipe?.nutrition?.sodium || '',
        }
    });

    const [saving, setSaving] = useState(false);
    const [heroImagePreview, setHeroImagePreview] = useState<string | null>(editingRecipe?.heroImage || null);
    const [ingredientsImagePreview, setIngredientsImagePreview] = useState<string | null>(editingRecipe?.ingredientsImage || null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageType: 'hero' | 'ingredients') => {
      const file = e.target.files?.[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          alert('Please select an image file');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          alert('Image size should be less than 5MB');
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          if(imageType === 'hero') {
            setHeroImagePreview(reader.result as string);
          } else {
            setIngredientsImagePreview(reader.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    };

    const removeImage = (imageType: 'hero' | 'ingredients') => {
      if(imageType === 'hero') {
          setHeroImagePreview(null);
          const fileInput = document.getElementById('hero-image') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
      } else {
          setIngredientsImagePreview(null);
          const fileInput = document.getElementById('ingredients-image') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const totalTime = `${parseInt(formData.prepTime || '0') + parseInt(formData.cookTime || '0')}`;
            const payload: any = {
                ...formData, // This now includes 'story' automatically
                totalTime,
                servings: parseInt(formData.servings),
                ingredients: formData.ingredients.filter((i: any) => i.item),
                instructions: formData.instructions.filter((i: any) => i.description),
                tips: formData.tips.filter(Boolean),
                heroImage: heroImagePreview,
                ingredientsImage: ingredientsImagePreview,
                nutrition: formData.hasNutrition ? {
                    calories: parseInt(formData.nutrition.calories) || 0,
                    protein: formData.nutrition.protein || '',
                    carbs: formData.nutrition.carbs || '',
                    fat: formData.nutrition.fat || '',
                    fiber: formData.nutrition.fiber || null,
                    sugar: formData.nutrition.sugar || null,
                    sodium: formData.nutrition.sodium || null,
                } : null
            };
    
            const url = editingRecipe ? `/api/recipes/${editingRecipe.slug}` : '/api/recipes';
            const method = editingRecipe ? 'PUT' : 'POST';
    
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
    
            if (response.ok) {
                alert(editingRecipe ? 'Recipe updated successfully!' : 'Recipe created successfully!');
                onClose();
            } else {
                const error = await response.json();
                alert(`Failed: ${error.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error handling recipe:', error);
            alert('Error: ' + (error as Error).message);
        } finally {
            setSaving(false);
        }
    };

    const addIngredient = () => setFormData({ ...formData, ingredients: [...formData.ingredients, { amount: '', unit: '', item: '', notes: '' }] });
    const removeIngredient = (index: number) => {
        setFormData({ ...formData, ingredients: formData.ingredients.filter((_, i) => i !== index) });
    };

    const addInstruction = () => setFormData({ ...formData, instructions: [...formData.instructions, { step: formData.instructions.length + 1, title: '', description: '' }] });
    const removeInstruction = (index: number) => {
        const newInstructions = formData.instructions
            .filter((_, i) => i !== index)
            .map((inst, i) => ({ ...inst, step: i + 1 }));
        setFormData({ ...formData, instructions: newInstructions });
    };

    const addTip = () => setFormData({ ...formData, tips: [...formData.tips, ''] });
    const removeTip = (index: number) => {
        setFormData({ ...formData, tips: formData.tips.filter((_, i) => i !== index) });
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl bg-[var(--surface)] rounded-2xl p-8 max-h-[90vh] overflow-y-auto">
                <h2 className="text-3xl font-bold mb-6">{editingRecipe ? 'Edit Recipe' : 'Create New Recipe'}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Finished Dish Image</label>
                        <div className="space-y-4">
                            {heroImagePreview ? (
                                <div className="relative">
                                    <img src={heroImagePreview} alt="Recipe preview" className="w-full max-h-64 object-cover rounded-lg" />
                                    <button type="button" onClick={() => removeImage('hero')} className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-colors"><FaTrash /></button>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-[var(--accent-primary)]/50 transition-colors">
                                    <FaImage className="mx-auto text-4xl text-gray-500 mb-2" />
                                    <p className="text-gray-400 mb-2">No image selected</p>
                                    <label htmlFor="hero-image" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"><FaUpload /> Choose Image</label>
                                </div>
                            )}
                            <input id="hero-image" type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'hero')} className="hidden" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Ingredients Image (Top Banner)</label>
                        <div className="space-y-4">
                            {ingredientsImagePreview ? (
                                <div className="relative">
                                    <img src={ingredientsImagePreview} alt="Ingredients preview" className="w-full max-h-64 object-cover rounded-lg" />
                                    <button type="button" onClick={() => removeImage('ingredients')} className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-colors"><FaTrash /></button>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-[var(--accent-primary)]/50 transition-colors">
                                    <FaImage className="mx-auto text-4xl text-gray-500 mb-2" />
                                    <p className="text-gray-400 mb-2">No image selected</p>
                                    <label htmlFor="ingredients-image" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"><FaUpload /> Choose Image</label>
                                </div>
                            )}
                            <input id="ingredients-image" type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'ingredients')} className="hidden" />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-2">Thumbnail Display</label>
                        <p className="text-xs text-gray-500 mb-2">Choose which image appears on the main cooking page grid.</p>
                        <div className="flex gap-4 rounded-lg bg-black/50 p-2">
                            <label className="flex-1 cursor-pointer p-2 text-center rounded-md transition-colors" style={{backgroundColor: formData.thumbnailDisplay === ThumbnailDisplay.HERO ? 'var(--accent-primary)' : 'transparent'}}>
                                <input type="radio" name="thumbnailDisplay" value={ThumbnailDisplay.HERO} checked={formData.thumbnailDisplay === ThumbnailDisplay.HERO} onChange={(e) => setFormData({...formData, thumbnailDisplay: e.target.value as ThumbnailDisplay})} className="sr-only" />
                                Finished Dish
                            </label>
                            <label className="flex-1 cursor-pointer p-2 text-center rounded-md transition-colors" style={{backgroundColor: formData.thumbnailDisplay === ThumbnailDisplay.INGREDIENTS ? 'var(--accent-primary)' : 'transparent'}}>
                                <input type="radio" name="thumbnailDisplay" value={ThumbnailDisplay.INGREDIENTS} checked={formData.thumbnailDisplay === ThumbnailDisplay.INGREDIENTS} onChange={(e) => setFormData({...formData, thumbnailDisplay: e.target.value as ThumbnailDisplay})} className="sr-only" />
                                Ingredients
                            </label>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Title</label>
                            <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Cuisine (optional)</label>
                            <input type="text" value={formData.cuisine} onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none" />
                        </div>
                    </div>

                    <TagSelector selectedTags={formData.tags} onTagChange={(newTags) => setFormData({...formData, tags: newTags})} />

                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Story / Details (Optional)</label>
                        <p className="text-xs text-gray-500 mb-2">Add more details about the dish. This will appear below the main image. Markdown is supported.</p>
                        <textarea value={formData.story} onChange={(e) => setFormData({ ...formData, story: e.target.value })} rows={5} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div><label className="block text-sm font-medium mb-2">Prep Time (min)</label><input type="number" required value={formData.prepTime} onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none" /></div>
                        <div><label className="block text-sm font-medium mb-2">Cook Time (min)</label><input type="number" required value={formData.cookTime} onChange={(e) => setFormData({ ...formData, cookTime: e.target.value })} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none" /></div>
                        <div><label className="block text-sm font-medium mb-2">Servings</label><input type="number" required value={formData.servings} onChange={(e) => setFormData({ ...formData, servings: e.target.value })} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none" /></div>
                        <div><label className="block text-sm font-medium mb-2">Difficulty</label><select value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Recipe['difficulty'] })} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none"><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-2">Ingredients</label>
                        {formData.ingredients.map((ingredient: any, index: number) => (
                            <div key={index} className="flex gap-2 mb-2 items-center">
                                <input type="text" placeholder="Amount" value={ingredient.amount} onChange={(e) => { const newIngredients = [...formData.ingredients]; newIngredients[index].amount = e.target.value; setFormData({ ...formData, ingredients: newIngredients }); }} className="w-24 px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none" />
                                <input type="text" placeholder="Item" value={ingredient.item} onChange={(e) => { const newIngredients = [...formData.ingredients]; newIngredients[index].item = e.target.value; setFormData({ ...formData, ingredients: newIngredients }); }} className="flex-1 px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none" />
                                <button type="button" onClick={() => removeIngredient(index)} className="p-2 text-red-500 hover:text-red-400 transition-colors rounded-full"><FaTrash /></button>
                            </div>
                        ))}
                        <button type="button" onClick={addIngredient} className="text-sm text-[var(--accent-primary)] hover:underline mt-2">+ Add Ingredient</button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Instructions</label>
                        {formData.instructions.map((instruction: any, index: number) => (
                            <div key={index} className="relative mb-3 pl-8">
                                <span className="absolute left-0 top-2.5 font-bold text-gray-500">{instruction.step}.</span>
                                <input type="text" placeholder="Step Title (optional)" value={instruction.title} onChange={(e) => { const newInstructions = [...formData.instructions]; newInstructions[index].title = e.target.value; setFormData({ ...formData, instructions: newInstructions }); }} className="w-full mb-2 px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none" />
                                <textarea placeholder="Step description" value={instruction.description} onChange={(e) => { const newInstructions = [...formData.instructions]; newInstructions[index].description = e.target.value; setFormData({ ...formData, instructions: newInstructions }); }} rows={2} className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none" />
                                <button type="button" onClick={() => removeInstruction(index)} className="absolute top-1 -right-2 p-2 text-red-500 hover:text-red-400 transition-colors rounded-full"><FaTrash /></button>
                            </div>
                        ))}
                        <button type="button" onClick={addInstruction} className="text-sm text-[var(--accent-primary)] hover:underline mt-2">+ Add Instruction</button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Notes (optional)</label>
                        {formData.tips.map((tip: string, index: number) => (
                            <div key={index} className="flex gap-2 mb-2 items-center">
                                <textarea
                                    placeholder="Pro tip..."
                                    value={tip}
                                    onChange={(e) => {
                                        const newTips = [...formData.tips];
                                        newTips[index] = e.target.value;
                                        setFormData({ ...formData, tips: newTips });
                                    }}
                                    rows={2}
                                    className="flex-1 w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none"
                                />
                                <button type="button" onClick={() => removeTip(index)} className="p-2 text-red-500 hover:text-red-400 transition-colors rounded-full"><FaTrash /></button>
                            </div>
                        ))}
                        <button type="button" onClick={addTip} className="text-sm text-[var(--accent-primary)] hover:underline mt-2">+ Add Tip</button>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                        <label className="flex items-center gap-3 mb-4">
                            <input
                                type="checkbox"
                                checked={formData.hasNutrition}
                                onChange={(e) => setFormData({ ...formData, hasNutrition: e.target.checked })}
                                className="w-5 h-5 bg-transparent border-gray-600 rounded text-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]"
                            />
                            <span className="text-lg font-medium">Include Nutrition Information</span>
                        </label>

                        {formData.hasNutrition && (
                            <div className="space-y-4 p-4 bg-black/30 rounded-lg">
                                <p className="text-sm text-gray-400 mb-4">Enter nutrition information per serving. Optional fields can be left blank.</p>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Calories <span className="text-red-400">*</span></label>
                                        <input
                                            type="number"
                                            value={formData.nutrition.calories}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                nutrition: { ...formData.nutrition, calories: e.target.value }
                                            })}
                                            className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none"
                                            placeholder="250"
                                            required={formData.hasNutrition}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Protein <span className="text-red-400">*</span></label>
                                        <input
                                            type="text"
                                            value={formData.nutrition.protein}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                nutrition: { ...formData.nutrition, protein: e.target.value }
                                            })}
                                            className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none"
                                            placeholder="20g"
                                            required={formData.hasNutrition}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Carbs <span className="text-red-400">*</span></label>
                                        <input
                                            type="text"
                                            value={formData.nutrition.carbs}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                nutrition: { ...formData.nutrition, carbs: e.target.value }
                                            })}
                                            className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none"
                                            placeholder="30g"
                                            required={formData.hasNutrition}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Fat <span className="text-red-400">*</span></label>
                                        <input
                                            type="text"
                                            value={formData.nutrition.fat}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                nutrition: { ...formData.nutrition, fat: e.target.value }
                                            })}
                                            className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none"
                                            placeholder="10g"
                                            required={formData.hasNutrition}
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Fiber (optional)</label>
                                        <input
                                            type="text"
                                            value={formData.nutrition.fiber}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                nutrition: { ...formData.nutrition, fiber: e.target.value }
                                            })}
                                            className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none"
                                            placeholder="5g"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Sugar (optional)</label>
                                        <input
                                            type="text"
                                            value={formData.nutrition.sugar}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                nutrition: { ...formData.nutrition, sugar: e.target.value }
                                            })}
                                            className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none"
                                            placeholder="8g"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Sodium (optional)</label>
                                        <input
                                            type="text"
                                            value={formData.nutrition.sodium}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                nutrition: { ...formData.nutrition, sodium: e.target.value }
                                            })}
                                            className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none"
                                            placeholder="400mg"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-6">
                        <label className="flex items-center gap-2"><input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4" /><span className="text-sm">Featured Recipe</span></label>
                        <label className="flex items-center gap-2"><input type="checkbox" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} className="w-4 h-4" /><span className="text-sm">Publish Immediately</span></label>
                    </div>

                    <div className="flex gap-4 justify-end pt-4 border-t border-white/10">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">Cancel</button>
                        <button type="submit" disabled={saving} className="px-6 py-2 bg-[var(--accent-primary)] rounded-lg hover:bg-opacity-80 transition-colors disabled:opacity-50 flex items-center gap-2">{saving ? 'Saving...' : (editingRecipe ? 'Update Recipe' : 'Create Recipe')}</button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default function RecipeAdminPage() {
    const [showForm, setShowForm] = useState(false);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingRecipe(null);
        fetchRecipes();
    };

    useEffect(() => {
        const isAuth = sessionStorage.getItem('adminAuth');
        if (isAuth === 'true') {
            setAuthenticated(true);
            fetchRecipes();
        } else {
            setLoading(false);
        }
    }, []);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (response.ok) {
                setAuthenticated(true);
                sessionStorage.setItem('adminAuth', 'true');
                fetchRecipes();
            } else {
                alert('Invalid password');
            }
        } catch (error) {
            alert('Authentication error');
        }
    };

    const fetchRecipes = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/recipes?all=true');
            const data = await response.json();
            setRecipes(data);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (recipe: Recipe) => {
        setEditingRecipe(recipe);
        setShowForm(true);
    };

    const handleDelete = async (recipe: Recipe) => {
        if (!confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
            return;
        }
        try {
            const response = await fetch(`/api/recipes/${recipe.slug}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert('Recipe deleted successfully!');
                fetchRecipes();
            } else {
                alert('Failed to delete recipe');
            }
        } catch (error) {
            console.error('Error deleting recipe:', error);
            alert('Error deleting recipe');
        }
    };

    const handleTogglePublish = async (recipe: Recipe) => {
        try {
            const response = await fetch(`/api/recipes/${recipe.slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...recipe,
                    published: !recipe.published,
                    tags: recipe.tags?.map(t => t.name)
                }),
            });

            if (response.ok) {
                alert(`Recipe ${recipe.published ? 'unpublished' : 'published'} successfully!`);
                fetchRecipes();
            } else {
                const error = await response.json();
                alert(`Failed to update recipe: ${error.error}`);
            }
        } catch (error) {
            console.error('Error updating recipe:', error);
            alert('Error updating recipe');
        }
    };

    if (!authenticated) {
        return (
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="w-full max-w-md p-8 bg-[var(--surface)] rounded-2xl">
              <h1 className="text-2xl font-bold mb-6 text-center">Admin Access</h1>
              <form onSubmit={handleAuth}>
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none mb-4"
                  autoFocus
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-[var(--accent-primary)] rounded-lg font-medium hover:bg-opacity-80 transition-colors"
                >
                  Access Admin
                </button>
              </form>
            </div>
          </div>
        );
      }

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
                            onClick={() => {
                                setEditingRecipe(null);
                                setShowForm(true);
                            }}
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
                                    className="flex items-center justify-between p-4 bg-[var(--surface)] rounded-xl border border-white/10"
                                >
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        {recipe.heroImage && (
                                            <img
                                                src={recipe.heroImage}
                                                alt={recipe.title}
                                                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                            />
                                        )}
                                        <div className="min-w-0">
                                            <h3 className="text-lg font-semibold truncate">{recipe.title}</h3>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {recipe.tags?.map((tag: any) => (
                                                    <span key={tag.id} className="px-2 py-0.5 bg-white/10 text-xs rounded-full">{tag.name}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                        <button onClick={() => handleEdit(recipe)} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Edit recipe">
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => handleTogglePublish(recipe)} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title={recipe.published ? 'Unpublish recipe' : 'Publish recipe'}>
                                            {recipe.published ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                        <button onClick={() => handleDelete(recipe)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors" title="Delete recipe">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {showForm && (
                <RecipeForm
                    onClose={handleCloseForm}
                    editingRecipe={editingRecipe}
                />
            )}
        </div>
    );
}