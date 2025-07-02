import { Recipe, Tag } from '@/types/recipe';

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
  tagSlug?: string;
  featured?: boolean;
  published?: boolean;
}): Promise<Recipe[]> {
  try {
    const params = new URLSearchParams();
    if (options?.tagSlug && options.tagSlug !== 'all') params.append('tag', options.tagSlug);
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

export async function getRecipesByTag(tagSlug: string): Promise<Recipe[]> {
  return getAllRecipes({ tagSlug });
}

export async function getFeaturedRecipes(): Promise<Recipe[]> {
  return getAllRecipes({ featured: true });
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
  const recipes = await getAllRecipes({published: true});
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