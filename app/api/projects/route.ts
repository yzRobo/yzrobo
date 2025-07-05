// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';

// GET /api/projects - Fetch all projects
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const published = searchParams.get('published');
    const all = searchParams.get('all');
    
    const where: any = {};
    
    if (category && category !== 'all') {
      where.category = category;
    }
    
    if (featured === 'true') {
      where.featured = true;
    }
    
    if (published !== 'false' && all !== 'true') {
      where.published = true;
    }
    
    const projects = await prisma.project.findMany({
      where,
      include: {
        technologies: { orderBy: { order: 'asc' } },
        features: { orderBy: { order: 'asc' } },
        images: { orderBy: { order: 'asc' } },
        updates: {
          where: { published: true },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
      },
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
    });
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      longDescription,
      category,
      status,
      featured,
      published,
      demoUrl,
      githubUrl,
      videoUrl,
      technologies,
      features,
      heroImage,
    } = body;
    
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Handle Hero Image
    let heroImageUrl = null;
    if (heroImage && typeof heroImage === 'string' && heroImage.startsWith('data:')) {
      const base64Data = heroImage.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `projects/${slug}-hero-${Date.now()}.jpg`;
      
      const blob = await put(filename, buffer, {
        access: 'public',
        contentType: 'image/jpeg',
      });
      
      heroImageUrl = blob.url;
    }
    
    const project = await prisma.project.create({
      data: {
        slug,
        title,
        description,
        longDescription,
        category,
        status: status || 'in-progress',
        featured: featured || false,
        published: published || false,
        heroImage: heroImageUrl,
        heroImageAlt: `${title} preview`,
        demoUrl,
        githubUrl,
        videoUrl,
        publishedAt: published ? new Date() : null,
        technologies: technologies ? {
          create: technologies.map((tech: any, index: number) => ({
            name: tech.name,
            icon: tech.icon,
            category: tech.category,
            order: index,
          })),
        } : undefined,
        features: features ? {
          create: features.map((feature: any, index: number) => ({
            title: feature.title,
            description: feature.description,
            order: index,
          })),
        } : undefined,
      },
      include: {
        technologies: true,
        features: true,
      },
    });
    
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}