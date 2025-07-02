// app/api/recipes/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
      return NextResponse.json([]);
    }

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);

    // Search in multiple fields
    const recipes = await prisma.recipe.findMany({
      where: {
        AND: [
          { published: true },
          {
            OR: searchTerms.map(term => ({
              OR: [
                { title: { contains: term, mode: 'insensitive' } },
                { description: { contains: term, mode: 'insensitive' } },
                { cuisine: { contains: term, mode: 'insensitive' } },
                {
                  ingredients: {
                    some: {
                      item: { contains: term, mode: 'insensitive' }
                    }
                  }
                },
                {
                  tags: {
                    some: {
                      name: { contains: term, mode: 'insensitive' }
                    }
                  }
                }
              ]
            }))
          }
        ]
      },
      include: {
        ingredients: { orderBy: { order: 'asc' } },
        instructions: { orderBy: { step: 'asc' } },
        tips: { orderBy: { order: 'asc' } },
        nutrition: true,
        tags: true,
        reviews: true,
      },
      take: 10, // Limit results to prevent overwhelming the UI
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Calculate ratings
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
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed. Please try again.' },
      { status: 500 }
    );
  }
}