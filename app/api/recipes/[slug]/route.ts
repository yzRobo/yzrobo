// app/api/recipes/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Define a type for the route's context. Note that `params` is a Promise.
type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

// GET /api/recipes/[slug] - Get a single recipe
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params; // Correct: Await the params to resolve
    const recipe = await prisma.recipe.findUnique({
      where: { slug },
      include: {
        ingredients: { orderBy: { order: 'asc' } },
        instructions: { orderBy: { step: 'asc' } },
        tips: { orderBy: { order: 'asc' } },
        nutrition: true,
        tags: true,
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
    
    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }
    
    // Calculate average rating
    const avgRating = recipe.reviews.length > 0
      ? recipe.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / recipe.reviews.length
      : 0;
    
    const recipeWithRating = {
      ...recipe,
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: recipe.reviews.length,
    };
    
    return NextResponse.json(recipeWithRating);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return NextResponse.json({ error: 'Failed to fetch recipe' }, { status: 500 });
  }
}

// PUT /api/recipes/[slug] - Update a recipe
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params; // Correct: Await the params
    const body = await request.json();
    
    const existingRecipe = await prisma.recipe.findUnique({
      where: { slug },
      include: { ingredients: true, instructions: true, tips: true },
    });
    
    if (!existingRecipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }
    
    const updatedRecipe = await prisma.recipe.update({
      where: { slug },
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        cuisine: body.cuisine,
        prepTime: body.prepTime,
        cookTime: body.cookTime,
        totalTime: body.totalTime,
        servings: body.servings,
        difficulty: body.difficulty,
        featured: body.featured,
        published: body.published,
        publishedAt: body.published && !existingRecipe.publishedAt 
          ? new Date() 
          : existingRecipe.publishedAt,
        ingredients: {
          deleteMany: {},
          create: body.ingredients.map((ing: any, index: number) => ({
            amount: ing.amount, unit: ing.unit, item: ing.item, notes: ing.notes, group: ing.group, order: index,
          })),
        },
        instructions: {
          deleteMany: {},
          create: body.instructions.map((inst: any, index: number) => ({
            step: index + 1, title: inst.title, description: inst.description, time: inst.time,
          })),
        },
        tips: {
          deleteMany: {},
          create: body.tips?.map((tip: string, index: number) => ({
            content: tip, order: index,
          })) || [],
        },
      },
      include: {
        ingredients: true, instructions: true, tips: true, nutrition: true, tags: true,
      },
    });
    
    return NextResponse.json(updatedRecipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    return NextResponse.json({ error: 'Failed to update recipe' }, { status: 500 });
  }
}

// DELETE /api/recipes/[slug] - Delete a recipe
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params; // Correct: Await the params
    await prisma.recipe.delete({
      where: { slug },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 });
  }
}