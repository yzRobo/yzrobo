// app/api/vehicles/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/vehicles - Get all vehicles
export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ],
    });
    
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}