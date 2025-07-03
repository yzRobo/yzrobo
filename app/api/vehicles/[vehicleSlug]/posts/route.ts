// app/api/vehicles/[vehicleSlug]/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';

// GET /api/vehicles/[vehicleSlug]/posts - Get all posts for a vehicle
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ vehicleSlug: string }> }
) {
  try {
    const { vehicleSlug } = await context.params;
    const searchParams = request.nextUrl.searchParams;
    const published = searchParams.get('published');
    const featured = searchParams.get('featured');
    
    const vehicle = await prisma.vehicle.findUnique({
      where: { slug: vehicleSlug },
      include: {
        blogPosts: {
          where: {
            ...(published === 'true' ? { published: true } : {}),
            ...(featured === 'true' ? { featured: true } : {}),
          },
          include: {
            tags: true,
          },
          orderBy: [
            { featured: 'desc' },
            { publishedAt: 'desc' },
            { createdAt: 'desc' }
          ],
        },
      },
    });
    
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    
    return NextResponse.json(vehicle.blogPosts);
  } catch (error) {
    console.error('Error fetching vehicle posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/vehicles/[vehicleSlug]/posts - Create a new post
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ vehicleSlug: string }> }
) {
  try {
    const { vehicleSlug } = await context.params;
    const body = await request.json();
    
    // Find the vehicle first
    const vehicle = await prisma.vehicle.findUnique({
      where: { slug: vehicleSlug },
    });
    
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    
    const {
      title,
      excerpt,
      content,
      published,
      featured,
      tags,
      heroImage,
    } = body;
    
    // Generate slug from title
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Ensure unique slug within the vehicle
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.vehicleBlogPost.findFirst({
      where: { vehicleId: vehicle.id, slug }
    })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    // Handle image upload
    let heroImageUrl = null;
    if (heroImage && typeof heroImage === 'string' && heroImage.startsWith('data:')) {
      const base64Data = heroImage.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `vehicles/${vehicleSlug}/${slug}-${Date.now()}.jpg`;
      
      const blob = await put(filename, buffer, {
        access: 'public',
        contentType: 'image/jpeg',
      });
      
      heroImageUrl = blob.url;
    }
    
    const post = await prisma.vehicleBlogPost.create({
      data: {
        slug,
        title,
        excerpt,
        content,
        published: published || false,
        featured: featured || false,
        heroImage: heroImageUrl,
        heroImageAlt: title,
        publishedAt: published ? new Date() : null,
        vehicleId: vehicle.id,
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
        tags: true,
      },
    });
    
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}