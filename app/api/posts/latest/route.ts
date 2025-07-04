// app/api/posts/latest/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const latestPost = await prisma.vehicleBlogPost.findFirst({
      where: { published: true },
      orderBy: { 
        publishedAt: 'desc',
      },
      // This ensures the full vehicle object is included
      include: {
        vehicle: true,
      },
    });

    return NextResponse.json(latestPost);

  } catch (error) {
    console.error('Error fetching latest post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest post' }, 
      { status: 500 }
    );
  }
}