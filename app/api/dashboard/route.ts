import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todayServices, monthServices, totalRevenue, lowStockProducts, outOfStockProducts] = await Promise.all([
      prisma.serviceRecord.count({
        where: {
          tarih: {
            gte: today,
          },
        },
      }),
      prisma.serviceRecord.count({
        where: {
          tarih: {
            gte: startOfMonth,
          },
        },
      }),
      prisma.serviceRecord.aggregate({
        where: {
          tarih: {
            gte: startOfMonth,
          },
        },
        _sum: {
          toplamUcret: true,
        },
      }),
      prisma.$queryRaw`
        SELECT * FROM products 
        WHERE "stokMiktari" <= "minStokSeviyesi" AND "stokMiktari" > 0
        ORDER BY "stokMiktari" ASC
      `,
      prisma.$queryRaw`
        SELECT * FROM products 
        WHERE "stokMiktari" = 0
        ORDER BY "urunAdi" ASC
      `,
    ]);

    return NextResponse.json({
      todayServices,
      monthServices,
      totalRevenue: totalRevenue._sum.toplamUcret || 0,
      lowStockProducts: lowStockProducts || [],
      outOfStockProducts: outOfStockProducts || [],
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({ 
      error: 'Dashboard verileri yüklenemedi',
      todayServices: 0,
      monthServices: 0,
      totalRevenue: 0,
      lowStockProducts: [],
      outOfStockProducts: []
    }, { status: 500 });
  }
}
