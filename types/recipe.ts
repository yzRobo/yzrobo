// /types/recipe.ts

export interface Tip {
  id: string;
  content: string;
  order: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export enum ThumbnailDisplay {
  HERO = 'HERO',
  INGREDIENTS = 'INGREDIENTS',
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  cuisine?: string;
  description: string;
  story?: string | null; // <-- Add this line
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  featured?: boolean;
  published?: boolean;
  heroImage?: string | null;
  heroImageAlt?: string | null;
  ingredientsImage?: string | null;
  ingredientsImageAlt?: string | null;
  thumbnailDisplay?: ThumbnailDisplay;
  ingredients: Ingredient[];
  instructions: Instruction[];
  tips?: Tip[];
  nutrition?: Nutrition | null;
  tags?: Tag[];
  rating?: number;
  reviewCount?: number;
  reviews?: RecipeReview[];
  authorId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date | null;
}

export interface Ingredient {
  id?: string;
  amount: string;
  unit?: string;
  item: string;
  notes?: string;
  group?: string; 
  order?: number;
}

export interface Instruction {
  id?: string;
  step: number;
  title?: string;
  description: string;
  image?: {
    url: string;
    alt: string;
  };
  time?: string;
}

export interface Nutrition {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  fiber?: string;
  sugar?: string;
  sodium?: string;
}

export interface RecipeReview {
  id: string;
  recipeId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  dateCreated: string;
  helpful: number;
}

export interface RecipeCollection {
  id:string;
  name: string;
  description: string;
  recipes: Recipe[];
  image?: {
    url: string;
    alt: string;
  };
}