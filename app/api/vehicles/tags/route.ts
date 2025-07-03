// app/api/vehicles/tags/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tags = await prisma.vehicleTag.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching vehicle tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}