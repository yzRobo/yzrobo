// app/api/vehicles/[vehicleSlug]/posts/[postSlug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';

// GET /api/vehicles/[vehicleSlug]/posts/[postSlug]
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ vehicleSlug: string; postSlug: string }> }
) {
  try {
    const { vehicleSlug, postSlug } = await context.params;
    
    const vehicle = await prisma.vehicle.findUnique({
      where: { slug: vehicleSlug },
    });
    
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    
    const post = await prisma.vehicleBlogPost.findFirst({
      where: {
        vehicleId: vehicle.id,
        slug: postSlug,
      },
      include: {
        tags: true,
        vehicle: true,
      },
    });
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

// PUT /api/vehicles/[vehicleSlug]/posts/[postSlug]
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ vehicleSlug: string; postSlug: string }> }
) {
  try {
    const { vehicleSlug, postSlug } = await context.params;
    const body = await request.json();
    
    const vehicle = await prisma.vehicle.findUnique({
      where: { slug: vehicleSlug },
    });
    
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    
    const existingPost = await prisma.vehicleBlogPost.findFirst({
      where: {
        vehicleId: vehicle.id,
        slug: postSlug,
      },
    });
    
    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    const dataToUpdate: any = {
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      published: body.published,
      featured: body.featured,
      publishedAt: body.published && !existingPost.publishedAt 
        ? new Date() 
        : (body.published === false ? null : existingPost.publishedAt),
    };
    
    if (body.heroImage && body.heroImage.startsWith('data:')) {
      const base64Data = body.heroImage.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `vehicles/${vehicleSlug}/${postSlug}-${Date.now()}.jpg`;
      const blob = await put(filename, buffer, { access: 'public', contentType: 'image/jpeg' });
      dataToUpdate.heroImage = blob.url;
      dataToUpdate.heroImageAlt = body.title;
    } else if (body.heroImage === null) {
      dataToUpdate.heroImage = null;
      dataToUpdate.heroImageAlt = null;
    }
    
    const updatedPost = await prisma.vehicleBlogPost.update({
      where: { id: existingPost.id },
      data: {
        ...dataToUpdate,
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
        tags: true,
      },
    });
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE /api/vehicles/[vehicleSlug]/posts/[postSlug]
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ vehicleSlug: string; postSlug: string }> }
) {
  try {
    const { vehicleSlug, postSlug } = await context.params;
    
    const vehicle = await prisma.vehicle.findUnique({
      where: { slug: vehicleSlug },
    });
    
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    
    const post = await prisma.vehicleBlogPost.findFirst({
      where: {
        vehicleId: vehicle.id,
        slug: postSlug,
      },
    });
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    await prisma.vehicleBlogPost.delete({
      where: { id: post.id },
    });
    
    return NextResponse.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}