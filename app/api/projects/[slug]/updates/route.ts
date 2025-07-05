// app/api/projects/[slug]/updates/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/projects/[slug]/updates
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    
    const project = await prisma.project.findUnique({
      where: { slug },
      select: { id: true }
    });
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    const updates = await prisma.projectUpdate.findMany({
      where: { 
        projectId: project.id,
        published: true 
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(updates);
  } catch (error) {
    console.error('Error fetching updates:', error);
    return NextResponse.json({ error: 'Failed to fetch updates' }, { status: 500 });
  }
}

// POST /api/projects/[slug]/updates
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
    
    const update = await prisma.projectUpdate.create({
      data: {
        title: body.title,
        content: body.content,
        published: body.published || false,
        projectId: project.id
      }
    });
    
    return NextResponse.json(update, { status: 201 });
  } catch (error) {
    console.error('Error creating update:', error);
    return NextResponse.json({ error: 'Failed to create update' }, { status: 500 });
  }
}