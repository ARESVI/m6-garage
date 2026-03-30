import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  const hasUrl = !!dbUrl;
  const urlPreview = dbUrl ? dbUrl.substring(0, 50) + '...' : 'NOT SET';
  
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ 
      status: 'DB connected', 
      hasUrl, 
      urlPreview 
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'DB error', 
      error: String(error),
      hasUrl,
      urlPreview
    }, { status: 500 });
  }
}
