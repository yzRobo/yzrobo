// app/api/analytics/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '7d';
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '24h':
        startDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
    }
    
    // Get page views
    const pageViews = await prisma.pageView.groupBy({
      by: ['path'],
      where: {
        createdAt: { gte: startDate }
      },
      _count: true,
      orderBy: {
        _count: { path: 'desc' }
      },
      take: 10
    });
    
    // Get content views
    const recipeViews = await prisma.contentView.groupBy({
      by: ['slug'],
      where: {
        contentType: 'recipe',
        createdAt: { gte: startDate }
      },
      _count: true,
      orderBy: {
        _count: { slug: 'desc' }
      },
      take: 5
    });
    
    const projectViews = await prisma.contentView.groupBy({
      by: ['slug'],
      where: {
        contentType: 'project',
        createdAt: { gte: startDate }
      },
      _count: true,
      orderBy: {
        _count: { slug: 'desc' }
      },
      take: 5
    });

    const vehiclePostViews = await prisma.contentView.groupBy({
      by: ['slug'],
      where: {
        contentType: 'vehicle-post',
        createdAt: { gte: startDate }
      },
      _count: true,
      orderBy: {
        _count: { slug: 'desc' }
      },
      take: 5
    });
    
    // Get total stats
    const totalPageViews = await prisma.pageView.count({
      where: { createdAt: { gte: startDate } }
    });
    
    const uniquePaths = await prisma.pageView.groupBy({
      by: ['path'],
      where: { createdAt: { gte: startDate } }
    });
    
    return NextResponse.json({
      period,
      totalPageViews,
      uniquePages: uniquePaths.length,
      topPages: pageViews,
      topRecipes: recipeViews,
      topProjects: projectViews,
      topVehiclePosts: vehiclePostViews,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}