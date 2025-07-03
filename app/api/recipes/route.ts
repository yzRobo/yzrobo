// app/api/recipes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';

// GET /api/recipes - Fetch all recipes or filtered by tag
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tagSlug = searchParams.get('tag');
    const featured = searchParams.get('featured');
    const published = searchParams.get('published');
    const all = searchParams.get('all');
    
    const where: any = {};
    
    if (tagSlug && tagSlug !== 'all') {
      where.tags = {
        some: {
          slug: tagSlug,
        },
      };
    }
    
    if (featured === 'true') {
      where.featured = true;
    }
    
    if (published !== 'false' && all !== 'true') {
      where.published = true;
    }
    
    const recipes = await prisma.recipe.findMany({
      where,
      include: {
        ingredients: { orderBy: { order: 'asc' } },
        instructions: { orderBy: { step: 'asc' } },
        tips: { orderBy: { order: 'asc' } },
        nutrition: true,
        tags: true,
        reviews: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    const recipesWithRating = recipes.map((recipe: any) => {
      const avgRating = recipe.reviews.length > 0
        ? recipe.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / recipe.reviews.length
        : 0;
      
      return {
        ...recipe,
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: recipe.reviews.length,
      };
    });
    
    return NextResponse.json(recipesWithRating);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}

// POST /api/recipes - Create a new recipe
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      story, // <-- Destructured the new field
      cuisine,
      prepTime,
      cookTime,
      totalTime,
      servings,
      difficulty,
      featured,
      published,
      ingredients,
      instructions,
      tips,
      nutrition,
      tags,
      heroImage,
      ingredientsImage,
    } = body;
    
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Handle Finished Dish Image (heroImage)
    let heroImageUrl = null;
    if (heroImage && typeof heroImage === 'string' && heroImage.startsWith('data:')) {
      const base64Data = heroImage.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `recipes/${slug}-hero-${Date.now()}.jpg`;
      
      const blob = await put(filename, buffer, {
        access: 'public',
        contentType: 'image/jpeg',
      });
      
      heroImageUrl = blob.url;
    }

    // Handle Ingredients Image Upload
    let ingredientsImageUrl = null;
    if (ingredientsImage && typeof ingredientsImage === 'string' && ingredientsImage.startsWith('data:')) {
      const base64Data = ingredientsImage.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `recipes/${slug}-ingredients-${Date.now()}.jpg`;
      
      const blob = await put(filename, buffer, {
        access: 'public',
        contentType: 'image/jpeg',
      });
      
      ingredientsImageUrl = blob.url;
    }
    
    const recipe = await prisma.recipe.create({
      data: {
        slug,
        title,
        description,
        story, //
        cuisine,
        prepTime,
        cookTime,
        totalTime,
        servings: parseInt(servings),
        difficulty,
        featured: featured || false,
        published: published || false,
        heroImage: heroImageUrl,
        heroImageAlt: `${title} - finished dish`,
        ingredientsImage: ingredientsImageUrl,
        ingredientsImageAlt: `Ingredients for ${title}`,
        publishedAt: published ? new Date() : null,
        ingredients: {
          create: ingredients.map((ing: any, index: number) => ({
            amount: ing.amount,
            unit: ing.unit,
            item: ing.item,
            notes: ing.notes,
            group: ing.group,
            order: index,
          })),
        },
        instructions: {
          create: instructions.map((inst: any, index: number) => ({
            step: index + 1,
            title: inst.title,
            description: inst.description,
            time: inst.time,
          })),
        },
        tips: tips ? {
          create: tips.map((tip: string, index: number) => ({
            content: tip,
            order: index,
          })),
        } : undefined,
        nutrition: nutrition && nutrition.calories ? {
          create: {
            calories: parseInt(nutrition.calories),
            protein: nutrition.protein,
            carbs: nutrition.carbs,
            fat: nutrition.fat,
            fiber: nutrition.fiber || null,
            sugar: nutrition.sugar || null,
            sodium: nutrition.sodium || null,
          },
        } : undefined,
        tags: tags ? {
          connectOrCreate: tags.map((tagName: string) => ({
            where: { name: tagName },
            create: {
              name: tagName,
              slug: tagName.toLowerCase().replace(/\s+/g, '-'),
            },
          })),
        } : undefined,
      },
      include: {
        ingredients: true,
        instructions: true,
        tips: true,
        nutrition: true,
        tags: true,
      },
    });
    
    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json(
      { error: 'Failed to create recipe' },
      { status: 500 }
    );
  }
}