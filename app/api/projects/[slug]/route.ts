// app/api/projects/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';

// GET /api/projects/[slug] - Get a single project
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        technologies: { orderBy: { order: 'asc' } },
        features: { orderBy: { order: 'asc' } },
        images: { orderBy: { order: 'asc' } },
        updates: {
          where: { published: true },
          orderBy: { createdAt: 'desc' }
        },
      },
    });
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

// PUT /api/projects/[slug] - Update a project
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const body = await request.json();
    
    const existingProject = await prisma.project.findUnique({
      where: { slug },
    });
    
    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const dataToUpdate: any = {};

    // Handle hero image update
    if (body.heroImage && body.heroImage.startsWith('data:')) {
      const base64Data = body.heroImage.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `projects/${slug}-hero-${Date.now()}.jpg`;
      const blob = await put(filename, buffer, { access: 'public', contentType: 'image/jpeg' });
      dataToUpdate.heroImage = blob.url;
      dataToUpdate.heroImageAlt = `${body.title} preview`;
    } else if (body.heroImage === null) {
      dataToUpdate.heroImage = null;
      dataToUpdate.heroImageAlt = null;
    }
    
    const updatedProject = await prisma.project.update({
      where: { slug },
      data: {
        title: body.title,
        description: body.description,
        longDescription: body.longDescription,
        category: body.category,
        status: body.status,
        featured: body.featured,
        published: body.published,
        demoUrl: body.demoUrl,
        githubUrl: body.githubUrl,
        videoUrl: body.videoUrl,
        publishedAt: body.published && !existingProject.publishedAt 
          ? new Date() 
          : (body.published === false ? null : existingProject.publishedAt),
        ...dataToUpdate,
        technologies: {
          deleteMany: {},
          create: body.technologies?.map((tech: any, index: number) => ({
            name: tech.name,
            icon: tech.icon,
            category: tech.category,
            order: index,
          })) || [],
        },
        features: {
          deleteMany: {},
          create: body.features?.map((feature: any, index: number) => ({
            title: feature.title,
            description: feature.description,
            order: index,
          })) || [],
        },
      },
      include: {
        technologies: true,
        features: true,
        images: true,
        updates: true,
      },
    });
    
    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE /api/projects/[slug] - Delete a project
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    await prisma.project.delete({
      where: { slug },
    });

    return NextResponse.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}