import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteContext = {
    params: {
        slug: string;
    };
};

// GET /api/recipes/[slug] - Get a single recipe
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = context.params;
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
    const { slug } = context.params;
    const body = await request.json();
    
    const existingRecipe = await prisma.recipe.findUnique({
      where: { slug },
    });
    
    if (!existingRecipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }
    
    const updatedRecipe = await prisma.recipe.update({
      where: { slug },
      data: {
        title: body.title,
        description: body.description,
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
        tags: body.tags ? {
          set: [],
          connectOrCreate: body.tags.map((tagName: string) => ({
            where: { name: tagName },
            create: {
              name: tagName,
              slug: tagName.toLowerCase().replace(/\s+/g, '-'),
            },
          })),
        } : undefined,
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
    const { slug } = context.params;
    await prisma.recipe.delete({
      where: { slug },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 });
  }
}