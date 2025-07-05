// app/api/projects/search/route.ts
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
    const projects = await prisma.project.findMany({
      where: {
        AND: [
          { published: true },
          {
            OR: searchTerms.map(term => ({
              OR: [
                { title: { contains: term, mode: 'insensitive' } },
                { description: { contains: term, mode: 'insensitive' } },
                { longDescription: { contains: term, mode: 'insensitive' } },
                { category: { contains: term, mode: 'insensitive' } },
                {
                  technologies: {
                    some: {
                      name: { contains: term, mode: 'insensitive' }
                    }
                  }
                },
                {
                  features: {
                    some: {
                      OR: [
                        { title: { contains: term, mode: 'insensitive' } },
                        { description: { contains: term, mode: 'insensitive' } }
                      ]
                    }
                  }
                }
              ]
            }))
          }
        ]
      },
      include: {
        technologies: { orderBy: { order: 'asc' } },
        features: { orderBy: { order: 'asc' } },
      },
      take: 10,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed. Please try again.' },
      { status: 500 }
    );
  }
}