// app/api/analytics/track/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, path, contentType, contentId, slug } = body;
    
    // Get basic request info
    const referrer = request.headers.get('referer') || null;
    const userAgent = request.headers.get('user-agent') || null;
    const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown';
    
    if (type === 'pageview') {
      await prisma.pageView.create({
        data: {
          path,
          referrer,
          userAgent,
          ip,
        },
      });
    } else if (type === 'content') {
      await prisma.contentView.create({
        data: {
          contentType,
          contentId,
          slug,
          referrer,
        },
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json({ success: false }, { status: 200 }); // Return 200 to not block user
  }
}