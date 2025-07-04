// app/api/vehicles/[vehicleSlug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';

// GET /api/vehicles/[vehicleSlug] - Get a single vehicle
export async function GET(
  request: NextRequest,
  context: { params: { vehicleSlug: string } }
) {
  try {
    const { vehicleSlug } = await context.params;
    
    const vehicle = await prisma.vehicle.findUnique({
      where: { slug: vehicleSlug },
      include: {
        specs: { orderBy: { order: 'asc' } },
        modifications: { orderBy: { order: 'asc' } },
      },
    });
    
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    
    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicle' },
      { status: 500 }
    );
  }
}

// PUT /api/vehicles/[vehicleSlug] - Update a vehicle's overview
export async function PUT(
  request: NextRequest,
  context: { params: { vehicleSlug: string } }
) {
  try {
    const { vehicleSlug } = await context.params;
    const body = await request.json();

    const vehicle = await prisma.vehicle.findUnique({
      where: { slug: vehicleSlug },
    });

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    // --- Safely handle optional arrays ---
    const gallery = body.gallery ?? [];
    const specs = body.specs ?? [];
    const modifications = body.modifications ?? [];
    
    // --- Image Handling Logic ---
    let heroImageUrl = body.heroImage;
    if (heroImageUrl && heroImageUrl.startsWith('data:')) {
      const base64Data = heroImageUrl.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `vehicles/${vehicle.slug}/hero.jpg`;
      const blob = await put(filename, buffer, {
        access: 'public',
        contentType: 'image/jpeg',
        addRandomSuffix: true,
      });
      heroImageUrl = blob.url;
    }

    const newGalleryUrls = await Promise.all(
      gallery.map(async (img: string) => {
        if (img && img.startsWith('data:')) {
          const base64Data = img.split(',')[1];
          const buffer = Buffer.from(base64Data, 'base64');
          const filename = `vehicles/${vehicle.slug}/gallery.jpg`;
          const blob = await put(filename, buffer, {
            access: 'public',
            contentType: 'image/jpeg',
            addRandomSuffix: true,
          });
          return blob.url;
        }
        return img;
      })
    );

    // --- Database Update Transaction ---
    await prisma.$transaction([
      prisma.spec.deleteMany({ where: { vehicleId: vehicle.id } }),
      prisma.modification.deleteMany({ where: { vehicleId: vehicle.id } }),
      prisma.vehicle.update({
        where: { id: vehicle.id },
        data: {
          name: body.name,
          category: body.category,
          story: body.story,
          heroImage: heroImageUrl,
          gallery: newGalleryUrls,
          specs: {
            create: specs.map((spec: { label: string; value: string }, index: number) => ({
              label: spec.label,
              value: spec.value,
              order: index,
            })),
          },
          modifications: {
            create: modifications.map((mod: { category: string; items: string[] }, index: number) => ({
              category: mod.category,
              items: mod.items,
              order: index,
            })),
          },
        },
      }),
    ]);

    return NextResponse.json({ success: true });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error updating vehicle:', errorMessage);
    return NextResponse.json({ error: 'Failed to update vehicle', details: errorMessage }, { status: 500 });
  }
}