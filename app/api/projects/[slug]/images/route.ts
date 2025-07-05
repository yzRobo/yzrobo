// app/api/projects/[slug]/images/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';

// POST /api/projects/[slug]/images
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const body = await request.json();
    
    const project = await prisma.project.findUnique({
      where: { slug },
      select: { id: true }
    });
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Handle image upload
    let imageUrl = body.url;
    if (body.image && body.image.startsWith('data:')) {
      const base64Data = body.image.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `projects/${slug}/gallery-${Date.now()}.jpg`;
      
      const blob = await put(filename, buffer, {
        access: 'public',
        contentType: 'image/jpeg',
      });
      
      imageUrl = blob.url;
    }
    
    const image = await prisma.projectImage.create({
      data: {
        url: imageUrl,
        alt: body.alt,
        caption: body.caption,
        order: body.order || 0,
        projectId: project.id
      }
    });
    
    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

// DELETE /api/projects/[slug]/images/[imageId]
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('id');
    
    if (!imageId) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 });
    }
    
    await prisma.projectImage.delete({
      where: { id: imageId }
    });
    
    return NextResponse.json({ message: 'Image deleted' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}