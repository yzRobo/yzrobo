// lib/recipes.ts
import { Recipe } from '@/types/recipe';

// Base URL for API calls - works in both client and server components
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Browser should use relative URL
    return '';
  }
  if (process.env.VERCEL_URL) {
    // Reference for vercel deployments
    return `https://${process.env.VERCEL_URL}`;
  }
  // Assume localhost
  return 'http://localhost:3000';
};

// Recipe fetching functions
export async function getAllRecipes(options?: {
  category?: string;
  featured?: boolean;
  published?: boolean;
}): Promise<Recipe[]> {
  try {
    const params = new URLSearchParams();
    if (options?.category) params.append('category', options.category);
    if (options?.featured !== undefined) params.append('featured', String(options.featured));
    if (options?.published !== undefined) params.append('published', String(options.published));
    
    const response = await fetch(`${getBaseUrl()}/api/recipes?${params}`, {
      next: { revalidate: 60 }, // Cache for 1 minute
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  try {
    const response = await fetch(`${getBaseUrl()}/api/recipes/${slug}`, {
      next: { revalidate: 60 },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch recipe');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
}

export async function getRecipesByCategory(category: string): Promise<Recipe[]> {
  return getAllRecipes({ category });
}

export async function getFeaturedRecipes(): Promise<Recipe[]> {
  return getAllRecipes({ featured: true });
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
  // For now, fetch all and filter client-side
  // Later, you can add a search endpoint to your API
  const recipes = await getAllRecipes();
  const lowercaseQuery = query.toLowerCase();
  
  return recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(lowercaseQuery) ||
    recipe.description.toLowerCase().includes(lowercaseQuery) ||
    recipe.ingredients.some(ing => ing.item.toLowerCase().includes(lowercaseQuery)) ||
    recipe.tags?.some(tag => (typeof tag === 'string' ? tag : tag.name).toLowerCase().includes(lowercaseQuery))
  );
}

// Helper functions
export function formatCookingTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

export function getDifficultyColor(difficulty: Recipe['difficulty']): string {
  const colors = {
    easy: 'text-green-400',
    medium: 'text-yellow-400',
    hard: 'text-red-400'
  };
  return colors[difficulty];
}

export function getCategoryIcon(category: Recipe['category']): string {
  const icons = {
    italian: '🍝',
    bbq: '🔥',
    experimental: '🧪',
    dessert: '🍰',
    appetizer: '🥟',
    main: '🍽️',
    side: '🥗'
  };
  return icons[category] || '🍴';
}